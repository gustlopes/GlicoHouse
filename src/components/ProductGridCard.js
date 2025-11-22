import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { COLORS } from '../constants/colors';
import { verticalScale, scale, moderateScale, normalize } from '../utils/responsive';
import Icon from './Icon';

export default function ProductGridCard({ product, onPress, onAddToCart }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.card} onPress={onPress}>
        {/* Imagem do produto */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.image }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        {/* Informações do produto */}
        <View style={styles.infoContainer}>
          <Text style={styles.brand}>{product.brand}</Text>
          <Text style={styles.name} numberOfLines={2}>
            {product.name}
          </Text>

          {/* Avaliação */}
          <View style={styles.ratingContainer}>
            <Icon name="star" size={normalize(12)} color="#FFB800" style={styles.star} />
            <Text style={styles.rating}>{product.rating.toFixed(1)}</Text>
            <Text style={styles.reviews}>({product.reviewCount})</Text>
          </View>

          {/* Preço e botão */}
          <View style={styles.priceContainer}>
            <View>
              {product.oldPrice && (
                <Text style={styles.oldPrice}>R$ {product.oldPrice.toFixed(2)}</Text>
              )}
              <Text style={styles.price}>R$ {product.price.toFixed(2)}</Text>
            </View>
            <TouchableOpacity
              style={styles.addButton}
              onPress={(e) => {
                e.stopPropagation();
                if (onAddToCart) {
                  onAddToCart();
                }
              }}
            >
              <Icon name="cart" size={normalize(16)} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: verticalScale(16),
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: moderateScale(12),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
    height: verticalScale(160),
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
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  oldPrice: {
    fontSize: normalize(11),
    color: COLORS.textLight,
    textDecorationLine: 'line-through',
  },
  price: {
    fontSize: normalize(16),
    fontWeight: 'bold',
    color: COLORS.secondary,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    borderRadius: moderateScale(20),
    width: moderateScale(36),
    height: moderateScale(36),
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonIcon: {
    fontSize: normalize(16),
  },
});
