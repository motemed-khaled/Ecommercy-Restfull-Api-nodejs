import exppress from "express";


import {
    addProductToCart,
    getLoggedUserCart,
    deleteSpecificCartItem,
    deleteUserCart,
    updateCartItemQuantity,
    applayCopoun
} from "../controllers/cartController.js";

import {
    addToCartValidation,
    getSpecificCartItemValidation,
    updateCartItemQuantityValidation,
    applayCopounValidation
} from "../utils/validators/cart_validators.js";

import { allowedTo , auth as protect } from "../controllers/authController.js";


export const router = exppress.Router();

router.use(protect, allowedTo("user"));

router
    .route("/")
    .post(addToCartValidation, addProductToCart)
    .get(getLoggedUserCart)
    .delete(deleteUserCart)

router.put("/applaycopoun", applayCopounValidation, applayCopoun);

router
    .route("/:id")
    .delete(getSpecificCartItemValidation, deleteSpecificCartItem)
    .put(updateCartItemQuantityValidation, updateCartItemQuantity)
    
