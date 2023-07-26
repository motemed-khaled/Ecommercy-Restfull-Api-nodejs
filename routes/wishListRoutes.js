import express from "express";

import { addProductToWishList ,removeProductToWishList , getLoggedUserWishList } from "../controllers/wishListController.js";
import { addProductToWhisListValidation , removeProductFromWhisListValidation } from "../utils/validators/wishList_validator.js";
import { allowedTo ,auth as protect } from "../controllers/authController.js";


export const router = express.Router();

router.use(protect, allowedTo("user"))

router
    .route("/")
    .post(addProductToWhisListValidation, addProductToWishList)
    .get(getLoggedUserWishList);
    
router.delete("/:productId", removeProductFromWhisListValidation, removeProductToWishList);