import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { apiRequest } from "@/utils/api";
const storageKey = "svml_local_auth";
const AuthContext = createContext(void 0);
function toProfile(user) {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    full_name: user.fullName,
    studio_name: user.studioName ?? null,
    studio_slug: user.studioSlug ?? null,
    status: user.status,
    phone: user.phone,
    address: user.address,
    city: user.city,
    state: user.state
  };
}
function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const savedAuth = localStorage.getItem(storageKey);
    if (savedAuth) {
      try {
        const savedSession = JSON.parse(savedAuth);
        setSession(savedSession);
        setUser(savedSession.user);
        setProfile(savedSession.profile);
      } catch {
        localStorage.removeItem(storageKey);
      }
    }
    setLoading(false);
  }, []);
  const signUpVendor = async (data) => {
    try {
      await apiRequest("/auth/register/vendor", {
        method: "POST",
        body: JSON.stringify(data)
      });
      return { error: null };
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Unable to create account." };
    }
  };
  const signIn = async (email, password) => {
    try {
      const response = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });
      const nextProfile = toProfile(response.user);
      const nextSession = { token: response.token, user: { id: response.user.id, email: response.user.email }, profile: nextProfile };
      localStorage.setItem(storageKey, JSON.stringify(nextSession));
      setSession(nextSession);
      setUser(nextSession.user);
      setProfile(nextProfile);
      return { error: null };
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Unable to sign in." };
    }
  };
  const signOut = useCallback(async () => {
    localStorage.removeItem(storageKey);
    setProfile(null);
    setUser(null);
    setSession(null);
  }, []);
  const refreshProfile = useCallback(async () => {
    if (!session?.token) return;
    try {
      const response = await apiRequest("/auth/me", { token: session.token });
      const nextProfile = toProfile(response.user);
      const nextSession = {
        token: session.token,
        user: { id: response.user.id, email: response.user.email },
        profile: nextProfile
      };
      localStorage.setItem(storageKey, JSON.stringify(nextSession));
      setSession(nextSession);
      setUser(nextSession.user);
      setProfile(nextProfile);
    } catch {
      // Keep the last known profile while the API is temporarily unavailable.
    }
  }, [session?.token]);
  return <AuthContext.Provider
    value={{ session, user, profile, loading, signUpVendor, signIn, signOut, refreshProfile }}
  >{children}</AuthContext.Provider>;
}
function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx)
    throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
export {
  AuthProvider,
  useAuth
};
