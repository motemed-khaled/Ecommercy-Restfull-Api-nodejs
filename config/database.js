import mongoose from "mongoose";

export const dbConnection = () => {
    mongoose.connect(process.env.DB_URI).then(conn => {
        console.log(`database connected : ${conn.connection.host}`)
    });
}