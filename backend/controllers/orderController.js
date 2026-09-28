import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import razorpay from "razorpay";
import crypto from "crypto";

//global verification
const currency = "inr";
const deliveryCharge = 10;

// gateway initialize
const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

// Placing orders using COD Method
const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, message: "Order Placed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Placing orders using Razorpay Method
const placeOrderRazorpay = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "Razorpay",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    const options = {
      amount: amount * 100,
      currency: currency.toUpperCase(),
      receipt: newOrder._id.toString(),
    };

    await razorpayInstance.orders.create(options, (error, order) => {
      if (error) {
        console.log(error);
        return res.json({ success: false, message: error });
      }
      res.json({ success: true, order });
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const verifyRazorpay = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    // Create signature body
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    // Generate expected signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
      .update(body.toString())
      .digest("hex");

    // Verify Razorpay signature
    if (expectedSignature === razorpay_signature) {
      const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

      // Check payment status
      if (orderInfo.status === "paid") {
        // Find our order using Razorpay receipt
        const order = await orderModel.findById(orderInfo.receipt);

        if (!order) {
          return res.json({
            success: false,
            message: "Order not found",
          });
        }

        // Mark order as paid
        await orderModel.findByIdAndUpdate(orderInfo.receipt, {
          payment: true,
        });

        // =========================
        // CLEAR USER CART FROM MONGODB
        // =========================
        console.log("CLEARING CART FOR USER:", order.userId);
        const updatedUser = await userModel.findByIdAndUpdate(
          order.userId,
          {
            cartData: {},
          },
          {
            new: true,
          }
        );

        console.log("CART CLEARED SUCCESSFULLY:", updatedUser.cartData);

        if (!updatedUser) {
          return res.json({
            success: false,
            message: "User not found while clearing cart",
          });
        }

        res.json({
          success: true,
          message: "Payment Successful",
        });
      } else {
        res.json({
          success: false,
          message: "Payment Failed",
        });
      }
    } else {
      res.json({
        success: false,
        message: "Invalid signature",
      });
    }
  } catch (error) {
    console.log(error);

    res.json({
      success: false,
      message: error.message,
    });
  }
};

// All Orders data for Admin Panel
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// User Order Data for Frontend
const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;

    const orders = await orderModel.find({ userId });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// update order status form Admin Panel
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  verifyRazorpay,
  placeOrder,
  placeOrderRazorpay,
  allOrders,
  userOrders,
  updateStatus,
};
