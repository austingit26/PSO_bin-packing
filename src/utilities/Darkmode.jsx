import React, { useEffect, useState } from "react";
import { FaMoon } from "react-icons/fa";
import { BsSunFill } from "react-icons/bs";

export default function Darkmode() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const switchTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <button
      onClick={switchTheme}
      className="border-slate-700 dark:border-slate-100 dark:text-yellow-500"
    >
      {theme === "dark" ? <BsSunFill /> : <FaMoon />}
    </button>
  );
}
