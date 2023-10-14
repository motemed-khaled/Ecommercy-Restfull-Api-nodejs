
import { copounModel } from "../models/copoun_model.js";
import {
    deleteOne,
    updateOne,
    createOne,
    getOne,
    getAll
} from "./handlersFactory.js";


export const createcopoun = createOne(copounModel);

export const getAllcopouns = getAll(copounModel , "copoun");

export const getSpecificcopoun = getOne(copounModel);

export const updatecopoun = updateOne(copounModel);

export const deletecopoun = deleteOne(copounModel);
