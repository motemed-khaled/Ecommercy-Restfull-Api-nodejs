import express from "express";
import {
    createBrandValidator,
    getSpecificBrandValidator,
    updateBrandValidator,
    deleteBrandValidator
} from "../utils/validators/brand-validator.js";
import {
    createBrand,
    getAllBrands,
    getSpecificBrand,
    updateBrand,
    deleteBrand,
    brandImageProcessing,
    uploadBrandImage
} from "../controllers/brandController.js";
import { auth as protectRoute , allowedTo } from "../controllers/authController.js";

export const router = express.Router();

router
    .route("/")
    .post(protectRoute,allowedTo("admin" , "superAdmin"),uploadBrandImage , brandImageProcessing,createBrandValidator, createBrand)
    .get(getAllBrands);

router
    .route("/:id")
    .get(getSpecificBrandValidator, getSpecificBrand)
    .put(protectRoute,allowedTo("admin" , "superAdmin"),uploadBrandImage , brandImageProcessing,updateBrandValidator, updateBrand)
    .delete(protectRoute, allowedTo("admin", "superAdmin"), deleteBrandValidator, deleteBrand);