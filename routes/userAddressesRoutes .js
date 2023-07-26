import express from "express";

import { addAddressValidation ,deleteUserAddressValidation } from "../utils/validators/userAddress_validator.js";
import { addAddressToUserAddresses,getLoggedUserAddresses,removeAddressToUserAddresses } from "../controllers/userAddreessController.js";
import { allowedTo ,auth as protect } from "../controllers/authController.js";


export const router = express.Router();

router.use(protect, allowedTo("user"))

router
    .route("/")
    .post(addAddressValidation,addAddressToUserAddresses)
    .get(getLoggedUserAddresses);
    
router.delete("/:addressId",deleteUserAddressValidation, removeAddressToUserAddresses);