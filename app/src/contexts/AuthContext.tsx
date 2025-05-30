import { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
	onLogin: (token: string) => void;
	token: string | null;
	logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
	children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [token, setToken] = useState<string | null>(null);

	const handleLogin = (token: string) => {
		setToken(token);
		// Additional login logic (e.g., save token to localStorage)
	};

	const handleLogout = () => {
		setToken(null);
		// Additional logout logic (e.g., clear localStorage)
	};

	return (
		<AuthContext.Provider
			value={{ onLogin: handleLogin, token, logout: handleLogout }}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
