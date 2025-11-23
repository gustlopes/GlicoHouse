import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  Modal,            // <--- Adicionado
  Text,             // <--- Adicionado
  TouchableOpacity, // <--- Adicionado
  Image,            // <--- Adicionado
  Alert             // <--- Adicionado
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker'; // <--- Importante

// Componentes
import Header from '../components/Header';
import HeaderBanner from '../components/HeaderBanner';
import CategoriesSection from '../components/CategoriesSection';
import HealthTip from '../components/HealthTip';
import ProductsSection from '../components/ProductsSection';
import FreeShippingBanner from '../components/FreeShippingBanner';
import ConsultCard from '../components/ConsultCard';
import BottomNavigation from '../components/BottomNavigation';
import Icon from '../components/Icon'; // <--- Adicionado

// Serviços e Contexto
import { api } from '../services/api';
import { COLORS } from '../constants/colors';
import { normalize } from '../utils/responsive'; // <--- Adicionado
import { useCart } from '../context/CartContext';

export default function HomeScreen({ 
  onNavigateToProducts, 
  onNavigateToCategories, 
  onNavigateToCart, 
  onProductPress, 
  onNavigateToAccount, 
  onNavigateToConsultation, 
  onNavigateToOffers 
}) {
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    categories: [],
    featuredProducts: [],
    highlightProducts: [],
    shippingPromo: null,
  });

  // --- ESTADOS PARA MODAIS (Igual ao ProductsScreen) ---
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [prescriptionImage, setPrescriptionImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      setLoading(true);
      const homeData = await api.getHomeData();
      setData(homeData);
    } catch (error) {
      console.error('Erro ao carregar dados da home:', error);
    } finally {
      setLoading(false);
    }
  };

  // --- LÓGICA DE INTERCEPTAÇÃO (A mesma do ProductsScreen) ---
  const handleAddToCartPress = (product) => {
    // Verifica se precisa de receita (agora checking 'needsPrescription')
    const needsCheck = product.needsPrescription === true || String(product.needsPrescription) === 'true';
    
    if (needsCheck) {
      setSelectedProduct(product);
      setShowWarningModal(true);
    } else {
      addToCart(product);
      Alert.alert('Sucesso', 'Produto adicionado ao carrinho!');
    }
  };

  const pickImage = async (useCamera = false) => {
    const permissionResult = useCamera 
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

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
      Alert.alert('Sucesso', 'Produto e receita adicionados!');
    }, 1000);
  };

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
      <Header onSearchPress={() => onNavigateToProducts()} onCartPress={onNavigateToCart} />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <HeaderBanner onOffersPress={onNavigateToOffers} />
        
        <CategoriesSection
          categories={data.categories}
          onCategoryPress={(category) => onNavigateToProducts && onNavigateToProducts(category.name)}
        />

        <HealthTip />

        {/* AQUI ESTÁ A MUDANÇA CRÍTICA NA HOME: onAddToCart chama nosso handler */}
        <ProductsSection
          title="Produtos em Destaque"
          products={data.highlightProducts}
          onSeeAll={() => onNavigateToProducts && onNavigateToProducts()}
          onAddToCart={handleAddToCartPress} 
          onProductPress={onProductPress}
        />

        <FreeShippingBanner minValue={data.shippingPromo?.minValue} />
        <ConsultCard onPress={onNavigateToConsultation} />
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* --- INSERIR OS MODAIS AQUI (Copiados do ProductsScreen) --- */}
      
      {/* Modal Aviso */}
      <Modal visible={showWarningModal} transparent={true} animationType="fade" onRequestClose={() => setShowWarningModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeaderError}>
              <Icon name="alert-circle" size={normalize(28)} color="#FFF" />
              <Text style={styles.modalTitleWhite}>Restrição de Venda</Text>
            </View>
            <View style={styles.modalBody}>
              <Text style={styles.productNameAlert}>{selectedProduct?.name}</Text>
              <Text style={styles.warningText}>Este produto requer prescrição médica.</Text>
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

      {/* Modal Upload */}
      <Modal visible={showUploadModal} transparent={true} animationType="slide" onRequestClose={() => setShowUploadModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Anexar Receita</Text>
              <TouchableOpacity onPress={() => setShowUploadModal(false)}>
                <Icon name="close" size={24} color="#333" />
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
                  <Image source={{ uri: prescriptionImage }} style={styles.prescriptionPreview} />
                  <TouchableOpacity onPress={() => setPrescriptionImage(null)}><Text style={{color:COLORS.secondary}}>Trocar</Text></TouchableOpacity>
                </View>
              )}
              <TouchableOpacity 
                style={[styles.confirmUploadButton, (!prescriptionImage || isProcessing) && styles.disabledButton]}
                onPress={handleConfirmWithPrescription}
                disabled={!prescriptionImage || isProcessing}
              >
                {isProcessing ? <ActivityIndicator color="#FFF"/> : <Text style={styles.confirmUploadText}>Confirmar</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <BottomNavigation
        activeTab="home"
        onNavigate={(tabId) => {
          if (tabId === 'categories') onNavigateToCategories();
          else if (tabId === 'cart') onNavigateToCart();
          else if (tabId === 'account') onNavigateToAccount && onNavigateToAccount();
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollView: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  bottomSpacing: { height: 20 },
  
  // --- ESTILOS DOS MODAIS (Copiar os mesmos do ProductsScreen) ---
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden', maxHeight: '80%' },
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
  attachButtonsContainer: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 20 },
  attachOption: { alignItems: 'center' },
  attachIconBg: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#E0F7FA', justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  previewContainer: { alignItems: 'center', marginVertical: 10 },
  prescriptionPreview: { width: '100%', height: 200, resizeMode: 'contain', borderRadius: 8, marginBottom: 10, backgroundColor: '#f5f5f5' },
  confirmUploadButton: { backgroundColor: COLORS.secondary, padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  confirmUploadText: { color: '#fff', fontWeight: 'bold' },
  disabledButton: { opacity: 0.6, backgroundColor: '#999' }
});