import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Loading() {
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate("/");
    }, 8000);
    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-[#4e1d75] via-[#2a1850] to-[#0f0c29] flex flex-col items-center justify-center text-white">
      {/* Spinner */}
      <div className="relative w-16 h-16 mb-6">
        <div className="absolute inset-0 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
        <div className="absolute inset-2 border-4 border-purple-600 border-t-transparent rounded-full animate-spin-slow"></div>
      </div>

      {/* Loading Text with pulse animation */}
      <p className="text-2xl md:text-3xl font-semibold tracking-wide animate-pulse">
        Loading, please wait...
      </p>

      {/* Progress bar */}
      <div className="w-48 h-2 mt-6 bg-white/20 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 animate-progress"></div>
      </div>
    </div>
  );
}

export default Loading;
