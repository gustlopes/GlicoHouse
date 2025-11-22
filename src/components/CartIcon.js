import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useCart } from '../context/CartContext';
import Icon from './Icon';

export default function CartIcon({ onPress, iconSize = 22, iconColor = '#FFFFFF' }) {
  const { getCartCount } = useCart();
  const count = getCartCount();

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Icon name="cart" size={iconSize} color={iconColor} />
      {count > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{count > 99 ? '99+' : count}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    padding: 4,
  },
  icon: {
    fontSize: 22,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#DC3545',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
