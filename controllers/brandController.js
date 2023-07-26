import { uid } from "uid";
import sharp from "sharp";
import asyncHandler from "express-async-handler";

import { uploadSingleImage } from "../middleware/uploadImage_middleWare.js";
import { brandModel } from "../models/brand-model.js";
import {
    deleteOne,
    updateOne,
    createOne,
    getOne,
    getAll
} from "./handlersFactory.js";

// upload single image
export const uploadBrandImage = uploadSingleImage("image");

// image proccesing
export const brandImageProcessing = asyncHandler(async (req, res, next) => {
    if (req.file) {
        const fileName = `brand-${uid()}-${Date.now()}.jpeg`;
        await sharp(req.file.buffer)
            .resize(600, 600)
            .toFormat("jpeg")
            .jpeg({ quality: 90 })
            .toFile(`uploads/brands/${fileName}`);
        req.body.image = fileName;
    }
    next();
});

export const createBrand = createOne(brandModel);

export const getAllBrands = getAll(brandModel , "brand");

export const getSpecificBrand = getOne(brandModel);

export const updateBrand = updateOne(brandModel);

export const deleteBrand = deleteOne(brandModel);
