// screens/History.js
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, SIZES, FONTS } from '../constants/config';
import { getTransactionHistory } from '../services/payment';
import Loader from '../components/Loader';

const STATUS_CONFIG = {
  success: { bg: '#D1FAE5', text: COLORS.success, label: 'Success', emoji: '✅' },
  pending: { bg: '#FEF3C7', text: '#92400E', label: 'Pending', emoji: '⏳' },
  failed: { bg: '#FEE2E2', text: COLORS.error, label: 'Failed', emoji: '❌' },
  processing: { bg: '#DBEAFE', text: '#1E40AF', label: 'Processing', emoji: '🔄' },
};

const getStatusConfig = (status) =>
  STATUS_CONFIG[status?.toLowerCase()] || STATUS_CONFIG.pending;

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }) + ', ' + d.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

const TransactionItem = ({ item }) => {
  const statusConf = getStatusConfig(item.status);

  return (
    <View style={styles.txCard}>
      <View style={styles.txLeft}>
        <View style={[styles.txIconBg, { backgroundColor: statusConf.bg }]}>
          <Text style={{ fontSize: 20 }}>{statusConf.emoji}</Text>
        </View>
        <View style={styles.txDetails}>
          <Text style={styles.txMerchant} numberOfLines={1}>
            {item.merchantId || item.merchant || 'Payment'}
          </Text>
          <Text style={styles.txDate}>{formatDate(item.createdAt || item.date)}</Text>
          {item.txnId && (
            <Text style={styles.txId} numberOfLines={1}>
              ID: {item.txnId}
            </Text>
          )}
        </View>
      </View>
      <View style={styles.txRight}>
        <Text style={styles.txAmount}>₹{Number(item.amount || 0).toFixed(2)}</Text>
        <View style={[styles.txStatusBadge, { backgroundColor: statusConf.bg }]}>
          <Text style={[styles.txStatusText, { color: statusConf.text }]}>
            {statusConf.label}
          </Text>
        </View>
      </View>
    </View>
  );
};

const FILTERS = ['All', 'Success', 'Pending', 'Failed'];

const History = ({ navigation }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('All');

  // const fetchTransactions = async () => {
  //   try {
  //     const data = await getTransactionHistory();
  //     setTransactions(data.transactions || data || []);
  //   } catch (error) {
  //     Alert.alert('Error', 'Failed to load transactions.');
  //   } finally {
  //     setLoading(false);
  //     setRefreshing(false);
  //   }
  // };

  const fetchTransactions = async () => {
  try {
    const data = await getTransactionHistory();

    console.log("TRANSACTION API RESPONSE:", data); // 🔥 debug

    // if (Array.isArray(data)) {
    //   setTransactions(data);
    // } else if (Array.isArray(data?.transactions)) {
    //   setTransactions(data.transactions);
    // } else if (Array.isArray(data?.data)) {
    //   setTransactions(data.data);
    // } else {
    //   console.log("INVALID DATA FORMAT:", data);
    //   setTransactions([]);
    // }
    if (Array.isArray(data?.data?.transactions)) {
  setTransactions(data.data.transactions);
} else {
  console.log("INVALID DATA FORMAT:", data);
  setTransactions([]);
}

  } catch (error) {
    Alert.alert('Error', 'Failed to load transactions.');
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
};


  useFocusEffect(
    useCallback(() => {
      fetchTransactions();
    }, [])
  );

  // const filtered = filter === 'All'
  //   ? transactions
  //   : transactions.filter((t) => t.status?.toLowerCase() === filter.toLowerCase());

  const safeTransactions = Array.isArray(transactions) ? transactions : [];

const filtered = filter === 'All'
  ? safeTransactions
  : safeTransactions.filter(
      (t) => t.status?.toLowerCase() === filter.toLowerCase()
    );

  const totalSuccess = transactions
    .filter((t) => t.status?.toLowerCase() === 'success')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  if (loading) return <Loader fullScreen message="Loading transactions..." />;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transaction History</Text>
        <TouchableOpacity
          style={styles.refreshBtn}
          onPress={() => { setRefreshing(true); fetchTransactions(); }}
        >
          <Text style={{ fontSize: 18 }}>↻</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Card */}
      <View style={styles.statsCard}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{transactions.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: COLORS.success }]}>
            {transactions.filter((t) => t.status?.toLowerCase() === 'success').length}
          </Text>
          <Text style={styles.statLabel}>Success</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: COLORS.primary }]}>
            ₹{totalSuccess.toFixed(0)}
          </Text>
          <Text style={styles.statLabel}>Total Paid</Text>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterTab, filter === f && styles.filterTabActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item._id || item.id || String(Math.random())}
        renderItem={({ item }) => <TransactionItem item={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); fetchTransactions(); }}
            tintColor={COLORS.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={{ fontSize: 48, marginBottom: 16 }}>📭</Text>
            <Text style={styles.emptyTitle}>No Transactions</Text>
            <Text style={styles.emptySubtitle}>
              {filter === 'All'
                ? 'Your transactions will appear here after your first payment.'
                : `No ${filter.toLowerCase()} transactions found.`}
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F5FF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    paddingTop: 56,
    paddingBottom: 16,
    paddingHorizontal: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 22,
    color: COLORS.text,
    fontWeight: FONTS.bold,
  },
  headerTitle: {
    fontSize: SIZES.lg,
    fontWeight: FONTS.bold,
    color: COLORS.text,
  },
  refreshBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: 12,
  },
  statValue: {
    fontSize: SIZES.xl,
    fontWeight: FONTS.bold,
    color: COLORS.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: SIZES.xs,
    color: COLORS.textLight,
    fontWeight: FONTS.medium,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 8,
  },
  filterTab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterTabActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterText: {
    fontSize: SIZES.sm,
    color: COLORS.textLight,
    fontWeight: FONTS.medium,
  },
  filterTextActive: {
    color: COLORS.white,
    fontWeight: FONTS.semiBold,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    flexGrow: 1,
  },
  txCard: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  txLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  txIconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  txDetails: {
    flex: 1,
  },
  txMerchant: {
    fontSize: SIZES.base,
    fontWeight: FONTS.semiBold,
    color: COLORS.text,
    marginBottom: 2,
  },
  txDate: {
    fontSize: 11,
    color: COLORS.textLight,
  },
  txId: {
    fontSize: 10,
    color: COLORS.gray400,
    marginTop: 2,
  },
  txRight: {
    alignItems: 'flex-end',
    marginLeft: 12,
  },
  txAmount: {
    fontSize: SIZES.lg,
    fontWeight: FONTS.bold,
    color: COLORS.text,
    marginBottom: 6,
  },
  txStatusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  txStatusText: {
    fontSize: 11,
    fontWeight: FONTS.semiBold,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: SIZES.xl,
    fontWeight: FONTS.bold,
    color: COLORS.text,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: SIZES.base,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default History;
