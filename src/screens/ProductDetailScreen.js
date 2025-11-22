import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  const images = [product.image, product.image, product.image]; // Mock: mesma imagem 3x

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
        {/* Imagem principal */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: images[selectedImageIndex] }}
            style={styles.mainImage}
            resizeMode="cover"
          />
        </View>

        {/* Miniaturas */}
        <View style={styles.thumbnailsContainer}>
          {images.map((img, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.thumbnail,
                selectedImageIndex === index && styles.thumbnailActive,
              ]}
              onPress={() => setSelectedImageIndex(index)}
            >
              <Image source={{ uri: img }} style={styles.thumbnailImage} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Informações do produto */}
        <View style={styles.infoContainer}>
          {/* Tag de categoria */}
          <View style={styles.categoryTag}>
            <Text style={styles.categoryTagText}>Monitor</Text>
          </View>

          {/* Marca e nome */}
          <View style={styles.titleRow}>
            <View style={styles.titleContainer}>
              <Text style={styles.brand}>{product.brand}</Text>
              <Text style={styles.productName}>{product.name}</Text>
            </View>
          </View>

          {/* Avaliação */}
          <View style={styles.ratingContainer}>
            <View style={styles.stars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Icon
                  key={star}
                  name="star"
                  size={normalize(16)}
                  color={star <= Math.floor(product.rating) ? '#FFB800' : COLORS.gray}
                  style={styles.star}
                />
              ))}
            </View>
            <Text style={styles.ratingText}>
              {product.rating.toFixed(1)} ({product.reviewCount} avaliações)
            </Text>
          </View>

          {/* Preço */}
          <View style={styles.priceContainer}>
            {product.oldPrice && (
              <Text style={styles.oldPrice}>R$ {product.oldPrice.toFixed(2)}</Text>
            )}
            <View style={styles.priceRow}>
              <Text style={styles.price}>R$ {product.price.toFixed(2)}</Text>
              {product.oldPrice && (
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>
                    {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% OFF
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Benefícios para Saúde */}
          <View style={styles.benefitsCard}>
            <View style={styles.benefitsHeader}>
              <Text style={styles.benefitsIcon}>💚</Text>
              <Text style={styles.benefitsTitle}>Benefícios para Saúde</Text>
            </View>
            <Text style={styles.benefitsText}>
              Reduz a necessidade de picadas no dedo, oferece controle 24h da glicose
            </Text>
            <View style={styles.certificationsRow}>
              <View style={styles.certificationBadge}>
                <Icon name="check" size={normalize(12)} color={COLORS.primary} style={styles.certificationIcon} />
                <Text style={styles.certificationText}>Aprovado ANVISA</Text>
              </View>
              <View style={styles.certificationBadge}>
                <Icon name="check" size={normalize(12)} color={COLORS.primary} style={styles.certificationIcon} />
                <Text style={styles.certificationText}>Certificado</Text>
              </View>
            </View>
          </View>

          {/* Abas */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[styles.tab, selectedTab === 'description' && styles.tabActive]}
              onPress={() => setSelectedTab('description')}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedTab === 'description' && styles.tabTextActive,
                ]}
              >
                Descrição
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, selectedTab === 'specs' && styles.tabActive]}
              onPress={() => setSelectedTab('specs')}
            >
              <Text
                style={[styles.tabText, selectedTab === 'specs' && styles.tabTextActive]}
              >
                Especificações
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, selectedTab === 'usage' && styles.tabActive]}
              onPress={() => setSelectedTab('usage')}
            >
              <Text
                style={[styles.tabText, selectedTab === 'usage' && styles.tabTextActive]}
              >
                Como Usar
              </Text>
            </TouchableOpacity>
          </View>

          {/* Conteúdo da aba */}
          <View style={styles.tabContent}>
            {selectedTab === 'description' && (
              <Text style={styles.descriptionText}>
                Sistema de monitoramento contínuo de glicose que oferece leituras precisas em
                tempo real através de sensor discreto no braço.
              </Text>
            )}
            {selectedTab === 'specs' && (
              <Text style={styles.descriptionText}>
                • Sensor de 14 dias{'\n'}• À prova d'água{'\n'}• Leitura a cada minuto{'\n'}•
                Sem necessidade de calibração
              </Text>
            )}
            {selectedTab === 'usage' && (
              <Text style={styles.descriptionText}>
                1. Aplique o sensor na parte traseira do braço{'\n'}2. Escaneie com o leitor ou
                smartphone{'\n'}3. Acompanhe suas leituras a qualquer momento
              </Text>
            )}
          </View>

          {/* Controles de quantidade */}
          <View style={styles.quantitySection}>
            <Text style={styles.quantityLabel}>Quantidade:</Text>
            <View style={styles.quantityControls}>
              <TouchableOpacity
                style={styles.qtyButton}
                onPress={() => quantity > 1 && setQuantity(quantity - 1)}
              >
                <Text style={styles.qtyButtonText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.qtyValue}>{quantity}</Text>
              <TouchableOpacity
                style={styles.qtyButton}
                onPress={() => setQuantity(quantity + 1)}
              >
                <Text style={styles.qtyButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Botão fixo de adicionar ao carrinho */}
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
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
    marginHorizontal: 12,
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    width: '100%',
    height: 300,
    backgroundColor: COLORS.white,
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  thumbnailsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    backgroundColor: COLORS.white,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  thumbnailActive: {
    borderColor: COLORS.primary,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    backgroundColor: COLORS.white,
    padding: 16,
    marginTop: 8,
  },
  categoryTag: {
    backgroundColor: COLORS.background,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginBottom: 12,
  },
  categoryTagText: {
    fontSize: 12,
    color: COLORS.text,
  },
  titleRow: {
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
  },
  brand: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stars: {
    flexDirection: 'row',
    marginRight: 8,
  },
  star: {
  },
  ratingText: {
    fontSize: 13,
    color: COLORS.text,
  },
  priceContainer: {
    marginBottom: 16,
  },
  oldPrice: {
    fontSize: 14,
    color: COLORS.textLight,
    textDecorationLine: 'line-through',
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.secondary,
    marginRight: 12,
  },
  discountBadge: {
    backgroundColor: '#FFE5E5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  discountText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#DC3545',
  },
  benefitsCard: {
    backgroundColor: '#E8F5F5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  benefitsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  benefitsIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  benefitsTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  benefitsText: {
    fontSize: 13,
    color: COLORS.text,
    lineHeight: 18,
    marginBottom: 12,
  },
  certificationsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  certificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  certificationIcon: {
  },
  certificationText: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: '600',
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray,
    marginBottom: 16,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  tabTextActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  tabContent: {
    marginBottom: 24,
  },
  descriptionText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
  quantitySection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  quantityLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qtyButton: {
    width: 36,
    height: 36,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyButtonText: {
    fontSize: 20,
    color: COLORS.text,
  },
  qtyValue: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginHorizontal: 20,
    minWidth: 30,
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 80,
  },
  addToCartContainer: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray,
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 8,
  },
  cartIcon: {
    marginRight: 8,
  },
  addToCartText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
