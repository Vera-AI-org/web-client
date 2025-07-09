// App.tsx
import { AppProvider } from "@components/AppProvider";
import { PrivateRoute } from "@components/PrivateRoute";
import { Routes, Route } from "react-router";
import type { AuthFunctions, NavigationItem } from "@customTypes/session";
import { HomePage, AdminPage, SignInPage, UnauthorizedPage } from "@/pages";
import { AccessAlarm } from "@mui/icons-material";
import { appTheme } from "@/theme";

// Mock de autenticação e sessão
const mockAuth: AuthFunctions = {
  signIn: async () => ({
    success: true,
    user: { id: "1", name: "Admin", email: "admin@test.com", role: "admin" },
    error: null,
  }),
  signOut: () => console.log("Signed out"),
};

const mockNavigation: NavigationItem[] = [
  { kind: "header", title: "Main" },
  {
    kind: "page",
    title: "Home",
    segment: "home",
    pattern: "/",
    icon: <AccessAlarm />,
  },
  {
    kind: "page",
    title: "Admin",
    segment: "admin",
    pattern: "/admin",
    icon: <AccessAlarm />,
  },
];

export const App = () => {
  return (
    <AppProvider
      authentication={mockAuth}
      theme={appTheme}
      navigation={mockNavigation}
    >
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/admin"
          element={
            <PrivateRoute allowedTo={["admin"]} element={<AdminPage />} />
          }
        />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
      </Routes>
    </AppProvider>
  );
};
