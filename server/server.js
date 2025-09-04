import express from "express";

import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import chatRouter from "./routes/chatRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import creditsRouter from "./routes/creditsRoute.js";
import { stripeWebhooks } from "./controllers/webhooks.js";

const app = express();

await connectDB();

//stripe webhooks

app.post(
  "/api/stripe",
  express.raw({ type: "application/json" }),
  stripeWebhooks
);

//middlewares

app.use(cors());
app.use(express.json());

// Routes

app.get("/", (req, res) => res.send("Server is live!"));
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is listen on port ${port}`);
});

//api routes

app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);
app.use("/api/credit", creditsRouter);
