import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Upload, FileCode } from 'lucide-react-native';
import { TomatoTheme } from '../constants/theme';

interface UploadCardProps {
  title: string;
  subtitle: string;
  onPress: () => void;
  fileName?: string | null;
  style?: ViewStyle;
}

export const UploadCard: React.FC<UploadCardProps> = ({
  title,
  subtitle,
  onPress,
  fileName,
  style,
}) => {
  return (
    <TouchableOpacity style={[styles.card, style]} onPress={onPress} activeOpacity={0.75}>
      <View style={styles.iconContainer}>
        {fileName ? (
          <FileCode size={32} color={TomatoTheme.colors.success} />
        ) : (
          <Upload size={32} color={TomatoTheme.colors.primary} />
        )}
      </View>
      <Text style={styles.title}>{fileName ? fileName : title}</Text>
      <Text style={styles.subtitle}>{fileName ? 'File attached ✓' : subtitle}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: TomatoTheme.colors.cardBackground,
    borderWidth: 2,
    borderColor: TomatoTheme.colors.border,
    borderStyle: 'dashed',
    borderRadius: TomatoTheme.borderRadius.xl,
    padding: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: TomatoTheme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: TomatoTheme.colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: TomatoTheme.colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
});
