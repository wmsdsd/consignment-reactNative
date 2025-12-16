import React, { useEffect, useState } from 'react';
import {
    Keyboard,
    Platform,
    TouchableWithoutFeedback,
    KeyboardAvoidingView,
    Animated,
} from 'react-native';

export default function KeyboardWrapper({ children }) {
    const [keyboardHeight] = useState(new Animated.Value(0))
    
    useEffect(() => {
        const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow'
        const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide'
        
        const keyboardWillShowListener = Keyboard.addListener(showEvent, event => {
            Animated.timing(keyboardHeight, {
                duration: Platform.OS === 'ios' ? 250 : 200,
                toValue: event.endCoordinates.height,
                useNativeDriver: false,
            }).start()
        })
        
        const keyboardWillHideListener = Keyboard.addListener(hideEvent, () => {
            Animated.timing(keyboardHeight, {
                duration: Platform.OS === 'ios' ? 250 : 200,
                toValue: 0,
                useNativeDriver: false,
            }).start()
        })
        
        return () => {
            keyboardWillShowListener.remove()
            keyboardWillHideListener.remove()
        };
    }, [])
    
    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <Animated.View
                    style={{
                        flex: 1,
                        paddingBottom: Platform.OS === 'android' ? keyboardHeight : undefined,
                        transform:
                            Platform.OS === 'ios'
                                ? [
                                    {
                                        translateY: keyboardHeight.interpolate({
                                            inputRange: [0, 300],
                                            outputRange: [0, -10],
                                            extrapolate: 'clamp',
                                        }),
                                    },
                                ]
                                : undefined,
                    }}
                >
                    {children}
                </Animated.View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
}
