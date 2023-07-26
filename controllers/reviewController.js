
import asyncHandler from "express-async-handler";

import { reviewModel } from "../models/review_model.js";
import {
    deleteOne,
    updateOne,
    createOne,
    getOne,
    getAll
} from "./handlersFactory.js";

export const getAllReviewMiddleWare = (req, res, next) => {
    let filterObj = {}
    if (req.params.productId) {
        filterObj = {product:req.params.productId}
    }
    req.filterObj = filterObj;
    next();
}
export const createReviewMiddleWare = (req, res, next) => {
    if (req.params.productId) {
        req.body.product = req.params.productId
    }
    next();
};

export const createReview = createOne(reviewModel)

export const getAllReview = getAll(reviewModel , "review");

export const getSpecificReview = getOne(reviewModel);

export const updateReview = updateOne(reviewModel);

export const deleteReview = deleteOne(reviewModel);
