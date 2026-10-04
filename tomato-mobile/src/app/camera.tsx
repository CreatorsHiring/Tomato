import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { ImageResult } from 'expo-image-manipulator';
import { Camera as CameraIcon, RefreshCw, Crop as CropIcon, Sparkles, ArrowRight } from 'lucide-react-native';
import { PrimaryButton } from '../components/PrimaryButton';
import { SecondaryButton } from '../components/SecondaryButton';
import { MedicineInput } from '../components/MedicineInput';
import { useScanContext } from '../context/ScanContext';
import { analyzeMedicineImage } from '../services/api';
import { TomatoTheme } from '../constants/theme';

export default function CameraScreen() {
  const router = useRouter();
  const { setMedicineInfo } = useScanContext();

  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [medicineName, setMedicineName] = useState('');
  const [dosage, setDosage] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isCropping, setIsCropping] = useState(false);
  const [errors, setErrors] = useState<{ medicine?: string; dosage?: string }>({});

  const processOcrOnImage = async (uri: string) => {
    setIsAnalyzing(true);
    try {
      const ocrData = await analyzeMedicineImage(uri);
      if (ocrData && ocrData.medicine_name) {
        setMedicineName(ocrData.medicine_name);
        setDosage(ocrData.dosage);
      }
    } catch (e) {
      console.warn('OCR error:', e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCapture = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      alert('Camera permission is required to capture photos!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true, // Native picker crop interface
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setCapturedImage(uri);
      await processOcrOnImage(uri);
    }
  };

  const handleCropImage = async () => {
    if (!capturedImage) return;

    setIsCropping(true);
    try {
      // Load image metadata to compute a proper centered crop
      const imgInfo: ImageResult = await ImageManipulator.manipulateAsync(
        capturedImage,
        [], // no transforms — just resolve metadata / current dimensions
        { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
      );

      const { width: imgW, height: imgH } = imgInfo;

      // Compute a centered 4:3 crop covering 80% of the shorter dimension
      const targetAspect = 4 / 3;
      let cropW: number;
      let cropH: number;

      if (imgW / imgH > targetAspect) {
        // Image is wider than 4:3 → constrain by height
        cropH = Math.floor(imgH * 0.8);
        cropW = Math.floor(cropH * targetAspect);
      } else {
        // Image is taller than 4:3 → constrain by width
        cropW = Math.floor(imgW * 0.8);
        cropH = Math.floor(cropW / targetAspect);
      }

      const originX = Math.floor((imgW - cropW) / 2);
      const originY = Math.floor((imgH - cropH) / 2);

      const manipResult: ImageResult = await ImageManipulator.manipulateAsync(
        capturedImage,
        [{ crop: { originX, originY, width: cropW, height: cropH } }],
        { compress: 0.9, format: ImageManipulator.SaveFormat.JPEG }
      );

      setCapturedImage(manipResult.uri);
      await processOcrOnImage(manipResult.uri);
    } catch (e) {
      console.warn('Crop error:', e);
    } finally {
      setIsCropping(false);
    }
  };

  const handleContinue = () => {
    if (!medicineName.trim() || !dosage.trim()) {
      setErrors({
        medicine: !medicineName.trim() ? 'Medicine name is required' : undefined,
        dosage: !dosage.trim() ? 'Dosage is required' : undefined,
      });
      return;
    }

    setMedicineInfo(medicineName, dosage, capturedImage);
    router.push('/insert');
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {!capturedImage ? (
        <View style={styles.viewfinderContainer}>
          <Text style={styles.instructionText}>
            Position the medicine strip clearly inside the frame.
          </Text>

          {/* Viewfinder Frame */}
          <View style={styles.cameraPreview}>
            <View style={styles.scanFrame}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
              <CameraIcon size={40} color={TomatoTheme.colors.primary} opacity={0.6} />
              <Text style={styles.frameHint}>Position Strip Here</Text>
            </View>
          </View>

          <PrimaryButton
            title="Capture Photo"
            onPress={handleCapture}
            icon={<CameraIcon size={20} color="#FFFFFF" />}
            style={styles.captureBtn}
          />
        </View>
      ) : (
        <View style={styles.reviewContainer}>
          <Text style={styles.instructionText}>Captured & Cropped Medicine Strip:</Text>

          <View style={styles.previewBox}>
            <Image source={{ uri: capturedImage }} style={styles.capturedImage} />
            
            {/* Quick Action Badges */}
            <View style={styles.badgeRow}>
              <TouchableOpacity style={styles.actionBadge} onPress={handleCropImage} disabled={isCropping}>
                {isCropping ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <>
                    <CropIcon size={16} color="#FFFFFF" />
                    <Text style={styles.badgeText}>Crop Photo</Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionBadge} onPress={handleCapture}>
                <RefreshCw size={16} color="#FFFFFF" />
                <Text style={styles.badgeText}>Retake</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.formCard}>
            <View style={styles.titleRow}>
              <Text style={styles.formTitle}>Identified Medicine Details</Text>
              {isAnalyzing && (
                <View style={styles.aiBadge}>
                  <Sparkles size={14} color={TomatoTheme.colors.primary} />
                  <Text style={styles.aiText}>AI Analyzing...</Text>
                </View>
              )}
            </View>

            <MedicineInput
              label="Medicine (Active Ingredient)"
              placeholder="e.g. Paracetamol"
              value={medicineName}
              onChangeText={(text) => {
                setMedicineName(text);
                if (errors.medicine) setErrors((prev) => ({ ...prev, medicine: undefined }));
              }}
              error={errors.medicine}
            />

            <MedicineInput
              label="Dosage"
              placeholder="e.g. 500 mg"
              value={dosage}
              onChangeText={(text) => {
                setDosage(text);
                if (errors.dosage) setErrors((prev) => ({ ...prev, dosage: undefined }));
              }}
              error={errors.dosage}
            />
          </View>

          {/* Action Row */}
          <View style={styles.actionRow}>
            <SecondaryButton
              title="Crop Photo"
              onPress={handleCropImage}
              icon={<CropIcon size={18} color={TomatoTheme.colors.textPrimary} />}
              style={styles.cropBtn}
            />
            <PrimaryButton
              title="Proceed"
              onPress={handleContinue}
              loading={isAnalyzing}
              disabled={!medicineName.trim() || !dosage.trim()}
              icon={<ArrowRight size={18} color="#FFFFFF" />}
              style={styles.proceedBtn}
            />
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: TomatoTheme.spacing.lg,
    backgroundColor: TomatoTheme.colors.background,
  },
  instructionText: {
    fontSize: 15,
    color: TomatoTheme.colors.textSecondary,
    lineHeight: 22,
    marginBottom: TomatoTheme.spacing.lg,
    textAlign: 'center',
  },
  viewfinderContainer: {
    alignItems: 'center',
  },
  cameraPreview: {
    width: '100%',
    height: 280,
    borderRadius: TomatoTheme.borderRadius.xl,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: TomatoTheme.spacing.xl,
    overflow: 'hidden',
  },
  scanFrame: {
    width: '80%',
    height: '70%',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: TomatoTheme.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  frameHint: {
    color: '#94A3B8',
    fontSize: 13,
    marginTop: 8,
    fontWeight: '500',
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: TomatoTheme.colors.primary,
  },
  topLeft: { top: -2, left: -2, borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: 8 },
  topRight: { top: -2, right: -2, borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: 8 },
  bottomLeft: { bottom: -2, left: -2, borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: 8 },
  bottomRight: { bottom: -2, right: -2, borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: 8 },
  captureBtn: {
    width: '100%',
  },
  reviewContainer: {
    width: '100%',
  },
  previewBox: {
    position: 'relative',
    marginBottom: TomatoTheme.spacing.lg,
  },
  capturedImage: {
    width: '100%',
    height: 220,
    borderRadius: TomatoTheme.borderRadius.xl,
  },
  badgeRow: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    gap: 8,
  },
  actionBadge: {
    backgroundColor: 'rgba(0,0,0,0.75)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: TomatoTheme.borderRadius.full,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  formCard: {
    backgroundColor: TomatoTheme.colors.cardBackground,
    borderRadius: TomatoTheme.borderRadius.xl,
    padding: TomatoTheme.spacing.lg,
    borderWidth: 1,
    borderColor: TomatoTheme.colors.border,
    marginBottom: TomatoTheme.spacing.lg,
    ...TomatoTheme.shadows.soft,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: TomatoTheme.spacing.md,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: TomatoTheme.colors.textPrimary,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: TomatoTheme.colors.primaryLight,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: TomatoTheme.borderRadius.sm,
  },
  aiText: {
    fontSize: 12,
    fontWeight: '600',
    color: TomatoTheme.colors.primary,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  cropBtn: {
    flex: 1,
  },
  proceedBtn: {
    flex: 1.2,
  },
});
