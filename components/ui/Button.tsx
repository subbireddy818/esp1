import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    ViewStyle,
    TextStyle,
    View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { FontWeights, FontSizes } from '@/constants/typography';
import { BorderRadius, Spacing, Layout, Shadows } from '@/constants/spacing';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: ButtonVariant;
    size?: ButtonSize;
    disabled?: boolean;
    loading?: boolean;
    icon?: React.ReactNode;
    fullWidth?: boolean;
    style?: ViewStyle;
}

export function Button({
    title,
    onPress,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    icon,
    fullWidth = false,
    style,
}: ButtonProps) {
    const sizeStyles = getSizeStyles(size);
    const isDisabled = disabled || loading;

    if (variant === 'primary') {
        return (
            <TouchableOpacity
                onPress={onPress}
                disabled={isDisabled}
                activeOpacity={0.8}
                style={[fullWidth && { width: '100%' }, style]}
            >
                <LinearGradient
                    colors={isDisabled ? ['#333', '#444'] : [...Colors.gradientPrimary]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[
                        styles.base,
                        sizeStyles.container,
                        fullWidth && { width: '100%' },
                        !isDisabled && Shadows.neon,
                    ]}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color={Colors.background} />
                    ) : (
                        <View style={styles.content}>
                            {icon && <View style={styles.iconWrapper}>{icon}</View>}
                            <Text style={[styles.primaryText, sizeStyles.text]}>{title}</Text>
                        </View>
                    )}
                </LinearGradient>
            </TouchableOpacity>
        );
    }

    const variantStyles = getVariantStyles(variant, isDisabled);

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={isDisabled}
            activeOpacity={0.7}
            style={[
                styles.base,
                sizeStyles.container,
                variantStyles.container,
                fullWidth && { width: '100%' },
                style,
            ]}
        >
            {loading ? (
                <ActivityIndicator size="small" color={variantStyles.textColor} />
            ) : (
                <View style={styles.content}>
                    {icon && <View style={styles.iconWrapper}>{icon}</View>}
                    <Text style={[sizeStyles.text, { color: variantStyles.textColor, fontWeight: FontWeights.bold }]}>
                        {title}
                    </Text>
                </View>
            )}
        </TouchableOpacity>
    );
}

function getSizeStyles(size: ButtonSize): { container: ViewStyle; text: TextStyle } {
    switch (size) {
        case 'sm':
            return {
                container: { height: 38, paddingHorizontal: Spacing.md },
                text: { fontSize: FontSizes.sm },
            };
        case 'lg':
            return {
                container: { height: 56, paddingHorizontal: Spacing.xl },
                text: { fontSize: FontSizes.lg },
            };
        default:
            return {
                container: { height: Layout.buttonHeight, paddingHorizontal: Spacing.lg },
                text: { fontSize: FontSizes.base },
            };
    }
}

function getVariantStyles(variant: ButtonVariant, disabled: boolean) {
    if (disabled) {
        return {
            container: { backgroundColor: Colors.surfaceLight },
            textColor: Colors.textMuted,
        };
    }
    switch (variant) {
        case 'secondary':
            return {
                container: { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border },
                textColor: Colors.textPrimary,
            };
        case 'outline':
            return {
                container: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: Colors.primary },
                textColor: Colors.primary,
            };
        case 'ghost':
            return {
                container: { backgroundColor: 'transparent' },
                textColor: Colors.primary,
            };
        case 'danger':
            return {
                container: { backgroundColor: Colors.danger },
                textColor: Colors.textPrimary,
            };
        default:
            return {
                container: { backgroundColor: Colors.surface },
                textColor: Colors.textPrimary,
            };
    }
}

const styles = StyleSheet.create({
    base: {
        borderRadius: BorderRadius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    iconWrapper: {
        marginRight: 2,
    },
    primaryText: {
        color: Colors.background,
        fontWeight: FontWeights.extrabold,
        letterSpacing: 0.5,
    },
});
