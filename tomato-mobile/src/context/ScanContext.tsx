import React, { createContext, useContext, useState } from 'react';
import { ScanState, WavelengthMeasurements, ClassificationResponse, HistoryItem } from '../types';

interface ScanContextType {
  scanState: ScanState;
  history: HistoryItem[];
  setMedicineInfo: (name: string, dosage: string, imageUri?: string | null) => void;
  setSensorMeasurements: (measurements: WavelengthMeasurements) => void;
  setScanResult: (result: ClassificationResponse) => void;
  resetScan: () => void;
}

const initialScanState: ScanState = {
  medicineName: 'Paracetamol',
  dosage: '500 mg',
  imageUri: null,
  sensorMeasurements: null,
  scanResult: null,
};

const initialHistory: HistoryItem[] = [
  {
    id: '1',
    medicineName: 'Paracetamol',
    dosage: '500 mg',
    result: 'reference_consistent',
    confidence: 0.94,
    timestamp: 'Today, 4:32 PM',
    measurements: {
      '405': 0.33443,
      '450': 0.45163,
      '530': 0.59159,
      '660': 0.64213,
      '850': 0.49823,
      '940': 0.43046,
    },
  },
  {
    id: '2',
    medicineName: 'Ibuprofen',
    dosage: '400 mg',
    result: 'substandard',
    confidence: 0.87,
    timestamp: 'Today, 3:18 PM',
    measurements: {
      '405': 0.28102,
      '450': 0.39211,
      '530': 0.48120,
      '660': 0.51044,
      '850': 0.38912,
      '940': 0.31201,
    },
  },
  {
    id: '3',
    medicineName: 'Paracetamol',
    dosage: '500 mg',
    result: 'different',
    confidence: 0.91,
    timestamp: 'Yesterday, 7:42 PM',
    measurements: {
      '405': 0.12033,
      '450': 0.18442,
      '530': 0.24011,
      '660': 0.29044,
      '850': 0.21098,
      '940': 0.19012,
    },
  },
];

const ScanContext = createContext<ScanContextType | undefined>(undefined);

export const ScanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [scanState, setScanState] = useState<ScanState>(initialScanState);
  const [history, setHistory] = useState<HistoryItem[]>(initialHistory);

  const setMedicineInfo = (name: string, dosage: string, imageUri: string | null = null) => {
    setScanState((prev) => ({
      ...prev,
      medicineName: name,
      dosage: dosage,
      imageUri: imageUri,
    }));
  };

  const setSensorMeasurements = (measurements: WavelengthMeasurements) => {
    setScanState((prev) => ({
      ...prev,
      sensorMeasurements: measurements,
    }));
  };

  const setScanResult = (result: ClassificationResponse) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setScanState((prev) => ({
      ...prev,
      scanResult: result,
      timestamp: `Today, ${timestamp}`,
    }));

    // Save to local history state
    if (scanState.sensorMeasurements) {
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        medicineName: scanState.medicineName,
        dosage: scanState.dosage,
        result: result.result,
        confidence: result.confidence,
        timestamp: `Today, ${timestamp}`,
        measurements: scanState.sensorMeasurements,
      };
      setHistory((prev) => [newItem, ...prev]);
    }
  };

  const resetScan = () => {
    setScanState(initialScanState);
  };

  return (
    <ScanContext.Provider
      value={{
        scanState,
        history,
        setMedicineInfo,
        setSensorMeasurements,
        setScanResult,
        resetScan,
      }}
    >
      {children}
    </ScanContext.Provider>
  );
};

export const useScanContext = () => {
  const context = useContext(ScanContext);
  if (!context) {
    throw new Error('useScanContext must be used within a ScanProvider');
  }
  return context;
};
