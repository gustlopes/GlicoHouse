import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../constants/colors';
import { normalize } from '../utils/responsive';
import ProductGridCard from '../components/ProductGridCard';
import CartIcon from '../components/CartIcon';
import Icon from '../components/Icon';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';

export default function OffersScreen({ onBack, onNavigateToCart, onProductPress }) {
  const { addToCart } = useCart();
  const insets = useSafeAreaInsets();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const featured = await api.getFeaturedProducts();
      const highlight = await api.getHighlightProducts();
      const allProducts = [...featured, ...highlight];
      // Filtrar apenas produtos com desconto (oldPrice)
      const productsWithDiscount = allProducts.filter(p => p.oldPrice);
      setProducts(productsWithDiscount);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <LinearGradient
        colors={[COLORS.gradientStart, COLORS.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + 12 }]}
      >
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Icon name="back" size={normalize(24)} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ofertas Especiais</Text>
        <CartIcon onPress={onNavigateToCart} />
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Banner de Ofertas */}
        <LinearGradient
          colors={['#FF6B35', '#FF8C42']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.offerBanner}
        >
          <View style={styles.bannerIconContainer}>
            <Icon name="tag" size={normalize(28)} color={COLORS.white} />
          </View>
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>Ofertas Especiais</Text>
            <Text style={styles.bannerSubtitle}>
              Produtos para diabetes com até 31% de desconto!
            </Text>
          </View>
        </LinearGradient>

        {/* Badge de Economia */}
        <View style={styles.economyBadge}>
          <Icon name="check" size={normalize(16)} color="#4CAF50" style={styles.economyIcon} />
          <Text style={styles.economyText}>
            Economia garantida em produtos selecionados
          </Text>
        </View>

        {/* Cabeçalho de Produtos */}
        <View style={styles.productsHeader}>
          <View style={styles.promoBadge}>
            <Text style={styles.promoText}>PROMOÇÃO</Text>
          </View>
          <Text style={styles.productsCount}>
            {products.length} Produtos em Oferta
          </Text>
        </View>

        {/* Grid de Produtos */}
        <View style={styles.productsGrid}>
          {products.map((product) => (
            <View key={product.id} style={styles.productCard}>
              {/* Badge de desconto */}
              {product.oldPrice && (
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>
                    -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
                  </Text>
                </View>
              )}
              <ProductGridCard
                product={product}
                onPress={() => onProductPress && onProductPress(product)}
                onAddToCart={() => addToCart(product)}
              />
            </View>
          ))}
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
    marginLeft: 12,
  },
  content: {
    flex: 1,
  },
  offerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
    borderRadius: 12,
  },
  bannerIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  bannerContent: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 13,
    color: COLORS.white,
    lineHeight: 18,
  },
  economyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
  },
  economyIcon: {
    marginRight: 8,
  },
  economyText: {
    fontSize: 13,
    color: '#2E7D32',
    fontWeight: '600',
  },
  productsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  promoBadge: {
    backgroundColor: '#DC3545',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginRight: 12,
  },
  promoText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  productsCount: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '600',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  productCard: {
    width: '48%',
    position: 'relative',
    marginBottom: 16,
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#DC3545',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    zIndex: 10,
    elevation: 5,
  },
  discountText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  bottomSpacing: {
    height: 20,
  },
});
