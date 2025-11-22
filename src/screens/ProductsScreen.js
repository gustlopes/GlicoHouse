import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  FlatList,
  Modal,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../constants/colors';
import { normalize } from '../utils/responsive';
import ProductGridCard from '../components/ProductGridCard';
import CartIcon from '../components/CartIcon';
import BottomNavigation from '../components/BottomNavigation';
import Icon from '../components/Icon';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';

export default function ProductsScreen({
  onBack,
  filterCategory,
  onNavigateToCart,
  onProductPress,
  onNavigateToHome,
  onNavigateToCategories,
  onNavigateToAccount
}) {
  const { addToCart } = useCart();
  const insets = useSafeAreaInsets();
  const [searchText, setSearchText] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('Nome A-Z');
  const [filterBrand, setFilterBrand] = useState('Todas as Marcas');
  const [showSortModal, setShowSortModal] = useState(false);
  const [showBrandModal, setShowBrandModal] = useState(false);

  // Opções de ordenação
  const sortOptions = [
    'Nome A-Z',
    'Nome Z-A',
    'Menor Preço',
    'Maior Preço',
    'Melhor Avaliação',
  ];

  // Opções de marcas (extraídas dinamicamente dos produtos)
  const brandOptions = ['Todas as Marcas', ...new Set(products.map(p => p.brand).filter(Boolean))];

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      // Buscar todos os produtos
      const featured = await api.getFeaturedProducts();
      const highlight = await api.getHighlightProducts();
      const allProducts = [...featured, ...highlight];
      setProducts(allProducts);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Função para ordenar produtos
  const sortProducts = (productsToSort) => {
    const sorted = [...productsToSort];

    switch (sortBy) {
      case 'Nome A-Z':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'Nome Z-A':
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case 'Menor Preço':
        return sorted.sort((a, b) => a.price - b.price);
      case 'Maior Preço':
        return sorted.sort((a, b) => b.price - a.price);
      case 'Melhor Avaliação':
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      default:
        return sorted;
    }
  };

  // Filtrar e ordenar produtos
  const filteredProducts = sortProducts(
    products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchText.toLowerCase()) ||
                            product.brand.toLowerCase().includes(searchText.toLowerCase());
      const matchesCategory = !filterCategory ||
                              product.category.toLowerCase() === filterCategory.toLowerCase();
      const matchesBrand = filterBrand === 'Todas as Marcas' || product.brand === filterBrand;
      return matchesSearch && matchesCategory && matchesBrand;
    })
  );

  // Função para lidar com navegação da bottom bar
  const handleNavigate = (tabId) => {
    switch (tabId) {
      case 'home':
        onNavigateToHome && onNavigateToHome();
        break;
      case 'categories':
        onNavigateToCategories && onNavigateToCategories();
        break;
      case 'cart':
        onNavigateToCart && onNavigateToCart();
        break;
      case 'account':
        onNavigateToAccount && onNavigateToAccount();
        break;
      default:
        console.log('Tab não reconhecida:', tabId);
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
        <Text style={styles.headerTitle}>
          {filterCategory ? filterCategory : 'Produtos'}
        </Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Text style={styles.iconText}>🔍</Text>
          </TouchableOpacity>
          <CartIcon onPress={onNavigateToCart} />
        </View>
      </LinearGradient>

      {/* Conteúdo */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Barra de pesquisa */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBox}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar produtos..."
              placeholderTextColor={COLORS.textLight}
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
        </View>

        {/* Filtros */}
        <View style={styles.filtersContainer}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowSortModal(true)}
          >
            <Text style={styles.filterText}>{sortBy}</Text>
            <Text style={styles.filterArrow}>▼</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowBrandModal(true)}
          >
            <Text style={styles.filterText}>{filterBrand}</Text>
            <Text style={styles.filterArrow}>▼</Text>
          </TouchableOpacity>
        </View>

        {/* Contador e botão de filtros */}
        <View style={styles.resultHeader}>
          <Text style={styles.resultCount}>
            {filteredProducts.length} produtos encontrados
          </Text>
          <TouchableOpacity style={styles.filterIconButton}>
            <Icon name="settings" size={normalize(16)} color={COLORS.secondary} />
            <Text style={styles.filterIconLabel}>Filtros</Text>
          </TouchableOpacity>
        </View>

        {/* Grid de produtos */}
        <View style={styles.productsGrid}>
          {filteredProducts.map((product, index) => (
            <View key={product.id} style={styles.productCard}>
              <ProductGridCard
                product={product}
                onPress={() => onProductPress && onProductPress(product)}
                onAddToCart={() => addToCart(product)}
              />
            </View>
          ))}
        </View>

        {/* Espaçamento para o bottom navigation */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Modal de Ordenação */}
      <Modal
        visible={showSortModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSortModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowSortModal(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Ordenar por</Text>
            {sortOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.modalOption,
                  sortBy === option && styles.modalOptionActive,
                ]}
                onPress={() => {
                  setSortBy(option);
                  setShowSortModal(false);
                }}
              >
                <Text
                  style={[
                    styles.modalOptionText,
                    sortBy === option && styles.modalOptionTextActive,
                  ]}
                >
                  {option}
                </Text>
                {sortBy === option && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Modal de Marcas */}
      <Modal
        visible={showBrandModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowBrandModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowBrandModal(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filtrar por Marca</Text>
            {brandOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.modalOption,
                  filterBrand === option && styles.modalOptionActive,
                ]}
                onPress={() => {
                  setFilterBrand(option);
                  setShowBrandModal(false);
                }}
              >
                <Text
                  style={[
                    styles.modalOptionText,
                    filterBrand === option && styles.modalOptionTextActive,
                  ]}
                >
                  {option}
                </Text>
                {filterBrand === option && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Navegação inferior */}
      <BottomNavigation activeTab="categories" onNavigate={handleNavigate} />
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
  backIcon: {
    fontSize: 24,
    color: COLORS.white,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
    marginLeft: 12,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 16,
  },
  iconButton: {
    padding: 4,
  },
  iconText: {
    fontSize: 22,
    color: COLORS.white,
  },
  content: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: COLORS.white,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    backgroundColor: COLORS.white,
  },
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.background,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.gray,
  },
  filterText: {
    fontSize: 13,
    color: COLORS.text,
  },
  filterArrow: {
    fontSize: 10,
    color: COLORS.textLight,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  resultCount: {
    fontSize: 13,
    color: COLORS.text,
  },
  filterIconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  filterIconText: {
    fontSize: 16,
  },
  filterIconLabel: {
    fontSize: 13,
    color: COLORS.secondary,
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
  },
  bottomSpacing: {
    height: 20,
  },
  // Estilos dos modais
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  modalOptionActive: {
    backgroundColor: COLORS.primaryLight || '#E3F2FD',
  },
  modalOptionText: {
    fontSize: 15,
    color: COLORS.text,
  },
  modalOptionTextActive: {
    fontWeight: '600',
    color: COLORS.secondary,
  },
  checkmark: {
    fontSize: 18,
    color: COLORS.secondary,
    fontWeight: 'bold',
  },
});
