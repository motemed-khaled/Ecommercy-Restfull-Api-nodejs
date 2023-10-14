import { check } from "express-validator";

import { validatorMiddleware } from "../../middleware/validator_middleware.js";
import { productModel } from "../../models/product_model.js";

export const addProductToWhisListValidation = [
    check("productId")
        .isMongoId().withMessage("invalid id format")
        .custom(async (val) =>
            await productModel.findById(val).then(product => {
                if (!product) {
                    return Promise.reject(new Error(`no product in this id ${val}`))
                }
                return true;
            })
        ),
    validatorMiddleware
];

export const removeProductFromWhisListValidation = [
    check("productId").isMongoId().withMessage("invalid id format"),
    validatorMiddleware
];