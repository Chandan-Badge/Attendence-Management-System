import { createContext, useMemo, useState } from "react";

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [authSession, setAuthSession] = useState({ role: "", identifier: "" });

    const login = (role, identifier) => {
        setAuthSession({ role, identifier });
    };

    const logout = () => {
        setAuthSession({ role: "", identifier: "" });
    };

    const value = useMemo(
        () => ({
            backendUrl,
            authSession,
            isAuthenticated: Boolean(authSession.role && authSession.identifier),
            login,
            logout,
        }),
        [authSession, backendUrl],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;
