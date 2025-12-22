import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
    driverApi,
    driverMoveApi,
    orderApi,
    orderLocationApi,
    orderPhotoApi,
    orderSettlementApi,
    orderAccidentApi, driverPhotoApi, pushNotificationApi,
} from '@/lib/api';

// Driver Hooks --------------------------------------------------------------------------------------------------------
export const useDriverLogin = () => {
    return useMutation({
        mutationFn: driverApi.login,
    })
}

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
    const queryClient = useQueryClient()
    
    return useMutation({
        mutationFn: driverApi.logout,
        onSuccess: () => {
            queryClient.clear()
        },
    })
}

export const useDriverCheck = (enabled) => {
    return useQuery({
        queryKey: ['driver', 'check'],
        queryFn: driverApi.check,
        enabled: enabled
    })
}

export const useDriverProfile = (uid) => {
    return useQuery({
        queryKey: ['driver', 'profile', uid],
        queryFn: async ({ queryKey }) => {
            const [,, uid] = queryKey
            const qs = new URLSearchParams({ uid })
            return driverApi.getProfile(qs)
        },
        enabled: !!uid,
        staleTime: 0,
        cacheTime: 0,
        refetchOnMount: true,
        refetchOnWindowFocus: true
    });
};

export const useDriverUpdate = () => {
    const queryClient = useQueryClient()
    
    return useMutation({
        mutationFn: driverApi.update,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['driver'] })
        },
    })
}

export const useDriverSendAuthCode = () => {
    return useMutation({
        mutationFn: driverApi.authCode,
    })
}

export const useDriverVerify = () => {
    return useMutation({
        mutationFn: async ({phone, code}) => {
            const qs = new URLSearchParams({ phone, code })
            return driverApi.verifyCode(qs)
        },
    })
}

export const useDriverChangePassword = () => {
    return useMutation({
        mutationFn: driverApi.changePassword,
    })
}

export const useDriverVerifyPassword = () => {
    return useMutation({
        mutationFn: driverApi.verifyPassword,
    })
}

export const useDriverSetPush = () => {
    return useMutation({
        mutationFn: driverApi.setPush,
    })
}

// Driver Hooks End ----------------------------------------------------------------------------------------------------

// Order Hooks ---------------------------------------------------------------------------------------------------------
export const useOrder = (uid) => {
    return useQuery({
        queryKey: ['order', uid],
        queryFn: async ({ queryKey }) => {
            const [, uid] = queryKey
            const qs = new URLSearchParams({ uid })
            return orderApi.getOrder(qs)
        },
    })
};

export const useOrderList = () => {
    return useQuery({
        queryKey: ['order', 'list'],
        queryFn: orderApi.getOrderList
    })
}

export const useOrderHistory = () => {
    return useQuery({
        queryKey: ['order', 'history'],
        queryFn: orderApi.getOrderHistory,
    });
};

export const useOrderCancel = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: orderApi.cancel,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['order'] });
        },
    });
};

export const useOrderStatusUpdate = () => {
    const queryClient = useQueryClient()
    
    return useMutation({
        mutationFn: ({ orderId, status }) => orderApi.updateStatus(orderId, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['order'] })
        },
    })
}
// Order Hooks End -----------------------------------------------------------------------------------------------------

// OrderLocation Hooks -------------------------------------------------------------------------------------------------
export const useOrderLocationProcess = (uid) => {
    return useQuery({
        queryKey: ['orderLocation', 'process', uid],
        queryFn: async ({ queryKey }) => {
            const [,, uid] = queryKey
            const qs = new URLSearchParams({ uid })
            return orderLocationApi.getProcess(qs)
        },
        enabled: !!uid
    })
}

export const useOrderLocationStart = () => {
    const queryClient = useQueryClient()
    
    return useMutation({
        mutationFn: orderLocationApi.start,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['order', 'orderLocation'] })
        },
    })
}

export const useOrderLocationEnd = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: orderLocationApi.end,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orderLocation'] })
        },
    });
};

