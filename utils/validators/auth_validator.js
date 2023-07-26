import { check } from "express-validator";
import slugify from "slugify";

import { validatorMiddleware } from "../../middleware/validator_middleware.js";
import { userModel } from "../../models/userModel.js";


export const signUpUserValidation = [
    check("name")
        .notEmpty().withMessage("name is required")
        .isLength({ min: 3 }).withMessage("too short name")
        .custom((val, { req }) => req.body.slug = slugify(val)),
    
    check("email")
        .isEmail().withMessage("invalid email address")
        .custom(val =>
             userModel.findOne({ email: val }).then(user => {
                if (user) {
                    return Promise.reject("email address already in use");
                }
            })
        ),
    
    check("password")
        .notEmpty().withMessage("password is required")
        .isLength({ min: 6 }).withMessage("too short password")
        .custom((val, { req }) => {
            if (val != req.body.confirmPassword) {
                throw new Error("Passord Confirmation incorrect")
            } else {
                return true;
            }
        }),
    
    check("confirmPassword")
        .notEmpty().withMessage("confirmPassword is required"),
   
    validatorMiddleware
];

export const loginUserValidation = [
    check("email")
        .isEmail().withMessage("invalid email address"),
    
    check("password")
        .notEmpty().withMessage("password is required")
        .isLength({ min: 6 }).withMessage("too short password")
    ,
    validatorMiddleware
];

export const updateUserPasswordValidation = [
    check("email").isEmail().withMessage("invalid email address format"),
    check("newpassword").notEmpty().withMessage("new password is required")
        .isLength({ min: 6 }).withMessage("to short password"),
    check("confirmpassword").notEmpty().withMessage("confirm passwordis required")
        .custom((val, { req }) => {
            if (val != req.body.newpassword) {
                throw new Error("incorrect confirm password");
            }
            return true
        }),
    validatorMiddleware
];


