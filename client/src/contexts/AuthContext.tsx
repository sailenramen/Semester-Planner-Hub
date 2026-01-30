import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface AuthContextType {
  user: Omit<User, "password"> | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateName: (name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Omit<User, "password"> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        }
      } catch (error) {
        console.error("Failed to check auth:", error);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await apiRequest("POST", "/api/auth/login", { email, password });
      const userData = await res.json();
      setUser(userData);
      queryClient.clear();
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed";
      const errorText = message.includes(":") ? message.split(":")[1].trim() : message;
      try {
        const parsed = JSON.parse(errorText);
        return { success: false, error: parsed.error || "Login failed" };
      } catch {
        return { success: false, error: errorText || "Login failed" };
      }
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const res = await apiRequest("POST", "/api/auth/register", { name, email, password });
      const userData = await res.json();
      setUser(userData);
      queryClient.clear();
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Registration failed";
      const errorText = message.includes(":") ? message.split(":")[1].trim() : message;
      try {
        const parsed = JSON.parse(errorText);
        return { success: false, error: parsed.error || "Registration failed" };
      } catch {
        return { success: false, error: errorText || "Registration failed" };
      }
    }
  };

  const logout = async () => {
    try {
      await apiRequest("POST", "/api/auth/logout", {});
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      queryClient.clear();
    }
  };

  const updateName = async (name: string) => {
    try {
      const res = await apiRequest("PATCH", "/api/user/name", { name });
      const userData = await res.json();
      setUser(userData);
    } catch (error) {
      console.error("Failed to update name:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateName,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
