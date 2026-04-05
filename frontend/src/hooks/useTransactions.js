import { useContext } from "react";
import { AppContext } from "../context/AppContext.jsx";

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppContextProvider");
  return ctx;
};

