import asyncHandler from "express-async-handler";

import { ApiError } from "../utils/api_errors.js";
import { cartModel } from "../models/cart-model.js";
import { copounModel } from "../models/copoun_model.js";
import { productModel } from "../models/product_model.js";


const calcTotalPrice = (cart) => {
    // calculate total cart price 
    let totalPrice = 0;
    cart.cartItems.forEach(ele =>
        totalPrice += ele.quantity * ele.price
    );
    return totalPrice
}

export const addProductToCart = asyncHandler(async (req, res, next) => {
    const { productId, color } = req.body;
    // if user not have cart
    let product = await productModel.findById(productId);
    let cart = await cartModel.findOne({ user: req.user._id });
    if (!cart) {
        cart = await cartModel.create({
            user: req.user._id,
            cartItems: [{
                product: productId,
                color: color,
                price: product.price
            }]
        });
    } else {
        // if product already exist 
        const existProduct = cart.cartItems.findIndex(ele =>
            ele.product.toString() === productId && ele.color === color);
        if (existProduct > -1) {
            cart.cartItems[existProduct].quantity += 1;
        } else {
            cart.cartItems.push({ product: productId, color: color, price: product.price });
        }
    }
    // update cart total price
    cart.totalCartPrice = calcTotalPrice(cart);
    cart.totalCartPriceAfterDiscount = undefined;

    await cart.save();
    res.status(200).json({ status: "success", message: "product added to cart",cartLength:cart.cartItems.length, data: cart });
});

export const getLoggedUserCart = asyncHandler(async (req, res, next) => {
    const cart = await cartModel.findOne({ user: req.user._id });
    if (!cart) {
        return next(new ApiError("user dont have cart", 404));
    }

    res.status(200).json({ status: "succsses",cartLength:cart.cartItems.length ,data: cart });
});

export const deleteSpecificCartItem = asyncHandler(async (req, res, next) => {
    const cart = await cartModel.findOneAndUpdate(
        { user: req.user._id },
        { $pull: { cartItems: { _id: req.params.id } } },
        { new: true }
    );
    cart.totalCartPrice = calcTotalPrice(cart);
    await cart.save();
    res.status(200).json({ status: "success", message: "product removed from user cart", cartLength: cart.cartItems.length, data: cart });
});

export const deleteUserCart = asyncHandler(async (req, res, next) => {
    const cart = await cartModel.findOneAndDelete({ user: req.user._id });
    res.status(204).send();
});

export const updateCartItemQuantity = asyncHandler(async (req, res, next) => {
    const { quantity } = req.body;

    const cart = await cartModel.findOne({ user: req.user._id });
    
    if (!cart) {
        return next(new ApiError(`no cart in this user id : ${req.user._id}`, 404));
    }

    const cartItemIndex = cart.cartItems.findIndex(ele => ele._id == req.params.id);

    if (cartItemIndex > -1) {
        cart.cartItems[cartItemIndex].quantity = quantity;
    } else {
        return next(new ApiError(`no cart item in this id : ${req.params.id}`, 404))
    }

    cart.totalCartPrice = calcTotalPrice(cart);
    cart.totalCartPriceAfterDiscount = undefined;
    await cart.save();
    res.status(200).json({ status: "succsses", cartLength: cart.cartItems.length, data: cart });
});

export const applayCopoun = asyncHandler(async (req, res, next) => {
    const copoun = await copounModel.findOne({
        name: req.body.copoun,
        expire: { $gt: Date.now() }
    });

    if (!copoun) {
        return next(new ApiError("invalid copoun or expired", 400));
    }

    const cart = await cartModel.findOne({ user: req.user._id });

    const totalPrice = calcTotalPrice(cart);
    cart.totalCartPriceAfterDiscount = (totalPrice - (totalPrice * copoun.discount) / 100).toFixed(2);
    cart.save();
    res.status(200).json({ status: "sucsses", cartLength: cart.cartItems.length, data: cart });
});