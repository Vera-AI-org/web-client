// components/PrivateRoute.tsx
import { Navigate } from "react-router";
import type { ReactElement } from "react";
import { useAppContext } from "@contexts/AppContext";
import type { User } from "@customTypes/session";

export interface PrivateRouteProps {
  /** Lista de roles permitidas */
  allowedTo: string[];
  /** Redirecionamentos em caso de falha de autenticação/autorização */
  redirectTo?: {
    unauthenticated?: string;
    unauthorized?: string;
  };
  /** Elemento a ser renderizado se autorizado */
  element: ReactElement;
}

/**
 * Rota protegida com verificação de roles do usuário.
 * - Redireciona para `/sign-in` se não autenticado.
 * - Redireciona para `/unauthorized` se sem permissão.
 */
export const PrivateRoute = ({
  allowedTo,
  redirectTo = {
    unauthenticated: "/sign-in",
    unauthorized: "/unauthorized",
  },
  element,
}: PrivateRouteProps) => {
  const { session } = useAppContext();
  const user: User | null = session?.user ?? null;

  if (!user) {
    return <Navigate to={redirectTo.unauthenticated!} replace />;
  }

  if (!allowedTo.includes(user.role)) {
    return <Navigate to={redirectTo.unauthorized!} replace />;
  }

  return element;
};
