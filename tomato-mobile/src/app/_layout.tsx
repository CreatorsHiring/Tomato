import React from 'react';
import { Stack } from 'expo-router';
import { ScanProvider } from '../context/ScanContext';
import { TomatoTheme } from '../constants/theme';

export default function RootLayout() {
  return (
    <ScanProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: TomatoTheme.colors.background,
          },
          headerShadowVisible: false,
          headerTitleStyle: {
            fontWeight: '700',
            color: TomatoTheme.colors.textPrimary,
          },
          headerTintColor: TomatoTheme.colors.primary,
          contentStyle: {
            backgroundColor: TomatoTheme.colors.background,
          },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="upload" options={{ headerTitle: 'Identify Medicine' }} />
        <Stack.Screen name="camera" options={{ headerTitle: 'Scan Medicine Strip' }} />
        <Stack.Screen name="manual" options={{ headerTitle: 'Enter Medicine' }} />
        <Stack.Screen name="confirm" options={{ headerTitle: 'Medicine Confirmation' }} />
        <Stack.Screen name="insert" options={{ headerTitle: 'Place Tablet' }} />
        <Stack.Screen name="scan" options={{ headerTitle: 'TOMATO SCAN', headerLeft: () => null }} />
        <Stack.Screen name="result" options={{ headerTitle: 'Scan Complete', headerLeft: () => null }} />
        <Stack.Screen name="history" options={{ headerTitle: 'Scan History' }} />
      </Stack>
    </ScanProvider>
  );
}
