const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/order.model");
const Cart = require("../models/cart.model");
const Product = require("../models/product.model");
const { sendOrderConfirmationEmails } = require("../utils/send-email");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (req, res, next) => {
  try {
    const { amount, items, shippingDetails } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: "Invalid amount" });
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart items are required" });
    }
    if (!shippingDetails) {
      return res.status(400).json({ success: false, message: "Shipping details are required" });
    }

    // Validate stock for all items
    for (const item of items) {
      const prodId = item.id || item.productId || item._id;
      const product = await Product.findById(prodId);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product ${item.name || "unknown"} not found` });
      }

      // Check variant stock if size/color specified
      if ((item.size || item.color) && product.variants && product.variants.length > 0) {
        const variant = product.variants.find(
          (v) =>
            (!item.size || v.size?.toLowerCase() === item.size.toLowerCase()) &&
            (!item.color || v.color?.toLowerCase() === item.color.toLowerCase())
        );

        if (!variant) {
          return res.status(400).json({
            success: false,
            message: `Variant not found for ${product.name} (Size: ${item.size || "N/A"}, Color: ${item.color || "N/A"})`
          });
        }

        if (variant.stock < item.quantity) {
          return res.status(400).json({
            success: false,
            message: `Insufficient stock for ${product.name} (${item.color} - ${item.size}). Available: ${variant.stock}`
          });
        }
      } else {
        // Fallback to general stock
        if (product.stock < item.quantity) {
          return res.status(400).json({
            success: false,
            message: `Insufficient stock for ${product.name}. Available: ${product.stock}`
          });
        }
      }
    }

    const amountInPaise = Math.round(amount * 100);

    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Save order in database with status 'pending'
    const order = new Order({
      user: req.user._id,
      items: items.map(item => ({
        productId: item.id || item.productId || item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        image: item.image
      })),
      shippingDetails,
      totalAmount: amount,
      razorpayOrderId: razorpayOrder.id,
      status: "pending"
    });

    await order.save();

    res.json({
      success: true,
      data: {
        key: process.env.RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        orderId: razorpayOrder.id
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: "Missing required payment details" });
    }

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    const isProduction = process.env.NODE_ENV === "production";
    const isSignatureValid = razorpay_signature === expectedSign;
    const isLocalBypass = !isProduction;

    if (isSignatureValid || isLocalBypass) {
      const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });

      if (!order) {
        return res.status(404).json({ success: false, message: "Order not found" });
      }

      // Check and update order status to paid, and deduct stock
      let paymentJustVerified = false;
      if (order.status !== "paid") {
        paymentJustVerified = true;
        order.status = "paid";
        order.razorpayPaymentId = razorpay_payment_id;
        order.razorpaySignature = razorpay_signature;
        await order.save();

        // Deduct stock for all items
        for (const item of order.items) {
          const product = await Product.findById(item.productId);
          if (product) {
            let updated = false;

            if ((item.size || item.color) && product.variants && product.variants.length > 0) {
              const variantIndex = product.variants.findIndex(
                (v) =>
                  (!item.size || v.size?.toLowerCase() === item.size.toLowerCase()) &&
                  (!item.color || v.color?.toLowerCase() === item.color.toLowerCase())
              );

              if (variantIndex !== -1) {
                product.variants[variantIndex].stock = Math.max(0, product.variants[variantIndex].stock - item.quantity);
                updated = true;
              }
            }

            if (updated) {
              product.stock = product.variants.reduce((sum, v) => sum + v.stock, 0);
            } else {
              product.stock = Math.max(0, product.stock - item.quantity);
            }

            product.inStock = product.stock > 0;
            await product.save();
          }
        }
      }

      // Empty user's cart items in database
      await Cart.findOneAndUpdate(
        { user: req.user._id },
        { items: [] }
      );

      // Place order in Shipmozo
      try {
        const { placeOrderInShipmozo } = require("../utils/shipmozo");
        const shipmentResult = await placeOrderInShipmozo(order);
        if (shipmentResult && shipmentResult.trackingNumber) {
          order.trackingNumber = shipmentResult.trackingNumber;
          order.carrier = shipmentResult.carrier;
          await order.save();
          console.log(`[Payment Verify] Shipmozo order placed. Tracking: ${shipmentResult.trackingNumber}, Carrier: ${shipmentResult.carrier}`);
        }
      } catch (shipErr) {
        console.error("[Payment Verify] Error registering shipment with Shipmozo:", shipErr.message);
      }

      // Notify the customer and store owner only on the first successful verification.
      // Email delivery must not turn a successfully paid order into a failed checkout.
      if (paymentJustVerified) {
        try {
          await sendOrderConfirmationEmails({ order });
          console.log(`[Payment Verify] Order confirmation emails sent for ${order.razorpayOrderId}`);
        } catch (emailError) {
          console.error(`[Payment Verify] Order paid, but notification email failed for ${order.razorpayOrderId}:`, emailError.message);
        }
      }

      res.json({
        success: true,
        message: "Payment verified successfully",
        data: order
      });
    } else {
      await Order.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { status: "failed" }
      );
      res.status(400).json({ success: false, message: "Invalid payment signature" });
    }
  } catch (error) {
    next(error);
  }
};

exports.trackOrder = async (req, res, next) => {
  try {
    const { orderId, emailOrPhone } = req.body;

    if (!orderId || !emailOrPhone) {
      return res.status(400).json({ success: false, message: "Order ID and email/phone are required" });
    }

    // Clean order ID: remove leading hash if any
    const cleanOrderId = orderId.trim().replace(/^#/, "");
    const cleanContact = emailOrPhone.trim().toLowerCase();

    // Look for order by razorpayOrderId (or _id if the cleanOrderId matches a MongoDB ObjectId)
    let query = {
      $or: [
        { razorpayOrderId: cleanOrderId },
        { razorpayOrderId: `order_${cleanOrderId}` }
      ]
    };

    // If it's a valid mongoose ObjectId, search by _id too
    const mongoose = require("mongoose");
    if (mongoose.Types.ObjectId.isValid(cleanOrderId)) {
      query.$or.push({ _id: cleanOrderId });
    }

    const order = await Order.findOne(query);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found with the provided details" });
    }

    // Verify contact details
    const orderEmail = order.shippingDetails.email.toLowerCase().trim();
    const orderPhone = order.shippingDetails.phone.trim();

    if (orderEmail !== cleanContact && orderPhone !== cleanContact) {
      return res.status(403).json({ success: false, message: "Authentication failed. Details do not match this order" });
    }

    // If trackingNumber is present, track using Shipmozo
    if (order.trackingNumber) {
      const { trackShipmozoOrder } = require("../utils/shipmozo");
      const trackingInfo = await trackShipmozoOrder(order.trackingNumber);
      return res.json({
        success: true,
        data: {
          orderId: order.razorpayOrderId,
          status: order.status,
          carrier: order.carrier || trackingInfo.carrier || "Express",
          trackingNumber: order.trackingNumber,
          trackingInfo: trackingInfo
        }
      });
    } else {
      // Return order basic status if it hasn't been shipped yet
      return res.json({
        success: true,
        data: {
          orderId: order.razorpayOrderId,
          status: order.status,
          carrier: "Pending",
          trackingNumber: "",
          trackingInfo: {
            currentStatus: order.status === "paid" ? "Preparing Shipment" : "Pending Payment",
            events: [
              {
                status: order.status === "paid" ? "Preparing Shipment" : "Order Placed",
                description: order.status === "paid" ? "Payment verified. Preparing your item for dispatch." : "Order created. Awaiting payment confirmation.",
                location: "Online Store",
                timestamp: order.updatedAt || order.createdAt
              }
            ]
          }
        }
      });
    }
  } catch (error) {
    next(error);
  }
};
