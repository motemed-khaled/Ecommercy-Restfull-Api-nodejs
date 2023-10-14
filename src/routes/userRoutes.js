import express from "express";
import {
    createUserValidation,
    deleteUserValidation,
    getSpecificUserValidation,
    updateUserValidation,
    updateUserPasswordValidation,
    updateUserLoggedPasswordValidation,
    updateLoggedUserValidation
} from "../utils/validators/user-validator.js";

import {
    createUser,
    deleteUser,
    getAllUsers,
    getSpecificUser,
    updateUser,
    uploadUserImage,
    userImageProcessing,
    updateUserPassword,
    getLoggedUserData,
    updateUserLoggedPassword,
    updateUserLoggedData,
    deactiveUserLogged
} from "../controllers/userController.js";
import { auth as protectRoute , allowedTo } from "../controllers/authController.js";


export const router = express.Router();

router.use(protectRoute);

// logged user routes
router.get("/getloggeduser", getLoggedUserData,getSpecificUser);
router.put("/updateuserpassword",updateUserLoggedPasswordValidation, updateUserLoggedPassword);
router.put("/updateuserdata",updateLoggedUserValidation,updateUserLoggedData);
router.put("/deactivloggeduser",deactiveUserLogged);


// only super admin can use this route
router.use(allowedTo("superAdmin"));

router.put("/changepassword/:id",  updateUserPasswordValidation, updateUserPassword);

router
    .route("/")
    .post( uploadUserImage , userImageProcessing,createUserValidation, createUser)
    .get(getAllUsers);

router
    .route("/:id")
    .get(getSpecificUserValidation,getSpecificUser)
    .put(uploadUserImage , userImageProcessing,updateUserValidation, updateUser)
    .delete( deleteUserValidation, deleteUser);
    
