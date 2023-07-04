import React, { useEffect, useState } from "react";
import { BsSunFill } from "react-icons/bs";
import { FaMoon } from "react-icons/fa";

export default function Darkmode() {
  // Retrieve the theme from local storage, or default to "dark"
  const savedTheme = localStorage.getItem("theme");
  const [theme, setTheme] = useState(savedTheme || "dark");

  useEffect(() => {
    // Update the class on the root element
    document.documentElement.classList.toggle("dark", theme === "dark");

    // Save the current theme to local storage
    localStorage.setItem("theme", theme);
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
