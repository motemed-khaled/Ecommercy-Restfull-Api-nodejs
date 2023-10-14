import multer from "multer";
import { ApiError } from "../utils/api_errors.js";


const multerOptions = () => {
    // 1 - disk storage engine
    // const multerStorage = multer.diskStorage({
    //     destination: function (req, file, cb) {
    //         cb(null, "uploads/catogries");
    //     },
    //     filename: function (req, file, cb) {
    //         const ext = file.mimetype.split("/")[1];
    //         const fileName = `catogry-${uid()}-${Date.now()}.${ext}`;
    //         cb(null, fileName);
    //     }
    // });
    
    const multerStorage = multer.memoryStorage();
    const multerFilter = function (req, file, cb) {
        if (file.mimetype.startsWith("image")) {
            cb(null, true);
        } else {
            cb(new ApiError("Only Images Allowed", 400), false);
        }
    };
    const uploads = multer({ storage: multerStorage, fileFilter: multerFilter });
    return uploads;
};
export const uploadSingleImage = (fieldName) =>
    multerOptions().single(fieldName);

export const uploadMultiImage = (arrayOfFields) =>
    multerOptions().fields(arrayOfFields);


