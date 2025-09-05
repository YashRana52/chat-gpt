import { useAppContext } from "../context/AppContext";
import React, { useState } from "react";
import { assets } from "../assets/assets";
import moment from "moment";
import toast from "react-hot-toast";

function Sidebar({ isMenuOpen, setIsMenuOpen }) {
  const {
    chats,
    setSelectedChat,
    theme,
    setTheme,
    user,
    navigate,
    createNewChat,
    axios,
    setChats,
    fetchUsersChats,
    setToken,
    token,
  } = useAppContext();

  const [search, setSearch] = useState("");

  const Logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    toast.success("Logged out successfully");
  };

  const detelteChat = async (e, chatId) => {
    try {
      e.stopPropagation();
      const confirm = window.confirm(
        "Are u sure you want to delete this chat?"
      );
      if (!confirm) return;
      const { data } = await axios.post(
        "/api/chat/delete",
        { chatId },
        {
          headers: { Authorization: token },
        }
      );
      if (data.success) {
        setChats((prev) => prev.filter((chat) => chat._id !== chatId));
        await fetchUsersChats();
        toast.success(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div
      className={`flex flex-col h-screen min-w-72 p-5 
        bg-white/20 dark:bg-black/30 
        border-r border-gray-300 dark:border-white/10 
        backdrop-blur-xl shadow-lg transition-all duration-500 
        max-md:absolute left-0 z-10 
        ${!isMenuOpen && "max-md:-translate-x-full"}`}
    >
      {/* Logo */}
      <img
        src={theme === "dark" ? assets.logo_full : assets.logo_full_dark}
        alt="logo"
        className="w-40 mx-auto mb-6"
      />

      {/* New Chat button */}
      <button
        onClick={createNewChat}
        className="flex justify-center items-center w-full py-2 
        bg-gradient-to-r from-purple-500 to-blue-500 
        text-white text-sm rounded-xl shadow-md 
        hover:scale-105 transition-all duration-300"
      >
        <span className="mr-2 text-xl">+</span> New Chat
      </button>

      {/* Search */}
      <div
        className="flex items-center gap-2 p-3 mt-6 
        bg-white/30 dark:bg-white/5 
        border border-gray-300 dark:border-white/10 
        rounded-xl shadow-sm"
      >
        <img src={assets.search_icon} alt="" className="w-4 opacity-70" />
        <input
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          className="text-xs bg-transparent placeholder:text-gray-400 outline-none w-full"
          type="text"
          placeholder="Search conversation"
        />
      </div>

      {/* Recent Chats */}
      {chats?.length > 0 && (
        <p className="mt-5 text-sm font-semibold text-gray-600 dark:text-gray-300">
          Recent Chats
        </p>
      )}

      <div className="flex-1 overflow-y-scroll mt-3 text-sm space-y-3 scrollbar-thin scrollbar-thumb-gray-400/50 scrollbar-track-transparent">
        {chats
          ?.filter((chat) =>
            chat?.messages[0]
              ? chat?.messages[0].content
                  .toLowerCase()
                  .includes(search.toLowerCase())
              : chat.name.toLowerCase().includes(search.toLowerCase())
          )
          .map((chat) => (
            <div
              key={chat._id}
              onClick={() => {
                navigate("/");
                setSelectedChat(chat);
                setIsMenuOpen(false);
              }}
              className="p-3 px-4 rounded-xl cursor-pointer flex justify-between 
              bg-white/20 dark:bg-white/5 
              border border-gray-200 dark:border-gray-700 
              hover:bg-purple-500/10 hover:scale-[1.02] 
              transition-all duration-300 group"
            >
              <div>
                <p className="truncate font-medium">
                  {chat.messages?.length > 0
                    ? chat.messages[0].content.slice(0, 32)
                    : chat.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {moment(chat.updatedAt).fromNow()}
                </p>
              </div>
              <img
                onClick={(e) =>
                  toast.promise(detelteChat(e, chat._id), {
                    loading: "deleting...",
                  })
                }
                src={assets.bin_icon}
                alt="delete"
                className="hidden group-hover:block w-4 cursor-pointer opacity-60 hover:opacity-100"
              />
            </div>
          ))}
      </div>

      {/* Community */}
      <div
        onClick={() => {
          navigate("/community");
          setIsMenuOpen(false);
        }}
        className="flex items-center gap-3 p-3 mt-5 
        bg-white/20 dark:bg-white/5 
        border border-gray-200 dark:border-gray-700 
        rounded-xl cursor-pointer hover:bg-purple-500/10 hover:scale-[1.02] 
        transition-all duration-300"
      >
        <img className="w-5 opacity-80" src={assets.gallery_icon} alt="" />
        <p className="text-sm font-medium">Community Images</p>
      </div>

      {/* Credits */}
      <div
        onClick={() => {
          navigate("/credits");
          setIsMenuOpen(false);
        }}
        className="flex items-center gap-3 p-3 mt-3 
        bg-white/20 dark:bg-white/5 
        border border-gray-200 dark:border-gray-700 
        rounded-xl cursor-pointer hover:bg-purple-500/10 hover:scale-[1.02] 
        transition-all duration-300"
      >
        <img className="w-5 opacity-80" src={assets.diamond_icon} alt="" />
        <div className="flex flex-col text-sm">
          <p className="font-semibold">Credits: {user?.credits}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Purchase to use Chat-GPT
          </p>
        </div>
      </div>

      {/* Dark Mode */}
      <div
        className="flex items-center justify-between gap-2 p-3 mt-5 
        bg-white/20 dark:bg-white/5 
        border border-gray-200 dark:border-gray-700 
        rounded-xl shadow-sm"
      >
        <div className="flex items-center gap-2 text-sm">
          <img src={assets.theme_icon} alt="" className="w-4 opacity-70" />
          <p>Dark Mode</p>
        </div>
        <label className="relative inline-flex cursor-pointer">
          <input
            onChange={() => setTheme(theme === "dark" ? "light" : "dark")}
            type="checkbox"
            className="sr-only peer"
            checked={theme === "dark"}
          />
          <div className="w-9 h-5 bg-gray-400/50 rounded-full peer-checked:bg-purple-600 transition-all"></div>
          <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform peer-checked:translate-x-4"></span>
        </label>
      </div>

      {/* User */}
      <div
        className="flex items-center gap-3 p-3 mt-5 
        bg-white/20 dark:bg-white/5 
        border border-gray-200 dark:border-gray-700 
        rounded-xl cursor-pointer group hover:scale-[1.02] transition-all duration-300"
      >
        <img className="w-8 rounded-full" src={assets.user_icon} alt="" />
        <div className="flex flex-1 justify-between items-center text-sm">
          <p className="truncate font-medium">
            {user ? user.name : "Login your account"}
          </p>
          {user && (
            <img
              onClick={Logout}
              src={assets.logout_icon}
              alt="logout"
              className="h-5 cursor-pointer hidden group-hover:block opacity-70 hover:opacity-100"
            />
          )}
        </div>
      </div>

      {/* Close btn */}
      <img
        onClick={() => setIsMenuOpen(false)}
        src={assets.close_icon}
        alt="close"
        className="absolute top-4 right-4 w-6 h-6 cursor-pointer md:hidden opacity-70 hover:opacity-100"
      />
    </div>
  );
}

export default Sidebar;
