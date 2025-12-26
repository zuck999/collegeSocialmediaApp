import { useNavigate } from "@tanstack/react-router";
import type React from "react";
import { createContext, useContext } from "react";
import { routes } from "@/layout/routes";

interface AuthContextType {
	logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const navigate = useNavigate();

	const logout = () => {
		// In a real app, you'd clear the user's session here.
		navigate({ to: routes.login });
	};

	return (
		<AuthContext.Provider value={{ logout }}>{children}</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

export const useAuthActions = () => {
	const { logout } = useAuth();
	return { logout };
};
