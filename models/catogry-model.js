import mongoose from "mongoose";

const catogrySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "catogryName is required"],
        unique : [true, "catogryName must be unique"],
        minlength:[3 , "catogryName is shorter"],
        maxlength: [32, "To long catogryName"],
        trim:true
    },
    slug: {
        type: String,
        lowercase: true
        
    },
    image: String
}, { timestamps: true });


// to set image url in response
const setImageUrl = (doc) => {
    if (doc.image) {
        const imageUrl = `${process.env.BASE_URL}/catogries/${doc.image}`;
        doc.image = imageUrl;
    }
}

catogrySchema.post("init", (doc) => {
    setImageUrl(doc);
});

catogrySchema.post("save", (doc) => {
    setImageUrl(doc);
});

export const catogryModel = mongoose.model("catogry", catogrySchema);