import mongoose from "mongoose";

import { productModel } from "./product_model.js";

const reviewSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    rating: {
        type: Number,
        required: [true, "rating required"],
        min: [1, "min rating is 1.0"],
        max: [5, "max rating is 5.0"],
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "users",
        required: [true, "review must belong to user"]
    },
    product: {
        type: mongoose.Schema.ObjectId,
        ref: "product",
        required: [true, "review must belong to product"]
    }
}, { timestamps: true });

reviewSchema.pre(/^find/, function (next) {
    this.populate({ path: "user", select: "name" });
    next();
});

reviewSchema.statics.claculateAvgRatingAndCount = async function (productId) {
    const result = await this.aggregate([
        {
            $match: { product: productId }
        },
        {
            $group: {
                _id: "product",
                avgRating: { $avg: "$rating" },
                ratingQuantity: { $sum: 1 }
            }
        }
    ]);

    if (result.length > 0) {
        await productModel.findByIdAndUpdate(
            productId,
            {
                ratingsAverage: result[0].avgRating,
                ratingsQuantity: result[0].ratingQuantity,
            }
        );
    } else {
        await productModel.findByIdAndUpdate(
            productId,
            {
                ratingsAverage: 0,
                ratingsQuantity: 0,
            }
        );
    }
};

reviewSchema.post("save", async function () {
    await this.constructor.claculateAvgRatingAndCount(this.product);
});

reviewSchema.post(/^findOneAnd/, async function (doc) {
    if(doc) await doc.constructor.claculateAvgRatingAndCount(doc.product);
});


export const reviewModel = mongoose.model("reviews", reviewSchema);