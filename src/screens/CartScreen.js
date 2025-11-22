import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../constants/colors';
import { normalize } from '../utils/responsive';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import BottomNavigation from '../components/BottomNavigation';
import Icon from '../components/Icon';

export default function CartScreen({ onNavigateToHome, onNavigateToCategories, onNavigateToAccount, onNavigateToCheckout, onNavigateToLogin }) {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, getCartCount } = useCart();
  const { isLoggedIn } = useAuth();
  const [couponCode, setCouponCode] = useState('');
  const insets = useSafeAreaInsets();

  const handleCheckout = () => {
    if (!isLoggedIn) {
      // Se não estiver logado, redireciona para tela de login
      onNavigateToLogin && onNavigateToLogin();
    } else {
      // Se estiver logado, prossegue para o checkout
      onNavigateToCheckout && onNavigateToCheckout();
    }
  };

  const subtotal = getCartTotal();
  const freeShippingThreshold = 149;
  const shippingCost = subtotal >= freeShippingThreshold ? 0 : 20; // Frete grátis acima de 149, caso contrário R$ 20
  const remainingForFreeShipping = freeShippingThreshold - subtotal;
  const total = subtotal + shippingCost;

  // Renderizar carrinho vazio
  if (cartItems.length === 0) {
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
          <Text style={styles.headerTitle}>Carrinho</Text>
        </LinearGradient>

        {/* Empty State */}
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Icon name="cart" size={normalize(48)} color={COLORS.textLight} />
          </View>
          <Text style={styles.emptyTitle}>Seu carrinho está vazio</Text>
          <Text style={styles.emptySubtitle}>
            Adicione produtos e eles aparecerão aqui
          </Text>
          <TouchableOpacity
            style={styles.continueShoppingButton}
            onPress={onNavigateToHome}
          >
            <Text style={styles.continueShoppingText}>Continuar Comprando</Text>
          </TouchableOpacity>
        </View>

        {/* Navegação inferior */}
        <BottomNavigation
          activeTab="cart"
          onNavigate={(tabId) => {
            if (tabId === 'home') {
              onNavigateToHome();
            } else if (tabId === 'categories') {
              onNavigateToCategories && onNavigateToCategories();
            } else if (tabId === 'account') {
              onNavigateToAccount && onNavigateToAccount();
            }
          }}
        />
      </SafeAreaView>
    );
  }

  // Renderizar carrinho com itens
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
        <Text style={styles.headerTitle}>Carrinho</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Título com contagem */}
        <Text style={styles.cartTitle}>Meu Carrinho ({getCartCount()})</Text>

        {/* Lista de itens */}
        {cartItems.map((item) => (
          <View key={item.id} style={styles.cartItem}>
            <Image source={{ uri: item.image }} style={styles.itemImage} />

            <View style={styles.itemDetails}>
              <Text style={styles.itemBrand}>{item.brand}</Text>
              <Text style={styles.itemName} numberOfLines={2}>
                {item.name}
              </Text>
              <Text style={styles.itemPrice}>R$ {item.price.toFixed(2)}</Text>

              {/* Controles de quantidade */}
              <View style={styles.quantityContainer}>
                <Text style={styles.qtyLabel}>Qtd:</Text>
                <TouchableOpacity
                  style={styles.qtyButton}
                  onPress={() => updateQuantity(item.id, item.quantity - 1)}
                >
                  <Text style={styles.qtyButtonText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.qtyValue}>{item.quantity}</Text>
                <TouchableOpacity
                  style={styles.qtyButton}
                  onPress={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  <Text style={styles.qtyButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Preço total e botão remover */}
            <View style={styles.itemRight}>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeFromCart(item.id)}
              >
                <Icon name="delete" size={normalize(20)} color="#DC3545" />
              </TouchableOpacity>
              <Text style={styles.itemTotalPrice}>
                R$ {(item.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          </View>
        ))}

        {/* Cupom */}
        <View style={styles.couponContainer}>
          <TextInput
            style={styles.couponInput}
            placeholder="Código do cupom"
            placeholderTextColor={COLORS.textLight}
            value={couponCode}
            onChangeText={setCouponCode}
          />
          <TouchableOpacity style={styles.couponButton}>
            <Text style={styles.couponButtonText}>Aplicar</Text>
          </TouchableOpacity>
        </View>

        {/* Resumo do Pedido */}
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Resumo do Pedido</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>R$ {subtotal.toFixed(2)}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Frete</Text>
            <Text style={[styles.summaryValue, shippingCost === 0 && styles.freeShipping]}>
              {shippingCost === 0 ? 'Grátis' : `R$ ${shippingCost.toFixed(2)}`}
            </Text>
          </View>

          {subtotal >= freeShippingThreshold ? (
            <View style={styles.freeShippingInfo}>
              <Icon name="check" size={normalize(14)} color={COLORS.secondary} style={styles.checkmark} />
              <Text style={styles.freeShippingText}>
                Você ganhou frete grátis!
              </Text>
            </View>
          ) : (
            <View style={styles.shippingWarning}>
              <Icon name="box" size={normalize(14)} color="#F57C00" style={styles.warningIcon} />
              <Text style={styles.shippingWarningText}>
                Faltam R$ {remainingForFreeShipping.toFixed(2)} para ganhar frete grátis
              </Text>
            </View>
          )}

          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>R$ {total.toFixed(2)}</Text>
          </View>
        </View>

        {/* Botões */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity onPress={handleCheckout}>
            <LinearGradient
              colors={[COLORS.gradientStart, COLORS.gradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.checkoutButton}
            >
              <Text style={styles.checkoutButtonText}>Finalizar Compra</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.continueButton}
            onPress={onNavigateToHome}
          >
            <Text style={styles.continueButtonText}>Continuar Comprando</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Navegação inferior */}
      <BottomNavigation
        activeTab="cart"
        onNavigate={(tabId) => {
          if (tabId === 'home') {
            onNavigateToHome();
          } else if (tabId === 'categories') {
            onNavigateToCategories && onNavigateToCategories();
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
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.gray,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: 24,
  },
  continueShoppingButton: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 8,
  },
  continueShoppingText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 15,
  },
  // Cart with items
  content: {
    flex: 1,
  },
  cartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: COLORS.background,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
  },
  itemBrand: {
    fontSize: 11,
    color: COLORS.textLight,
    marginBottom: 2,
  },
  itemName: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.secondary,
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qtyLabel: {
    fontSize: 12,
    color: COLORS.text,
    marginRight: 8,
  },
  qtyButton: {
    width: 28,
    height: 28,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyButtonText: {
    fontSize: 16,
    color: COLORS.text,
  },
  qtyValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginHorizontal: 12,
    minWidth: 24,
    textAlign: 'center',
  },
  itemRight: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  removeButton: {
    padding: 4,
  },
  itemTotalPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  // Coupon
  couponContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
    gap: 12,
  },
  couponInput: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
  },
  couponButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 8,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  couponButtonText: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '600',
  },
  // Summary
  summaryContainer: {
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.text,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  freeShipping: {
    color: COLORS.secondary,
  },
  freeShippingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5F5',
    padding: 8,
    borderRadius: 6,
    marginVertical: 8,
  },
  checkmark: {
    marginRight: 8,
  },
  freeShippingText: {
    flex: 1,
    fontSize: 11,
    color: COLORS.secondary,
  },
  shippingWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF4E6',
    padding: 8,
    borderRadius: 6,
    marginVertical: 8,
  },
  warningIcon: {
    marginRight: 8,
  },
  shippingWarningText: {
    flex: 1,
    fontSize: 11,
    color: '#F57C00',
    fontWeight: '600',
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.secondary,
  },
  // Buttons
  buttonsContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  checkoutButton: {
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  checkoutButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  continueButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  continueButtonText: {
    color: COLORS.secondary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  bottomSpacing: {
    height: 20,
  },
});
