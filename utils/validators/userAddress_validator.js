import { check } from "express-validator";

import { validatorMiddleware } from "../../middleware/validator_middleware.js";
import { userModel } from "../../models/userModel.js";

export const addAddressValidation = [
    check("alias").notEmpty().withMessage("alias required")
        .custom((val, { req }) => 
            userModel.find({ "addresses.alias": { $eq: val } }).then(address => {
            if (address.length == 0) {
                return true;
                }
                return Promise.reject(new Error("you already have this alias before"));
        })
    ),
    check("details").notEmpty().withMessage("details required"),
    check("city").notEmpty().withMessage("city required"),
    check("postalCode").notEmpty().withMessage("postalCode required"),
    check("phone").isMobilePhone(["ar-EG", "ar-SA"])
        .withMessage("Invalid phone number only accepted EG and SA numbers"),
    validatorMiddleware
];

export const deleteUserAddressValidation = [
    check("addressId").isMongoId().withMessage("invalid id format"),
    validatorMiddleware
];