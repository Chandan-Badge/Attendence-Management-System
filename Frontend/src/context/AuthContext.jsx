import axios from "axios";
import { createContext, useEffect, useMemo, useState } from "react";

export const AuthContext = createContext();

const STORAGE_TOKEN_KEY = "ams_auth_token";
const EMPTY_SESSION = {
    role: "",
    identifier: "",
    name: "",
    token: "",
};

const AuthContextProvider = ({ children }) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [authSession, setAuthSession] = useState(EMPTY_SESSION);
    const [isAuthLoading, setIsAuthLoading] = useState(true);

    const clearSession = () => {
        localStorage.removeItem(STORAGE_TOKEN_KEY);
        setAuthSession(EMPTY_SESSION);
    };

    const restoreSession = async (token) => {
        try {
            const response = await axios.get(`${backendUrl}/api/auth/me`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const user = response?.data?.user;

            if (!user?.role || !user?.identifier) {
                clearSession();
                return false;
            }

            setAuthSession({
                role: user.role,
                identifier: user.identifier,
                name: user.name || "",
                token,
            });
            localStorage.setItem(STORAGE_TOKEN_KEY, token);
            return true;
        } catch (_error) {
            clearSession();
            return false;
        }
    };

    useEffect(() => {
        const initializeSession = async () => {
            const token = localStorage.getItem(STORAGE_TOKEN_KEY);

            if (!token) {
                setIsAuthLoading(false);
                return;
            }

            await restoreSession(token);
            setIsAuthLoading(false);
        };

        initializeSession();
    }, [backendUrl]);

    const login = async (role, identifier, password) => {
        const response = await axios.post(`${backendUrl}/api/auth/login`, {
            role,
            identifier,
            password,
        });

        const token = response?.data?.token;
        const user = response?.data?.user;

        if (!token || !user?.role || !user?.identifier) {
            throw new Error("Invalid login response.");
        }

        localStorage.setItem(STORAGE_TOKEN_KEY, token);
        setAuthSession({
            role: user.role,
            identifier: user.identifier,
            name: user.name || "",
            token,
        });

        return user;
    };

    const logout = async () => {
        const token = authSession.token || localStorage.getItem(STORAGE_TOKEN_KEY);

        try {
            if (token) {
                await axios.post(
                    `${backendUrl}/api/auth/logout`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                );
            }
        } catch (_error) {
            // Client still clears session even if logout API fails.
        } finally {
            clearSession();
        }
    };

    const value = useMemo(
        () => ({
            backendUrl,
            authSession,
            isAuthLoading,
            isAuthenticated: Boolean(
                authSession.role && authSession.identifier && authSession.token,
            ),
            login,
            logout,
        }),
        [authSession, backendUrl, isAuthLoading],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;
