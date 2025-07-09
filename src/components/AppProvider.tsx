import { type Theme, ThemeProvider } from "@mui/material/styles";
import { AppContext } from "@contexts/AppContext";
import type {
  AuthFunctions,
  Session,
  NavigationItem,
} from "@customTypes/session";
import { createTheme } from "@mui/material/styles";
import { useMemo, useState, type ReactNode } from "react";
import CssBaseline from "@mui/material/CssBaseline";

export interface AppProviderProps {
  /** Autenticação (signIn/signOut). Padrão: null */
  authentication?: AuthFunctions | null;
  /** Sessão do usuário atual. Padrão: null */
  session?: Session | null;
  /** Tema MUI. Padrão: createTheme() */
  theme?: Theme;
  /** Navegação da aplicação. Padrão: [] */
  navigation?: NavigationItem[];
  /** Elementos filhos obrigatórios */
  children: ReactNode;
}

/**
 * AppProvider encapsula os providers globais e contexto da aplicação.
 */
export const AppProvider = ({
  authentication = null,
  session: initialSession = null,
  theme = createTheme(),
  navigation = [],
  children,
}: AppProviderProps) => {
  const [session, setSession] = useState<Session | null>(initialSession);

  // Memoriza o contexto para evitar re-renders desnecessários
  const contextValue = useMemo(
    () => ({ authentication, session, setSession, theme, navigation }),
    [authentication, session, setSession, theme, navigation]
  );

  return (
    <AppContext.Provider value={contextValue}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppContext.Provider>
  );
};
