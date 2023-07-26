import { check } from "express-validator";
import { validatorMiddleware } from "../../middleware/validator_middleware.js";
import { catogryModel } from "../../models/catogry-model.js";
import { subCatogryModel } from "../../models/subCatogry-model.js";
import slugify from "slugify";

export const createProductValidation = [
    check("title")
        .isLength({ min: 3 })
        .withMessage(" product title mustbe at least 3 charchter")
        .notEmpty()
        .withMessage("product title is required")
        .custom((val, { req }) => {
            req.body.slug = slugify(val);
            return true;
    }),
    check("description")
        .notEmpty()
        .withMessage("product description is required")
        .isLength({ max: 200 })
        .withMessage("product description is to long"),
    check("quantity")
        .notEmpty()
        .withMessage("product quantity is required")
        .isNumeric()
        .withMessage("product quantity mustbe anumber"),
    check("sold")
        .optional()
        .isNumeric()
        .withMessage("product quantity mustbe anumber"),
    check("price")
        .notEmpty()
        .withMessage("product price is required")
        .isNumeric()
        .withMessage("product price mustbe anumber")
        .isLength({ max: 32 })
        .withMessage("to long price"),
    check("priceAfterDiscount")
        .optional()
        .isNumeric()
        .withMessage("product priceAfterDiscount mustbe anumber")
        .toFloat()
        .custom((value, { req }) => {
            if (req.body.price <= value) {
                throw new Error("priceAfterDiscount mustbe lower than price")
            }
            return true;
        }),
    check("colors")
        .optional()
        .isArray()
        .withMessage("image should be array of string"),
    check("imageCover")
        .notEmpty()
        .withMessage("imageCover is required"),
    check("images")
        .optional()
        .isArray()
        .withMessage("images mustbe array of string"),
    check("catogry")
        .notEmpty()
        .withMessage("product mustbe belong to catogry")
        .isMongoId()
        .withMessage("Invalid Id Format")
        .custom((catogryId) => catogryModel.findById(catogryId).then(catogry => {
            if (!catogry) {
                return Promise.reject(`No Catogry For This Id : ${catogryId}`);
            }
        })),
    check("subCatogryies")
        .optional()
        .isMongoId()
        .withMessage("Invalid Id Format")
        .custom((subCatogryiesIds) => {
            return subCatogryModel.find({ _id: { $exists: true, $in: subCatogryiesIds } })
                .then(result => {
                    if (result.length != subCatogryiesIds.length || result.length < 1) {
                        return Promise.reject(`Invalid subCatogryiesIds `);
                    }
                });
        })
        .custom((value, { req }) => {
            return subCatogryModel.find({ catogry: req.body.catogry }).then(result => {
                const subCatogriesId = [];
                result.forEach(obj => subCatogriesId.push(obj._id.toString()));
                if (!value.every(val => subCatogriesId.includes(val))) {
                    return Promise.reject(`subcatogries not belong to this catogry ${req.body.catogry}`);
                }
            });
        }),
    check("brand")
        .optional()
        .isMongoId()
        .withMessage("Invalid Id Format"),
    check("ratingsAverage")
        .optional()
        .isNumeric()
        .withMessage("ratingsAverage mustbe number")
        .isLength({ min: 1 })
        .withMessage("rating mustbe equal or above 1.0")
        .isLength({ max: 5 })
        .withMessage("rating mustbe equal or below 1.0"),
    check("ratingsQuantity")
        .optional()
        .isNumeric()
        .withMessage("ratingsQuantity mustbe anumber"),
    validatorMiddleware
];

export const updateProductValidation = [
    check("id").isMongoId().withMessage("Invalid Id Formatt"),
    check("title")
        .optional()
    .isLength({ min: 3 })
    .withMessage(" product title mustbe at least 3 charchter")
    .notEmpty()
    .withMessage("product title is required")
    .custom((val, { req }) => {
        req.body.slug = slugify(val);
        return true;
}),
    check("description")
    .optional()
    .notEmpty()
    .withMessage("product description is required")
    .isLength({ max: 200 })
    .withMessage("product description is to long"),
    check("quantity")
    .optional()
    .notEmpty()
    .withMessage("product quantity is required")
    .isNumeric()
    .withMessage("product quantity mustbe anumber"),
check("sold")
    .optional()
    .isNumeric()
    .withMessage("product quantity mustbe anumber"),
    check("price")
    .optional()
    .notEmpty()
    .withMessage("product price is required")
    .isNumeric()
    .withMessage("product price mustbe anumber")
    .isLength({ max: 32 })
    .withMessage("to long price"),
check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("product priceAfterDiscount mustbe anumber")
    .toFloat()
    .custom((value, { req }) => {
        if (req.body.price <= value) {
            throw new Error("priceAfterDiscount mustbe lower than price")
        }
        return true;
    }),
check("colors")
    .optional()
    .isArray()
    .withMessage("image should be array of string"),
    check("imageCover")
    .optional()
    .notEmpty()
    .withMessage("imageCover is required"),
check("images")
    .optional()
    .isArray()
    .withMessage("images mustbe array of string"),
    check("catogry")
    .optional()
    .notEmpty()
    .withMessage("product mustbe belong to catogry")
    .isMongoId()
    .withMessage("Invalid Id Format")
    .custom((catogryId) => catogryModel.findById(catogryId).then(catogry => {
        if (!catogry) {
            return Promise.reject(`No Catogry For This Id : ${catogryId}`);
        }
    })),
check("subCatogryies")
    .optional()
    .isMongoId()
    .withMessage("Invalid Id Format")
    .custom((subCatogryiesIds) => {
        return subCatogryModel.find({ _id: { $exists: true, $in: subCatogryiesIds } })
            .then(result => {
                if (result.length != subCatogryiesIds.length || result.length < 1) {
                    console.log(true)
                    return Promise.reject(`Invalid subCatogryiesIds `);
                }
            });
    })
    .custom((value, { req }) => {
        return subCatogryModel.find({ catogry: req.body.catogry }).then(result => {
            const subCatogriesId = [];
            result.forEach(obj => subCatogriesId.push(obj._id.toString()));
            if (!value.every(val => subCatogriesId.includes(val))) {
                return Promise.reject(`subcatogries not belong to this catogry ${req.body.catogry}`);
            }
        });
    }),
check("brand")
    .optional()
    .isMongoId()
    .withMessage("Invalid Id Format"),
check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("ratingsAverage mustbe number")
    .isLength({ min: 1 })
    .withMessage("rating mustbe equal or above 1.0")
    .isLength({ max: 5 })
    .withMessage("rating mustbe equal or below 1.0"),
check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("ratingsQuantity mustbe anumber"),
    validatorMiddleware
];

export const deleteProductValidation = [
    check("id").isMongoId().withMessage("Invalid Id Formatt"),
    validatorMiddleware
];

export const getSpecificProductValidation = [
    check("id").isMongoId().withMessage("Invalid Id Formatt"),
    validatorMiddleware
];



