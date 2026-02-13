import React from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { StatusBar } from 'expo-status-bar';

interface GradientBackgroundProps {
    children: React.ReactNode;
    colors?: readonly string[];
}

export function GradientBackground({
    children,
    colors,
}: GradientBackgroundProps) {
    return (
        <LinearGradient
            colors={Colors.gradientDark}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >
            {children}
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
