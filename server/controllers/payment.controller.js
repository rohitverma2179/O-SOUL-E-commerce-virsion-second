const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/order.model");
const Cart = require("../models/cart.model");

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
        color: item.color
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

    if (razorpay_signature === expectedSign) {
      const order = await Order.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        {
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          status: "paid"
        },
        { new: true }
      );

      if (!order) {
        return res.status(404).json({ success: false, message: "Order not found" });
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
