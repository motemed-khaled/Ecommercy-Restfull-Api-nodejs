import { uid } from "uid";
import sharp from "sharp";
import asyncHandler from "express-async-handler";
import bcryptjs from "bcryptjs";

import { uploadSingleImage } from "../middleware/uploadImage_middleWare.js";
import { ApiError } from "../utils/api_errors.js";
import { userModel } from "../models/userModel.js";
import {
    deleteOne,
    updateOne,
    createOne,
    getOne,
    getAll
} from "./handlersFactory.js";
import { generateToken } from "../utils/generateToken.js";

// upload single image
export const uploadUserImage = uploadSingleImage("profileImg");

// image proccesing
export const userImageProcessing = asyncHandler(async (req, res, next) => {
    if (req.file) {
        const fileName = `user-${uid()}-${Date.now()}.jpeg`;
        await sharp(req.file.buffer)
            .resize(250, 250)
            .toFormat("jpeg")
            .jpeg({ quality: 95 })
            .toFile(`uploads/users/${fileName}`);
        req.body.profileImg = fileName;
    }
    next();
});

export const createUser = createOne(userModel);

export const getAllUsers = getAll(userModel , "user");

export const getSpecificUser  = getOne(userModel);

export const updateUser = asyncHandler(async (req, res, next) => {

    const document = await userModel.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            slug: req.body.slug,
            email: req.body.email,
            phone: req.body.phone,
            role: req.body.role,
            active:req.body.active,
            profileImg: req.body.profileImg
        },
        { new: true }
    );
    if (!document) {
        return next(new ApiError(`No Document In This Id : ${req.params.id}`, 404));
    }
    res.status(200).json({ data: document });
});

export const updateUserPassword = asyncHandler(async (req, res, next) => {

    const document = await userModel.findByIdAndUpdate(
        req.params.id,
        {
            password: await bcryptjs.hash(req.body.password, 12),
            changePasswordTime : Date.now()
        },
        { new: true }
    );
    if (!document) {
        return next(new ApiError(`No Document In This Id : ${req.params.id}`, 404));
    }
    res.status(200).json({ data: document });
});

export const deleteUser = deleteOne(userModel);

// logged user
 
export const getLoggedUserData = asyncHandler(async (req, res, next) => {
    req.params.id = req.user._id;
    next();
});

export const updateUserLoggedPassword = asyncHandler(async (req, res, next) => {
    const document = await userModel.findByIdAndUpdate(
        req.user._id,
        {
            password: await bcryptjs.hash(req.body.password, 12),
            changePasswordTime: Date.now()
        },
        { new: true }
    );
    const token = generateToken(document._id);
    res.status(200).json({ data: document, token: token });
});

export const updateUserLoggedData = asyncHandler(async (req, res, next) => {
    const user = await userModel.findByIdAndUpdate(
        req.user._id,
        {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            profileImg: req.body.profileImg
        },
        { new: true }
    );
    res.status(200).json({ data: user });
});

export const deactiveUserLogged = asyncHandler(async (req, res, next) => {
    await userModel.findByIdAndUpdate(
        req.user._id,
        {
            active: false
        }
    );
    res.status(200).json({ status: "sucsses" });
});

