import { AppProvider } from "@components/AppProvider";
import { useAppContext } from "@hooks/appProviderContext";
import { Routes, Route } from "react-router";

const authentication = {
  signIn: () => alert("sign in"),
  signOut: () => alert("sign out"),
};

const session = {
  user: {
    name: "Marcos",
    email: "marcos@email.com",
  },
};

export const Home = () => {
  const { session, authentication } = useAppContext();

  return (
    <div>
      <h1>Home Page</h1>
      <p>Usuário: {session?.user?.name ?? "Anônimo"}</p>
      <button onClick={authentication?.signOut}>Sair</button>
    </div>
  );
};

const About = () => {
  return <h1>About Page</h1>;
};

export const App = () => {
  return (
    <AppProvider authentication={authentication} session={session}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </AppProvider>
  );
};
