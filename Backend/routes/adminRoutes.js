import express from "express";
import { createManagedUser, getManagedUsers } from "../controllers/adminController.js";
import { requireAuth, requireRole } from "../middlewares/authMiddleware.js";

const adminRouter = express.Router();

adminRouter.use(requireAuth);
adminRouter.use(requireRole("admin"));

adminRouter.post("/users", createManagedUser);
adminRouter.get("/users", getManagedUsers);

export default adminRouter;
