const BASE_URL = 'http://192.168.0.15:4000/api';

// 기본 fetch 함수
const apiCall = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'API 호출 실패');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

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
  
  getProfile: () => apiCall('/driver'),
  
  update: (data) => apiCall('/driver/update', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};

// Order API
export const orderApi = {
  getOrders: () => apiCall('/order'),
  
  getOrderList: () => apiCall('/order/list'),
  
  getOrderHistory: () => apiCall('/order/history'),
  
  cancel: (orderId) => apiCall('/order/cancel', {
    method: 'POST',
    body: JSON.stringify({ orderId }),
  }),
  
  updateStatus: (orderId, status) => apiCall('/order/status', {
    method: 'POST',
    body: JSON.stringify({ orderId, status }),
  }),
};

// OrderLocation API
export const orderLocationApi = {
  getProcess: () => apiCall('/orderLocation/process'),
  
  start: (data) => apiCall('/orderLocation/start', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  end: (data) => apiCall('/orderLocation/end', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};

// OrderPhoto API
export const orderPhotoApi = {
  getList: () => apiCall('/orderPhoto/list'),
  
  uploads: (formData) => apiCall('/orderPhoto/uploads', {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    body: formData,
  }),
  
  remove: (photoId) => apiCall('/orderPhoto/remove', {
    method: 'POST',
    body: JSON.stringify({ photoId }),
  }),
};

// OrderSettlement API
export const orderSettlementApi = {
  getSettlement: () => apiCall('/orderSettlement'),
  
  getList: () => apiCall('/orderSettlement/list'),
  
  save: (data) => apiCall('/orderSettlement/save', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  update: (data) => apiCall('/orderSettlement/update', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  remove: (settlementId) => apiCall('/orderSettlement/remove', {
    method: 'POST',
    body: JSON.stringify({ settlementId }),
  }),
};
