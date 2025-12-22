import { Redirect } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import '@/lib/background-location-task';


export default function Index() {
    const [isReady, setIsReady] = useState(false)
    const [hasToken, setHasToken] = useState(false)
    
    useEffect(() => {
        (async () => {
            const token = await SecureStore.getItemAsync("authToken")
            setHasToken(!!token)
            setIsReady(true)
        })()
    }, [])
    
    if (!isReady) {
        // 로딩 화면 또는 아무것도 안 보여도 됨
        return null
    }
    
    if (hasToken) {
        // 토큰 있으면 protected 페이지로
        return <Redirect href="/(protected)/taksongs" />
    }
    else {
        // 토큰 없으면 로그인 화면으로
        return <Redirect href="/(auth)/login" />;
    }
}
