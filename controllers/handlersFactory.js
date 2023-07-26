import asyncHandler from "express-async-handler";
import { ApiError } from "../utils/api_errors.js";
import { Apifeature } from "../utils/apiFeature.js";



export const deleteOne = model => {
    return asyncHandler(async (req, res, next) => {
        const { id } = req.params;
        const document = await model.findOneAndDelete({_id:id});
    
        if (!document) {
            return next(new ApiError("no Document in this id...", 404));
        }

        res.status(204).send();
    })
}

export const updateOne = model => {
    return asyncHandler(async (req, res, next) => {

        const document = await model.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!document) {
            return next(new ApiError(`No Document In This Id : ${req.params.id}`, 404));
        }
        document.save();
        res.status(200).json({ data: document });
    })
}

export const createOne = model => {
    return asyncHandler(async (req, res) => {
        const document = await model.create(req.body);
        res.status(201).json({ data: document });
    });
}

export const getOne = (model , populationOpt) => {
    return asyncHandler(async (req, res, next) => {
        const { id } = req.params;

        // build query
        let query =  model.findById(id);
        if (populationOpt) {
            query.populate(populationOpt)
        }

        //excute query
        const document = await query;
        if (!document) {
            return next(new ApiError("No document In This Id..", 404));
        }
        res.status(200).json({ data: document });
    });
}

export const getAll = (model , modelName) => {
    return asyncHandler(async (req, res) => {
        let filterObj = {};
        if (req.filterObj) {
            filterObj = req.filterObj;
        }
        const documentCount = await model.countDocuments();
        const apiFeature = new Apifeature(model.find(filterObj), req.query)
        .paginate(documentCount).sort().limitFields().filter().search(modelName);
        
        // Execute Query
        const {mongooseQuery , paginationResult} = apiFeature
        const document = await mongooseQuery;
        res.status(200).json({ result: document.length, paginationResult, data: document });
    })
}