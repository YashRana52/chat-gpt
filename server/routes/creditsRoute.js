import express from "express";

import { protect } from "../middlewares/auth.js";
import { getPlans, purchasePlans } from "../controllers/creditController.js";

const creditsRouter = express.Router();

creditsRouter.get("/plan", getPlans);
creditsRouter.post("/purchase", protect, purchasePlans);

export default creditsRouter;
