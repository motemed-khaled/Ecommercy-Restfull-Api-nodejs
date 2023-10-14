import asyncHandler from "express-async-handler";
import { uid } from "uid";
import sharp from "sharp";

import { productModel } from "../models/product_model.js";
import { deleteOne , updateOne , createOne, getOne , getAll } from "./handlersFactory.js";
import { uploadMultiImage } from "../middleware/uploadImage_middleWare.js";



// upload multi image
export const uploadProductImages = uploadMultiImage([{
    name: "imageCover",
    maxCount: 1
}, {
    name: "images",
    maxCount: 5
}]);
// image procceing
export const resizeProductImage = asyncHandler(async (req, res, next) => {
    // image processing for imageCover
    if (req.files.imageCover) {
        const imageCoverFileName = `product-${uid()}-${Date.now()}-cover.jpeg`

        await sharp(req.files.imageCover[0].buffer)
            .resize(2000, 1333)
            .toFormat("jpeg")
            .jpeg({ quality: 95 })
            .toFile(`uploads/products/${imageCoverFileName}`);
        req.body.imageCover = imageCoverFileName;
    }

    // image processing for images
    if (req.files.images) {
        req.body.images = [];
        await Promise.all(
            req.files.images.map(async (img, index) => {
                const imageName = `product-${uid()}-${Date.now()}-${index + 1}.jpeg`;
                await sharp(img.buffer)
                    .resize(2000, 1333)
                    .toFormat("jpeg")
                    .jpeg({ quality: 95 })
                    .toFile(`uploads/products/${imageName}`);
                
                req.body.images.push(imageName);
            })
        )
    }
    next();
});

export const createProduct = createOne(productModel);

export const getAllProduct = getAll(productModel , "products");

export const getSpecificProduct = getOne(productModel , "reviews");

export const updateProduct = updateOne(productModel);

export const deleteProduct = deleteOne(productModel);

