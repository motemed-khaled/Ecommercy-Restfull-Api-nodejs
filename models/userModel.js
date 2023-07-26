import mongoose from "mongoose";
import bcryptjs from "bcryptjs";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "userName Is  Required"],
        trim: true
    },
    slug: {
        type: String,
        lowercase: true
    },
    email: {
        type: String,
        required: [true, "Email Is Required"],
        unique: [true, "Email Mustbe Unique"],
        lowercase: true
    },
    phone: String,
    profileImg: String,
    password: {
        type: String,
        required: [true, "Password Is Required"],
        minlength: [6, "Too Short Password"]
    },
    changePasswordTime: Date,
    resetCodePassword: String,
    resetCodeExpire: Date,
    resetCodeVerify:Boolean,
    role: {
        type: String,
        enum: ["user", "admin" , "superAdmin"],
        default: "user"
    },
    active: {
        type: Boolean,
        default: true
    },
    wishList:[ {
        type: mongoose.Schema.ObjectId,
        ref:"product"
    }],
    addresses: [{
        id: { type: mongoose.Schema.Types.ObjectId },
        alias: String,
        details: String,
        phone: String,
        city: String,
        postalCode:String
    }]
}, { timestamps: true });

const setImgUrl = (doc) => {
    if (doc.profileImg) {
        const imgUrl = `${process.env.BASE_URL}/users/${doc.profileImg}`
        doc.profileImg = imgUrl;
    }
}
userSchema.post("init", (doc) => {
   setImgUrl(doc)
});
userSchema.post("save", (doc) => {
   setImgUrl(doc)
});

// hashing password

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcryptjs.hash(this.password, 12);
    next();
});

export const userModel = mongoose.model("users", userSchema);