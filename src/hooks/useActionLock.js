import { useRef } from 'react';

export function useActionLock() {
    const lockRef = useRef(false)

    const runOnce = async (fn) => {
        if (lockRef.current) return
        lockRef.current = true

        try {
            await fn()
        } finally {
            lockRef.current = false
        }
    }

    return { runOnce }
}
