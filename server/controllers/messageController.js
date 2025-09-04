import imagekit from "../configs/imagekit.js";
import Chat from "../models/Chat.js";
import axios from "axios";
import openai from "../configs/openai.js";
import User from "../models/User.js";

//text based Ai chat Message Controller
export const textMessageController = async (req, res) => {
  try {
    const userId = req.user._id;

    if (req.user.credits < 1) {
      return res.json({
        success: false,
        message: "You don't have enough credit to use this feature ",
      });
    }

    const { chatId, prompt } = req.body;

    const chat = await Chat.findOne({ userId, _id: chatId });
    if (!chat) {
      return res.json({ success: false, message: "Chat not found" });
    }

    // user message push
    chat.messages.push({
      role: "user",
      content: prompt,
      timestamps: Date.now(),
      isImage: false,
    });

    // generate AI reply
    const { choices } = await openai.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [{ role: "user", content: prompt }],
    });

    const reply = {
      role: choices[0].message.role,
      content: choices[0].message.content,
      timestamps: Date.now(),
      isImage: false,
    };

    // save reply in db
    chat.messages.push(reply);
    await chat.save();

    // deduct credit
    await User.updateOne({ _id: userId }, { $inc: { credits: -1 } });

    return res.json({
      success: true,
      message: reply,
    });
  } catch (error) {
    console.error("Message controller error:", error);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

//image generation message controller

export const imageMessageController = async (req, res) => {
  try {
    const userId = req.user._id;
    //check credit

    if (req.user.credits < 2) {
      return res.json({
        success: false,
        message: "You don't have enough credit to use this feature ",
      });
    }

    const { prompt, chatId, isPublished } = req.body;

    //find chat

    const chat = await Chat.findOne({ userId, _id: chatId });

    //push user message

    chat.messages.push({
      role: "user",
      content: prompt,
      timestamps: Date.now(),
      isImage: false,
    });

    //Encode the prompt
    const encodedPromp = encodeURIComponent(prompt);

    // construct Imagekit Ai generation Url

    const generatedImageUrl = `${
      process.env.IMAGEKIT_URL_ENDPOINT
    }/ik-genimg-prompt-${encodedPromp}/chat-gpt/${Date.now()}.png?tr=w-800,h-800`;
    //Trigger generation by fetching from imagekit
    const aiImageResponse = await axios.get(generatedImageUrl, {
      responseType: "arraybuffer",
    });

    //convert to base64

    const base64Image = `data:image/png;base64,${Buffer.from(
      aiImageResponse.data,
      "binary"
    ).toString("base64")}`;

    // Upload to imagekit media library

    const uploadResponse = await imagekit.upload({
      file: base64Image,
      fileName: `${Date.now()}.png`,
      folder: "chat-gpt",
    });

    const reply = {
      role: "assistent",
      content: uploadResponse.url,
      timestamps: Date.now(),
      isImage: true,
      isPublished,
    };

    chat.messages.push(reply);

    await chat.save();
    await User.updateOne({ _id: userId }, { $inc: { credits: -2 } });
    res.json({
      success: true,
      message: reply,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};
