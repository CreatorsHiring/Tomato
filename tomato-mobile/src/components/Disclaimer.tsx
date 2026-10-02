import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ShieldAlert } from 'lucide-react-native';
import { TomatoTheme } from '../constants/theme';

export const Disclaimer: React.FC = () => {
  return (
    <View style={styles.container}>
      <ShieldAlert size={16} color={TomatoTheme.colors.textMuted} />
      <Text style={styles.text}>
        Prototype screening result. Not a laboratory certification.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: TomatoTheme.borderRadius.md,
    backgroundColor: 'transparent',
    marginTop: 8,
  },
  text: {
    fontSize: 12,
    color: TomatoTheme.colors.textMuted,
    fontWeight: '500',
    textAlign: 'center',
  },
});
