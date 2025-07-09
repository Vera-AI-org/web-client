import { DashboardLayout } from "@components/layouts/DashboardLayout";
import { Page } from "@components/layouts/Page";
import { useAppContext } from "@contexts/AppContext";
import { useNavigate } from "react-router";

// pages/index.tsx
export const HomePage = () => <h1>Home Page</h1>;

export const AdminPage = () => {
  return (
    <DashboardLayout branding={{ title: "VeraAI" }}>
      <Page title="Admin">
        <p>Área restrita a administradores.</p>
      </Page>
    </DashboardLayout>
  );
};

export const SignInPage = () => {
  const { authentication, setSession } = useAppContext();
  const navigate = useNavigate();

  const handleSignIn = async () => {
    if (!authentication) return;

    const result = await authentication.signIn();

    if (result.success && result.user) {
      setSession({ user: result.user });
      navigate("/admin");
    } else {
      alert("Falha no login: " + result.error);
    }
  };

  return (
    <>
      <h1>Sign In Page</h1>
      <button onClick={handleSignIn}>Sign In</button>
    </>
  );
};

export const UnauthorizedPage = () => <h1>Unauthorized Page</h1>;
