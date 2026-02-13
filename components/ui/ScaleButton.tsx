import React from 'react';
import {
    TouchableOpacity,
    TouchableOpacityProps,
    Animated,
    StyleSheet,
} from 'react-native';

interface ScaleButtonProps extends TouchableOpacityProps {
    scaleTo?: number;
    friction?: number;
    tension?: number;
    activeOpacity?: number;
}

export function ScaleButton({
    children,
    style,
    scaleTo = 0.96,
    activeOpacity = 0.9,
    onPressIn,
    onPressOut,
    ...props
}: ScaleButtonProps) {
    const scaleValue = React.useRef(new Animated.Value(1)).current;

    const handlePressIn = (e: any) => {
        Animated.spring(scaleValue, {
            toValue: scaleTo,
            useNativeDriver: true,
            friction: 9,
            tension: 40,
        }).start();
        onPressIn?.(e);
    };

    const handlePressOut = (e: any) => {
        Animated.spring(scaleValue, {
            toValue: 1,
            useNativeDriver: true,
            friction: 9,
            tension: 40,
        }).start();
        onPressOut?.(e);
    };

    return (
        <TouchableOpacity
            activeOpacity={activeOpacity}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={[style]}
            {...props}
        >
            <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
                {children}
            </Animated.View>
        </TouchableOpacity>
    );
}
