import type { ReactNode } from "react";
import type { Theme } from "@mui/material/styles";
import type {
  Authentication,
  Session,
  NavigationItem,
} from "@customTypes/AppProvider";
import { AppContext } from "@hooks/appProviderContext";
import { createTheme } from "@mui/material/styles";

type AppProviderProps = {
  children: ReactNode;
  authentication?: Authentication;
  session?: Session;
  navigation?: NavigationItem[];
  theme?: Theme;
};

export const AppProvider = ({
  children,
  authentication = null,
  session = null,
  navigation = [],
  theme = createTheme(),
}: AppProviderProps) => {
  const contextValue = { authentication, session, navigation, theme };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};
