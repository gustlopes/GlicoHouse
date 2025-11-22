import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/colors';

export default function StatsBar({ stats }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.statItem}>
        <Text style={styles.statValue}>{stats?.pendingOrders || 0}</Text>
        <Text style={styles.statLabel}>Pedidos Pendentes</Text>
      </TouchableOpacity>

      <View style={styles.divider} />

      <TouchableOpacity style={styles.statItem}>
        <Text style={styles.statValue}>{stats?.pendingDeliveries || 0}</Text>
        <Text style={styles.statLabel}>Entregas Pendentes</Text>
      </TouchableOpacity>

      <View style={styles.divider} />

      <TouchableOpacity style={styles.statItem}>
        <Text style={styles.statValue}>{stats?.cashback || 0}</Text>
        <Text style={styles.statLabel}>Cashback</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.gray,
  },
});
