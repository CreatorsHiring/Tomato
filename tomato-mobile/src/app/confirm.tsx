import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { CheckCircle2 } from 'lucide-react-native';
import { PrimaryButton } from '../components/PrimaryButton';
import { MedicineCard } from '../components/MedicineCard';
import { useScanContext } from '../context/ScanContext';
import { TomatoTheme } from '../constants/theme';

export default function ConfirmScreen() {
  const router = useRouter();
  const { scanState } = useScanContext();

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Medicine Confirmed</Text>
      <Text style={styles.subtitle}>
        Please review the details below before preparing the physical sample.
      </Text>

      {/* Reassuring Medicine Card */}
      <MedicineCard
        medicineName={scanState.medicineName}
        dosage={scanState.dosage}
        imageUri={scanState.imageUri}
        style={styles.card}
      />

      {/* Checkmarks list */}
      <View style={styles.checklistCard}>
        <View style={styles.checkItem}>
          <CheckCircle2 size={20} color={TomatoTheme.colors.success} />
          <Text style={styles.checkText}>Medicine identified</Text>
        </View>

        <View style={styles.checkItem}>
          <CheckCircle2 size={20} color={TomatoTheme.colors.success} />
          <Text style={styles.checkText}>Dosage identified</Text>
        </View>
      </View>

      <PrimaryButton
        title="Confirm & Continue"
        onPress={() => router.push('/insert')}
        style={styles.continueBtn}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: TomatoTheme.spacing.lg,
    backgroundColor: TomatoTheme.colors.background,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: TomatoTheme.colors.textPrimary,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: TomatoTheme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: TomatoTheme.spacing.xl,
  },
  card: {
    marginBottom: TomatoTheme.spacing.lg,
  },
  checklistCard: {
    backgroundColor: TomatoTheme.colors.cardBackground,
    borderRadius: TomatoTheme.borderRadius.xl,
    padding: TomatoTheme.spacing.lg,
    borderWidth: 1,
    borderColor: TomatoTheme.colors.border,
    marginBottom: TomatoTheme.spacing.xl,
    gap: 14,
    ...TomatoTheme.shadows.soft,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkText: {
    fontSize: 15,
    fontWeight: '600',
    color: TomatoTheme.colors.textPrimary,
  },
  continueBtn: {
    marginTop: TomatoTheme.spacing.xs,
  },
});
