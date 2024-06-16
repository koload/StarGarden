// a wrapper for a protected root
import { Navigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import api from "../api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from '../constants';
import { useState, useEffect } from "react";

function ProtectedRoute({ children }) {
    const [isAuthorized, setIsAuthorized] = useState(null);

    // useEffect is a hook that is being called when ProtectedRoute is being rendered. It initializes the auth function
    useEffect(() => {
        auth().catch(() => setIsAuthorized(false))
    }, [])

    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        try {
            const res = await api.post("/main/token/refresh/", {
                refresh: refreshToken
            });
            if (res.status == 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                setIsAuthorized(true);
            } else {
                setIsAuthorized(false);
            }
        } catch (error) {
            console.log(error);
            setIsAuthorized(false);
        }
    };

    // check if we have an access token and if its expired or not,
    // if its expired its going to be refreshed automatically
    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) {
            setIsAuthorized(false);
            return;
        }

        // decoding the token and accesing the value of exp date
        const decoded = jwtDecode(token);
        const tokenExpiration = decoded.exp;
        const now = Date.now() /1000;

        if (tokenExpiration < now) {
            await refreshToken();
        } else {
            setIsAuthorized(true);
        }
    };

    if (isAuthorized == null) {
        return <div>Loading...</div>;
    }

    return isAuthorized ? children : <Navigate to="/welcome"/>;
}

export default ProtectedRoute;
