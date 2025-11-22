import React from 'react';
import { Ionicons, MaterialIcons, Feather, FontAwesome5, AntDesign } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

/**
 * Componente de ícone centralizado
 * Mapeia nomes de ícones para suas respectivas bibliotecas
 */
export default function Icon({ name, size = 24, color = COLORS.text, style }) {
  const iconMap = {
    // Navigation
    'home': { Component: Ionicons, name: 'home' },
    'categories': { Component: Ionicons, name: 'grid' },
    'cart': { Component: Ionicons, name: 'cart' },
    'account': { Component: Ionicons, name: 'person' },

    // Actions
    'search': { Component: Ionicons, name: 'search' },
    'back': { Component: Ionicons, name: 'arrow-back' },
    'close': { Component: Ionicons, name: 'close' },
    'add': { Component: Ionicons, name: 'add' },
    'remove': { Component: Ionicons, name: 'remove' },
    'delete': { Component: Ionicons, name: 'trash' },
    'arrow-forward': { Component: Ionicons, name: 'arrow-forward' },
    'chevron-down': { Component: Ionicons, name: 'chevron-down' },

    // Products & Store
    'box': { Component: Feather, name: 'package' },
    'tag': { Component: Feather, name: 'tag' },
    'truck': { Component: Feather, name: 'truck' },
    'shopping-bag': { Component: Feather, name: 'shopping-bag' },
    'gift': { Component: Feather, name: 'gift' },

    // Categories
    'monitor': { Component: Ionicons, name: 'phone-portrait' },
    'medical': { Component: FontAwesome5, name: 'stethoscope' },
    'lancet': { Component: FontAwesome5, name: 'syringe' },
    'document': { Component: Ionicons, name: 'document-text' },
    'pill': { Component: FontAwesome5, name: 'pills' },
    'apple': { Component: Ionicons, name: 'nutrition' },
    'all': { Component: Ionicons, name: 'apps' },

    // Features
    'shield': { Component: Ionicons, name: 'shield-checkmark' },
    'clock': { Component: Ionicons, name: 'time' },
    'award': { Component: Ionicons, name: 'trophy' },
    'check': { Component: Ionicons, name: 'checkmark-circle' },
    'heart': { Component: Ionicons, name: 'heart' },
    'star': { Component: Ionicons, name: 'star' },

    // User & Account
    'user': { Component: Ionicons, name: 'person' },
    'login': { Component: Ionicons, name: 'log-in' },
    'logout': { Component: Ionicons, name: 'log-out' },
    'eye': { Component: Ionicons, name: 'eye' },
    'eye-off': { Component: Ionicons, name: 'eye-off' },

    // Payment
    'card': { Component: Ionicons, name: 'card' },

    // Order Tracking
    'check-circle': { Component: Ionicons, name: 'checkmark-circle' },
    'location': { Component: Ionicons, name: 'location' },
    'package-check': { Component: FontAwesome5, name: 'box' },

    // Consultation
    'calendar': { Component: Ionicons, name: 'calendar' },
    'notification': { Component: Ionicons, name: 'notifications' },
    'info': { Component: Ionicons, name: 'information-circle' },

    // Misc
    'settings': { Component: Ionicons, name: 'settings' },
    'filter': { Component: Ionicons, name: 'filter' },
  };

  const iconConfig = iconMap[name];

  if (!iconConfig) {
    console.warn(`Icon "${name}" not found in icon map`);
    return null;
  }

  const { Component, name: iconName } = iconConfig;

  return <Component name={iconName} size={size} color={color} style={style} />;
}
