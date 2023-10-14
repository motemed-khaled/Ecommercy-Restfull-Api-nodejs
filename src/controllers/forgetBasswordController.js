import crypto from "crypto";

import asyncHandler from "express-async-handler";

import { userModel } from "../models/userModel.js";
import { ApiError } from "../utils/api_errors.js";
import { sendEmail } from "../utils/sendEmai.js";
import { generateToken } from "../utils/generateToken.js";


export const forgetBassword = asyncHandler(async (req, res, next) => {
    //check if user exist
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
        return next(new ApiError(`No User In This Email : ${req.body.email}`));
    }
    //generate random 6 digit 
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const resetCodeHash = crypto.createHash("sha256").update(resetCode).digest("hex");

    user.resetCodePassword = resetCodeHash;
    user.resetCodeExpire = Date.now() + 10 * 60 * 1000;
    user.resetCodeVerify = false;
    await user.save();

    //send mail
    const message = `Hi ${user.name} \n 
    we recieved a request to reset the password on your E-commercy account \n
    ${resetCode} \n enter this code to reset password
    `
    try {
        await sendEmail({
            email: user.email,
            subject: "your password reset code valid for 10 min",
            message: message
        });
    } catch (error) {
        user.resetCodePassword = undefined;
        user.resetCodeExpire = undefined;
        user.resetCodeVerify = undefined;

        await user.save();
        return next(new ApiError("you have error in sending email", 500));
    }
    res.status(200).json({ status: "success", message: "reset code send to email" });
});

export const verifyResetCode = asyncHandler(async (req, res, next) => {
    
    const hashResetCode = crypto.createHash("sha256").update(req.body.resetCode).digest("hex");

    const user = await userModel.findOne({
        resetCodePassword: hashResetCode,
        resetCodeExpire: { $gt: Date.now() }
    });

    if (!user) {
        return next(new ApiError("invalid resetcode or expire", 500));
    }

    user.resetCodeVerify = true;
    await user.save();

    res.status(200).json({ status: "success" });
});

export const updateUserPassword = asyncHandler(async (req, res, next) => {
    
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
        return next(new ApiError(`no user in this email ${req.body.email}`, 404));
    }

    if (!user.resetCodeVerify) {
        return next(new ApiError("reset code not verified", 400));
    }

    user.password = req.body.newpassword;
    user.resetCodeExpire = undefined;
    user.resetCodePassword = undefined;
    user.resetCodeVerify = undefined;
    await user.save();

    const token = generateToken(user._id);

    res.status(200).json({ status: "success", token: token });
});