import { check } from "express-validator";
import { validatorMiddleware } from "../../middleware/validator_middleware.js";
import slugify from "slugify";


export const createBrandValidator = [
    check("name").notEmpty().withMessage("brand name is required")
        .isLength({ min: 3 }).withMessage("brand name is shorter")
        .isLength({ max: 32 }).withMessage("brand name is longer")
        .custom((val, { req }) => {
            req.body.slug = slugify(val);
            return true;
    }),
    validatorMiddleware
];

export const getSpecificBrandValidator = [
    check("id").isMongoId().withMessage("Invalid Brand Id Format"),
    validatorMiddleware
];

export const updateBrandValidator = [
    check("id").isMongoId().withMessage("Invalid Brand Id Format"),
    check("name").optional().notEmpty().withMessage("Brand Name Is Required")
        .isLength({ min: 3 }).withMessage("Brand Name Is Shorter")
        .isLength({ max: 32 }).withMessage("Brand Name Is Longer")
        .custom((val, { req }) => {
            req.body.slug = slugify(val);
            return true;
    }),
    validatorMiddleware
];

export const deleteBrandValidator = [
    check("id").isMongoId().withMessage("Invalid Brand Id Format"),
    validatorMiddleware
];
