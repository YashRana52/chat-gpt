import express from "express";

import { protect } from "../middlewares/auth.js";
import { getPlans } from "../controllers/creditController.js";

const creditsRouter = express.Router();

creditsRouter.get("/plan", getPlans);
creditsRouter.post("/plan", protect, getPlans);

export default creditsRouter;
