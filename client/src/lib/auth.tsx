import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { Teacher } from "@shared/schema";

interface AuthContextType {
  teacher: Teacher | null;
  login: (teacher: Teacher) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored teacher data on mount
    const storedTeacher = localStorage.getItem("quran_teacher");
    if (storedTeacher) {
      try {
        const teacherData = JSON.parse(storedTeacher);
        setTeacher(teacherData);
      } catch (error) {
        console.error("Error parsing stored teacher data:", error);
        localStorage.removeItem("quran_teacher");
      }
    }
    setIsLoading(false);
  }, []);

  const login = (teacherData: Teacher) => {
    setTeacher(teacherData);
    // Store teacher data in localStorage for persistence
    localStorage.setItem("quran_teacher", JSON.stringify(teacherData));
  };

  const logout = () => {
    setTeacher(null);
    localStorage.removeItem("quran_teacher");
  };

  const value = {
    teacher,
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
