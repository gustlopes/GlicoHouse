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
  Image,            // <--- Importado
  Alert,            // <--- Importado
  ActivityIndicator // <--- Importado
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker'; // <--- Certifique-se de instalar: npx expo install expo-image-picker

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

  // --- ESTADOS PARA MODAIS DE RECEITA ---
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [prescriptionImage, setPrescriptionImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const sortOptions = ['Nome A-Z', 'Nome Z-A', 'Menor Preço', 'Maior Preço', 'Melhor Avaliação'];

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const featured = await api.getFeaturedProducts();
      const highlight = await api.getHighlightProducts();
      const allProducts = [...featured, ...highlight];
      // Remove duplicatas por ID, se houver
      const uniqueProducts = Array.from(new Map(allProducts.map(item => [item.id, item])).values());
      setProducts(uniqueProducts);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Lógica de ordenação e filtro
  const brandOptions = ['Todas as Marcas', ...new Set(products.map(p => p.brand).filter(Boolean))];
  
  const sortProducts = (productsToSort) => {
    const sorted = [...productsToSort];
    switch (sortBy) {
      case 'Nome A-Z': return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'Nome Z-A': return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case 'Menor Preço': return sorted.sort((a, b) => a.price - b.price);
      case 'Maior Preço': return sorted.sort((a, b) => b.price - a.price);
      case 'Melhor Avaliação': return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      default: return sorted;
    }
  };

  const filteredProducts = sortProducts(
    products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchText.toLowerCase()) ||
                            product.brand.toLowerCase().includes(searchText.toLowerCase());
      const matchesCategory = !filterCategory || product.category.toLowerCase() === filterCategory.toLowerCase();
      const matchesBrand = filterBrand === 'Todas as Marcas' || product.brand === filterBrand;
      return matchesSearch && matchesCategory && matchesBrand;
    })
  );

  const handleAddToCartPress = (product) => {
  if (product.needPrescription === true || String(product.needPrescription) === 'true') {
    setSelectedProduct(product);
    setShowWarningModal(true); // Abre o fluxo de receita
  } else {
    addToCart(product);
    Alert.alert('Sucesso', 'Adicionado ao carrinho!');
  }
};

  // --- FUNÇÕES DE IMAGEM ---
  const pickImage = async (useCamera = false) => {
    try {
      let permissionResult;
      if (useCamera) {
        permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      } else {
        permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      }

      if (permissionResult.status !== 'granted') {
        Alert.alert('Permissão necessária', 'Precisamos de acesso à câmera/galeria.');
        return;
      }

      const result = await (useCamera ? ImagePicker.launchCameraAsync : ImagePicker.launchImageLibraryAsync)({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.7,
      });

      if (!result.canceled) {
        setPrescriptionImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar a imagem.');
    }
  };

  const handleProceedToUpload = () => {
    setShowWarningModal(false);
    setTimeout(() => setShowUploadModal(true), 400);
  };

  const handleConfirmWithPrescription = () => {
    if (!prescriptionImage) {
      Alert.alert('Atenção', 'Por favor, anexe a imagem da receita.');
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      addToCart(selectedProduct, prescriptionImage);
      setIsProcessing(false);
      setShowUploadModal(false);
      setPrescriptionImage(null);
      setSelectedProduct(null);
      Alert.alert('Sucesso', 'Produto e receita adicionados ao carrinho!');
    }, 1000);
  };

  // ... Navegação (handleNavigate) mantém-se igual ...
  const handleNavigate = (tabId) => {
    if (tabId === 'home') onNavigateToHome && onNavigateToHome();
    else if (tabId === 'categories') onNavigateToCategories && onNavigateToCategories();
    else if (tabId === 'cart') onNavigateToCart && onNavigateToCart();
    else if (tabId === 'account') onNavigateToAccount && onNavigateToAccount();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      {/* ... Header e Busca mantêm-se iguais ... */}
      <LinearGradient
        colors={[COLORS.gradientStart, COLORS.gradientEnd]}
        style={[styles.header, { paddingTop: insets.top + 12 }]}
      >
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Icon name="back" size={normalize(24)} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{filterCategory ? filterCategory : 'Produtos'}</Text>
        <View style={styles.headerIcons}>
           <TouchableOpacity style={styles.iconButton}><Text style={styles.iconText}>🔍</Text></TouchableOpacity>
           <CartIcon onPress={onNavigateToCart} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.searchContainer}>
          <View style={styles.searchBox}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar produtos..."
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
        </View>

        {/* ... Filtros mantêm-se iguais ... */}
        <View style={styles.filtersContainer}>
          <TouchableOpacity style={styles.filterButton} onPress={() => setShowSortModal(true)}>
            <Text style={styles.filterText}>{sortBy}</Text>
            <Text style={styles.filterArrow}>▼</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton} onPress={() => setShowBrandModal(true)}>
            <Text style={styles.filterText}>{filterBrand}</Text>
            <Text style={styles.filterArrow}>▼</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.resultHeader}>
          <Text style={styles.resultCount}>{filteredProducts.length} produtos encontrados</Text>
        </View>

        {/* Grid de Produtos */}
        <View style={styles.productsGrid}>
          {filteredProducts.map((product) => (
            <View key={product.id} style={styles.productCard}>
              <ProductGridCard
                product={product}
                onPress={() => onProductPress && onProductPress(product)}
                // ALTERADO AQUI: Chama nossa função interceptadora
                onAddToCart={() => handleAddToCartPress(product)}
              />
            </View>
          ))}
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* ... Modais de Ordenação e Marca mantêm-se iguais ... */}
      <Modal visible={showSortModal} transparent={true} onRequestClose={() => setShowSortModal(false)}>
         <TouchableOpacity style={styles.modalOverlay} onPress={() => setShowSortModal(false)}>
           <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Ordenar por</Text>
              {sortOptions.map(op => (
                  <TouchableOpacity key={op} style={[styles.modalOption, sortBy === op && styles.modalOptionActive]} onPress={() => {setSortBy(op); setShowSortModal(false);}}>
                      <Text style={styles.modalOptionText}>{op}</Text>
                  </TouchableOpacity>
              ))}
           </View>
         </TouchableOpacity>
      </Modal>

      <Modal visible={showBrandModal} transparent={true} onRequestClose={() => setShowBrandModal(false)}>
         <TouchableOpacity style={styles.modalOverlay} onPress={() => setShowBrandModal(false)}>
           <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Filtrar por Marca</Text>
              {brandOptions.map(op => (
                  <TouchableOpacity key={op} style={[styles.modalOption, filterBrand === op && styles.modalOptionActive]} onPress={() => {setFilterBrand(op); setShowBrandModal(false);}}>
                      <Text style={styles.modalOptionText}>{op}</Text>
                  </TouchableOpacity>
              ))}
           </View>
         </TouchableOpacity>
      </Modal>

      {/* --- MODAIS DE RECEITA --- */}
      
      {/* Modal de Aviso */}
      <Modal visible={showWarningModal} transparent={true} animationType="fade" onRequestClose={() => setShowWarningModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeaderError}>
              <Icon name="alert-circle" size={normalize(28)} color="#FFF" />
              <Text style={styles.modalTitleWhite}>Restrição de Venda</Text>
            </View>
            <View style={styles.modalBody}>
              <Text style={styles.productNameAlert}>{selectedProduct?.name}</Text>
              <Text style={styles.warningText}>Este produto requer prescrição médica para compra.</Text>
              <View style={styles.modalButtonsRow}>
                <TouchableOpacity style={styles.modalCancelButton} onPress={() => setShowWarningModal(false)}>
                  <Text style={styles.modalCancelText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalProceedButton} onPress={handleProceedToUpload}>
                  <Text style={styles.modalProceedText}>Enviar Receita</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Upload */}
      <Modal visible={showUploadModal} transparent={true} animationType="slide" onRequestClose={() => setShowUploadModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Anexar Receita</Text>
              <TouchableOpacity onPress={() => setShowUploadModal(false)}>
                 <Icon name="close" size={24} color="#333"/>
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              {!prescriptionImage ? (
                <View style={styles.attachButtonsContainer}>
                   <TouchableOpacity style={styles.attachOption} onPress={() => pickImage(true)}>
                      <View style={styles.attachIconBg}><Icon name="camera" size={32} color={COLORS.secondary}/></View>
                      <Text>Câmera</Text>
                   </TouchableOpacity>
                   <TouchableOpacity style={styles.attachOption} onPress={() => pickImage(false)}>
                      <View style={styles.attachIconBg}><Icon name="image" size={32} color={COLORS.secondary}/></View>
                      <Text>Galeria</Text>
                   </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.previewContainer}>
                   <Image source={{uri: prescriptionImage}} style={styles.prescriptionPreview} />
                   <TouchableOpacity onPress={() => setPrescriptionImage(null)}><Text style={{color:COLORS.secondary, fontWeight:'bold'}}>Trocar</Text></TouchableOpacity>
                </View>
              )}
              <TouchableOpacity 
                 style={[styles.confirmUploadButton, (!prescriptionImage || isProcessing) && styles.disabledButton]}
                 onPress={handleConfirmWithPrescription}
                 disabled={!prescriptionImage || isProcessing}
              >
                 {isProcessing ? <ActivityIndicator color="#FFF"/> : <Text style={styles.confirmUploadText}>Confirmar e Adicionar</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <BottomNavigation activeTab="categories" onNavigate={handleNavigate} />
    </SafeAreaView>
  );
}

