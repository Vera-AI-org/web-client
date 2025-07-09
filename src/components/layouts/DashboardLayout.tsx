import { type ReactNode, useState, useCallback, useEffect } from "react";
import {
  Box,
  Drawer,
  Typography,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  useMediaQuery,
  useTheme,
  ListItemIcon,
  type Theme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { useAppContext } from "@contexts/AppContext";
import type { NavigationItem } from "@customTypes/session";
import { useLocation } from "react-router";

interface Branding {
  title?: string;
  logo?: ReactNode;
  homeUrl?: string;
}

interface DashboardLayoutProps {
  children: ReactNode;
  branding?: Branding;
  navigation?: NavigationItem[];
  defaultSidebarCollapsed?: boolean;
  disableCollapsibleSidebar?: boolean;
  hideNavigation?: boolean;
  sidebarExpandedWidth?: number | string;
  sidebarFooterContent?: ReactNode;
  sx?: object;
}

const MINI_DRAWER_WIDTH = 88;

const getDrawerSxTransitionMixin = (
  expanded: boolean,
  property: "padding" | "width"
) => ({
  transition: (theme: Theme) =>
    theme.transitions.create(property, {
      easing: theme.transitions.easing.sharp,
      duration: expanded
        ? theme.transitions.duration.enteringScreen
        : theme.transitions.duration.leavingScreen,
    }),
});

export const DashboardLayout = (props: DashboardLayoutProps) => {
  const {
    children,
    branding,
    navigation: navigationProp,
    defaultSidebarCollapsed = true,
    disableCollapsibleSidebar = false,
    hideNavigation = false,
    sidebarExpandedWidth = 320,
    sidebarFooterContent,
    sx,
  } = props;

  const theme = useTheme();
  const { navigation: contextNavigation } = useAppContext();
  const navigation = navigationProp ?? contextNavigation ?? [];

  const location = useLocation();

  const [activePath, setActivePath] = useState<string>(
    typeof window !== "undefined" ? window.location.pathname : ""
  );

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location.pathname]);

  const [isDesktopNavigationExpanded, setIsDesktopNavigationExpanded] =
    useState(!defaultSidebarCollapsed);
  const [isMobileNavigationExpanded, setIsMobileNavigationExpanded] =
    useState(false);

  const isOverSmViewport = useMediaQuery(theme.breakpoints.up("sm"));
  const isOverMdViewport = useMediaQuery(theme.breakpoints.up("md"));

  const isNavigationExpanded = isOverMdViewport
    ? isDesktopNavigationExpanded
    : isMobileNavigationExpanded;

  const setIsNavigationExpanded = useCallback(
    (newExpanded: boolean) => {
      if (isOverMdViewport) setIsDesktopNavigationExpanded(newExpanded);
      else setIsMobileNavigationExpanded(newExpanded);
    },
    [isOverMdViewport]
  );

  const handleSetNavigationExpanded = useCallback(
    (newExpanded: boolean) => () => {
      setIsNavigationExpanded(newExpanded);
    },
    [setIsNavigationExpanded]
  );

  const handleToggleHeaderMenu = useCallback(() => {
    setIsNavigationExpanded(!isNavigationExpanded);
  }, [isNavigationExpanded, setIsNavigationExpanded]);

  const handleNavigationLinkClick = useCallback((href?: string) => {
    if (href) setActivePath(href);
    setIsMobileNavigationExpanded(false);
  }, []);

  const isDesktopMini =
    !disableCollapsibleSidebar && !isDesktopNavigationExpanded;
  const isMobileMini =
    !disableCollapsibleSidebar && !isMobileNavigationExpanded;

  const hasDrawerTransitions =
    isOverSmViewport && (!disableCollapsibleSidebar || isOverMdViewport);

  const getDrawerSharedSx = (isMini: boolean, isTemporary: boolean) => {
    const drawerWidth = isMini ? MINI_DRAWER_WIDTH : sidebarExpandedWidth;
    return {
      displayPrint: "none",
      width: drawerWidth,
      flexShrink: 0,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: isNavigationExpanded
          ? theme.transitions.duration.enteringScreen
          : theme.transitions.duration.leavingScreen,
      }),
      ...(isTemporary ? { position: "absolute" } : {}),
      "& .MuiDrawer-paper": {
        position: "absolute",
        width: drawerWidth,
        boxSizing: "border-box",
        backgroundColor: theme.palette.background.paper,
        backgroundImage: "none",
        transition: theme.transitions.create("width", {
          easing: theme.transitions.easing.sharp,
          duration: isNavigationExpanded
            ? theme.transitions.duration.enteringScreen
            : theme.transitions.duration.leavingScreen,
        }),
      },
    };
  };

  const renderSidebarContent = (isMini: boolean, viewport: string) => (
    <>
      <Box
        component="nav"
        aria-label={`Navigation (${viewport})`}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          overflow: "auto",
          pt: isMini ? 4 : 2,
          scrollbarGutter: isMini ? "stable" : "auto",
          overflowX: "hidden",
          ...(hasDrawerTransitions
            ? getDrawerSxTransitionMixin(isNavigationExpanded, "padding")
            : {}),
        }}
      >
        <List dense disablePadding>
          {navigation.map((item, index) => {
            if (item.kind === "page" && item.title) {
              const isActive = activePath === (item.pattern ?? "");
              return (
                <ListItemButton
                  key={index}
                  sx={{
                    justifyContent: isMini ? "center" : "flex-start",
                    px: isMini ? 1.5 : 2,
                    py: isMini ? 1.5 : 1,
                    mb: 0.5,
                    marginX: 1,
                    borderRadius: 2,
                    flexDirection: isMini ? "column" : "row",
                    transition: theme.transitions.create(
                      [
                        "padding",
                        "margin",
                        "flex-direction",
                        "opacity",
                        "background-color",
                      ],
                      {
                        duration: theme.transitions.duration.standard,
                        easing: theme.transitions.easing.easeInOut,
                      }
                    ),
                    backgroundColor: isActive
                      ? theme.palette.action.selected
                      : "transparent",
                    color: isActive ? theme.palette.primary.main : "inherit",
                    "&:hover": {
                      backgroundColor: isActive
                        ? theme.palette.action.selected
                        : theme.palette.action.hover,
                    },
                  }}
                  onClick={() => handleNavigationLinkClick(item.pattern)}
                  component="a"
                  href={item.pattern ?? "#"}
                  selected={isActive}
                >
                  {item.icon && (
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: isMini ? 0 : 2,
                        justifyContent: "center",
                        color: isActive
                          ? theme.palette.primary.main
                          : "inherit",
                        transition: theme.transitions.create("margin", {
                          duration: theme.transitions.duration.standard,
                          easing: theme.transitions.easing.easeInOut,
                        }),
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                  )}
                  <ListItemText
                    primary={item.title}
                    primaryTypographyProps={{
                      noWrap: !isMini,
                      fontSize: isMini ? "0.75rem" : "inherit",
                      textAlign: isMini ? "center" : "left",
                      sx: {
                        transition: theme.transitions.create("margin", {
                          duration: theme.transitions.duration.standard,
                          easing: theme.transitions.easing.easeInOut,
                        }),
                      },
                      color: isActive ? theme.palette.primary.main : "inherit",
                    }}
                    sx={{ opacity: 1, mt: isMini ? 0.5 : 0 }}
                  />
                </ListItemButton>
              );
            }

            if (item.kind === "header" && item.title && isNavigationExpanded) {
              return (
                <ListItemText
                  key={index}
                  primary={item.title}
                  primaryTypographyProps={{
                    fontWeight: "bold",
                    fontSize: isMini ? "0.75rem" : "1rem",
                    sx: { px: isMini ? 0 : 2, py: 1, userSelect: "none" },
                  }}
                  sx={{ opacity: isMini ? 0 : 1, px: isMini ? 0 : 2, py: 1 }}
                />
              );
            }

            return null;
          })}
        </List>
        {sidebarFooterContent && (
          <Box
            sx={{
              p: 1,
              borderTop: 1,
              borderColor: "divider",
              textAlign: "center",
              fontSize: isMini ? "0.75rem" : "inherit",
              userSelect: "none",
            }}
          >
            {sidebarFooterContent}
          </Box>
        )}
      </Box>
    </>
  );

  const Header = () => (
    <Box
      component="header"
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 72,
        bgcolor: "background.paper",
        borderBottom: 1,
        borderColor: "divider",
        display: "flex",
        alignItems: "center",
        px: 2,
        zIndex: theme.zIndex.drawer + 1,
      }}
    >
      {!hideNavigation && (
        <IconButton
          edge="start"
          color="inherit"
          aria-label="toggle navigation"
          onClick={handleToggleHeaderMenu}
          sx={{
            ml: 1, // ADICIONADO: margem esquerda para espaçamento
            mr: 2,
            display: { md: "block", xs: "block" },
            backgroundColor: "transparent",
            borderRadius: 1,
            border: `1px solid ${theme.palette.divider}`,
            "&:hover": {
              backgroundColor: theme.palette.action.hover,
            },
          }}
        >
          {isNavigationExpanded ? <ChevronLeftIcon /> : <MenuIcon />}
        </IconButton>
      )}
      {branding?.logo && <Box sx={{ mr: 1 }}>{branding.logo}</Box>}
      <Typography variant="h6" noWrap component="div">
        {branding?.title || "Dashboard"}
      </Typography>
    </Box>
  );

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        overflow: "hidden",
        height: "100vh",
        width: "100vw",
        ...sx,
      }}
    >
      <Header />
      {!hideNavigation && (
        <>
          <Drawer
            variant="temporary"
            open={isMobileNavigationExpanded}
            onClose={handleSetNavigationExpanded(false)}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: {
                xs: "block",
                sm: disableCollapsibleSidebar ? "block" : "none",
                md: "none",
              },
              ...getDrawerSharedSx(false, true),
              "& .MuiDrawer-paper": {
                height: `calc(100vh - 72px)`,
                top: "72px",
              },
            }}
          >
            {renderSidebarContent(false, "phone")}
          </Drawer>

          <Drawer
            variant="permanent"
            sx={{
              display: {
                xs: "none",
                sm: disableCollapsibleSidebar ? "none" : "block",
                md: "none",
              },
              ...getDrawerSharedSx(isMobileMini, false),
              "& .MuiDrawer-paper": {
                height: `calc(100vh - 72px)`,
                top: "72px",
              },
            }}
          >
            {renderSidebarContent(isMobileMini, "tablet")}
          </Drawer>

          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", md: "block" },
              ...getDrawerSharedSx(isDesktopMini, false),
              "& .MuiDrawer-paper": {
                height: `calc(100vh - 72px)`,
                top: "72px",
              },
            }}
          >
            {renderSidebarContent(isDesktopMini, "desktop")}
          </Drawer>
        </>
      )}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          pt: "72px",
          overflow: "auto",
          backgroundColor: "background",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};