// OrderPhoto Hooks ----------------------------------------------------------------------------------------------------
export const useOrderPhotoList = (orderUid, orderLocationUid, enabled = true) => {
    return useQuery({
        queryKey: ['orderPhoto', "list", orderUid, orderLocationUid],
        queryFn: async ({ queryKey }) => {
            const [,, orderUid, orderLocationUid] = queryKey
            const qs = new URLSearchParams({
                orderUid: orderUid,
                orderLocationUid: orderLocationUid
            })
            return orderPhotoApi.getList(qs)
        },
        enabled: enabled,
    });
};

export const useOrderPhotoUpload = () => {
    const queryClient = useQueryClient()
    
    return useMutation({
        mutationFn: orderPhotoApi.uploads,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orderPhoto'] })
        },
    })
}

export const useOrderPhotoRemove = () => {
    const queryClient = useQueryClient()
    
    return useMutation({
        mutationFn: orderPhotoApi.remove,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orderPhoto'] })
        },
    })
}
// OrderPhoto Hooks End ------------------------------------------------------------------------------------------------

// OrderSettlement Hooks -----------------------------------------------------------------------------------------------
export const useOrderSettlement = (uid) => {
    return useQuery({
        queryKey: ['orderSettlement', uid],
        queryFn: async ({ queryKey }) => {
            const [, uid] = queryKey
            const qs = new URLSearchParams({ uid })
            return orderSettlementApi.getSettlement(qs)
        },
    });
};

export const useOrderSettlementList = (orderUid) => {
    return useQuery({
        queryKey: ['orderSettlement', 'list', orderUid],
        queryFn: async ({ queryKey }) => {
            const [,, orderUid] = queryKey
            const qs = new URLSearchParams({ orderUid })
            return orderSettlementApi.getList(qs)
        },
        enabled: !!orderUid
    })
}

export const useOrderSettlementSave = () => {
    const queryClient = useQueryClient()
    
    return useMutation({
        mutationFn: orderSettlementApi.save,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orderSettlement'] })
        },
    })
}

export const useOrderSettlementUpdate = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: orderSettlementApi.update,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orderSettlement'] })
        },
    })
}

export const useOrderSettlementRemove = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: orderSettlementApi.remove,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orderSettlement'] })
        },
    })
}
// OrderSettlement Hooks End -------------------------------------------------------------------------------------------

// DriverMove Hooks ----------------------------------------------------------------------------------------------------
export const useDriverMove = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: driverMoveApi.save,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['driverMove'] })
        }
    })
}
// DriverMove Hooks End ------------------------------------------------------------------------------------------------

// OrderAccident Hooks Start -------------------------------------------------------------------------------------------
export const useOrderAccident = (uid) => {
    return useQuery({
        queryKey: ['orderAccident', uid],
        queryFn: async ({ queryKey }) => {
            const [, uid] = queryKey
            const qs = new URLSearchParams({ orderUid: uid })
            return orderAccidentApi.get(qs)
        },
        enabled: !!uid
    })
}

export const useOrderAccidentReceive = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: orderAccidentApi.receive,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['order', 'orderAccident'] })
        }
    })
}

export const useOrderAccidentUpdate = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: orderAccidentApi.update,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orderAccident'] })
        }
    })
}
// OrderAccident Hooks End ---------------------------------------------------------------------------------------------

// DriverPhoto Hooks Start ---------------------------------------------------------------------------------------------
export const useDriverPhotoUpload = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: driverPhotoApi.upload,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['driver', 'driverPhoto'] })
        },
    })
}

export const useDriverPhotoRemove = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: driverPhotoApi.remove,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['driver', 'driverPhoto'] })
        },
    })
}
// DriverPhoto Hooks End -----------------------------------------------------------------------------------------------

// Push Notification Hooks Start ---------------------------------------------------------------------------------------
export const usePushNotificationList = (isRead = undefined) => {
    return useQuery({
        queryKey: ['pushNotification', isRead],
        queryFn: async ({ queryKey }) => {
            const [, isRead] = queryKey
            let qs
            if (isRead) {
                qs = new URLSearchParams({ isRead: isRead })
            }
            return pushNotificationApi.list(qs)
        },
    })
}

export const usePushNotificationRead = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: pushNotificationApi.read,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['pushNotification'] })
        },
    })
}
// Push Notification Hooks End -----------------------------------------------------------------------------------------
