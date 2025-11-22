import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/colors';
import { normalize } from '../utils/responsive';
import Icon from './Icon';

export default function FreeShippingBanner({ minValue = 149 }) {
  return (
    <View style={styles.wrapper}>
      <TouchableOpacity activeOpacity={0.8}>
        <LinearGradient
          colors={[COLORS.gradientStart, COLORS.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.container}
        >
          <View style={styles.content}>
            <View style={styles.textContainer}>
              <Text style={styles.title}>Frete Grátis</Text>
              <Text style={styles.subtitle}>
                Em compras acima de R$ {minValue}
              </Text>
            </View>
            <View style={styles.iconContainer}>
              <Icon name="truck" size={normalize(32)} color={COLORS.white} />
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 16,
    marginVertical: 12,
  },
  container: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.white,
    opacity: 0.95,
  },
  iconContainer: {
    marginLeft: 12,
  },
  icon: {
    fontSize: 32,
  },
});
