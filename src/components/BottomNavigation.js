import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../constants/colors';
import { verticalScale, normalize, moderateScale } from '../utils/responsive';
import Icon from './Icon';

export default function BottomNavigation({ activeTab = 'home', onNavigate }) {
  const insets = useSafeAreaInsets();

  const tabs = [
    { id: 'home', icon: 'home', label: 'Início' },
    { id: 'categories', icon: 'categories', label: 'Categorias' },
    { id: 'cart', icon: 'cart', label: 'Carrinho' },
    { id: 'account', icon: 'account', label: 'Conta' },
  ];

  const handleTabPress = (tabId) => {
    if (onNavigate) {
      onNavigate(tabId);
    } else {
      console.log('Tab pressed:', tabId);
    }
  };

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, verticalScale(8)) }]}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={styles.tab}
          onPress={() => handleTabPress(tab.id)}
        >
          <Icon
            name={tab.icon}
            size={normalize(24)}
            color={activeTab === tab.id ? COLORS.primary : COLORS.textLight}
            style={styles.icon}
          />
          <Text
            style={[
              styles.label,
              activeTab === tab.id && styles.labelActive,
            ]}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray,
    paddingTop: verticalScale(8),
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: verticalScale(8),
  },
  icon: {
    marginBottom: verticalScale(4),
  },
  label: {
    fontSize: normalize(11),
    color: COLORS.textLight,
  },
  labelActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});
