import React, { createContext, useState } from "react";

export const AuthContext = createContext({
	token: null,
	userId: null,
	login: () => {},
	logout: () => {},
});

const AuthContextProvider = ({ children }) => {
	const [token, setToken] = useState(null);

	const [userId, setUserId] = useState(null);

	const login = authData => {
		const { token, userId, tokenExpiration } = authData;

		localStorage.setItem("token", JSON.stringify(token));
		setToken(token);
		setUserId(userId);
	};

	const logout = () => {
		setToken(null);
		setUserId(null);
	};

	return (
		<AuthContext.Provider value={{ token, userId, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthContextProvider;
