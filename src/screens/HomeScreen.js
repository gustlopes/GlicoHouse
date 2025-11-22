import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Componentes
import Header from '../components/Header';
import HeaderBanner from '../components/HeaderBanner';
import CategoriesSection from '../components/CategoriesSection';
import HealthTip from '../components/HealthTip';
import ProductsSection from '../components/ProductsSection';
import FreeShippingBanner from '../components/FreeShippingBanner';
import ConsultCard from '../components/ConsultCard';
import BottomNavigation from '../components/BottomNavigation';

// Serviços
import { api } from '../services/api';
import { COLORS } from '../constants/colors';
import { useCart } from '../context/CartContext';

export default function HomeScreen({ onNavigateToProducts, onNavigateToCategories, onNavigateToCart, onProductPress, onNavigateToAccount, onNavigateToConsultation, onNavigateToOffers }) {
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    categories: [],
    featuredProducts: [],
    highlightProducts: [],
    shippingPromo: null,
  });

  // Carregar dados da API quando o componente montar
  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      setLoading(true);
      // Buscar todos os dados da home
      const homeData = await api.getHomeData();
      setData(homeData);
    } catch (error) {
      console.error('Erro ao carregar dados da home:', error);
      // Aqui você pode adicionar tratamento de erro (ex: mostrar mensagem)
    } finally {
      setLoading(false);
    }
  };

  // Mostrar loading enquanto carrega os dados
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Header fixo */}
      <Header
        onSearchPress={() => onNavigateToProducts()}
        onCartPress={onNavigateToCart}
      />

      {/* Conteúdo rolável */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Banner (gradiente + features) */}
        <HeaderBanner
          onOffersPress={onNavigateToOffers}
        />

        {/* Categorias */}
        <CategoriesSection
          categories={data.categories}
          onCategoryPress={(category) => onNavigateToProducts && onNavigateToProducts(category.name)}
        />

        {/* Dica de Saúde */}
        <HealthTip />

        {/* Produtos em Destaque */}
        <ProductsSection
          title="Produtos em Destaque"
          products={data.highlightProducts}
          onSeeAll={() => onNavigateToProducts && onNavigateToProducts()}
          onAddToCart={addToCart}
          onProductPress={onProductPress}
        />

        {/* Banner de frete grátis */}
        <FreeShippingBanner minValue={data.shippingPromo?.minValue} />

        {/* Card de consulta */}
        <ConsultCard onPress={onNavigateToConsultation} />

        {/* Espaçamento para o bottom navigation */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Navegação inferior */}
      <BottomNavigation
        activeTab="home"
        onNavigate={(tabId) => {
          if (tabId === 'categories') {
            onNavigateToCategories();
          } else if (tabId === 'cart') {
            onNavigateToCart();
          } else if (tabId === 'account') {
            onNavigateToAccount && onNavigateToAccount();
          }
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  bottomSpacing: {
    height: 20,
  },
});