// Adicione estes estilos se eles não existirem
const styles = StyleSheet.create({
  // ... (Estilos existentes mantidos)
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  backButton: { padding: 4 },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: 'bold', color: COLORS.white, marginLeft: 12 },
  headerIcons: { flexDirection: 'row', gap: 16 },
  iconButton: { padding: 4 },
  iconText: { fontSize: 22, color: COLORS.white },
  content: { flex: 1 },
  searchContainer: { paddingHorizontal: 16, paddingVertical: 16, backgroundColor: COLORS.white },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.background, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 12 },
  searchIcon: { fontSize: 18, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14, color: COLORS.text },
  filtersContainer: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 12, gap: 12, backgroundColor: COLORS.white },
  filterButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: COLORS.background, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: COLORS.gray },
  filterText: { fontSize: 13, color: COLORS.text },
  filterArrow: { fontSize: 10, color: COLORS.textLight },
  resultHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  resultCount: { fontSize: 13, color: COLORS.text },
  productsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 16 },
  productCard: { width: '48%' },
  bottomSpacing: { height: 20 },
  
  // Estilos Modais (Copiados e adaptados)
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden', maxHeight: '80%', padding: 0 },
  modalHeaderError: { backgroundColor: '#D32F2F', padding: 16, flexDirection: 'row', alignItems: 'center', gap: 10 },
  modalTitleWhite: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  modalBody: { padding: 20 },
  productNameAlert: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  warningText: { fontSize: 14, color: '#555', marginBottom: 20 },
  modalButtonsRow: { flexDirection: 'row', gap: 12 },
  modalCancelButton: { flex: 1, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: '#ccc', borderRadius: 8 },
  modalProceedButton: { flex: 1, padding: 12, alignItems: 'center', backgroundColor: COLORS.secondary, borderRadius: 8 },
  modalCancelText: { fontWeight: '600' },
  modalProceedText: { color: '#fff', fontWeight: 'bold' },
  
  modalHeader: { padding: 16, flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: '#eee' },
  modalTitle: { fontSize: 18, fontWeight: 'bold' },
  modalOption: { padding: 16, borderBottomWidth: 1, borderColor: '#eee' },
  modalOptionActive: { backgroundColor: '#E3F2FD' },
  modalOptionText: { fontSize: 15 },
  attachButtonsContainer: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 20 },
  attachOption: { alignItems: 'center' },
  attachIconBg: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#E0F7FA', justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  previewContainer: { alignItems: 'center', marginVertical: 10 },
  prescriptionPreview: { width: '100%', height: 200, resizeMode: 'contain', borderRadius: 8, marginBottom: 10, backgroundColor:'#f5f5f5' },
  confirmUploadButton: { backgroundColor: COLORS.secondary, padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  confirmUploadText: { color: '#fff', fontWeight: 'bold' },
  disabledButton: { opacity: 0.6, backgroundColor: '#999' }
});