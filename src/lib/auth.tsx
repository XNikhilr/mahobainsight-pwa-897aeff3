import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { jwtLogin, jwtValidate } from "./wp";

interface AuthUser { email: string; nicename: string; displayName: string; }
interface AuthState {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (u: string, p: string) => Promise<void>;
  logout: () => void;
}

const Ctx = createContext<AuthState>({ user: null, token: null, loading: true, login: async () => {}, logout: () => {} });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const raw = localStorage.getItem("auth");
        if (!raw) { setLoading(false); return; }
        const parsed = JSON.parse(raw);
        const ok = await jwtValidate(parsed.token);
        if (ok) { setUser(parsed.user); setToken(parsed.token); }
        else localStorage.removeItem("auth");
      } catch {} finally { setLoading(false); }
    })();
  }, []);

  const login = async (u: string, p: string) => {
    const res = await jwtLogin(u, p);
    const newUser = { email: res.user_email, nicename: res.user_nicename, displayName: res.user_display_name };
    setUser(newUser); setToken(res.token);
    localStorage.setItem("auth", JSON.stringify({ token: res.token, user: newUser }));
  };
  const logout = () => { setUser(null); setToken(null); localStorage.removeItem("auth"); };

  return <Ctx.Provider value={{ user, token, loading, login, logout }}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);