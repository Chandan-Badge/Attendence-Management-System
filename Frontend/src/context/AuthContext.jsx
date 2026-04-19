import { createContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";
import axios from "axios";

export const AuthContext = createContext();

const AuthContextProvider = (probs) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const value = {
        backendUrl
    }

    return (
        <AuthContext.Provider value={value}>
            {probs.children}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider;
