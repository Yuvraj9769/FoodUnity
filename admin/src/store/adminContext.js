import { createContext } from "react";

const adminContext = createContext({
  darkMode: true,
  isSidebarVisible: false,
  toggleDarkMode: () => {},
  setSidebarVisible: () => {},
});

export default adminContext;
