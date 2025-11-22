import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { COLORS } from '../constants/colors';

export default function CategoryCard({ category, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: category.color }]}
      onPress={onPress}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{category.icon}</Text>
      </View>
      <Text style={styles.name}>{category.name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 90,
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginRight: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  icon: {
    fontSize: 24,
  },
  name: {
    fontSize: 11,
    color: COLORS.text,
    textAlign: 'center',
    fontWeight: '500',
  },
});
