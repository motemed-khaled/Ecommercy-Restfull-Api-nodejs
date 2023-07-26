
import { uid } from "uid";
import sharp from "sharp";
import asyncHandler from "express-async-handler";

import { uploadSingleImage } from "../middleware/uploadImage_middleWare.js";
import { catogryModel } from "../models/catogry-model.js";
import { deleteOne, updateOne, createOne, getOne, getAll } from "./handlersFactory.js";


// upload single image
export const uploadCatogryImage = uploadSingleImage("image");
//image processing
export const imageProcessing = asyncHandler(async (req, res, next) => {
    if (req.file) {
        const fileName = `catogry-${uid()}-${Date.now()}.jpeg`;
        await sharp(req.file.buffer)
            .resize(600, 600)
            .toFormat("jpeg")
            .jpeg({ quality: 90 })
            .toFile(`uploads/catogries/${fileName}`);
    
        req.body.image = fileName;
    }
    next();
});

export const addCatogry = createOne(catogryModel);

export const getCatogries = getAll(catogryModel , "catogry");

export const getCatogry = getOne(catogryModel);

export const updateCatogry = updateOne(catogryModel);

export const deleteCatogry = deleteOne(catogryModel);

