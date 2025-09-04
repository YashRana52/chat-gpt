import { dummyChats, dummyUserData } from "../assets/assets";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const fetchUser = async () => {
    setUser(dummyUserData);
  };

  const fetchUsersChats = async () => {
    setChats(dummyChats);
    setSelectedChat(dummyChats[0]);
  };

  // user change hote hi chats update honge
  useEffect(() => {
    if (user) {
      fetchUsersChats();
    } else {
      setChats([]);
      setSelectedChat(null);
    }
  }, [user]);

  // initial user load
  useEffect(() => {
    fetchUser();
  }, []);

  // theme change hone par apply
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const value = {
    navigate,
    chats,
    setChats,
    selectedChat,
    setSelectedChat,
    theme,
    setTheme,
    fetchUser,
    user,
    setUser,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
