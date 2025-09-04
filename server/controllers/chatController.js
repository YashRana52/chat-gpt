import Chat from "../models/Chat.js";

//create chat
export const createChat = async (req, res) => {
  try {
    const userId = req.user._id;

    const chatData = {
      userId,
      messages: [],
      name: "New Chat",
      userName: req.user.name,
    };

    await Chat.create(chatData);
    return res.json({
      success: true,
      message: "Chat Created",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

//get  chat

export const getChats = async (req, res) => {
  try {
    const userId = req.user._id;

    const chats = await Chat.find({ userId }).sort({ updatedAt: -1 });
    return res.json({
      success: true,
      message: chats,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

//delete selected chat
export const deleteChat = async (req, res) => {
  try {
    const userId = req.user._id;
    const { chatId } = req.body;

    await Chat.deleteOne({ _id: chatId, userId });

    return res.json({
      success: true,
      message: "Chat deleted",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};
