import { useEffect, useState } from "react";
import axios from "axios";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const useAuth = () => {
  const [auth, setAuth] = useState({ loading: true, isAuthenticated: false });

  useEffect(() => {
    axios
      .get(`${backendUrl}/api/dashboard/home`, {
        withCredentials: true,
      })
      .then(() => {
        setAuth({ loading: false, isAuthenticated: true });
      })
      .catch(() => {
        setAuth({ loading: false, isAuthenticated: false });
      });
  }, []);

  return auth;
};
