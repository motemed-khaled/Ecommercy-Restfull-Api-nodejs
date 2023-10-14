import mongoose  from "mongoose";


const subCatogrySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "subCatogryName is required"],
            unique: [true, "subCatogryName must be unique"],
            minlength: [2, "subCatogryName is shorter"],
            maxlength: [32, "To long subCatogryName"],
            trim: true,
        },
        slug: {
            type: String,
            lowercase: true
        },
        catogry: {
            type: mongoose.Schema.ObjectId,
            ref: "catogry",
            required: [true, "subCatogry Must Be Belong To Parent Catogry"]
        }
    },
    { timestamps: true });

export const subCatogryModel = mongoose.model("subCatogry", subCatogrySchema);
