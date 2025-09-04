import bcrypt from "bcryptjs";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import Chat from "../models/Chat.js";

//generate token

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "10d",
  });
};

//Api to register user
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.json({
        success: false,
        message: "all details are required",
      });
    }

    const existings = await User.findOne({ email });
    if (existings) {
      return res.json({
        success: false,
        message: "user already exist with this email",
      });
    }
    const user = await User.create({ name, email, password });

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

//login user

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.json({
        success: false,
        message: "all details are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        message: "user not find with this email",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({
        success: false,
        message: "password is Incorrect",
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    return res.json({
      success: true,
      user,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

//api to get published image

export const getPublishedImage = async (req, res) => {
  try {
    const publishedImageMessage = await Chat.aggregate([
      { $unwind: "$messages" },
      {
        $match: {
          "messages.isImage": true,
          "messages.isPublished": true,
        },
      },
      {
        $project: {
          _id: 0,
          imageUrl: "$messages.content",
          userName: "$userName",
        },
      },
    ]);

    return res.json({
      success: true,
      images: publishedImageMessage.reverse(),
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};
