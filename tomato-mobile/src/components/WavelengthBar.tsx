import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TomatoTheme } from '../constants/theme';

interface WavelengthBarProps {
  wavelength: string;
  value: number;
  maxValue?: number;
  isActive?: boolean;
  isComplete?: boolean;
}

const wavelengthColors: Record<string, string> = {
  '405': '#8B5CF6',
  '450': '#3B82F6',
  '530': '#10B981',
  '660': '#EF4444',
  '850': '#B91C1C',
  '940': '#991B1B',
};

export const WavelengthBar: React.FC<WavelengthBarProps> = ({
  wavelength,
  value,
  maxValue = 1.0,
  isActive = false,
  isComplete = false,
}) => {
  const percentage = Math.min(Math.max((value / maxValue) * 100, 5), 100);
  const color = wavelengthColors[wavelength] || TomatoTheme.colors.primary;

  return (
    <View style={[styles.container, isActive && styles.activeContainer]}>
      <View style={styles.labelRow}>
        <View style={styles.leftLabel}>
          <View style={[styles.colorBadge, { backgroundColor: color }]} />
          <Text style={[styles.wavelengthText, isActive && styles.activeText]}>
            {wavelength} nm
          </Text>
          {isComplete && <Text style={styles.checkMark}>✓</Text>}
        </View>
        <Text style={styles.valueText}>{value.toFixed(3)}</Text>
      </View>
      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            {
              width: `${percentage}%`,
              backgroundColor: color,
            },
            isActive && styles.activeFill,
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
    padding: 10,
    borderRadius: TomatoTheme.borderRadius.md,
    backgroundColor: 'transparent',
  },
  activeContainer: {
    backgroundColor: TomatoTheme.colors.cardBackground,
    borderWidth: 1,
    borderColor: TomatoTheme.colors.border,
    ...TomatoTheme.shadows.soft,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  leftLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  colorBadge: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  wavelengthText: {
    fontSize: 14,
    fontWeight: '600',
    color: TomatoTheme.colors.textSecondary,
  },
  activeText: {
    color: TomatoTheme.colors.textPrimary,
    fontWeight: '700',
  },
  checkMark: {
    fontSize: 12,
    color: TomatoTheme.colors.success,
    fontWeight: '800',
  },
  valueText: {
    fontSize: 14,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    color: TomatoTheme.colors.textPrimary,
  },
  track: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E2E8F0',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
  activeFill: {
    opacity: 1,
  },
});
