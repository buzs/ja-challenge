import React from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";

type User = {
  username: string;
  name: string;
  password: string;
};

interface AuthContextType {
  user: Omit<User, "password">;
  signin: (user: Omit<User, "name">) => Promise<void>;
  signout: (callback: VoidFunction) => void;
}

let AuthContext = React.createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  let [user, setUser] = React.useState<any>(() => {
    let user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  });

  let signin = async (newUser: Omit<User, "name">) => {
    return new Promise<void>(async (resolve, reject) => {
      await api
        .post<Omit<User, "password">>("/login", newUser)
        .then(({ data }) => {
          if (!data.name && !data.username) {
            reject("Invalid username or password");
          }

          setUser(data);

          localStorage.setItem(
            "user",
            JSON.stringify({
              username: newUser.username,
            })
          );

          resolve();
        })
        .catch((e) => {
          reject("Invalid username or password");
        });
    });

    // return fakeAuthProvider.signin(() => {
    //   setUser(newUser);
    //   callback();
    // });
  };

  let signout = (callback: VoidFunction) => {
    localStorage.clear();
    setUser(null);
    callback();
  };

  let value = { user, signin, signout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return React.useContext(AuthContext);
}

export function RequireAuth({ children }: { children: JSX.Element }) {
  let auth = useAuth();
  let location = useLocation();

  if (!auth.user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}
