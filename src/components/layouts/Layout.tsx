import { type ReactNode } from "react";
import { Box } from "@mui/material";

export interface LayoutProps {
  sidebar?: ReactNode;
  topbar?: ReactNode;
  children: ReactNode;
  sx?: object;
}

/**
 * Layout base com topbar fixa no topo, sidebar à esquerda e conteúdo principal.
 */
export function Layout({ sidebar, topbar, children, sx }: LayoutProps) {
  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        ...sx,
      }}
    >
      {sidebar && (
        <Box
          component="nav"
          sx={{
            flexShrink: 0,
            bgcolor: "background.paper",
            borderRight: 1,
            borderColor: "divider",
          }}
        >
          {sidebar}
        </Box>
      )}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {topbar && (
          <Box
            component="header"
            sx={{ flexShrink: 0, borderBottom: 1, borderColor: "divider" }}
          >
            {topbar}
          </Box>
        )}
        <Box
          component="main"
          sx={{
            flex: 1,
            overflow: "auto",
            bgcolor: "background.default",
            p: 2,
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
