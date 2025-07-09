import { type ReactNode } from "react";
import { Box, Typography, useTheme, Stack } from "@mui/material";

interface PageProps {
  title?: string;
  breadcrumbs?: ReactNode;
  children: ReactNode;
  sx?: object;
}

/**
 * Container para páginas com título no topo e conteúdo scrollável.
 */
export function Page({ title, breadcrumbs, children, sx }: PageProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        padding: 2,
        ...sx,
      }}
    >
      {(title || breadcrumbs) && (
        <Stack spacing={title && breadcrumbs ? 1 : 0}>
          {breadcrumbs && <Box>{breadcrumbs}</Box>}
          {title && (
            <Typography variant="h6" component="h1">
              {title}
            </Typography>
          )}
        </Stack>
      )}
      <Stack
        component="section"
        sx={{
          bgcolor: theme.palette.background.default,
        }}
      >
        {children}
      </Stack>
    </Box>
  );
}
