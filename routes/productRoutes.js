import express from "express";
import {
    createProduct,
    deleteProduct,
    getAllProduct,
    getSpecificProduct,
    updateProduct,
    resizeProductImage,
    uploadProductImages
} from "../controllers/productController.js";
import {
    createProductValidation,
    deleteProductValidation,
    getSpecificProductValidation,
    updateProductValidation,
} from "../utils/validators/product-validator.js";
import { auth as protectRoute, allowedTo } from "../controllers/authController.js";
import { router as reviewsRoutes } from "./reviewRoutes.js";

export const router = express.Router();

// applay nested route
router.use("/:productId/reviews", reviewsRoutes);

router
    .route("/")
    .post(protectRoute , allowedTo("admin" , "superAdmin"),uploadProductImages,resizeProductImage,createProductValidation, createProduct)
    .get(getAllProduct);

router
    .route("/:id")
    .get(getSpecificProductValidation, getSpecificProduct)
    .put(protectRoute , allowedTo("admin" , "superAdmin"),uploadProductImages,resizeProductImage,updateProductValidation, updateProduct)
    .delete(protectRoute , allowedTo("superAdmin"),deleteProductValidation, deleteProduct);


