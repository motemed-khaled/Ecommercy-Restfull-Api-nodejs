import { check } from "express-validator";

import { validatorMiddleware } from "../../middleware/validator_middleware.js";


export const createCashOrderValidation = [
    check("id").isMongoId().withMessage("invalid id format"),
    check("shippingAddress[details]").optional()
        .notEmpty().withMessage("datails must be string"),
    check("shippingAddress[phone]").optional()
        .isMobilePhone(["ar-EG", "ar-SA"])
        .withMessage("Invalid phone number only accepted EG and SA numbers"),
    check("shippingAddress[city]").optional()
        .notEmpty().withMessage("city must be string"),
    check("shippingAddress[postalCode]").optional()
        .notEmpty().withMessage("city must be string"),
    validatorMiddleware
];

export const gitSpecificOrederValidation = [
    check("id").isMongoId().withMessage("invalid id format"),
    validatorMiddleware
];

export const isPaidAndIsDeliveredValidation = [
    check("id").isMongoId().withMessage("invalid id format"),
    validatorMiddleware
]