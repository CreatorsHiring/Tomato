import React from 'react';
import { View, Text, TextInput, StyleSheet, ViewStyle } from 'react-native';
import { TomatoTheme } from '../constants/theme';

interface MedicineInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  style?: ViewStyle;
  error?: string;
}

export const MedicineInput: React.FC<MedicineInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  style,
  error,
}) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, error ? styles.inputError : null]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={TomatoTheme.colors.textMuted}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: TomatoTheme.colors.textSecondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: TomatoTheme.colors.cardBackground,
    borderWidth: 1.5,
    borderColor: TomatoTheme.colors.border,
    borderRadius: TomatoTheme.borderRadius.md,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: TomatoTheme.colors.textPrimary,
    fontWeight: '500',
  },
  inputError: {
    borderColor: TomatoTheme.colors.danger,
  },
  errorText: {
    color: TomatoTheme.colors.danger,
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
});
