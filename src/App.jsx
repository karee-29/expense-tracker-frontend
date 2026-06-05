import { useEffect, useState } from "react";
import Login from "./login";
import Dashboard from "./Dashboard";

function App() {
  const [isLoggedIn, setIsLoggedIn] =
    useState(false);

  useEffect(() => {
    const token =
      localStorage.getItem("token");

    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  if (!isLoggedIn) {
    return (
      <Login
        setIsLoggedIn={
          setIsLoggedIn
        }
      />
    );
  }

  return (
    <Dashboard
      setIsLoggedIn={
        setIsLoggedIn
      }
    />
  );
}

export default App;
