import { create } from 'zustand'


export const useImageUriStore = create((set) => ({
    imageUri: null,
    type: null,
    setImageUri: (uri, type) => set({
        imageUri: uri,
        type: type,
    }),
    clearImageUri: () => set({
        imageUri: null,
        type: null
    }),

    mainOrderPhoto: {
        FRONT: null,
        LEFT: null,
        RIGHT: null,
        BACK: null,
        INSIDE: null,
    },
    setMainOrderPhoto: (orderPhoto, position) => set((state) => ({
        mainOrderPhoto: {
            ...state.mainOrderPhoto,
            [position]: orderPhoto
        }
    })),
    clearMainOrderPhoto: () =>
        set({
            mainOrderPhoto: {
                FRONT: null,
                LEFT: null,
                RIGHT: null,
                BACK: null,
                INSIDE: null,
            },
        }),
}))