import React, { createContext, useState, useContext } from 'react';
import { api, setAuthToken } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = async (authData) => {
    // authData deve conter { email, password } vindo do LoginScreen
    try {
      // Chama a API real
      const response = await api.login(authData.email, authData.password);
      
      // response = { user: {id, name, email...}, token: "JWT..." }
      setUser(response.user);
      setAuthToken(response.token); // Configura token para chamadas futuras
      setIsLoggedIn(true);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setAuthToken(null);
    setIsLoggedIn(false);
  };

  const register = async (registerData) => {
    try {
      // registerData = { name, email, password }
      // Backend retorna o usuário criado. Geralmente precisa logar depois.
      await api.register(registerData.name, registerData.email, registerData.password);
      
      // Realiza login automático após registro
      await login({ email: registerData.email, password: registerData.password });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}