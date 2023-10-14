import mongoose from "mongoose";

const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "brand name is required"],
        unique: [true, "brand name must be unique"],
        minlength: [3, "brand name is shorter"],
        maxlength: [32, "brand name is longer"],
        trim: true
    },
    slug: {
        type: String,
        lowercase: true
    },
    image: String
}, { timestamps: true });


const imageUrl = (doc) => {
    if (doc.image) {
        const imageUrl = `${process.env.BASE_URL}/brands/${doc.image}`;
        doc.image = imageUrl;
    }
}
brandSchema.post("init", (doc) => {
    imageUrl(doc);
});
brandSchema.post("save", (doc) => {
    imageUrl(doc)
});

export const brandModel = mongoose.model("brand", brandSchema);