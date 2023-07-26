import path from "path";

import exppress from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import compression from "compression";

dotenv.config();
import { ApiError } from "./utils//api_errors.js";
import { dbConnection } from "./config/database.js";
import { globalError } from "./middleware/error_middleware.js";
import { webhookCheckOut } from "./controllers/orderController.js";
// routes
import { mountRoutes } from "./routes/mountRoutes.js";

//connect with database
dbConnection();

// express app
const app = exppress();

// Cross-origin resource sharing to enable other domain to access to access this application
app.use(cors());
app.options("*", cors());

// compress all response
app.use(compression());

app.post("/webhook-checkout" , express.raw({type: 'application/json'}) , webhookCheckOut)

// middleware
if (process.env.NODE_ENV ==="development") {
    app.use(morgan("dev"));
    console.log(`mode : ${process.env.NODE_ENV}`)
}
app.use(exppress.urlencoded({ extended: true }));
app.use(exppress.json());
// to serve all image
app.use(exppress.static(path.join(path.dirname("uploads"), "uploads")));

//mount routes
mountRoutes(app)

app.all("*", (req, res, next) => {
    next(new ApiError(`cant find this route : ${req.originalUrl}`, 400));
});

// global error handle from express
app.use(globalError);


const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`server is running in http://localhost:${PORT}`);
});
 // handle error rejection outside express

process.on("unhandledRejection", (err) => {
    console.error(`unhandledRejection : ${err.name} | ${err.message}`);
    server.close(() => {
        console.log("server shutdown.....");
        process.exit(1);
    });
});
