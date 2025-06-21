// Em: src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

// Cria o "molde" do nosso contexto
const AuthContext = createContext(null);

// Cria o componente Provedor, que vai "segurar" a lógica e os dados
export const AuthProvider = ({ children }) => {
    // Estado para guardar o token do usuário
    const [userToken, setUserToken] = useState(null);

    // Este 'useEffect' roda uma única vez quando o app carrega
    // Ele verifica se já existe um token no localStorage para manter o usuário logado
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            setUserToken(token);
        }
    }, []);

    // Função de login: salva o token no estado e no localStorage
    const login = (token) => {
        localStorage.setItem('accessToken', token);
        setUserToken(token);
    };

    // Função de logout: remove o token do estado e do localStorage
    const logout = () => {
        localStorage.removeItem('accessToken');
        setUserToken(null);
    };

    // Uma forma fácil de verificar se o usuário está autenticado
    const isAuthenticated = !!userToken;

    // O valor que será compartilhado com todos os componentes "filhos"
    const value = {
        isAuthenticated,
        userToken,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook personalizado para acessar o contexto de autenticação
export const useAuth = () => {
    return useContext(AuthContext);
};