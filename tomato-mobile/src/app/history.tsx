import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { CheckCircle2, AlertTriangle, XCircle, ChevronRight } from 'lucide-react-native';
import { useScanContext } from '../context/ScanContext';
import { HistoryItem, ResultType } from '../types';
import { TomatoTheme } from '../constants/theme';
import { SecondaryButton } from '../components/SecondaryButton';

export default function HistoryScreen() {
  const router = useRouter();
  const { history } = useScanContext();

  const getResultBadge = (result: ResultType) => {
    switch (result) {
      case 'reference_consistent':
        return {
          label: 'Reference-Consistent',
          color: TomatoTheme.colors.success,
          bgColor: TomatoTheme.colors.successLight,
          icon: <CheckCircle2 size={16} color={TomatoTheme.colors.success} />,
        };
      case 'substandard':
        return {
          label: 'Possible Substandard',
          color: TomatoTheme.colors.warning,
          bgColor: TomatoTheme.colors.warningLight,
          icon: <AlertTriangle size={16} color={TomatoTheme.colors.warning} />,
        };
      case 'different':
        return {
          label: 'Different From Expected',
          color: TomatoTheme.colors.danger,
          bgColor: TomatoTheme.colors.dangerLight,
          icon: <XCircle size={16} color={TomatoTheme.colors.danger} />,
        };
    }
  };

  const renderHistoryItem = ({ item }: { item: HistoryItem }) => {
    const badge = getResultBadge(item.result);

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.medicineName}>{item.medicineName}</Text>
            <Text style={styles.dosage}>{item.dosage}</Text>
          </View>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>

        <View style={styles.cardFooter}>
          <View style={[styles.badge, { backgroundColor: badge.bgColor }]}>
            {badge.icon}
            <Text style={[styles.badgeText, { color: badge.color }]}>{badge.label}</Text>
          </View>
          <Text style={styles.confidenceText}>{Math.round(item.confidence * 100)}% Match</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {history.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No Scan History</Text>
          <Text style={styles.emptySubtitle}>Completed medicine scans will appear here.</Text>
          <SecondaryButton title="Start First Scan" onPress={() => router.push('/')} />
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={renderHistoryItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: TomatoTheme.colors.background,
  },
  listContainer: {
    padding: TomatoTheme.spacing.lg,
    gap: TomatoTheme.spacing.md,
  },
  card: {
    backgroundColor: TomatoTheme.colors.cardBackground,
    borderRadius: TomatoTheme.borderRadius.xl,
    padding: TomatoTheme.spacing.lg,
    borderWidth: 1,
    borderColor: TomatoTheme.colors.border,
    ...TomatoTheme.shadows.soft,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  medicineName: {
    fontSize: 17,
    fontWeight: '700',
    color: TomatoTheme.colors.textPrimary,
  },
  dosage: {
    fontSize: 13,
    fontWeight: '600',
    color: TomatoTheme.colors.textSecondary,
    marginTop: 2,
  },
  timestamp: {
    fontSize: 12,
    color: TomatoTheme.colors.textMuted,
    fontWeight: '500',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: TomatoTheme.colors.border,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: TomatoTheme.borderRadius.full,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  confidenceText: {
    fontSize: 13,
    fontWeight: '600',
    color: TomatoTheme.colors.textSecondary,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: TomatoTheme.spacing.xl,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: TomatoTheme.colors.textPrimary,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: TomatoTheme.colors.textSecondary,
    marginBottom: TomatoTheme.spacing.lg,
    textAlign: 'center',
  },
});
