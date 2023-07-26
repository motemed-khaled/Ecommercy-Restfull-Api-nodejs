import asyncHandler from "express-async-handler";
import Stripe from "stripe";


import { cartModel } from "../models/cart-model.js";
import { orderModel } from "../models/order-model.js";
import { productModel } from "../models/product_model.js";
import { ApiError } from './../utils/api_errors.js';
import { getAll , getOne } from "./handlersFactory.js";



export const createCashOrder = asyncHandler(async (req, res, next) => {
    // app setting
    const shippingTax = 0;
    const shippingPrice = 0;

    const cart = await cartModel.findById(req.params.id);

    if (!cart) {
        return next(new ApiError(`no cart in this id : ${req.params.id}`, 404));
    }

    const cartPrice = cart.totalCartPriceAfterDiscount ?
        cart.totalCartPriceAfterDiscount : cart.totalCartPrice;

    const totalOrderPrice = cartPrice + shippingPrice + shippingTax;

    const order = await orderModel.create({
        user: req.user._id,
        cartItems: cart.cartItems,
        shippingAddress: req.body,
        totalOrderPrice: totalOrderPrice
    });

    if (order) {
        
        const bulkOptions = cart.cartItems.map(item => ({
            updateOne: {
                filter: { _id: item.product },
                update: { $inc: { quantity: -item.quantity, sold: +item.quantity } }
            },
        }));
        await productModel.bulkWrite(bulkOptions, {});

        await cartModel.findByIdAndDelete(req.params.id);
    }
    res.status(200).json({ status: "success", data: order });
});

// middleWare to filter order by current user
export const filterOrderByCurrentUser = asyncHandler(async (req, res, next) => {
    let filterObj = {};
    if (req.user.role == "user") {
        filterObj = { user: req.user._id };
    }
    req.filterObj = filterObj;
    next();
});

export const getAllOrders = getAll(orderModel);

// middleWare to check if role is user and owner to this order or not
export const getSpecificOrderCheck = asyncHandler(async (req, res, next) => {
    if (req.user.role == "user") {
        const order = await orderModel.find({ user: req.user._id });
        const specificOrder = order.filter(order => order._id == req.params.id)
        if (specificOrder.length < 1) {
            return next(new ApiError(`you dont owner for this order id : ${req.params.id}`, 404));
        } 
    }
    next();
});

export const getSpecificOrder = getOne(orderModel);

export const updateIsPaid = asyncHandler(async (req, res, next) => {
    const order = await orderModel.findById(req.params.id);

    if (!order) {
        return next(new ApiError(`no order in this id : ${req.params.id}`))
    }

    order.isPaid = true;
    order.paidAt = Date.now();

    const updateOrder = await order.save();

    res.status(200).json({ status: "success", data: updateOrder });
});

export const updateIsDelivered = asyncHandler(async (req, res, next) => {
    const order = await orderModel.findById(req.params.id);

    if (!order) {
        return next(new ApiError(`no order in this id : ${req.params.id}`))
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updateOrder = await order.save();

    res.status(200).json({ status: "success", data: updateOrder });
});

//  create stripe checkOut session
export const checkOutSession = asyncHandler(async (req, res, next) => {
    // app setting
    const shippingTax = 0;
    const shippingPrice = 0;

    const cart = await cartModel.findById(req.params.id);

    if (!cart) {
        return next(new ApiError(`no cart in this id : ${req.params.id}`, 404));
    }

    const cartPrice = cart.totalCartPriceAfterDiscount ?
        cart.totalCartPriceAfterDiscount : cart.totalCartPrice;

    const totalOrderPrice = cartPrice + shippingPrice + shippingTax;

    const stripe = new Stripe(process.env.SECRET_KEY_STRIPE);
    const session = await stripe.checkout.sessions.create({
        line_items: [{
            price_data: {
                currency: "egp",
                unit_amount: totalOrderPrice * 100,
                product_data: {
                    name: req.user.name,
                }
            },
            quantity: 1
        }],
        mode: 'payment',
        success_url: `${req.protocol}://${req.get("host")}/orders`,
        cancel_url: `${req.protocol}://${req.get("host")}/cart`,
        customer_email: req.user.email,
        client_reference_id: req.params.id,
        metadata: req.body.shippingAddress
    });
    res.status(200).json({ status: "success", session });
});

export const webhookCheckOut = asyncHandler(async (req, res) => {
    console.log("hererreeree")
    const stripe = new Stripe(process.env.SECRET_KEY_STRIPE);
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.WEBHOOK_STRIPE_SECRET);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    
    if (event.type === "checkout.session.completed") {
        console.log("create order here......")
    }
});