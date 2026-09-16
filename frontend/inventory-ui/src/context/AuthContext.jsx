import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

const STORAGE_KEY = "ims_auth";

function readStoredAuth() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return null;
    }

    return JSON.parse(stored);
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(readStoredAuth);

  const login = (authResponse) => {
    const authData = {
      token: authResponse.token,
      userId: authResponse.userId,
      username: authResponse.username,
      name: authResponse.name,
      role: authResponse.role,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(authData));
    setAuth(authData);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setAuth(null);
  };

  const value = useMemo(
    () => ({
      ...auth,
      isAuthenticated: Boolean(auth?.token),
      isAdmin: auth?.role === "Admin",
      isCustomer: auth?.role === "Customer",
      login,
      logout,
    }),
    [auth]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}