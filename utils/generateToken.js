import jwt from "jsonwebtoken";

export const generateToken = (byload) => {
    return jwt.sign({ userId: byload }, process.env.JWT_SECRETKEY, {
        expiresIn: process.env.JWT_EXPIRE
    });
}