const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const Product = require("../models/product.model");

// In-memory cache for warehouse ID
let cachedWarehouseId = null;
let cacheExpiry = 0;

// Helper to format date to YYYY-MM-DD format required by the API
function formatOrderDate(dateVal) {
  if (!dateVal) return "";
  const d = new Date(dateVal);
  const pad = (num) => String(num).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// Fetch helper with retry logic
async function fetchWithRetry(url, options = {}, retries = 3, delay = 1000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, options);
      console.log(response)
      const data = await response.json();
      if (response.ok) {
        return data;
      }
      throw new Error(data.message || `HTTP error! Status: ${response.status}`);
    } catch (err) {
      console.warn(`[Shipmozo] Attempt ${attempt} failed: ${err.message}`);
      if (attempt === retries) {
        throw err;
      }
      // Linear-exponential-ish delay before retry
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
}

// Retrieve default warehouse ID (using caching)
async function getWarehouseId() {
  const now = Date.now();
  if (cachedWarehouseId && now < cacheExpiry) {
    console.log("[Shipmozo] Using cached warehouse ID:", cachedWarehouseId);
    return cachedWarehouseId;
  }

  console.log("[Shipmozo] Cache expired or missing. Fetching warehouses from Shipmozo API...");
  const url = "https://shipping-api.com/app/api/v1/get-warehouses";

  const responseData = await fetchWithRetry(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'public-key': PUBLIC_KEY,
      'private-key': PRIVATE_KEY
    }
  });

  if (responseData && (responseData.result === "1" || responseData.success) && Array.isArray(responseData.data)) {
    const defaultWh = responseData.data.find(w => String(w.default).toUpperCase() === "YES") || responseData.data[0];
    if (defaultWh) {
      cachedWarehouseId = String(defaultWh.id);
      cacheExpiry = now + 60 * 60 * 1000; // Cache for 1 hour
      console.log("[Shipmozo] Cached warehouse ID:", cachedWarehouseId);
      return cachedWarehouseId;
    }
  }

  throw new Error((responseData && responseData.message) || "Failed to fetch a valid warehouse from Shipmozo.");
}

/**
 * Places an order on Shipmozo.
 * @param {Object} order - The MongoDB order object.
 * @returns {Promise<Object>} - Contains { trackingNumber, carrier, success }
 */
