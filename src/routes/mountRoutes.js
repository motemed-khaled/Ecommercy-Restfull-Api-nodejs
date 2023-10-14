
import { router as catogryRoutes } from "./catogryRoutes.js";
import { router as subCatogryRoutes } from "./subCatogryRoutes.js";
import { router as brandRoutes } from "./brandRoutes.js";
import { router as productRoutes } from "./productRoutes.js";
import { router as userRoutes } from "./userRoutes.js";
import { router as authRoutes } from "./authRoutes.js";
import { router as reviewsRouters } from "./reviewRoutes.js";
import { router as wishListRouters } from "./wishListRoutes.js";
import { router as AddressesRouters } from "./userAddressesRoutes .js";
import { router as copounRouters } from "./copounRoutes.js";
import { router as cartRouters } from "./cartRoutes.js";
import { router as orderRouters } from "./orderRoutes.js";



export const mountRoutes = (app) => {
    app.use("/api/v1/catogry", catogryRoutes);
    app.use("/api/v1/subCatogry", subCatogryRoutes);
    app.use("/api/v1/brand", brandRoutes);
    app.use("/api/v1/product", productRoutes);
    app.use("/api/v1/users", userRoutes);
    app.use("/api/v1/auth", authRoutes);
    app.use("/api/v1/reviews", reviewsRouters);
    app.use("/api/v1/wishlist", wishListRouters);
    app.use("/api/v1/useraddress", AddressesRouters);
    app.use("/api/v1/copoun", copounRouters);
    app.use("/api/v1/cart", cartRouters);
    app.use("/api/v1/orders", orderRouters);
};