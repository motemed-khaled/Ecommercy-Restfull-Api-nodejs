import exppress from "express";

import {
    getCatogryValidator,
    createCatogryValidator,
    deleteCatogryValidator,
    updateCatogryValidator
} from "../utils/validators/catogry-validator.js";
import {
    addCatogry,
    getCatogries,
    getCatogry,
    updateCatogry,
    deleteCatogry,
    uploadCatogryImage,
    imageProcessing
} from "../controllers/catogryController.js";
import { auth as protectRoute , allowedTo } from "../controllers/authController.js";
import { router as subCatogryRoutes } from "./subCatogryRoutes.js"

export const router = exppress.Router();

router.use("/:catogryId/subCatogeries", subCatogryRoutes);

router
    .route("/")
    .post(protectRoute,allowedTo("admin" , "superAdmin"),uploadCatogryImage,imageProcessing,createCatogryValidator, addCatogry)
    .get(getCatogries);

router
    .route("/:id")
    .get(getCatogryValidator, getCatogry)
    .put(protectRoute,allowedTo("admin" , "superAdmin"),uploadCatogryImage,imageProcessing,updateCatogryValidator , updateCatogry)
    .delete(protectRoute,allowedTo("superAdmin"),deleteCatogryValidator,deleteCatogry);