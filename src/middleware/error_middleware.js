import { ApiError } from './../utils/api_errors.js';

const jwtInvalidSigniture = () => new ApiError("Invalid Token Blease Login Again !", 401);
const TokenExpiredError = () => new ApiError("Expired Token Blease Login Again !", 401);


export const globalError = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error"
    if (process.env.NODE_ENV === "development") {
        sendErrorForDevelopment(res, err);
    } else {
        if (err.name === "JsonWebTokenError") err =jwtInvalidSigniture();
        if (err.name === "TokenExpiredError") err =TokenExpiredError();
        sendErrorForProduction(res, err);
    }
}

const sendErrorForDevelopment = (res , err) => {
    return res.status(err.statusCode).json({
        status: err.status,
        error : err,
        message: err.message,
        stack: err.stack
    });
}

const sendErrorForProduction = (res , err) => {
    return res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    });
}