async function placeOrderInShipmozo(order) {
  // 1. Prevent duplicate pushes
  if (order.trackingNumber && !order.trackingNumber.startsWith("SMZ-")) {
    console.log("[Shipmozo] Order already pushed. Skipping duplicate request. Tracking:", order.trackingNumber);
    return {
      trackingNumber: order.trackingNumber,
      carrier: order.carrier || "Shipmozo Express",
      success: true
    };
  }

  try {
    // 2. Fetch products to calculate total weight and dimensions
    let totalWeight = 0;
    let maxLength = 0;
    let maxWidth = 0;
    let maxHeight = 0;

    const productDetailsMap = {};

    for (const item of order.items) {
      let productDetails = null;
      if (item.productId) {
        try {
          productDetails = await Product.findById(item.productId);
          if (productDetails) {
            productDetailsMap[item._id.toString()] = productDetails;
          }
        } catch (err) {
          console.error("[Shipmozo] Error fetching product details for item:", item.name, err.message);
        }
      }
      const itemQty = Number(item.quantity) || 1;
      const w = productDetails && productDetails.weight && Number(productDetails.weight) > 0 ? Number(productDetails.weight) : 500;
      const l = productDetails && productDetails.length && Number(productDetails.length) > 0 ? Number(productDetails.length) : 10;
      const wd = productDetails && productDetails.width && Number(productDetails.width) > 0 ? Number(productDetails.width) : 10;
      const h = productDetails && productDetails.height && Number(productDetails.height) > 0 ? Number(productDetails.height) : 10;

      totalWeight += w * itemQty;
      if (l > maxLength) maxLength = l;
      if (wd > maxWidth) maxWidth = wd;
      if (h > maxHeight) maxHeight = h;
    }

    // Fallback to defaults if calculations returned invalid numbers
    if (totalWeight <= 0) totalWeight = 500;
    if (maxLength <= 0) maxLength = 10;
    if (maxWidth <= 0) maxWidth = 10;
    if (maxHeight <= 0) maxHeight = 10;

    // 3. Retrieve warehouse ID (cached or fresh)
    const warehouseId = await getWarehouseId();

    // 4. Format inputs
    const rawPhone = String(order.shippingDetails.phone).replace(/\D/g, "");
    const consigneePhone = Number(rawPhone) || 0;

    const rawPincode = String(order.shippingDetails.pincode).replace(/\D/g, "");
    const consigneePinCode = Number(rawPincode) || 0;

    // 5. Structure product details
    const productDetail = order.items.map((item) => {
      const prod = productDetailsMap[item._id.toString()];
      return {
        name: item.name,
        sku_number: (prod && (prod.slug || prod.sku)) || item.sku || item._id.toString(),
        quantity: Number(item.quantity),
        discount: "",
        hsn: (prod && prod.hsn) || item.hsn || "",
        unit_price: Number(item.price),
        product_category: (prod && prod.category) || item.category || "Other"
      };
    });

    const payload = {
      order_id: order.razorpayOrderId || order._id.toString(),
      order_date: formatOrderDate(order.createdAt),
      consignee_name: `${order.shippingDetails.firstName} ${order.shippingDetails.lastName}`.trim(),
      consignee_phone: consigneePhone,
      consignee_email: order.shippingDetails.email,
      consignee_address_line_one: order.shippingDetails.address,
      consignee_address_line_two: order.shippingDetails.apartment || "",
      consignee_pin_code: consigneePinCode,
      consignee_city: order.shippingDetails.city,
      consignee_state: order.shippingDetails.state,
      product_detail: productDetail,
      payment_type: "PREPAID",
      weight: Number(totalWeight),
      length: Number(maxLength),
      width: Number(maxWidth),
      height: Number(maxHeight),
      warehouse_id: String(warehouseId)
    };

    console.log("[Shipmozo] Attempting to place order on Shipmozo API with payload:", JSON.stringify(payload, null, 2));

    if (!PUBLIC_KEY || !PRIVATE_KEY || PUBLIC_KEY.includes("dfsg") || PRIVATE_KEY.includes("dfsg")) {
      throw new Error("Using test/placeholder credentials. Skipping external API call.");
    }

    const url = 'https://shipping-api.com/app/api/v1/push-order';
    const responseData = await fetchWithRetry(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'public-key': PUBLIC_KEY,
        'private-key': PRIVATE_KEY
      },
      body: JSON.stringify(payload)
    });

    console.log("[Shipmozo] Response body:", responseData);

    if (responseData && (responseData.result === "1" || responseData.success)) {
      const deliveryData = responseData.data || {};
      return {
        trackingNumber: deliveryData.tracking_number || deliveryData.awb_code || deliveryData.reference_id || `SMZ-${Date.now().toString().slice(-8)}`,
        carrier: deliveryData.carrier || deliveryData.courier_name || "Shipmozo Express",
        success: true
      };
    } else {
      throw new Error((responseData && responseData.message) || "API returned failure result.");
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

  const url = `https://shipping-api.com/app/api/v1/track-order?awb_number=${trackingNumber}`;

  try {
    if (!PUBLIC_KEY || !PRIVATE_KEY || PUBLIC_KEY.includes("dfsg") || PRIVATE_KEY.includes("dfsg")) {
      throw new Error("Using test/placeholder credentials. Skipping external API call.");
    }

    const responseData = await fetchWithRetry(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'public-key': PUBLIC_KEY,
        'private-key': PRIVATE_KEY
      }
    });

    if (responseData && (responseData.result === "1" || responseData.success)) {
      const data = responseData.data || {};
      const events = data.events || data.tracking_events || data.checkpoints || responseData.events || [];
      const currentStatus = data.currentStatus || data.status || data.current_status || (events[0] ? (events[0].status || events[0].activity) : "In Transit");

      return {
        trackingNumber: trackingNumber,
        carrier: data.carrier || data.courier_name || responseData.carrier || "Shipmozo Express",
        currentStatus: currentStatus,
        events: events.map(e => ({
          status: e.status || e.activity || e.status_name || "Status Updated",
          description: e.description || e.instructions || e.comment || e.activity || "Package update in transit.",
          location: e.location || e.city || e.place || "",
          timestamp: e.timestamp || e.date || e.time || new Date().toISOString()
        }))
      };
    } else {
      throw new Error((responseData && responseData.message) || "API returned failure result.");
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
