import { check } from "express-validator";

import { validatorMiddleware } from "../../middleware/validator_middleware.js";
import { copounModel } from "../../models/copoun_model.js";


export const createCopounValidation = [
    check("name")
        .notEmpty().withMessage("copoun name is required")
        .custom(val => 
            copounModel.findOne({ name: val }).then(copoun => {
                if (copoun) {
                    return Promise.reject(new Error("dublicated copoun name"))
                }
                return true;
            })
        ),
    check("expire")
        .isDate({ format: 'DD-MM-YYYY' }).withMessage("date format mustbe 'DD-MM-YYYY'")
        .custom(val => {
            if (new Date(val).getTime() < Date.now()) {
                console.log(new Date(val).getTime() < Date.now())
                throw new Error("date you enter in the past")
            }
            return true
    }),
    check("discount").isNumeric().withMessage("copoun discount must be anumber"),
        
    validatorMiddleware
];

export const updateCopounValidation = [
    check("name").optional()
        .notEmpty().withMessage("copoun name is required")
        .custom(val => 
            copounModel.findOne({ name: val }).then(copoun => {
                if (copoun) {
                    return Promise.reject(new Error("dublicated copoun name"))
                }
                return true;
            })
        ),
    check("expire").optional()
    .isDate({format: 'DD-MM-YYYY'}).withMessage("date format mustbe 'DD-MM-YYYY'"),
    check("discount").optional()
        .isNumeric().withMessage("copoun discount must be anumber"),
    validatorMiddleware
];

export const getSpecificCopounValidation = [
    check("id").isMongoId().withMessage("invalid id format"),
    validatorMiddleware
];

export const deleteCopounValidation = [
    check("id").isMongoId().withMessage("invalid id format"),
    validatorMiddleware
];