const Order = require("../models/order");
const Product = require("../models/product");
const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");
const { checkPermissions } = require("../utils");

const fakeStripeAPI = async ({ amount, currency }) => {
  const client_secret = "someRandomValue";
  return { client_secret, amount };
};


const createOrder = async (req, res) => {
  const { items: cartItems, tax, shippingFee } = req.body;
  if (!cartItems || cartItems.length < 1) {
    throw new CustomError.BadRequest("No cart items provided");
  }
  if (!tax || !shippingFee) {
    throw new CustomError.BadRequest("please provide tax and shipping fee");
  }
  let orderItems = [];
  let subtotal = 0;

  for (const item of cartItems) {
    const dbProduct = await Product.findOne({ _id: item.product });
    if (!dbProduct) {
      throw new CustomError.NotFoundError(`no product with id ${item.product}`);
    }
    const { name, price, image, _id } = dbProduct;
    console.log(name, price, image);
    const singleOrderItems = {
      amount: item.amount,
      name,
      price,
      image,
      product: _id,
    };
    //add items to order
    orderItems = [...orderItems, singleOrderItems];
    //calculate subtotal
    subtotal += item.amount * price;
  }
  const total = tax + shippingFee + subtotal;
  // get client secret
  const paymentIntent = await fakeStripeAPI({
    amount: total,
    currency: "usd",
  });
  const order = await Order.create({
    orderItems,
    total,
    subtotal,
    tax,
    shippingFee,
    clientSecret: paymentIntent.client_secret,
    user: req.user.userId,
  });
  res
    .status(StatusCodes.CREATED)
    .json({ order, clientSecret: order.clientSecret });
};


const getAllOrders = async (req, res) => {
  const orders = await Order.find({}).populate({
    path: "user",
    select: "name email",
  });
  res.status(StatusCodes.OK).json({ orders });
};
const getSingleOrder = async (req, res) => {
  const { id: orderId } = req.params;
  const order = await Order.findOne({ _id: orderId }).populate({
    path: "user",
    select: "name email",
  });
  if (!order) {
    throw CustomError.NotFoundError(`no order with id ${orderId}`);
  }
  checkPermissions(req.user, order.user);
  res.status(StatusCodes.OK).json({ order });
};
const getCurrentUserOrders = async (req, res) => {
  req.body.user = req.user.userId;
  const orders = await Order.find({ user: req.user.userId });
  res.status(StatusCodes.OK).json({ orders, count: orders.length });
};
const updateOrder = async (req, res) => {
  const { id: orderId } = req.params;
  const { paymentIntentId } = req.body;
  const order = await Order.findOne({ _id: orderId }).populate({
    path: "user",
    select: "name email",
  });
  if (!order) {
    throw CustomError.NotFoundError(`no order with id ${orderId}`);
  }
  checkPermissions(req.user, order.user);
  order.status = "paid";
  order.paymentIntentId = paymentIntentId;
  await order.save();
  res.status(StatusCodes.OK).json({ order });
};

module.exports = {
  createOrder,
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  updateOrder,
};
