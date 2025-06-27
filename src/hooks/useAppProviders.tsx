import type { ReactNode } from "react";
import { AppContext } from "@hooks/appProviderContext";
import type {
  Authentication,
  Session,
  NavigationItem,
  Theme,
} from "@customTypes/AppProvider";

type AppProviderProps = {
  children: ReactNode;
  authentication: Authentication;
  session: Session;
  navigation: NavigationItem[];
  theme: Theme;
};

export function AppProvider({
  children,
  authentication,
  session,
  navigation,
  theme,
}: AppProviderProps) {
  const contextValue = { authentication, session, navigation, theme };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}
