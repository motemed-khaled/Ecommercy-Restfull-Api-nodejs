import exppress from "express";
import {
    createSubCatogry,
    getSubCatogries,
    getSpecificSubCatogry,
    updateSubcatogry,
    deleteSubcatogry,
    getSubCatogriesMiddleWare,
    createSubCatogriesMiddleWare
} from "../controllers/subCatogryController.js";
import {
    createSubCatogryValidator,
    getSpecificSubCatogryValidator,
    updateSubCatogryValidator,
    deleteSubCatogryValidator
} from "../utils/validators/subCatogry-validator.js";
import { auth as protectRoute , allowedTo } from "../controllers/authController.js";

export const router = exppress.Router({mergeParams:true});

router
    .route("/")
    .post(protectRoute , allowedTo("admin" , "superAdmin"),createSubCatogriesMiddleWare,createSubCatogryValidator, createSubCatogry)
    .get(getSubCatogriesMiddleWare, getSubCatogries);
    
router
    .route("/:id")
    .get(getSpecificSubCatogryValidator, getSpecificSubCatogry)
    .put(protectRoute , allowedTo("admin" , "superAdmin"),updateSubCatogryValidator, updateSubcatogry)
    .delete(protectRoute , allowedTo( "superAdmin"),deleteSubCatogryValidator,deleteSubcatogry);