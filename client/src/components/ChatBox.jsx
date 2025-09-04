import React, { useEffect, useRef, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import Message from "./Message";

function ChatBox() {
  const containerRef = useRef(null);
  const { selectedChat, theme } = useAppContext();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState("text");
  const [published, setPublished] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    if (selectedChat) {
      setMessages(selectedChat.messages);
    }
  }, [selectedChat]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col justify-between m-4 md:m-8 xl:mx-32 max-md:mt-14 2xl:pr-40">
      {/* Chat messages */}
      <div
        ref={containerRef}
        className="flex-1 mb-5 overflow-y-auto rounded-2xl border border-gray-300 dark:border-gray-700 p-4 bg-white dark:bg-gray-900 shadow-sm"
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center gap-3 text-primary">
            <img
              src={theme === "dark" ? assets.logo_full : assets.logo_full_dark}
              alt=""
              className="w-full max-w-56 sm:max-w-72"
            />
            <p className="mt-4 text-2xl sm:text-4xl text-center text-gray-400 dark:text-white">
              Ask me anything.
            </p>
          </div>
        )}
        {messages.map((message, index) => (
          <Message key={index} message={message} />
        ))}
      </div>

      {/* Three Dots Loading */}
      {loading && (
        <div className="flex justify-center mb-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-gray-500 dark:bg-white animate-bounce"></div>
            <div className="w-2 h-2 rounded-full bg-gray-500 dark:bg-white animate-bounce delay-150"></div>
            <div className="w-2 h-2 rounded-full bg-gray-500 dark:bg-white animate-bounce delay-300"></div>
          </div>
        </div>
      )}

      {mode === "image" && (
        <label className="inline-flex items-center gap-2 mb-3 text-sm mx-auto text-gray-600 dark:text-gray-300">
          <input
            onChange={(e) => setPublished(e.target.checked)}
            type="checkbox"
            className="cursor-pointer accent-purple-600"
            checked={published}
          />
          <p>Publish generated image to Community</p>
        </label>
      )}

      {/* Prompt input box */}
      <form
        onSubmit={onSubmit}
        className="flex items-center gap-2 p-2 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md"
      >
        <select
          onChange={(e) => setMode(e.target.value)}
          value={mode}
          className="text-sm px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white outline-none"
        >
          <option value="text">Text</option>
          <option value="image">Image</option>
        </select>

        <input
          onChange={(e) => setPrompt(e.target.value)}
          value={prompt}
          type="text"
          placeholder="Type your prompt here..."
          className="flex-1 bg-transparent text-sm outline-none px-2 dark:text-white"
          required
        />

        <button
          disabled={loading}
          className="p-2 rounded-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 transition-colors"
        >
          <img
            src={loading ? assets.stop_icon : assets.send_icon}
            alt=""
            className="w-5 invert dark:invert-0"
          />
        </button>
      </form>
    </div>
  );
}

export default ChatBox;
