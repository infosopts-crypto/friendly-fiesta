import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { Teacher, Parent } from "@shared/schema";

interface AuthUser extends Omit<Teacher | Parent, 'password'> {
  userType: 'teacher' | 'parent';
}

interface AuthContextType {
  user: AuthUser | null;
  teacher: Teacher | null;
  parent: Parent | null;
  login: (user: AuthUser) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user data on mount (check both old and new format)
    const storedUser = localStorage.getItem("quran_user") || localStorage.getItem("quran_teacher");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        // If old format (teacher), convert to new format
        if (!userData.userType) {
          userData.userType = "teacher";
        }
        setUser(userData);
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        localStorage.removeItem("quran_user");
        localStorage.removeItem("quran_teacher");
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userData: AuthUser) => {
    setUser(userData);
    // Store user data in localStorage for persistence
    localStorage.setItem("quran_user", JSON.stringify(userData));
    // Remove old teacher key if exists
    localStorage.removeItem("quran_teacher");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("quran_user");
    localStorage.removeItem("quran_teacher");
  };

  const teacher = user?.userType === 'teacher' ? (user as Teacher & { userType: 'teacher' }) : null;
  const parent = user?.userType === 'parent' ? (user as Parent & { userType: 'parent' }) : null;

  const value = {
    user,
    teacher,
    parent,
    login,
    logout,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
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
