import type { Theme } from "@mui/material/styles";
export type { Theme };

export type Session = {
  user?: {
    email?: string;
    id?: string;
    image?: string;
    name?: string;
  };
} | null;

export type Authentication = {
  signIn: (...args: unknown[]) => unknown;
  signOut: (...args: unknown[]) => unknown;
} | null;

type BaseNavigationItem = {
  icon?: React.ReactNode;
  title?: string;
  action?: React.ReactNode;
  children?: NavigationItem[];
};

export type NavigationItem =
  | (BaseNavigationItem & {
      kind?: "page";
      segment?: string;
      pattern?: string;
    })
  | { kind: "header"; title: string }
  | { kind: "divider" };
