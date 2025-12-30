import { useState, useEffect, createContext, useContext } from 'react'
import * as SecureStore from 'expo-secure-store'
import { useDriverCheck, useDriverLogout } from './useApi'
import { driverApi } from '@/lib/api'
import { router } from 'expo-router'
import { stopBackgroundLocation } from '@/lib/backgroundLocation';

const AuthContext = createContext(null)

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context
}

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [user, setUser] = useState(null)

    const { data: checkData, isLoading: isChecking, refetch: refetchUser } = useDriverCheck(isAuthenticated)
    const logoutMutation = useDriverLogout()
    
    // 앱 시작 시 토큰 확인
    useEffect(() => {
        (async () => {
            const token = await SecureStore.getItemAsync('authToken')
            if (token) {
                setIsAuthenticated(true)
            }
        })()
    }, [])
    
    // 서버에서 인증 상태 확인
    useEffect(() => {
        const driver = checkData?.driver
        setUser(driver)
        setIsLoading(false)
    }, [checkData, isAuthenticated])
    
    const login = async (credentials) => {
        try {
            const res = await driverApi.login(credentials)
            if (res?.token) {
                const token = res.token

                await SecureStore.setItemAsync('authToken', token)
                
                setIsAuthenticated(true)
                
                router.replace('/(protected)/taksongs')
                
                return res
            }
            
            throw new Error(res.message || '로그인 실패')
        } catch (error) {
            throw error;
        }
    }
    
    const logout = async () => {
        try {
            await logoutMutation.mutateAsync()
            await stopBackgroundLocation()
        }
        catch (error) {
            console.error('Logout error:', error)
        }
        finally {
            await SecureStore.deleteItemAsync('authToken')
            setIsAuthenticated(false)
            setUser(null)
            
            router.replace("/(auth)/login")
        }
    }

    const value = {
        isAuthenticated,
        isLoading: isLoading || isChecking,
        user,
        setUser,
        login,
        logout,
    }
    
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
