import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import api from "../lib/api";

const AuthContext = createContext();
console.log('[AuthContext] module loaded');
// ⭐ THIS IS THE EXPORT VITE NEEDS — DO NOT REMOVE
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("bb_user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(false);

  // prevents ProtectedRoute from redirecting too early
  const [authReady, setAuthReady] = useState(false);

  // LOGIN
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      setUser(res.data.user);
      setAccessToken(res.data.accessToken);
      localStorage.setItem("bb_user", JSON.stringify(res.data.user));
      return { ok: true };
    } catch (err) {
      return {
        ok: false,
        message: err?.response?.data?.message || "Login failed",
      };
    } finally {
      setLoading(false);
    }
  };

  // REGISTER
  const register = async (name, email, password) => {
    setLoading(true);
    try {
      await api.post("/auth/register", { name, email, password });
      return { ok: true };
    } catch (err) {
      return {
        ok: false,
        message: err?.response?.data?.message || "Register failed",
      };
    } finally {
      setLoading(false);
    }
  };

  // LOGOUT
  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {}
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem("bb_user");
  };

  // REFRESH TOKEN
  const refreshAccessToken = useCallback(async () => {
    try {
      const res = await api.post("/auth/refresh");
      setAccessToken(res.data.accessToken);
      return res.data.accessToken;
    } catch (err) {
      setUser(null);
      setAccessToken(null);
      localStorage.removeItem("bb_user");
      return null;
    }
  }, []);

  // FETCH WITH AUTH
  const fetchWithAuth = useCallback(
    async (opts) => {
      const doRequest = (token) =>
        api.request({
          url: opts.url,
          method: opts.method || "get",
          data: opts.data,
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        });

      try {
        if (accessToken) return await doRequest(accessToken);
        const newToken = await refreshAccessToken();
        if (newToken) return await doRequest(newToken);
        throw new Error("Not authenticated");
      } catch (err) {
        if (err?.response?.status === 401) {
          const newToken = await refreshAccessToken();
          if (newToken) return await doRequest(newToken);
        }
        throw err;
      }
    },
    [accessToken, refreshAccessToken]
  );

  // TRY REFRESH ON APP START
  useEffect(() => {
    (async () => {
      await refreshAccessToken();
      setAuthReady(true);
    })();
  }, [refreshAccessToken]);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        loading,
        login,
        register,
        logout,
        refreshAccessToken,
        fetchWithAuth,
        authReady,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
