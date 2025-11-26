import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { driverApi, orderApi, orderLocationApi, orderPhotoApi, orderSettlementApi } from '@/lib/api';

// Driver Hooks
export const useDriverLogin = () => {
    return useMutation({
        mutationFn: driverApi.login,
    });
};

export const useDriverRefresh = () => {
    return useMutation({
        mutationFn: driverApi.refresh,
    });
};

export const useDriverRegister = () => {
    return useMutation({
        mutationFn: driverApi.register,
    });
};

export const useDriverLogout = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: driverApi.logout,
        onSuccess: () => {
            queryClient.clear();
        },
    });
};

export const useDriverCheck = (token) => {
    return useQuery({
        queryKey: ['driver', 'check', token],
        queryFn: driverApi.check,
        enabled: !!token
    });
};

export const useDriverProfile = () => {
    return useQuery({
        queryKey: ['driver', 'profile'],
        queryFn: driverApi.getProfile,
    });
};

export const useDriverUpdate = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: driverApi.update,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['driver'] });
        },
    });
};

// Order Hooks
export const useOrders = () => {
    return useQuery({
        queryKey: ['orders'],
        queryFn: orderApi.getOrders,
    });
};

export const useOrderList = () => {
    return useQuery({
        queryKey: ['orders', 'list'],
        queryFn: orderApi.getOrderList,
    });
};

export const useOrderHistory = () => {
    return useQuery({
        queryKey: ['orders', 'history'],
        queryFn: orderApi.getOrderHistory,
    });
};

export const useOrderCancel = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: orderApi.cancel,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
        },
    });
};

export const useOrderStatusUpdate = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ orderId, status }) => orderApi.updateStatus(orderId, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
        },
    });
};

// OrderLocation Hooks
export const useOrderLocationProcess = () => {
    return useQuery({
        queryKey: ['orderLocation', 'process'],
        queryFn: orderLocationApi.getProcess,
    });
};

export const useOrderLocationStart = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: orderLocationApi.start,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orderLocation'] });
        },
    });
};

export const useOrderLocationEnd = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: orderLocationApi.end,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orderLocation'] });
        },
    });
};

// OrderPhoto Hooks
export const useOrderPhotoList = () => {
    return useQuery({
        queryKey: ['orderPhoto', 'list'],
        queryFn: orderPhotoApi.getList,
    });
};

export const useOrderPhotoUpload = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: orderPhotoApi.uploads,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orderPhoto'] });
        },
    });
};

export const useOrderPhotoRemove = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: orderPhotoApi.remove,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orderPhoto'] });
        },
    });
};

// OrderSettlement Hooks
export const useOrderSettlement = () => {
    return useQuery({
        queryKey: ['orderSettlement'],
        queryFn: orderSettlementApi.getSettlement,
    });
};

export const useOrderSettlementList = () => {
    return useQuery({
        queryKey: ['orderSettlement', 'list'],
        queryFn: orderSettlementApi.getList,
    });
};

export const useOrderSettlementSave = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: orderSettlementApi.save,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orderSettlement'] });
        },
    });
};

export const useOrderSettlementUpdate = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: orderSettlementApi.update,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orderSettlement'] });
        },
    });
};

export const useOrderSettlementRemove = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: orderSettlementApi.remove,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orderSettlement'] });
        },
    });
};
