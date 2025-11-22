import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../constants/colors';
import { normalize, scale, verticalScale } from '../utils/responsive';
import CartIcon from './CartIcon';
import Icon from './Icon';

export default function Header({ onSearchPress, onCartPress }) {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={[COLORS.gradientStart, COLORS.gradientEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.container, { paddingTop: insets.top + 12 }]}
    >
      <Text style={styles.logoText}>GlicoHouse</Text>
      <View style={styles.iconsContainer}>
        <TouchableOpacity style={styles.iconButton} onPress={onSearchPress}>
          <Icon name="search" size={normalize(24)} color={COLORS.white} />
        </TouchableOpacity>
        <CartIcon onPress={onCartPress} />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(16),
    paddingBottom: verticalScale(12),
  },
  logoText: {
    fontSize: normalize(20),
    fontWeight: 'bold',
    color: COLORS.white,
  },
  iconsContainer: {
    flexDirection: 'row',
    gap: scale(16),
  },
  iconButton: {
    padding: 4,
  },
});
