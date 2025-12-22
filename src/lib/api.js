const BASE_URL = 'http://192.168.0.48:4000/api/mobile';

//const BASE_URL = 'https://api.olgomobility.com/api';  // real
//const BASE_URL = 'http://13.209.6.245:4000/api';      // stage

import {router} from "expo-router"
import * as SecureStore from 'expo-secure-store'

// 기본 fetch 함수
const apiCall = async (endpoint, options = {}) => {
    const token = await SecureStore.getItemAsync('authToken')
    const url = `${BASE_URL}${endpoint}`
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'token': token,
            ...options.headers,
        },
        ...options,
    }
    
    try {
        const response = await fetch(url, config)
        const data = await response.json()
        
        if (!response.ok) {
            console.log("error data", data)
            const result = data?.result

            // 비인가
            if (result?.code === 401) {
                await SecureStore.deleteItemAsync('authToken')
                router.replace("/(auth)/login")
            }

            throw new Error(data?.result?.message || 'API 호출 실패')
        }
        
        return data.data
    } catch (error) {
        console.error('API Error:', error)
        throw error
    }
}

// Driver API
export const driverApi = {
    login: (credentials) => apiCall('/driver/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
    }),
    refresh: (token) => apiCall('/driver/refresh', {
        method: 'POST',
        body: JSON.stringify({ token }),
    }),
    register: (data) => apiCall('/driver/register', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    logout: () => apiCall('/driver/logout'),
    check: () => apiCall('/driver/check'),
    getProfile: (qs) => apiCall(`/driver?${qs}`),
    update: (data) => apiCall('/driver/update', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    authCode: (data) => apiCall('/driver/authCode', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    verifyCode: (qs) => apiCall(`/driver/verify?${qs}`),
    changePassword: (data) => apiCall('/driver/password', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    verifyPassword: (data) => apiCall('/driver/password/verify', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    setPush: (data) => apiCall('/driver/push', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
}

// Order API
export const orderApi = {
    getOrder: (qs) => apiCall(`/order?${qs}`),
    getOrderList: () => apiCall('/order/list'),
    getOrderHistory: () => apiCall('/order/history'),
    cancel: (orderId) => apiCall('/order/cancel', {
        method: 'POST',
        body: JSON.stringify({ uid: orderId }),
    }),
    updateStatus: (orderId, status) => apiCall('/order/status', {
        method: 'POST',
        body: JSON.stringify({
            uid: orderId,
            status: status
        }),
    }),
}

// OrderLocation API
export const orderLocationApi = {
    getProcess: (qs) => apiCall(`/orderLocation/process?${qs}`),
    start: (data) => apiCall('/orderLocation/start', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    end: (data) => apiCall('/orderLocation/end', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
}

// OrderPhoto API
export const orderPhotoApi = {
    getList: (qs) => apiCall(`/orderPhoto/list?${qs}`),
    uploads: (data) => apiCall('/orderPhoto/uploads', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    remove: (data) => apiCall('/orderPhoto/remove', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
};

// OrderSettlement API
export const orderSettlementApi = {
    getSettlement: (qs) => apiCall(`/orderSettlement?${qs}`),
    getList: (qs) => apiCall(`/orderSettlement/list?${qs}`),
    save: (data) => apiCall('/orderSettlement/save', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    update: (data) => apiCall('/orderSettlement/update', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    remove: (uid) => apiCall('/orderSettlement/remove', {
        method: 'POST',
        body: JSON.stringify({ uid }),
    }),
};

// driverMove API
export const driverMoveApi = {
    save: (data) => apiCall('/driverMove', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    background: (data) => apiCall('/driverMove/background', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
}

// orderAccident api
export const orderAccidentApi = {
    get: (qs) => apiCall(`/orderAccident?${qs}`),
    receive: (data) => apiCall(`/orderAccident`, {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    update: (data) => apiCall(`/orderAccident/update`, {
        method: 'POST',
        body: JSON.stringify(data),
    })
}

export const driverPhotoApi = {
    upload: (data) => apiCall(`/driverPhoto/upload`, {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    remove: (data) => apiCall(`/driverPhoto/remove`, {
        method: 'POST',
        body: JSON.stringify(data),
    })
}

export const pushNotificationApi = {
    list: (qs) => apiCall(`/pushNotification/list${ qs ? `?${qs}` : '' }`),
    read: () => apiCall(`/pushNotification/read`, {
        method: 'POST',
    }),
}