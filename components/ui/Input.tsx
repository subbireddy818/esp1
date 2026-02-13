import React, { useState } from 'react';
import {
    View,
    TextInput,
    Text,
    StyleSheet,
    ViewStyle,
    TextInputProps,
    Animated,
} from 'react-native';
import { Colors } from '@/constants/colors';
import { FontSizes, FontWeights } from '@/constants/typography';
import { BorderRadius, Spacing, Layout } from '@/constants/spacing';

interface InputProps extends TextInputProps {
    label: string;
    error?: string;
    icon?: React.ReactNode;
    containerStyle?: ViewStyle;
}

export function Input({
    label,
    error,
    icon,
    containerStyle,
    value,
    onFocus,
    onBlur,
    ...rest
}: InputProps) {
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = value && value.length > 0;

    return (
        <View style={[styles.container, containerStyle]}>
            <View
                style={[
                    styles.inputWrapper,
                    isFocused && styles.focused,
                    error && styles.errorBorder,
                ]}
            >
                {icon && <View style={styles.iconContainer}>{icon}</View>}
                <View style={styles.inputInner}>
                    <Text
                        style={[
                            styles.label,
                            (isFocused || hasValue) && styles.labelActive,
                        ]}
                    >
                        {label}
                    </Text>
                    <TextInput
                        value={value}
                        placeholderTextColor={Colors.textMuted}
                        style={[
                            styles.input,
                            icon ? { paddingLeft: 0 } : {},
                        ]}
                        onFocus={(e) => {
                            setIsFocused(true);
                            onFocus?.(e);
                        }}
                        onBlur={(e) => {
                            setIsFocused(false);
                            onBlur?.(e);
                        }}
                        {...rest}
                    />
                </View>
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: Spacing.base,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.lg,
        borderWidth: 1.5,
        borderColor: Colors.border,
        minHeight: Layout.inputHeight,
        paddingHorizontal: Spacing.base,
    },
    focused: {
        borderColor: Colors.primary,
        backgroundColor: Colors.surfaceLight,
    },
    errorBorder: {
        borderColor: Colors.danger,
    },
    iconContainer: {
        marginRight: Spacing.md,
    },
    inputInner: {
        flex: 1,
        justifyContent: 'center',
    },
    label: {
        position: 'absolute',
        top: 16,
        left: 0,
        color: Colors.textMuted,
        fontSize: FontSizes.base,
        fontWeight: FontWeights.medium,
    },
    labelActive: {
        top: 6,
        fontSize: FontSizes.xs,
        color: Colors.primary,
        fontWeight: FontWeights.semibold,
    },
    input: {
        color: Colors.textPrimary,
        fontSize: FontSizes.base,
        fontWeight: FontWeights.medium,
        paddingTop: 18,
        paddingBottom: 4,
        height: Layout.inputHeight - 3,
    },
    errorText: {
        color: Colors.danger,
        fontSize: FontSizes.xs,
        marginTop: Spacing.xs,
        marginLeft: Spacing.xs,
    },
});
