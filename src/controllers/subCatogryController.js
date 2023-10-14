import { subCatogryModel } from "../models/subCatogry-model.js";
import { deleteOne , updateOne , createOne , getOne, getAll } from "./handlersFactory.js";



export const createSubCatogriesMiddleWare = (req, res, next) => {
    if (req.params.catogryId) {
        req.body.catogry = req.params.catogryId
    }
    next();
};

export const getSubCatogriesMiddleWare = (req, res, next) => {
    let filterObj = {};
    if (req.params.catogryId) {
        filterObj = { catogry: req.params.catogryId };
    }
    req.filterObj = filterObj;
    next();
};

export const getSubCatogries = getAll(subCatogryModel , "subCatogry");

export const createSubCatogry = createOne(subCatogryModel);

export const getSpecificSubCatogry = getOne(subCatogryModel);

export const updateSubcatogry = updateOne(subCatogryModel);

export const deleteSubcatogry = deleteOne(subCatogryModel);

