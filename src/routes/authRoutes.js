import express from "express";

import { signUpUserValidation , loginUserValidation , updateUserPasswordValidation } from "../utils/validators/auth_validator.js";
import { sginUp , login  } from "../controllers/authController.js";
import { forgetBassword , verifyResetCode , updateUserPassword } from "../controllers/forgetBasswordController.js";

export const router = express.Router();

router.post("/signup" ,signUpUserValidation, sginUp);

router.post("/login",loginUserValidation, login);

router.post("/forgotpassword", forgetBassword);

router.post("/verifyresetcode", verifyResetCode);

router.put("/resetpassword", updateUserPasswordValidation , updateUserPassword);