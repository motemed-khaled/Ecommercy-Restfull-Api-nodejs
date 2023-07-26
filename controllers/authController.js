import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";

import { ApiError } from './../utils/api_errors.js';
import { generateToken } from "../utils/generateToken.js";
import { userModel } from "../models//userModel.js";




export const sginUp = asyncHandler(async (req, res) => {
    const user = await userModel.create({
        name: req.body.name,
        slug:req.body.slug,
        email: req.body.email,
        password: req.body.password
    });

    const token = generateToken(user._id)

    res.status(201).json({ data: user, token: token });

});

export const login = asyncHandler(async (req, res, next) => {
    const user = await userModel.findOne({ email: req.body.email });

    if (!user || !(await bcryptjs.compare(req.body.password, user.password))) {
        return next(new ApiError("inavlid creditional", 401));
    }

    const token = generateToken(user._id);

    res.status(200).json({ data: user, token: token });
});

export const auth = asyncHandler(async (req, res, next) => {
    let token;
    // get token
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
        return next(new ApiError("Un Authinticated", 401));
    }

    // verify token
    const decode = jwt.verify(token, process.env.JWT_SECRETKEY);

    //verify token
    const userLogin = await userModel.findById(decode.userId);
    if (!userLogin) {
        return next(new ApiError("This User Dosent Exist !", 401));
    };

    // check activated acount 
    if (userLogin.active !=true) {
        return next(new ApiError("your account deactivated please connect to system adminstrator", 400));
    }

    // check if user change password after generate token or not
    if (userLogin.changePasswordTime) {
        const changePasswordTime = parseInt(userLogin.changePasswordTime.getTime() / 1000, 10);
        if (changePasswordTime > decode.iat) {
            return next(new ApiError("user change password please login again", 401));
        }
    }

    req.user = userLogin;
    next();
});

export const allowedTo = (...roles) => asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return next(new ApiError("you not allowed to access this route", 403));
    }
    next();
});