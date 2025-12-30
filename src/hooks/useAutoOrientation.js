import * as ScreenOrientation from 'expo-screen-orientation';
import { useEffect } from 'react';

export function useAutoOrientation() {
    useEffect(() => {
        // 🔓 가로/세로 자동 허용
        ScreenOrientation.unlockAsync()

        return () => {
            // 🔒 화면 나가면 다시 세로 고정
            ScreenOrientation.lockAsync(
                ScreenOrientation.OrientationLock.PORTRAIT
            );
        };
    }, [])
}
