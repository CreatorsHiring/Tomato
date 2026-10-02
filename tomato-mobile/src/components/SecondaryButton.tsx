import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { TomatoTheme } from '../constants/theme';

interface SecondaryButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  title,
  onPress,
  disabled = false,
  style,
  textStyle,
  icon,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        disabled && styles.disabledButton,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {icon}
      <Text style={[styles.text, disabled && styles.disabledText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: TomatoTheme.colors.cardBackground,
    borderWidth: 1,
    borderColor: TomatoTheme.colors.border,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: TomatoTheme.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    ...TomatoTheme.shadows.soft,
  },
  disabledButton: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
  },
  text: {
    color: TomatoTheme.colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  disabledText: {
    color: '#94A3B8',
  },
});
