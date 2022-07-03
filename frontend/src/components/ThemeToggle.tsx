import React from "react";
import { Moon, Sun } from "./icons";
import { Button, useTheme } from "@nextui-org/react";
import { useTheme as useNextTheme } from "next-themes";

export const ThemeToggle = () => {
  const { setTheme } = useNextTheme();
  const { isDark } = useTheme();

  const handleToggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <Button
      aria-label="toggle a light and dark color scheme"
      onClick={handleToggleTheme}
      css={{
        dflex: "center",
        size: "auto",
        cursor: "pointer",
        background: "transparent",
        border: "none",
        padding: 0,
        "& .theme-selector-icon": {
          color: "$colors$accents6",
        },
        "@xsMax": {
          px: "$2",
        },
        m: 0,
      }}
    >
      {isDark ? (
        <Sun filled className="theme-selector-icon" size={20} />
      ) : (
        <Moon filled className="theme-selector-icon" size={20} />
      )}
    </Button>
  );
};
