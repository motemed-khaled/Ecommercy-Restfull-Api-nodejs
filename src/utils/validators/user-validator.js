import { check } from "express-validator";
import slugify from "slugify";
import  bcryptjs  from "bcryptjs";

import { validatorMiddleware } from "../../middleware/validator_middleware.js";
import { userModel } from "../../models/userModel.js";


export const createUserValidation = [
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
    
    check("phone").optional()
        .isMobilePhone(["ar-EG", "ar-SA"])
        .withMessage("Invalid phone number only accepted EG and SA numbers"),
    
    check("profileImg").optional(),
    check("role").optional(),
    check("active").optional().isBoolean().withMessage("we expect aboolean value (true or false)"),
    validatorMiddleware
];

export const updateUserValidation = [
    check("id").isMongoId().withMessage("invalid id format"),
    check("name")
        .optional()
        .notEmpty().withMessage("name is required")
        .isLength({ min: 3 }).withMessage("too short name")
    .custom((val , {req})=>req.body.slug = slugify(val)),

    check("email")
        .optional()
        .isEmail().withMessage("invalid email address")
        .custom(val => {
            return userModel.findOne({ email: val }).then(user => {
                if (user) {
                    return Promise.reject("email address already in use")
                }
            });
        }),

    check("phone").optional()
        .isMobilePhone(["ar-EG", "ar-SA"])
        .withMessage("Invalid phone number only accepted EG and SA numbers"),

    check("profileImg").optional(),
    check("role").optional(),
    check("active").optional().isBoolean().withMessage("we expect aboolean value (true or false)"),
    validatorMiddleware
];

export const deleteUserValidation = [
    check("id").isMongoId().withMessage("invalid id format"),
    validatorMiddleware
];

export const getSpecificUserValidation = [
    check("id").isMongoId().withMessage("invalid id format"),
    validatorMiddleware
];

export const updateUserPasswordValidation = [
    check("id").isMongoId().withMessage("invalid id format"),
    check("currentPassword")
        .notEmpty().withMessage("current password is required"),
    
    check("confirmPassword")
        .notEmpty().withMessage("confirmPassword is required"),

    check("password")
        .notEmpty().withMessage("password is required")
        .isLength({ min: 6 }).withMessage("too short password")
        // confirm password verify
        .custom((val, { req }) => {
            if (val != req.body.confirmPassword) {
                throw new Error("Passord Confirmation incorrect")
            } else {
                return true;
            }
        })

        // verify current password
        .custom(async(val, { req }) => {
            const user = await userModel.findById(req.params.id, { password: 1 });
            if (!user) {
                throw new Error(`no user in this id : ${req.params.id}`);
            }
            const wrongPassword = await bcryptjs.compare(req.body.currentPassword, user.password);
            if (!wrongPassword) {
                throw new Error("incorrect current password")
            }
            return true;
    }),

    validatorMiddleware
];

export const updateUserLoggedPasswordValidation = [
    check("confirmPassword")
        .notEmpty().withMessage("confirmPassword is required"),

    check("password")
        .notEmpty().withMessage("password is required")
        .isLength({ min: 6 }).withMessage("too short password")
        // confirm password verify
        .custom((val, { req }) => {
            if (val != req.body.confirmPassword) {
                throw new Error("Passord Confirmation incorrect")
            } else {
                return true;
            }
        }),

    validatorMiddleware
];

export const updateLoggedUserValidation = [
    check("name")
        .optional()
        .notEmpty().withMessage("name is required")
        .isLength({ min: 3 }).withMessage("too short name")
    .custom((val , {req})=>req.body.slug = slugify(val)),

    check("email")
        .optional()
        .isEmail().withMessage("invalid email address")
        .custom(val => {
            return userModel.findOne({ email: val }).then(user => {
                if (user) {
                    return Promise.reject("email address already in use")
                }
            });
        }),

    check("phone").optional()
        .isMobilePhone(["ar-EG", "ar-SA"])
        .withMessage("Invalid phone number only accepted EG and SA numbers"),

    check("profileImg").optional(),
    validatorMiddleware
];
