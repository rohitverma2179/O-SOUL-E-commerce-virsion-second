const Cart = require("../models/cart.model");

exports.getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    res.json({ success: true, data: cart?.items || [] });
  } catch (error) { next(error); }
};

exports.saveCart = async (req, res, next) => {
  try {
    const items = Array.isArray(req.body.items) ? req.body.items.slice(0, 100) : [];
    const cart = await Cart.findOneAndUpdate(
      { user: req.user._id },
      { user: req.user._id, items },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.json({ success: true, data: cart.items });
  } catch (error) { next(error); }
};
