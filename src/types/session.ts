import type { ReactNode } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
  [key: string]: unknown;
}

export interface AuthFunctions {
  signIn: () => Promise<{
    success: boolean;
    user: User | null;
    error: string | null;
  }>;
  signOut: () => void;
}

export interface Session {
  user: User | null;
}

export type NavigationItem =
  | {
      kind: "page";
      title: string;
      icon?: ReactNode;
      pattern?: string;
      segment?: string;
      action?: ReactNode;
      children?: NavigationItem[];
    }
  | {
      kind: "header";
      title: string;
    }
  | {
      kind: "divider";
    };
