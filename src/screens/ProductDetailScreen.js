import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Modal,
  Alert,
  ActivityIndicator
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker'; // Necessário instalar: npx expo install expo-image-picker

import { COLORS } from '../constants/colors';
import { normalize } from '../utils/responsive';
import { useCart } from '../context/CartContext';
import CartIcon from '../components/CartIcon';
import Icon from '../components/Icon';

export default function ProductDetailScreen({ product, onBack, onNavigateToCart }) {
  const { addToCart } = useCart();
  const insets = useSafeAreaInsets();
  const [quantity, setQuantity] = useState(1);
  const [selectedTab, setSelectedTab] = useState('description');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // --- ESTADOS PARA OS MODAIS DE RECEITA ---
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [prescriptionImage, setPrescriptionImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Lógica principal de adicionar ao carrinho
  const handleAddToCart = () => {
    // 1. Verifica se o produto precisa de receita (suporta boolean ou string "true")
    const needsPrescription = product.needPrescription === true || String(product.needPrescription) === 'true';

    if (needsPrescription) {
      // Se precisar, abre o primeiro modal (Aviso) e interrompe o fluxo normal
      setShowWarningModal(true);
    } else {
      // Se não precisar, adiciona direto (fluxo normal)
      addItemsToCart();
      Alert.alert('Sucesso', 'Produto adicionado ao carrinho!');
    }
  };

  // Função auxiliar para adicionar os itens (usada tanto no fluxo normal quanto após a receita)
  const addItemsToCart = (imageUri = null) => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product, imageUri);
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
        Alert.alert('Permissão necessária', 'Precisamos de acesso à câmera/galeria para anexar a receita.');
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
      console.log('Erro ao selecionar imagem:', error);
      Alert.alert('Erro', 'Não foi possível carregar a imagem.');
    }
  };

  // Transição do Modal de Aviso para o Modal de Upload
  const handleProceedToUpload = () => {
    setShowWarningModal(false);
    // Pequeno delay para evitar conflito visual entre modais
    setTimeout(() => setShowUploadModal(true), 300);
  };

  // Finalização do fluxo da receita
  const handleConfirmWithPrescription = () => {
    if (!prescriptionImage) {
      Alert.alert('Atenção', 'Por favor, anexe a foto da receita antes de continuar.');
      return;
    }

    setIsProcessing(true);

    // Simula processamento
    setTimeout(() => {
      // Adiciona ao carrinho COM a imagem
      addItemsToCart(prescriptionImage);
      
      setIsProcessing(false);
      setShowUploadModal(false);
      setPrescriptionImage(null); // Reseta para próxima vez

      Alert.alert(
        'Produto Adicionado',
        'O produto e a receita foram adicionados ao seu carrinho com sucesso!',
        [{ text: 'OK' }]
      );
    }, 1000);
  };

  const images = [product.image, product.image, product.image];

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
        <Text style={styles.headerTitle} numberOfLines={1}>
          {product.name}
        </Text>
        <CartIcon onPress={onNavigateToCart} />
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* ... (CONTEÚDO EXISTENTE: Imagens, Info, Abas, Quantidade) MANTENHA IGUAL ... */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: images[selectedImageIndex] }} style={styles.mainImage} resizeMode="cover" />
        </View>

        <View style={styles.thumbnailsContainer}>
          {images.map((img, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.thumbnail, selectedImageIndex === index && styles.thumbnailActive]}
              onPress={() => setSelectedImageIndex(index)}
            >
              <Image source={{ uri: img }} style={styles.thumbnailImage} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.categoryTag}><Text style={styles.categoryTagText}>Monitor</Text></View>
          <View style={styles.titleRow}>
            <View style={styles.titleContainer}>
              <Text style={styles.brand}>{product.brand}</Text>
              <Text style={styles.productName}>{product.name}</Text>
            </View>
          </View>

          <View style={styles.ratingContainer}>
             <Text style={styles.ratingText}>{product.rating.toFixed(1)} ({product.reviewCount} avaliações)</Text>
          </View>

          <View style={styles.priceContainer}>
            <View style={styles.priceRow}>
              <Text style={styles.price}>R$ {product.price.toFixed(2)}</Text>
            </View>
          </View>
          
          {/* Seção de Quantidade */}
          <View style={styles.quantitySection}>
            <Text style={styles.quantityLabel}>Quantidade:</Text>
            <View style={styles.quantityControls}>
              <TouchableOpacity style={styles.qtyButton} onPress={() => quantity > 1 && setQuantity(quantity - 1)}>
                <Text style={styles.qtyButtonText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.qtyValue}>{quantity}</Text>
              <TouchableOpacity style={styles.qtyButton} onPress={() => setQuantity(quantity + 1)}>
                <Text style={styles.qtyButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Botão Adicionar ao Carrinho */}
      <View style={styles.addToCartContainer}>
        <TouchableOpacity onPress={handleAddToCart}>
          <LinearGradient
            colors={[COLORS.gradientStart, COLORS.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.addToCartButton}
          >
            <Icon name="cart" size={normalize(20)} color={COLORS.white} style={styles.cartIcon} />
            <Text style={styles.addToCartText}>
              Adicionar ao Carrinho - R$ {(product.price * quantity).toFixed(2)}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* --- MODAL 1: AVISO --- */}
      <Modal
        visible={showWarningModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowWarningModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeaderError}>
              <Icon name="alert-circle" size={normalize(28)} color="#FFF" />
              <Text style={styles.modalTitleWhite}>Restrição de Venda</Text>
            </View>
            
            <View style={styles.modalBody}>
              <Text style={styles.productNameAlert}>
                {product.name}
              </Text>
              <Text style={styles.warningText}>
                Este produto só pode ser comercializado perante o envio da prescrição médica.
              </Text>
              
              <View style={styles.modalButtonsRow}>
                <TouchableOpacity 
                  style={styles.modalCancelButton} 
                  onPress={() => setShowWarningModal(false)}
                >
                  <Text style={styles.modalCancelText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.modalProceedButton} 
                  onPress={handleProceedToUpload}
                >
                  <Text style={styles.modalProceedText}>Continuar para envio</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* --- MODAL 2: UPLOAD --- */}
      <Modal
        visible={showUploadModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowUploadModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Anexar Receita Médica</Text>
              <TouchableOpacity onPress={() => setShowUploadModal(false)}>
                <Icon name="close" size={normalize(24)} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              {!prescriptionImage ? (
                <View style={styles.uploadOptionsContainer}>
                   <Text style={{textAlign:'center', marginBottom:20, color: COLORS.textLight}}>
                     Escolha uma opção para anexar a foto da receita:
                   </Text>
                   <View style={styles.attachButtonsContainer}>
                      <TouchableOpacity style={styles.attachOption} onPress={() => pickImage(true)}>
                        <View style={styles.attachIconBg}>
                          <Icon name="camera" size={normalize(32)} color={COLORS.secondary} />
                        </View>
                        <Text style={styles.attachText}>Câmera</Text>
                      </TouchableOpacity>

                      <TouchableOpacity style={styles.attachOption} onPress={() => pickImage(false)}>
                        <View style={styles.attachIconBg}>
                          <Icon name="image" size={normalize(32)} color={COLORS.secondary} />
                        </View>
                        <Text style={styles.attachText}>Galeria</Text>
                      </TouchableOpacity>
                   </View>
                </View>
              ) : (
                <View style={styles.previewContainer}>
                  <Text style={styles.previewLabel}>Pré-visualização:</Text>
                  <Image source={{ uri: prescriptionImage }} style={styles.prescriptionPreview} />
                  <TouchableOpacity onPress={() => setPrescriptionImage(null)} style={{padding:10}}>
                    <Text style={{color: COLORS.secondary, fontWeight:'bold'}}>Trocar imagem</Text>
                  </TouchableOpacity>
                </View>
              )}

              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={[
                    styles.confirmUploadButton,
                    (!prescriptionImage || isProcessing) && styles.disabledButton
                  ]}
                  onPress={handleConfirmWithPrescription}
                  disabled={!prescriptionImage || isProcessing}
                >
                  {isProcessing ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <Text style={styles.confirmUploadText}>Confirmar e Adicionar</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // ... (ESTILOS EXISTENTES DO CONTAINER, HEADER, ETC - MANTENHA AQUI)
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  backButton: { padding: 4 },
  headerTitle: { flex: 1, fontSize: 16, fontWeight: 'bold', color: COLORS.white, marginHorizontal: 12 },
  content: { flex: 1 },
  // ... (Demais estilos de imagem, info, etc que já existiam) ...
  imageContainer: { width: '100%', height: 300, backgroundColor: COLORS.white },
  mainImage: { width: '100%', height: '100%' },
  thumbnailsContainer: { flexDirection: 'row', padding: 12, gap: 12, backgroundColor: COLORS.white },
  thumbnail: { width: 60, height: 60, borderRadius: 8, borderWidth: 2, borderColor: 'transparent' },
  thumbnailActive: { borderColor: COLORS.primary },
  thumbnailImage: { width: '100%', height: '100%' },
  infoContainer: { backgroundColor: COLORS.white, padding: 16, marginTop: 8 },
  categoryTag: { backgroundColor: COLORS.background, alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 4, marginBottom: 12 },
  categoryTagText: { fontSize: 12, color: COLORS.text },
  titleRow: { marginBottom: 12 },
  titleContainer: { flex: 1 },
  brand: { fontSize: 14, color: COLORS.textLight, marginBottom: 4 },
  productName: { fontSize: 18, fontWeight: 'bold', color: COLORS.text },
  ratingContainer: { marginBottom: 16 },
  ratingText: { fontSize: 13, color: COLORS.text },
  priceContainer: { marginBottom: 16 },
  priceRow: { flexDirection: 'row', alignItems: 'center' },
  price: { fontSize: 28, fontWeight: 'bold', color: COLORS.secondary, marginRight: 12 },
  quantitySection: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  quantityLabel: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  quantityControls: { flexDirection: 'row', alignItems: 'center' },
  qtyButton: { width: 36, height: 36, borderWidth: 1, borderColor: COLORS.gray, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  qtyButtonText: { fontSize: 20, color: COLORS.text },
  qtyValue: { fontSize: 16, fontWeight: '600', color: COLORS.text, marginHorizontal: 20 },
  bottomSpacing: { height: 80 },
  addToCartContainer: { backgroundColor: COLORS.white, padding: 16, borderTopWidth: 1, borderTopColor: COLORS.gray },
  addToCartButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 8 },
  cartIcon: { marginRight: 8 },
  addToCartText: { color: COLORS.white, fontWeight: 'bold', fontSize: 16 },

  // --- ESTILOS DOS MODAIS ---
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    overflow: 'hidden',
    maxHeight: '85%',
  },
  // Modal Aviso
  modalHeaderError: {
    backgroundColor: '#D32F2F', // Vermelho Alerta
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  modalTitleWhite: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalBody: {
    padding: 20,
  },
  productNameAlert: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  warningText: {
    fontSize: 15,
    color: '#555',
    marginBottom: 24,
    lineHeight: 22,
  },
  modalButtonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCancelText: {
    color: '#666',
    fontWeight: '600',
  },
  modalProceedButton: {
    flex: 1,
    backgroundColor: COLORS.secondary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalProceedText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  // Modal Upload
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  uploadOptionsContainer: {
    paddingVertical: 10,
  },
  attachButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  attachOption: {
    alignItems: 'center',
  },
  attachIconBg: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#E8F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  attachText: {
    fontWeight: '600',
    color: COLORS.text,
  },
  previewContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  previewLabel: {
    alignSelf: 'flex-start',
    fontWeight: '600',
    marginBottom: 8,
    color: COLORS.text,
  },
  prescriptionPreview: {
    width: '100%',
    height: 250,
    borderRadius: 8,
    resizeMode: 'contain',
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#eee',
  },
  modalFooter: {
    marginTop: 10,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  confirmUploadButton: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  confirmUploadText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});