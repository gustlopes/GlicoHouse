import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { COLORS } from '../constants/colors';
import { verticalScale, scale, moderateScale, normalize } from '../utils/responsive';
import Icon from './Icon';

export default function ProductCard({ product, onPress, onAddToCart }) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.image }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.brand}>{product.brand}</Text>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>

        <View style={styles.ratingContainer}>
          <Icon name="star" size={normalize(12)} color="#FFB800" style={styles.star} />
          <Text style={styles.rating}>{product.rating.toFixed(1)}</Text>
          <Text style={styles.reviews}>({product.reviewCount})</Text>
        </View>

        <View style={styles.bottomContainer}>
          <Text style={styles.price}>R$ {product.price.toFixed(2)}</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={(e) => {
              e.stopPropagation();
              if (onAddToCart) {
                onAddToCart();
              }
            }}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: scale(160),
    backgroundColor: COLORS.white,
    borderRadius: moderateScale(12),
    marginRight: scale(12),
    marginBottom: verticalScale(12),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
    height: verticalScale(140),
    borderTopLeftRadius: moderateScale(12),
    borderTopRightRadius: moderateScale(12),
    overflow: 'hidden',
    backgroundColor: COLORS.background,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    padding: moderateScale(12),
  },
  brand: {
    fontSize: normalize(11),
    color: COLORS.textLight,
    marginBottom: verticalScale(4),
  },
  name: {
    fontSize: normalize(13),
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: verticalScale(8),
    minHeight: verticalScale(36),
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(8),
  },
  star: {
    fontSize: normalize(12),
    marginRight: scale(4),
  },
  rating: {
    fontSize: normalize(12),
    fontWeight: '600',
    color: COLORS.text,
    marginRight: scale(4),
  },
  reviews: {
    fontSize: normalize(11),
    color: COLORS.textLight,
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: normalize(16),
    fontWeight: 'bold',
    color: COLORS.secondary,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    borderRadius: moderateScale(16),
    width: moderateScale(32),
    height: moderateScale(32),
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: COLORS.white,
    fontSize: normalize(20),
    fontWeight: 'bold',
  },
});
