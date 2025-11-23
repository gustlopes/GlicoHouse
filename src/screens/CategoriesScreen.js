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
import Slider from '@react-native-community/slider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../constants/colors';
import { normalize } from '../utils/responsive';
import ProductGridCard from '../components/ProductGridCard';
import CartIcon from '../components/CartIcon';
import BottomNavigation from '../components/BottomNavigation';
import Icon from '../components/Icon';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';

const CATEGORIES = [
  { id: 'all', name: 'Todos', icon: 'box' },
  { id: 'monitores', name: 'Monitores CGM', icon: 'monitor' }, // Sensores (Medtronic, Dexcom, Libre)
  { id: 'glicosimetros', name: 'Glicosímetros', icon: 'medical' }, // Medidores de dedo
  { id: 'lancetas', name: 'Lancetas', icon: 'lancet' },
  { id: 'tiras', name: 'Tiras', icon: 'document' },
  { id: 'insulina', name: 'Insulina', icon: 'lancet' }, // Canetas e refis
];

const BRANDS = [
  { id: 'menarini', name: 'A. Menarini' },
  { id: 'abbott', name: 'Abbott' },
  { id: 'accu-chek', name: 'Accu-Chek' },
  { id: 'ascensia', name: 'Ascensia' },
  { id: 'bd', name: 'BD' },
  { id: 'contour', name: 'Contour' },
  { id: 'dexcom', name: 'Dexcom' },
  { id: 'g-tech', name: 'G-Tech' },
  { id: 'lilly', name: 'Lilly' },
  { id: 'medlevensohn', name: 'MedLevensohn' },
  { id: 'medtronic', name: 'Medtronic' },
  { id: 'novo-nordisk', name: 'Novo Nordisk' },
  { id: 'onetouch', name: 'OneTouch' },
  { id: 'sanofi', name: 'Sanofi' },
  { id: 'senseonics', name: 'Senseonics' },
];

const SORT_OPTIONS = [
  { value: 'name-asc', label: 'Nome A-Z' },
  { value: 'name-desc', label: 'Nome Z-A' },
  { value: 'price-asc', label: 'Menor Preço' },
  { value: 'price-desc', label: 'Maior Preço' },
];

