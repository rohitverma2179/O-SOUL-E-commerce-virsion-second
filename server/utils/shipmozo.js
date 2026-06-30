const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

/**
 * Places an order on Shipmozo.
 * @param {Object} order - The MongoDB order object.
 * @returns {Promise<Object>} - Contains { trackingNumber, carrier, success }
 */
async function placeOrderInShipmozo(order) {
  const url = 'https://api.shipmozo.com/v1/shipments';

  // Prepare standard shipping payload
  const payload = {
    order_id: order.razorpayOrderId || order._id.toString(),
    order_date: order.createdAt,
    pickup_location: "Primary Warehouse",
    billing_customer_name: order.shippingDetails.firstName,
    billing_last_name: order.shippingDetails.lastName,
    billing_address: order.shippingDetails.address,
    billing_address_2: order.shippingDetails.apartment || "",
    billing_city: order.shippingDetails.city,
    billing_pincode: order.shippingDetails.pincode,
    billing_state: order.shippingDetails.state,
    billing_country: order.shippingDetails.country || "India",
    billing_email: order.shippingDetails.email,
    billing_phone: order.shippingDetails.phone,
    shipping_is_billing: true,
    order_items: order.items.map(item => ({
      name: item.name,
      sku: item.productId ? item.productId.toString() : "SKU-ITEM",
      units: item.quantity,
      selling_price: item.price
    })),
    payment_method: "Prepaid",
    sub_total: order.totalAmount,
    length: 10,
    width: 10,
    height: 10,
    weight: 0.5
  };

  try {
    console.log("[Shipmozo] Attempting to place order on Shipmozo API...");
    // If keys are dummy/placeholder, we bypass and throw directly to trigger the fallback
    if (!PUBLIC_KEY || !PRIVATE_KEY || PUBLIC_KEY.includes("dfsg") || PRIVATE_KEY.includes("dfsg")) {
      throw new Error("Using test/placeholder credentials. Skipping external API call.");
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(`${PUBLIC_KEY}:${PRIVATE_KEY}`).toString('base64'),
        'X-Public-Key': PUBLIC_KEY,
        'X-Private-Key': PRIVATE_KEY
      },
      body: JSON.stringify(payload)
    });

    const responseData = await response.json();
    console.log("[Shipmozo] Response status:", response.status);
    console.log("[Shipmozo] Response body:", responseData);

    if (response.ok && responseData.success) {
      return {
        trackingNumber: responseData.tracking_number || responseData.awb_code || `SMZ-${Date.now().toString().slice(-8)}`,
        carrier: responseData.courier_name || responseData.carrier || "Shipmozo Express",
        success: true
      };
    } else {
      throw new Error(responseData.message || `API error with status ${response.status}`);
    }
  } catch (error) {
    console.error("[Shipmozo] Order placement failed:", error.message);
    console.log("[Shipmozo] Using fallback mock shipment tracking code...");
    // Fallback: generate a mock tracking number
    const mockTrackingNumber = `SMZ-${Math.floor(100000000 + Math.random() * 900000000)}`;
    return {
      trackingNumber: mockTrackingNumber,
      carrier: "Shipmozo Express (Demo)",
      success: false,
      isMock: true
    };
  }
}

/**
 * Tracks a shipment.
 * @param {string} trackingNumber - The tracking number or AWB.
 * @returns {Promise<Object>} - Contains status history and current status.
 */
async function trackShipmozoOrder(trackingNumber) {
  // If it's a mock tracking number or we are in test environment, return simulated updates
  if (!trackingNumber || trackingNumber.startsWith("SMZ-")) {
    return getMockTrackingStatus(trackingNumber);
  }

  const url = `https://api.shipmozo.com/v1/shipments/track/${trackingNumber}`;

  try {
    if (!PUBLIC_KEY || !PRIVATE_KEY || PUBLIC_KEY.includes("dfsg") || PRIVATE_KEY.includes("dfsg")) {
      throw new Error("Using test/placeholder credentials. Skipping external API call.");
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${PUBLIC_KEY}:${PRIVATE_KEY}`).toString('base64'),
        'X-Public-Key': PUBLIC_KEY,
        'X-Private-Key': PRIVATE_KEY
      }
    });

    const responseData = await response.json();
    if (response.ok && responseData.success) {
      return responseData.tracking_data || responseData;
    } else {
      throw new Error(responseData.message || `API error with status ${response.status}`);
    }
  } catch (error) {
    console.error("[Shipmozo] Tracking request failed, falling back to simulation:", error.message);
    return getMockTrackingStatus(trackingNumber);
  }
}

function getMockTrackingStatus(trackingNumber) {
  const now = new Date();
  
  const events = [
    {
      status: "Order Confirmed",
      description: "Payment verified. Shipping label generated.",
      location: "Delhi Warehouse",
      timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
      status: "Dispatched",
      description: "Shipment handed over to courier partner.",
      location: "Delhi Hub",
      timestamp: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString()
    },
    {
      status: "In Transit",
      description: "Shipment is on its way to the destination hub.",
      location: "Main sorting facility",
      timestamp: now.toISOString()
    }
  ];

  return {
    trackingNumber: trackingNumber || "SMZ-UNKNOWN",
    carrier: "Shipmozo Express (Demo)",
    currentStatus: "In Transit",
    events: events
  };
}

module.exports = {
  placeOrderInShipmozo,
  trackShipmozoOrder
};
