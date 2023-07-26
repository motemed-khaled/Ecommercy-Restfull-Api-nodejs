import express from "express";

import {
    createReview,
    deleteReview,
    getAllReview,
    getSpecificReview,
    updateReview,
    getAllReviewMiddleWare,
    createReviewMiddleWare
} from "../controllers/reviewController.js";
import { auth as protect, allowedTo } from "../controllers/authController.js";
import {
    createReviewValidation,
    getSpecificReviewValidation,
    updateReviewValidation,
    deleteReviewValidation
} from "../utils/validators/reviews_validator.js";

export const router = express.Router({mergeParams:true});

router
    .route("/")
    .post(protect, allowedTo("user"),createReviewMiddleWare,createReviewValidation, createReview)
    .get(getAllReviewMiddleWare,getAllReview);

router
    .route("/:id")
    .get(getSpecificReviewValidation,getSpecificReview)
    .put(protect, allowedTo("user"), updateReviewValidation,updateReview)
    .delete(protect,allowedTo("user" , "admin" , "superAdmin"),deleteReviewValidation , deleteReview)