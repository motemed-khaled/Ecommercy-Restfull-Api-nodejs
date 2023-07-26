import asyncHandler from "express-async-handler";

import { userModel } from "../models/userModel.js";


export const addProductToWishList = asyncHandler(async (req, res, next) => {
    const user = await userModel.findByIdAndUpdate(
        req.user._id,
        { $addToSet: { wishList: req.body.productId } },
        { new: true }
    );

    res.status(200).json({ status: "success", message: "product added to user wishList", data: user.wishList });
});

export const removeProductToWishList = asyncHandler(async (req, res, next) => {
    const user = await userModel.findByIdAndUpdate(
        req.user._id,
        { $pull: { wishList: req.params.productId } },
        { new: true }
    );

    res.status(200).json({ status: "success", message: "product removed to user wishList", data: user.wishList });
});

export const getLoggedUserWishList = asyncHandler(async (req, res, next) => {
    const user = await userModel.findById(req.user._id).populate("wishList");
    res.status(200).json({ status: "success", length: user.wishList.length, data: user.wishList });
});