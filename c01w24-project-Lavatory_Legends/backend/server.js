import express from "express";
import { connectToMongo } from "./db.js";
import userRoutes from "./userRoutes.js";
import cors from "cors";
import adminRoutes from "./adminRoutes.js";
import postRoutes from "./postRoutes.js";
import washroomAdminRoutes from "./washroomAdminRoutes.js";
import businessRoutes from "./businessRoutes.js";
import donationRoutes from "./donationRoutes.js"; 
import notificationRoutes from "./notificationRoutes.js";
import sponsorRoutes from "./sponsorRoutes.js";

const app = express();

const PORT = 4000;
connectToMongo();
// Open Port
app.use(cors());
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
app.use("/user", userRoutes); // routes in userRoutes.js will be prefixed with /user
app.use("/admin", adminRoutes); // routes in adminRoutes.js will be prefixed with /admin
app.use("/post", postRoutes); // routes in postRoutes.js will be preficed with /post
app.use("/admin/washrooms", washroomAdminRoutes);
app.use("/business", businessRoutes);
app.use("/donate", donationRoutes); // Use the donation routes with /donate prefix
app.use("/notification", notificationRoutes);
app.use("/sponsor", sponsorRoutes);