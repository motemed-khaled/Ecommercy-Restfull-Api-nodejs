import mongoose from "mongoose";


const cartSchema = new mongoose.Schema({
    cartItems: [{
        product: {
            type: mongoose.Schema.ObjectId,
            ref: "product"
        },
        quantity: {
            type: Number,
            default:1
        },
        color: String,
        price: Number
    }],
    totalCartPrice: Number,
    totalCartPriceAfterDiscount: Number,
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "users"
    }
}, { timestamps: true });

export const cartModel = mongoose.model("cart", cartSchema);