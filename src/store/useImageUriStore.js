import { create } from 'zustand'


export const useImageUriStore = create((set) => ({
    imageUri: null,
    type: null,
    setImageUri: (uri, type) => set({
        imageUri: uri,
        type: type,
    }),
    clearData: () => set({ imageUri: null, type: null }),

    orderPhoto: {
        FRONT: null,
        LEFT: null,
        RIGHT: null,
        BACK: null,
        INSIDE: null,
    },
    setOrderPhoto: (orderPhoto, position) => set((state) => ({
        orderPhoto: {
            ...state.orderPhoto,
            [position]: orderPhoto
        }
    })),
    clearOrderPhoto: () =>
        set({
            orderPhoto: {
                FRONT: null,
                LEFT: null,
                RIGHT: null,
                BACK: null,
                INSIDE: null,
            },
        }),
}))