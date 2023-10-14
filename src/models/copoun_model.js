import mongoose from "mongoose";

const copounSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, "copoun name is required"],
        unique:true
    },
    expire: {
        type: Date,
        required:[true , "copoun expire time required"]
    },
    discount: {
        type: Number,
        required:[true,"copoun discount value required"]
    }
}, { timestamps: true })


export const copounModel = mongoose.model("copouns", copounSchema);