import React from 'react';
import { View, Text, StyleSheet, Image, ViewStyle } from 'react-native';
import { Pill } from 'lucide-react-native';
import { TomatoTheme } from '../constants/theme';

interface MedicineCardProps {
  medicineName: string;
  dosage: string;
  imageUri?: string | null;
  style?: ViewStyle;
}

export const MedicineCard: React.FC<MedicineCardProps> = ({
  medicineName,
  dosage,
  imageUri,
  style,
}) => {
  return (
    <View style={[styles.card, style]}>
      <View style={styles.contentRow}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.previewImage} />
        ) : (
          <View style={styles.iconBadge}>
            <Pill size={24} color={TomatoTheme.colors.primary} />
          </View>
        )}
        <View style={styles.infoContainer}>
          <Text style={styles.medicineName}>{medicineName.toUpperCase()}</Text>
          <Text style={styles.dosage}>{dosage}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: TomatoTheme.colors.cardBackground,
    borderRadius: TomatoTheme.borderRadius.lg,
    padding: 20,
    borderWidth: 1,
    borderColor: TomatoTheme.colors.border,
    ...TomatoTheme.shadows.soft,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  previewImage: {
    width: 52,
    height: 52,
    borderRadius: TomatoTheme.borderRadius.md,
    backgroundColor: TomatoTheme.colors.primaryLight,
  },
  iconBadge: {
    width: 52,
    height: 52,
    borderRadius: TomatoTheme.borderRadius.md,
    backgroundColor: TomatoTheme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
  },
  medicineName: {
    fontSize: 18,
    fontWeight: '800',
    color: TomatoTheme.colors.textPrimary,
    letterSpacing: 0.8,
  },
  dosage: {
    fontSize: 14,
    fontWeight: '600',
    color: TomatoTheme.colors.textSecondary,
    marginTop: 2,
  },
});
