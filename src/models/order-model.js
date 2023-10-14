import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "users",
        required: [true, "order must be belong to user"]
    },
    cartItems: [{
        product: {
            type: mongoose.Schema.ObjectId,
            ref: "product"
        },
        quantity: {
            type: Number,
            default: 1
        },
        color: String,
        price: Number
    }],
    taxPrice: {
        type: Number,
        default: 0
    },
    shippingAddress: {
        details: String,
        phone: String,
        city: String,
        postalCode:String
    },
    shippingPrice: {
        type: Number,
        default: 0
    },
    totalOrderPrice: {
        type: Number
    },
    paymentMethodType: {
        type: String,
        enum: ["cash", "card"],
        default: "cash"
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    paidAt: Date,
    isDelivered: {
        type: Boolean,
        default: false
    },
    deliveredAt: Date
}, { timestamps: true });

orderSchema.pre(/^find/, function (next) {
    this.populate({ path: "user", select: "name phone email profileImg" })
        .populate({path:"cartItems.product" , select:"title imageCover"});
    next();
});

export const orderModel = mongoose.model("orders", orderSchema);