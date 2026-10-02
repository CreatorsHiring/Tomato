# TOMATO — Tiny Lab Technician (Mobile UI)

**TOMATO** is a preliminary medicine screening application designed to work with an optical laboratory technician device. It analyzes medicine dissolved in liquid across 6 light wavelengths to produce a unique optical fingerprint and verify medicine consistency.

This mobile application built with **React Native**, **Expo Router**, and **TypeScript** provides a modern, clean, hackathon-ready user interface for scanning medicine and inspecting optical spectra.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Application
```bash
npm start
```
You can run the app in **Expo Go**, an **Android Emulator**, an **iOS Simulator**, or on **Web** (`npm run web`).

---

## 📱 App Architecture & Component Breakdown

### 🎨 Core Components (`src/components/`)

- **`TomatoLogo.tsx`**: Prominently displays the TOMATO brand wordmark and emblem with custom styling.
- **`DummyTomato.tsx`**: Interactive visual representation of the physical Tomato device. Animated with liquid rotation, tablet dissolving chamber, and active pulsing LED dots corresponding to current light wavelengths.
- **`WavelengthBar.tsx`**: Horizontal bar visualizer for individual optical wavelength readings (405 nm, 450 nm, 530 nm, 660 nm, 850 nm, 940 nm). Highlights active readings and displays exact absorbance values.
- **`ScanProgress.tsx`**: Real-time progress bar showing active scanning steps (1 / 6 through 6 / 6) and status messages ("Building optical fingerprint...", "Analyzing sample...").
- **`ResultCard.tsx`**: Comprehensive result summary displaying match classification (`Reference-Consistent`, `Possible Substandard`, or `Different From Expected`), model confidence percentage, status banner, and complete 6-bar optical fingerprint.
- **`MedicineCard.tsx`**: Clean card summarizing identified medicine name, dosage strength, and captured strip photo preview.
- **`MedicineInput.tsx`**: Input field component for medicine name and dosage entry with validation error handling.
- **`UploadCard.tsx`**: Dashed interactive upload container for attaching strip photos and simulated sensor JSON data.
- **`PrimaryButton.tsx`**: Main CTA button with Tomato red styling, hover states, loading indicator, and optional icon support.
- **`SecondaryButton.tsx`**: Light outline button for secondary actions.
- **`Disclaimer.tsx`**: Footer notification reminding users that the result is a prototype screening readout rather than a certified lab test.

---

## 🛣️ Screen Routes (`src/app/`)

- **`index.tsx` (Dashboard)**: First screen featuring TOMATO branding, short description, photo identification options (Upload / Scan), manual input fields, and history navigation.
- **`upload.tsx` (Upload Photo)**: Screen to select a photo of the medicine strip from the device library via `expo-image-picker`.
- **`camera.tsx` (Scan Photo)**: Viewfinder overlay screen for capturing a photo of the medicine strip.
- **`manual.tsx` (Enter Medicine)**: Dedicated screen for manual input of medicine name and dosage with field validation.
- **`confirm.tsx` (Medicine Confirmation)**: Reassuring review screen showing confirmed medicine details and readiness checkmarks.
- **`insert.tsx` (Place Tablet)**: Visual guide instructing the user to drop the tablet into Tomato, plus a demo upload card to attach simulated 6-wavelength JSON sensor measurements.
- **`scan.tsx` (TOMATO SCAN)**: The core scanning screen that sequentially animates through all 6 optical LED wavelengths (405nm → 940nm) with stirring animations.
- **`result.tsx` (Scan Complete)**: Screen presenting the final classification result, confidence level %, horizontal wavelength spectrum bars, and disclaimer.
- **`history.tsx` (Scan History)**: Log of previous medicine screening tests with result badges and timestamps.

---

## 🧠 State Management & API Abstraction

- **`src/context/ScanContext.tsx`**: Central React context maintaining current scan state (`medicineName`, `dosage`, `imageUri`, `sensorMeasurements`, `scanResult`) and maintaining local scan history.
- **`src/services/classifier.ts`**: Pure TypeScript mock classification service that calculates optical fingerprint ratios across the 6 wavelengths to return classification outputs.
- **`src/services/api.ts`**: API service layer abstraction ready for future FastAPI migration (`POST /api/scan`).

---

## 🔮 Future Hardware Migration Path

Currently, sensor data is loaded via demo JSON files. The app architecture is structured so that when physical hardware is integrated, the data pipeline smoothly transitions to:

```
Physical Tomato Device -> ESP32 Wi-Fi -> FastAPI Backend (/api/scan) -> SVM Classification Model -> Mobile App UI
```
