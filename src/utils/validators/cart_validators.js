import { check } from "express-validator";

import { validatorMiddleware } from "../../middleware/validator_middleware.js";
import { productModel } from "../../models/product_model.js";

export const addToCartValidation = [
    check("productId")
        .isMongoId().withMessage("invalid id format")
        .custom(val =>
            productModel.findById(val).then(product => {
                if (!product) {
                    return Promise.reject(new Error(`no catogry in this id:${val}`));
                }
                return true;
            })
        ),
    check("color").notEmpty().withMessage("product color is required"),
    validatorMiddleware
];

export const getSpecificCartItemValidation = [
    check("id").isMongoId().withMessage("invalid id format"),
    validatorMiddleware
];

export const updateCartItemQuantityValidation = [
    check("id").isMongoId().withMessage("invalid id format"),
    check("quantity").isInt().withMessage("quantity must be positive number"),
    validatorMiddleware
];

export const applayCopounValidation = [
    check("copoun").notEmpty().withMessage("copoun name is requierd"),
    validatorMiddleware
];