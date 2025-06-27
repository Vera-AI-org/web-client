import { createContext, useContext } from "react";
import type {
  Authentication,
  Session,
  Theme,
  NavigationItem,
} from "@customTypes/AppProvider";

type AppContextType = {
  authentication?: Authentication;
  session?: Session;
  navigation?: NavigationItem[];
  theme?: Theme;
};

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context)
    throw new Error("useAppContext must be used within an AppProvider");
  return context;
};
