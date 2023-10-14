import { check } from "express-validator";
import { validatorMiddleware } from "../../middleware/validator_middleware.js";
import slugify from "slugify";


export const createSubCatogryValidator = [
    check("name").notEmpty()
        .withMessage("Name is required")
        .isLength({ min: 2 })
        .withMessage("subCatogryName is shorter")
        .isLength({ max: 32 })
        .withMessage("subCatogryName is too longer")
        .custom((val, { req }) => {
            req.body.slug = slugify(val);
            return true;
    }),
    check("catogry").notEmpty().withMessage("catogryId is required")
        .isMongoId().withMessage("Invalid catogryId Format"),
    validatorMiddleware
];

export const getSpecificSubCatogryValidator = [
    check("id").isMongoId().withMessage("Invalid SubCatogry Id.."),
    validatorMiddleware
]

export const updateSubCatogryValidator = [
    check("id").isMongoId().withMessage("Invalid SubCatogry Id.."),
    check("name").optional().notEmpty().withMessage("Name is required")
        .isLength({ min: 2 }).withMessage("subCatogryName is shorter")
        .isLength({ max: 32 }).withMessage("subCatogryName is too longer")
        .custom((val, { req }) => {
            req.body.slug = slugify(val);
            return true;
    }),
    check("catogry").optional().isMongoId().withMessage("Invalid catogryId Format"),
    validatorMiddleware
]

export const deleteSubCatogryValidator = [
    check("id").isMongoId().withMessage("Invalid catogryId Format"),
    validatorMiddleware
]