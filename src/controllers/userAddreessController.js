import asyncHandler from "express-async-handler";

import { userModel } from "../models/userModel.js";


export const addAddressToUserAddresses = asyncHandler(async (req, res) => {
    const user = await userModel.findByIdAndUpdate(
        req.user._id,
        { $addToSet: { addresses: req.body } },
        { new: true }
    );

    res.status(200).json({ status: "success", message: "address added to user", data: user.addresses });
});

export const removeAddressToUserAddresses = asyncHandler(async (req, res, next) => {
    const user = await userModel.findByIdAndUpdate(
        req.user._id,
        { $pull: { addresses: {_id:req.params.addressId} } },
        { new: true }
    );

    res.status(200).json({ status: "success", message: "address removed from user addresses", data: user.addresses });
});

export const getLoggedUserAddresses = asyncHandler(async (req, res, next) => {
    const user = await userModel.findById(req.user._id);
    res.status(200).json({ status: "success", length: user.addresses.length, data: user.addresses });
});