import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import ProductCard from './ProductCard';
import { COLORS } from '../constants/colors';

export default function ProductsSection({ title, products, onSeeAll, onAddToCart, onProductPress }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {onSeeAll && (
          <TouchableOpacity onPress={onSeeAll}>
            <Text style={styles.seeAll}>Ver todos →</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onPress={() => onProductPress && onProductPress(product)}
            onAddToCart={() => onAddToCart && onAddToCart(product)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  seeAll: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
});
