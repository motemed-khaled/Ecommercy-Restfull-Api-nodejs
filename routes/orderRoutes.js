import express from "express";

import {
    createCashOrder,
    filterOrderByCurrentUser,
    getAllOrders,
    getSpecificOrder,
    getSpecificOrderCheck,
    updateIsDelivered,
    updateIsPaid,
    checkOutSession
} from "../controllers/orderController.js";
import {
    createCashOrderValidation,
    gitSpecificOrederValidation,
    isPaidAndIsDeliveredValidation
} from "../utils/validators/order_validator.js";
import { allowedTo , auth as protect } from "../controllers/authController.js";


export const router = express.Router();

router.use(protect);

router.get("/check-out-session/:id", allowedTo("user"), checkOutSession);

router.route("/:id")
    .post(allowedTo("user"), createCashOrderValidation, createCashOrder)
    .get(allowedTo("user", "admin", "superAdmin"),gitSpecificOrederValidation, getSpecificOrderCheck, getSpecificOrder);

router.route("/").get(allowedTo("user", "admin", "superAdmin"), filterOrderByCurrentUser, getAllOrders);

router.put("/:id/pay",isPaidAndIsDeliveredValidation, allowedTo("admin", "superAdmin"), updateIsPaid);
router.put("/:id/deliver", isPaidAndIsDeliveredValidation,allowedTo("admin", "superAdmin"), updateIsDelivered);

