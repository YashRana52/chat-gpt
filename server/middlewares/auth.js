import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token = req.headers.authorization;
  if (!token) {
    return res.json({
      success: false,
      message: "no token recieved",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.json({
        success: false,
        message: "user is unauthorised",
      });
    }
    const userId = decoded.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.json({
        success: false,
        message: "user is unauthorised",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};
