import { createContext } from "react";

const adminContext = createContext({
  darkMode: true,
  toggleDarkMode: () => {},
});

export default adminContext;
