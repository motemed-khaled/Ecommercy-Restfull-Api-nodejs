import { check } from "express-validator";
import { validatorMiddleware } from "../../middleware/validator_middleware.js";
import slugify from "slugify";


export const getCatogryValidator = [
    check("id").isMongoId().withMessage("Invalid Catogery Id Format.."),
    validatorMiddleware,
];

export const createCatogryValidator = [
    check("name").notEmpty()
        .withMessage("catogryName is required")
        .isLength({ min: 3 })
        .withMessage("catogryName is shorter")
        .isLength({ max: 32 })
        .withMessage("To long catogryName")
        .custom((val, { req }) => {
            req.body.slug = slugify(val);
            return true;
    }),
    validatorMiddleware
];

export const updateCatogryValidator = [
    check("id").isMongoId().withMessage("Invalid Catogery Id Format.."),
    check("name").optional().notEmpty().withMessage("catogryName is Required")
        .isLength({ min: 3 }).withMessage("catogryName Is Shorter")
        .isLength({ max: 32 }).withMessage("catogry Name Is Longer")
        .custom((val, { req }) => {
            req.body.slug = slugify(val);
            return true;
    }),
    validatorMiddleware,
];

export const deleteCatogryValidator = [
    check("id").isMongoId().withMessage("Invalid Catogery Id Format.."),
    validatorMiddleware,
];