export default function CategoriesScreen({ onNavigateToHome, onNavigateToCart, onProductPress, onNavigateToAccount }) {
  const insets = useSafeAreaInsets();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name-asc');
  const [priceRange, setPriceRange] = useState([0, 400]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const allProducts = await api.getAllProducts(); 
      
      setProducts(allProducts);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleBrand = (brandId) => {
    if (selectedBrands.includes(brandId)) {
      setSelectedBrands(selectedBrands.filter(id => id !== brandId));
    } else {
      setSelectedBrands([...selectedBrands, brandId]);
    }
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setSortBy('name-asc');
    setPriceRange([0, 400]);
    setSelectedBrands([]);
  };

  // Filtrar e ordenar produtos
  const filteredProducts = products
    .filter(product => {
      // Filtro de categoria
      if (selectedCategory !== 'all') {
        const categoryMatch = product.category.toLowerCase().includes(selectedCategory);
        if (!categoryMatch) return false;
      }

      // Filtro de preço
      if (product.price < priceRange[0] || product.price > priceRange[1]) {
        return false;
      }

      // Filtro de marca
      if (selectedBrands.length > 0) {
        const brandMatch = selectedBrands.some(brandId =>
          product.brand.toLowerCase().includes(brandId.replace('-', ' '))
        );
        if (!brandMatch) return false;
      }

      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        default:
          return 0;
      }
    });

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
        <Text style={styles.headerTitle}>Categorias</Text>
        <CartIcon onPress={onNavigateToCart} />
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Categorias de Produtos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categorias de Produtos</Text>
          <View style={styles.categoriesGrid}>
            {CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryChip,
                  selectedCategory === category.id && styles.categoryChipActive,
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Icon
                  name={category.icon}
                  size={normalize(18)}
                  color={selectedCategory === category.id ? COLORS.secondary : COLORS.text}
                  style={styles.categoryIcon}
                />
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === category.id && styles.categoryTextActive,
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Filtros */}
        <View style={styles.section}>
          <View style={styles.filterHeader}>
            <Text style={styles.sectionTitle}>Filtros</Text>
            <TouchableOpacity onPress={clearFilters}>
              <Text style={styles.clearButton}>Limpar</Text>
            </TouchableOpacity>
          </View>

          {/* Ordenar por */}
          <Text style={styles.filterLabel}>Ordenar por</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setShowSortDropdown(!showSortDropdown)}
          >
            <Text style={styles.dropdownText}>
              {SORT_OPTIONS.find(opt => opt.value === sortBy)?.label}
            </Text>
            <Text style={styles.dropdownArrow}>▼</Text>
          </TouchableOpacity>

          {showSortDropdown && (
            <View style={styles.dropdownMenu}>
              {SORT_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSortBy(option.value);
                    setShowSortDropdown(false);
                  }}
                >
                  <Text style={styles.dropdownItemText}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Faixa de Preço */}
          <Text style={styles.filterLabel}>
            Faixa de Preço: R$ {priceRange[0]} - R$ {priceRange[1]}
          </Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={400}
            value={priceRange[1]}
            onValueChange={(value) => setPriceRange([0, Math.round(value)])}
            minimumTrackTintColor={COLORS.primary}
            maximumTrackTintColor={COLORS.gray}
            thumbTintColor={COLORS.primary}
          />
          <View style={styles.priceLabels}>
            <Text style={styles.priceLabel}>R$ 0</Text>
            <Text style={styles.priceLabel}>R$ 400</Text>
          </View>

          {/* Marcas */}
          <Text style={styles.filterLabel}>Marcas</Text>
          {BRANDS.map((brand) => (
            <TouchableOpacity
              key={brand.id}
              style={styles.checkboxContainer}
              onPress={() => toggleBrand(brand.id)}
            >
              <View style={styles.checkbox}>
                {selectedBrands.includes(brand.id) && (
                  <View style={styles.checkboxChecked} />
                )}
              </View>
              <Text style={styles.checkboxLabel}>
                {brand.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Contador de produtos */}
        <View style={styles.resultHeader}>
          <Text style={styles.resultCount}>
            {filteredProducts.length} produtos encontrados
          </Text>
        </View>

        {/* Grid de produtos */}
        <View style={styles.productsGrid}>
          {filteredProducts.map((product) => (
            <View key={product.id} style={styles.productCard}>
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

      {/* Navegação inferior */}
      <BottomNavigation
        activeTab="categories"
        onNavigate={(tabId) => {
          if (tabId === 'home') {
            onNavigateToHome();
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  cartButton: {
    padding: 4,
  },
  cartIcon: {
    fontSize: 22,
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.gray,
    backgroundColor: COLORS.white,
  },
  categoryChipActive: {
    borderColor: COLORS.secondary,
    backgroundColor: '#E8F5F5',
  },
  categoryIcon: {
    marginRight: 8,
  },
  categoryText: {
    fontSize: 13,
    color: COLORS.text,
  },
  categoryTextActive: {
    fontWeight: '600',
    color: COLORS.secondary,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  clearButton: {
    fontSize: 14,
    color: COLORS.secondary,
    fontWeight: '600',
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: COLORS.white,
  },
  dropdownText: {
    fontSize: 14,
    color: COLORS.text,
  },
  dropdownArrow: {
    fontSize: 10,
    color: COLORS.textLight,
  },
  dropdownMenu: {
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    marginTop: 4,
  },
  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray,
  },
  dropdownItemText: {
    fontSize: 14,
    color: COLORS.text,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  priceLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priceLabel: {
    fontSize: 11,
    color: COLORS.textLight,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: COLORS.text,
    borderRadius: 4,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    width: 12,
    height: 12,
    backgroundColor: COLORS.text,
    borderRadius: 2,
  },
  checkboxLabel: {
    fontSize: 14,
    color: COLORS.text,
  },
  resultHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  resultCount: {
    fontSize: 13,
    color: COLORS.text,
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
});
