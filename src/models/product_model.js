import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        minlength: [3, "to short product title"],
        maxlength: [100, "to long product title"],
        required: [true, "product titile is required"],
        trim: true
    },
    slug: {
        type: String,
        lowercase: true
    },
    description: {
        type: String,
        required: [true, "product description is required"],
        minlength: [20, "to short product description"]
    },
    quantity: {
        type: Number,
        required: [true, "product quantity is required"]
    },
    sold: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, "product prce is required"],
        trim: true,
        max: [200000, "to long product price"]
    },
    priceAfterDiscount: {
        type: Number,
    },
    colors: [String],
    imageCover: {
        type: String,
        required: [true, "product image cover is required"]
    },
    images: [String],
    catogry: {
        type: mongoose.Schema.ObjectId,
        ref: "catogry",
        required: [true, "product must be belong to catogry"]
    },
    subCatogryies: [{
        type: mongoose.Schema.ObjectId,
        ref: "subCatogry"
    }],
    brand: {
        type: mongoose.Schema.ObjectId,
        ref: "brand"
    },
    ratingsAverage: {
        type: Number,
        min: [1, "Rating must be equal or above 1.0"],
        max: [5, "Rating must be equal or below 5.0"],
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject:{virtuals:true}
});

productSchema.virtual("reviews", {
    ref: "reviews",
    foreignField: "product",
    localField: "_id"
});



productSchema.pre(/^find/, function (next) {
    this.populate({
        path: "catogry",
        select: "name"
    })
    next();
});

const setImageUrl = (doc) => {
    if (doc.imageCover) {
        const imageUrl = `${process.env.BASE_URL}/products/${doc.imageCover}`
        doc.imageCover = imageUrl;
    }
    if (doc.images) {
        const images = [];
        doc.images.map(img => {
            const imageUrl = `${process.env.BASE_URL}/products/${img}`
            images.push(imageUrl);
        })
        doc.images = images;
    }
}

productSchema.post("init", (doc) => {
    setImageUrl(doc);
});
productSchema.post("save", (doc) => {
    setImageUrl(doc);
});

export const productModel = mongoose.model("product", productSchema);