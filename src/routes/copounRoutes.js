import express from "express";


import {
    createCopounValidation,
    deleteCopounValidation,
    getSpecificCopounValidation,
    updateCopounValidation
} from "../utils/validators/copoun_validator.js";
import {
    createcopoun,
    deletecopoun,
    getAllcopouns,
    getSpecificcopoun,
    updatecopoun
} from "../controllers/copounController.js";
import { auth as protectRoute , allowedTo } from "../controllers/authController.js";

export const router = express.Router();

router.use(protectRoute,allowedTo("admin" , "superAdmin"))

router
    .route("/")
    .post(createCopounValidation,createcopoun)
    .get(getAllcopouns);

router
    .route("/:id")
    .get(getSpecificCopounValidation, getSpecificcopoun)
    .put(updateCopounValidation,updatecopoun)
    .delete(deleteCopounValidation,deletecopoun);