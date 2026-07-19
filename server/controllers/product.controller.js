const Product = require("../models/product.model");
const { uploadToCloudinary, deleteFromCloudinary } = require("../utils/cloudinary");

const splitList = (value = "") => String(value).split(",").map((item) => item.trim()).filter(Boolean);

exports.getProducts = async (_req, res, next) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ success: true, data: products });
  } catch (error) { next(error); }
};

exports.getProductBySlug = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug.toLowerCase() });
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    res.json({ success: true, data: product });
  } catch (error) { next(error); }
};

exports.createProduct = async (req, res, next) => {
  try {
    const imageFile = req.files?.image?.[0];
    const backImageFile = req.files?.backImage?.[0];

    if (!imageFile) return res.status(400).json({ success: false, message: "Product image is required" });

    // Server-side double validation for 8MB limit
    if (imageFile.size > 8 * 1024 * 1024) {
      return res.status(400).json({ success: false, message: "Image size must be less than 8MB" });
    }
    if (backImageFile && backImageFile.size > 8 * 1024 * 1024) {
      return res.status(400).json({ success: false, message: "Secondary image size must be less than 8MB" });
    }

    let variants = [];
    if (req.body.variants) {
      try {
        variants = typeof req.body.variants === "string" ? JSON.parse(req.body.variants) : req.body.variants;
      } catch (e) {
        console.error("Failed to parse variants:", e.message);
      }
    }

    let stock = Number(req.body.stock);
    if (variants && variants.length > 0) {
      stock = variants.reduce((sum, v) => sum + Number(v.stock || 0), 0);
    }

    if (!Number.isInteger(stock) || stock < 0) return res.status(400).json({ success: false, message: "Stock must be a non-negative whole number" });

    const baseSlug = String(req.body.slug || req.body.name)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    let slug = baseSlug;
    let suffix = 2;
    while (await Product.exists({ slug })) {
      slug = `${baseSlug}-${suffix}`;
      suffix += 1;
    }

    // Upload main image to Cloudinary
    const uploadResult = await uploadToCloudinary(imageFile.buffer, "osou/products");

    // Upload back image to Cloudinary if available
    let backImageUrl = undefined;
    if (backImageFile) {
      const uploadBackResult = await uploadToCloudinary(backImageFile.buffer, "osou/products");
      backImageUrl = uploadBackResult.secure_url;
    }

    // Upload black color images if available
    const blackImages = [];
    if (req.files?.blackImages) {
      for (const file of req.files.blackImages) {
        if (file.size <= 8 * 1024 * 1024) {
          const resUpload = await uploadToCloudinary(file.buffer, "osou/products");
          blackImages.push(resUpload.secure_url);
        }
      }
    }

    // Upload olive color images if available
    const oliveImages = [];
    if (req.files?.oliveImages) {
      for (const file of req.files.oliveImages) {
        if (file.size <= 8 * 1024 * 1024) {
          const resUpload = await uploadToCloudinary(file.buffer, "osou/products");
          oliveImages.push(resUpload.secure_url);
        }
      }
    }

    const originalPrice = req.body.originalPrice ? Number(req.body.originalPrice) : undefined;

    // Parse weight and dimensions (ensure positive numbers, fallback to defaults if invalid)
    const weight = req.body.weight && Number(req.body.weight) > 0 ? Number(req.body.weight) : 500;
    const length = req.body.length && Number(req.body.length) > 0 ? Number(req.body.length) : 10;
    const width = req.body.width && Number(req.body.width) > 0 ? Number(req.body.width) : 10;
    const height = req.body.height && Number(req.body.height) > 0 ? Number(req.body.height) : 10;

    const rating = req.body.rating ? Number(req.body.rating) : 5;

    let objections = [];
    if (req.body.objections) {
      try {
        objections = typeof req.body.objections === "string" ? JSON.parse(req.body.objections) : req.body.objections;
      } catch (e) {
        console.error("Failed to parse objections:", e.message);
      }
    }

    const product = await Product.create({
      ...req.body,
      slug,
      image: uploadResult.secure_url,
      backImage: backImageUrl,
      blackImages,
      oliveImages,
      colors: splitList(req.body.colors),
      sizes: splitList(req.body.sizes),
      tags: splitList(req.body.tags),
      variants,
      stock,
      inStock: stock > 0,
      onSale: false,
      originalPrice,
      weight,
      length,
      width,
      height,
      rating,
      objections
    });
    res.status(201).json({ success: true, data: product, message: "Product created" });
  } catch (error) { next(error); }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    const imageFile = req.files?.image?.[0];
    const backImageFile = req.files?.backImage?.[0];

    let imageUrl = product.image;
    if (imageFile) {
      if (imageFile.size > 8 * 1024 * 1024) {
        return res.status(400).json({ success: false, message: "Image size must be less than 8MB" });
      }
      const uploadResult = await uploadToCloudinary(imageFile.buffer, "osou/products");
      if (product.image) {
        try {
          await deleteFromCloudinary(product.image);
        } catch (delErr) {
          console.error("Cloudinary old image delete failed:", delErr.message);
        }
      }
      imageUrl = uploadResult.secure_url;
    }

    let backImageUrl = product.backImage;
    if (backImageFile) {
      if (backImageFile.size > 8 * 1024 * 1024) {
        return res.status(400).json({ success: false, message: "Secondary image size must be less than 8MB" });
      }
      const uploadBackResult = await uploadToCloudinary(backImageFile.buffer, "osou/products");
      if (product.backImage) {
        try {
          await deleteFromCloudinary(product.backImage);
        } catch (delErr) {
          console.error("Cloudinary old secondary image delete failed:", delErr.message);
        }
      }
      backImageUrl = uploadBackResult.secure_url;
    }

    let variants = [];
    if (req.body.variants) {
      try {
        variants = typeof req.body.variants === "string" ? JSON.parse(req.body.variants) : req.body.variants;
      } catch (e) {
        console.error("Failed to parse variants:", e.message);
      }
    } else if (product.variants) {
      variants = product.variants;
    }

    let objections = [];
    if (req.body.objections) {
      try {
        objections = typeof req.body.objections === "string" ? JSON.parse(req.body.objections) : req.body.objections;
      } catch (e) {
        console.error("Failed to parse objections:", e.message);
      }
    } else if (product.objections) {
      objections = product.objections;
    }

    let stock = req.body.stock !== undefined ? Number(req.body.stock) : product.stock;
    if (variants && variants.length > 0) {
      stock = variants.reduce((sum, v) => sum + Number(v.stock || 0), 0);
    }

    if (req.body.slug && req.body.slug !== product.slug) {
      const baseSlug = String(req.body.slug)
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      let slug = baseSlug;
      let suffix = 2;
      while (await Product.exists({ slug, _id: { $ne: product._id } })) {
        slug = `${baseSlug}-${suffix}`;
        suffix += 1;
      }
      product.slug = slug;
    }

    let blackImagesUrls = product.blackImages || [];
    if (req.files?.blackImages) {
      if (product.blackImages && product.blackImages.length > 0) {
        for (const img of product.blackImages) {
          try { await deleteFromCloudinary(img); } catch (e) { console.error("Cloudinary delete failed:", e.message); }
        }
      }
      blackImagesUrls = [];
      for (const file of req.files.blackImages) {
        if (file.size <= 8 * 1024 * 1024) {
          const resUpload = await uploadToCloudinary(file.buffer, "osou/products");
          blackImagesUrls.push(resUpload.secure_url);
        }
      }
    }

    let oliveImagesUrls = product.oliveImages || [];
    if (req.files?.oliveImages) {
      if (product.oliveImages && product.oliveImages.length > 0) {
        for (const img of product.oliveImages) {
          try { await deleteFromCloudinary(img); } catch (e) { console.error("Cloudinary delete failed:", e.message); }
        }
      }
      oliveImagesUrls = [];
      for (const file of req.files.oliveImages) {
        if (file.size <= 8 * 1024 * 1024) {
          const resUpload = await uploadToCloudinary(file.buffer, "osou/products");
          oliveImagesUrls.push(resUpload.secure_url);
        }
      }
    }

    product.name = req.body.name || product.name;
    product.price = req.body.price !== undefined ? Number(req.body.price) : product.price;
    product.originalPrice = req.body.originalPrice !== undefined ? (req.body.originalPrice ? Number(req.body.originalPrice) : undefined) : product.originalPrice;
    product.category = req.body.category || product.category;
    product.type = req.body.type || product.type;
    product.shortDescription = req.body.shortDescription || product.shortDescription;
    product.bestFor = req.body.bestFor || product.bestFor;
    product.colors = req.body.colors !== undefined ? splitList(req.body.colors) : product.colors;
    product.sizes = req.body.sizes !== undefined ? splitList(req.body.sizes) : product.sizes;
    product.tags = req.body.tags !== undefined ? splitList(req.body.tags) : product.tags;
    product.weight = req.body.weight !== undefined ? Number(req.body.weight) : product.weight;
    product.length = req.body.length !== undefined ? Number(req.body.length) : product.length;
    product.width = req.body.width !== undefined ? Number(req.body.width) : product.width;
    product.height = req.body.height !== undefined ? Number(req.body.height) : product.height;
    product.image = imageUrl;
    product.backImage = backImageUrl;
    product.blackImages = blackImagesUrls;
    product.oliveImages = oliveImagesUrls;
    product.variants = variants;
    product.stock = stock;
    product.inStock = stock > 0;
    product.rating = req.body.rating !== undefined ? Number(req.body.rating) : product.rating;

    // Update new fields
    product.emotionalHook = req.body.emotionalHook !== undefined ? req.body.emotionalHook : product.emotionalHook;
    product.shortCopy = req.body.shortCopy !== undefined ? req.body.shortCopy : product.shortCopy;
    product.fitDetailLine = req.body.fitDetailLine !== undefined ? req.body.fitDetailLine : product.fitDetailLine;
    product.careLine = req.body.careLine !== undefined ? req.body.careLine : product.careLine;
    product.objections = req.body.objections !== undefined ? objections : product.objections;

    await product.save();
    res.json({ success: true, data: product, message: "Product updated successfully" });
  } catch (error) { next(error); }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    // Delete from Cloudinary if URLs exist
    if (product.image) {
      try { await deleteFromCloudinary(product.image); } catch (e) { console.error(e); }
    }
    if (product.backImage) {
      try { await deleteFromCloudinary(product.backImage); } catch (e) { console.error(e); }
    }
    if (product.blackImages && product.blackImages.length > 0) {
      for (const img of product.blackImages) {
        try { await deleteFromCloudinary(img); } catch (e) { console.error(e); }
      }
    }
    if (product.oliveImages && product.oliveImages.length > 0) {
      for (const img of product.oliveImages) {
        try { await deleteFromCloudinary(img); } catch (e) { console.error(e); }
      }
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Product deleted" });
  } catch (error) { next(error); }
};

