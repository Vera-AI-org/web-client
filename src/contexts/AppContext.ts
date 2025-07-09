// contexts/AppContext.tsx
import {
  createContext,
  useContext,
  type Dispatch,
  type SetStateAction,
} from "react";
import { type Theme, createTheme } from "@mui/material/styles";
import type {
  AuthFunctions,
  Session,
  NavigationItem,
} from "@customTypes/session";

export interface AppContextProps {
  authentication: AuthFunctions | null;
  session: Session | null;
  setSession: Dispatch<SetStateAction<Session | null>>;
  theme: Theme;
  navigation: NavigationItem[];
}

export const AppContext = createContext<AppContextProps>({
  authentication: null,
  session: null,
  setSession: () => {},
  theme: createTheme(),
  navigation: [],
});

export const useAppContext = () => useContext(AppContext);
