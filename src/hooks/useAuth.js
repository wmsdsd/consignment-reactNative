import { useState, useEffect, createContext, useContext } from 'react';
import * as SecureStore from 'expo-secure-store';
import { useDriverCheck, useDriverLogout } from './useApi';
import { driverApi } from '../lib/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  const { data: checkData, isLoading: isChecking } = useDriverCheck();
  const logoutMutation = useDriverLogout();

  // 앱 시작 시 토큰 확인
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // 서버에서 인증 상태 확인
  useEffect(() => {
    if (checkData !== undefined) {
      if (checkData.success) {
        setIsAuthenticated(true);
        setUser(checkData.user);
      } else {
        setIsAuthenticated(false);
        setUser(null);
        SecureStore.deleteItemAsync('authToken');
      }
      setIsLoading(false);
    }
  }, [checkData]);

  const checkAuthStatus = async () => {
    try {
      const token = await SecureStore.getItemAsync('authToken');
      if (token) {
        // 토큰이 있으면 서버에서 유효성 검사 (useDriverCheck가 처리)
        setIsLoading(false);
      } else {
        setIsAuthenticated(false);
        setUser(null);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setIsAuthenticated(false);
      setUser(null);
      setIsLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await driverApi.login(credentials);
      if (response.success && response.token) {
        await SecureStore.setItemAsync('authToken', response.token);
        setIsAuthenticated(true);
        setUser(response.user);
        return response;
      }
      throw new Error(response.message || '로그인 실패');
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await SecureStore.deleteItemAsync('authToken');
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  const value = {
    isAuthenticated,
    isLoading: isLoading || isChecking,
    user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
