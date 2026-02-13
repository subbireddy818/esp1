import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';
import { FontWeights } from '@/constants/typography';
import { BorderRadius, Spacing } from '@/constants/spacing';
import { TextStyles } from '@/constants/typography';

interface CountdownTimerProps {
    targetTime: Date;
    label?: string;
    onComplete?: () => void;
}

export function CountdownTimer({ targetTime, label, onComplete }: CountdownTimerProps) {
    const [timeLeft, setTimeLeft] = useState(getTimeLeft(targetTime));
    const completedRef = useRef(false);

    useEffect(() => {
        const timer = setInterval(() => {
            const left = getTimeLeft(targetTime);
            setTimeLeft(left);
            if (left.total <= 0 && !completedRef.current) {
                completedRef.current = true;
                clearInterval(timer);
                onComplete?.();
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [targetTime]);

    const pad = (n: number) => String(n).padStart(2, '0');

    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}
            <View style={styles.timerRow}>
                <TimeBlock value={pad(timeLeft.hours)} unit="HRS" />
                <Text style={styles.separator}>:</Text>
                <TimeBlock value={pad(timeLeft.minutes)} unit="MIN" />
                <Text style={styles.separator}>:</Text>
                <TimeBlock value={pad(timeLeft.seconds)} unit="SEC" />
            </View>
        </View>
    );
}

function TimeBlock({ value, unit }: { value: string; unit: string }) {
    return (
        <View style={styles.block}>
            <Text style={styles.blockValue}>{value}</Text>
            <Text style={styles.blockUnit}>{unit}</Text>
        </View>
    );
}

function getTimeLeft(target: Date) {
    const now = new Date().getTime();
    const total = Math.max(0, target.getTime() - now);
    return {
        total,
        hours: Math.floor(total / (1000 * 60 * 60)),
        minutes: Math.floor((total % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((total % (1000 * 60)) / 1000),
    };
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    label: {
        color: Colors.textMuted,
        fontSize: 10,
        fontWeight: FontWeights.bold,
        letterSpacing: 1.5,
        textTransform: 'uppercase',
        marginBottom: Spacing.sm,
    },
    timerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
    },
    block: {
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        borderColor: Colors.borderAccent,
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.md,
        alignItems: 'center',
        minWidth: 54,
    },
    blockValue: {
        ...TextStyles.monoLg,
        color: Colors.primary,
    },
    blockUnit: {
        color: Colors.textMuted,
        fontSize: 8,
        fontWeight: FontWeights.bold,
        letterSpacing: 1,
        marginTop: 2,
    },
    separator: {
        ...TextStyles.monoLg,
        color: Colors.primary,
        marginHorizontal: 2,
    },
});
