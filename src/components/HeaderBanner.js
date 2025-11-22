import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/colors';
import CartIcon from './CartIcon';
import Icon from './Icon';
import { moderateScale, scale, verticalScale, normalize } from '../utils/responsive';

export default function HeaderBanner({ onOffersPress }) {
  return (
    <View style={styles.container}>
      {/* Parte superior com gradiente (verde para azul) */}
      <LinearGradient
        colors={[COLORS.gradientStart, COLORS.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientSection}
      >
        {/* Conteúdo principal do banner */}
        <View style={styles.bannerContent}>
          <View style={styles.textContent}>
            <Text style={styles.title}>Cuide da sua saúde!</Text>
            <Text style={styles.subtitle}>
              Monitores e produtos para diabetes com até 25% OFF
            </Text>
            <TouchableOpacity style={styles.offerButton} onPress={onOffersPress}>
              <Text style={styles.offerButtonText}>Ver Ofertas</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      {/* Parte branca com features */}
      <View style={styles.featuresSection}>
        <View style={styles.featureItem}>
          <View style={styles.featureIconContainer}>
            <Icon name="shield" size={normalize(28)} color={COLORS.primary} />
          </View>
          <Text style={styles.featureText}>Produtos{'\n'}Seguros</Text>
        </View>

        <View style={styles.featureItem}>
          <View style={styles.featureIconContainer}>
            <Icon name="clock" size={normalize(28)} color={COLORS.primary} />
          </View>
          <Text style={styles.featureText}>Entrega{'\n'}Rápida</Text>
        </View>

        <View style={styles.featureItem}>
          <View style={styles.featureIconContainer}>
            <Icon name="award" size={normalize(28)} color={COLORS.primary} />
          </View>
          <Text style={styles.featureText}>Qualidade{'\n'}Garantida</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
  },
  gradientSection: {
    paddingTop: verticalScale(16),
    paddingBottom: verticalScale(24),
  },
  bannerContent: {
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(12),
  },
  textContent: {
    flex: 1,
  },
  title: {
    fontSize: normalize(24),
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: verticalScale(8),
  },
  subtitle: {
    fontSize: normalize(14),
    color: COLORS.white,
    marginBottom: verticalScale(16),
    lineHeight: verticalScale(20),
  },
  offerButton: {
    backgroundColor: COLORS.white,
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(20),
    borderRadius: moderateScale(20),
    alignSelf: 'flex-start',
  },
  offerButtonText: {
    color: '#00C896',
    fontWeight: 'bold',
    fontSize: normalize(14),
  },
  featuresSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: verticalScale(20),
    paddingHorizontal: scale(16),
    backgroundColor: COLORS.white,
  },
  featureItem: {
    alignItems: 'center',
    flex: 1,
  },
  featureIconContainer: {
    width: moderateScale(56),
    height: moderateScale(56),
    borderRadius: moderateScale(28),
    backgroundColor: '#E8F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(8),
  },
  featureIcon: {
    fontSize: normalize(28),
  },
  featureText: {
    fontSize: normalize(11),
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: verticalScale(14),
  },
});
