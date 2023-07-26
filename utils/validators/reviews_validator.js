import { check } from "express-validator";

import { reviewModel } from "../../models/review_model.js";
import { validatorMiddleware } from "../../middleware/validator_middleware.js";


export const createReviewValidation = [
    check("title").optional(),
    check("rating")
        .notEmpty().withMessage("rating required")
        .isFloat({ min: 1, max: 5 }).withMessage("rating value must be between 1.0 and 5.0"),
    
    check("product")
        .isMongoId().withMessage("invalid product id format")
        .custom((val, { req }) =>
            reviewModel.findOne({ user: req.user._id, product: req.body.product }).then(review => {
                if (review) {
                    return Promise.reject(new Error("you already have areview for this product"))
                }
            })
    )
    .custom((val , {req})=> req.body.user = req.user._id),
    validatorMiddleware
];

export const getSpecificReviewValidation = [
    check("id").isMongoId().withMessage("invalid Review Id format"),
    validatorMiddleware
];

export const updateReviewValidation = [
    check("id").isMongoId().withMessage("invalid id fprmat")
        .custom((val, { req }) =>
            reviewModel.findById(val).then(review => {
                if (!review) {
                    return Promise.reject(new Error(`no reviews in this id : ${val}`))
                }
                if (review.user._id.toString() != req.user._id.toString()) {
                    return Promise.reject(new Error("you are not owner for this review"))
                }
            })
        ),
    check("title").optional(),
    check("rating").optional()
        .isFloat({ min: 1, max: 5 }).withMessage("rating value must be between 1.0 and 5.0"),
    validatorMiddleware
];

export const deleteReviewValidation = [
    check("id")
        .isMongoId().withMessage("invalid id format")
        .custom((val, { req }) => {
            if (req.user.role == "user") {
                return reviewModel.findById(val).then(review => {
                    if (!review) {
                        return Promise.reject(new Error(`no review in this id ${val}`))
                    }

                    if (review.user._id.toString() != req.user._id) {
                        return Promise.reject(new Error("you are not owner for this review"))
                    }
                })
            }
            return true;
        }),
    validatorMiddleware
];