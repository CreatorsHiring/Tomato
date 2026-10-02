import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Camera, Image as ImageIcon, History, ChevronRight } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TomatoLogo } from '../components/TomatoLogo';
import { MedicineInput } from '../components/MedicineInput';
import { PrimaryButton } from '../components/PrimaryButton';
import { useScanContext } from '../context/ScanContext';
import { TomatoTheme } from '../constants/theme';

export default function DashboardScreen() {
  const router = useRouter();
  const { setMedicineInfo } = useScanContext();

  const [medicineName, setMedicineName] = useState('');
  const [dosage, setDosage] = useState('');
  const [errors, setErrors] = useState<{ medicine?: string; dosage?: string }>({});

  const handleManualContinue = () => {
    const newErrors: { medicine?: string; dosage?: string } = {};
    if (!medicineName.trim()) {
      newErrors.medicine = 'Medicine name is required';
    }
    if (!dosage.trim()) {
      newErrors.dosage = 'Dosage is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setMedicineInfo(medicineName, dosage);
    router.push('/confirm');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header with Logo and History Shortcut */}
        <View style={styles.headerRow}>
          <TomatoLogo size="lg" showSubtitle={true} />
          <TouchableOpacity
            style={styles.historyBtn}
            onPress={() => router.push('/history')}
            activeOpacity={0.7}
          >
            <History size={22} color={TomatoTheme.colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Hero description */}
        <View style={styles.heroSection}>
          <Text style={styles.heroDescription}>
            Screen your medicine with optical intelligence.
          </Text>
        </View>

        {/* Section title */}
        <Text style={styles.sectionTitle}>Identify Medicine</Text>

        {/* Identification Cards */}
        <View style={styles.cardsRow}>
          {/* Option A: Upload Photo */}
          <TouchableOpacity
            style={styles.optionCard}
            onPress={() => router.push('/upload')}
            activeOpacity={0.8}
          >
            <View style={styles.iconCircle}>
              <ImageIcon size={28} color={TomatoTheme.colors.primary} />
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>Upload Photo</Text>
              <Text style={styles.cardSubtitle}>
                Upload the back of your medicine strip
              </Text>
            </View>
            <ChevronRight size={20} color={TomatoTheme.colors.textMuted} />
          </TouchableOpacity>

          {/* Option B: Scan Photo */}
          <TouchableOpacity
            style={styles.optionCard}
            onPress={() => router.push('/camera')}
            activeOpacity={0.8}
          >
            <View style={styles.iconCircle}>
              <Camera size={28} color={TomatoTheme.colors.primary} />
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>Scan Photo</Text>
              <Text style={styles.cardSubtitle}>
                Capture the medicine strip using your camera
              </Text>
            </View>
            <ChevronRight size={20} color={TomatoTheme.colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Manual Entry Section */}
        <View style={styles.manualSection}>
          <Text style={styles.manualTitle}>Enter Medicine Manually</Text>

          <MedicineInput
            label="Medicine Name"
            placeholder="Paracetamol"
            value={medicineName}
            onChangeText={(text) => {
              setMedicineName(text);
              if (errors.medicine) setErrors((prev) => ({ ...prev, medicine: undefined }));
            }}
            error={errors.medicine}
          />

          <MedicineInput
            label="Dosage"
            placeholder="500 mg"
            value={dosage}
            onChangeText={(text) => {
              setDosage(text);
              if (errors.dosage) setErrors((prev) => ({ ...prev, dosage: undefined }));
            }}
            error={errors.dosage}
          />

          <PrimaryButton
            title="Continue"
            onPress={handleManualContinue}
            style={styles.continueBtn}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: TomatoTheme.colors.background,
  },
  container: {
    paddingHorizontal: TomatoTheme.spacing.lg,
    paddingTop: TomatoTheme.spacing.md,
    paddingBottom: TomatoTheme.spacing.xl,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: TomatoTheme.spacing.md,
  },
  historyBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: TomatoTheme.colors.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: TomatoTheme.colors.border,
    ...TomatoTheme.shadows.soft,
  },
  heroSection: {
    marginBottom: TomatoTheme.spacing.lg,
  },
  heroDescription: {
    fontSize: 16,
    color: TomatoTheme.colors.textSecondary,
    fontWeight: '500',
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: TomatoTheme.colors.textPrimary,
    marginBottom: TomatoTheme.spacing.md,
  },
  cardsRow: {
    gap: TomatoTheme.spacing.md,
    marginBottom: TomatoTheme.spacing.xl,
  },
  optionCard: {
    backgroundColor: TomatoTheme.colors.cardBackground,
    borderRadius: TomatoTheme.borderRadius.xl,
    padding: TomatoTheme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: TomatoTheme.colors.border,
    ...TomatoTheme.shadows.soft,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: TomatoTheme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: TomatoTheme.spacing.md,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: TomatoTheme.colors.textPrimary,
  },
  cardSubtitle: {
    fontSize: 13,
    color: TomatoTheme.colors.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },
  manualSection: {
    backgroundColor: TomatoTheme.colors.cardBackground,
    borderRadius: TomatoTheme.borderRadius.xl,
    padding: TomatoTheme.spacing.lg,
    borderWidth: 1,
    borderColor: TomatoTheme.colors.border,
    ...TomatoTheme.shadows.soft,
  },
  manualTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: TomatoTheme.colors.textPrimary,
    marginBottom: TomatoTheme.spacing.md,
  },
  continueBtn: {
    marginTop: TomatoTheme.spacing.sm,
  },
});
