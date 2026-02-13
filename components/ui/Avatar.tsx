import React from 'react';
import { View, Image, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { Layout } from '@/constants/spacing';

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';
type TierLevel = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'conqueror';

interface AvatarProps {
    uri?: string;
    size?: AvatarSize;
    tier?: TierLevel;
    style?: ViewStyle;
}

const sizeMap: Record<AvatarSize, number> = {
    sm: Layout.avatarSm,
    md: Layout.avatarMd,
    lg: Layout.avatarLg,
    xl: Layout.avatarXl,
};

const tierGradients: Record<TierLevel, readonly [string, string]> = {
    bronze: [Colors.tierBronze, '#8B4513'] as const,
    silver: [Colors.tierSilver, '#808080'] as const,
    gold: [Colors.tierGold, '#FF8C00'] as const,
    platinum: [Colors.tierPlatinum, '#008B8B'] as const,
    diamond: [Colors.tierDiamond, '#00CED1'] as const,
    conqueror: [Colors.tierConqueror, '#FF0000'] as const,
};

export function Avatar({ uri, size = 'md', tier, style }: AvatarProps) {
    const dimension = sizeMap[size];
    const borderWidth = size === 'sm' ? 2 : 3;

    const avatarContent = (
        <View
            style={[
                styles.inner,
                {
                    width: dimension - borderWidth * 2,
                    height: dimension - borderWidth * 2,
                    borderRadius: (dimension - borderWidth * 2) / 2,
                },
            ]}
        >
            {uri ? (
                <Image
                    source={{ uri }}
                    style={{
                        width: dimension - borderWidth * 2,
                        height: dimension - borderWidth * 2,
                        borderRadius: (dimension - borderWidth * 2) / 2,
                    }}
                />
            ) : (
                <View
                    style={[
                        styles.placeholder,
                        {
                            width: dimension - borderWidth * 2,
                            height: dimension - borderWidth * 2,
                            borderRadius: (dimension - borderWidth * 2) / 2,
                        },
                    ]}
                />
            )}
        </View>
    );

    if (tier) {
        const gradient = tierGradients[tier];
        return (
            <LinearGradient
                colors={[...gradient]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[
                    {
                        width: dimension,
                        height: dimension,
                        borderRadius: dimension / 2,
                        padding: borderWidth,
                    },
                    style,
                ]}
            >
                {avatarContent}
            </LinearGradient>
        );
    }

    return (
        <View
            style={[
                {
                    width: dimension,
                    height: dimension,
                    borderRadius: dimension / 2,
                    borderWidth,
                    borderColor: Colors.border,
                    overflow: 'hidden',
                },
                style,
            ]}
        >
            {avatarContent}
        </View>
    );
}

const styles = StyleSheet.create({
    inner: {
        overflow: 'hidden',
    },
    placeholder: {
        backgroundColor: Colors.surfaceLight,
    },
});
