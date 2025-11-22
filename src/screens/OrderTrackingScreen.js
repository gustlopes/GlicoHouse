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
import { useOrders } from '../context/OrderContext';
import CartIcon from '../components/CartIcon';
import Icon from '../components/Icon';

export default function OrderTrackingScreen({ onBack, onNavigateToCart }) {
  const insets = useSafeAreaInsets();
  const { orders } = useOrders();
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  // Se nenhum pedido selecionado e existem pedidos, seleciona o primeiro
  const order = selectedOrderId
    ? orders.find(o => o.id === selectedOrderId)
    : orders.length > 0 ? orders[0] : null;

  // Renderiza estado vazio quando não há pedidos
  if (orders.length === 0) {
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
          <Text style={styles.headerTitle}>Acompanhar Pedido</Text>
          <CartIcon onPress={onNavigateToCart} />
        </LinearGradient>

        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Icon name="box" size={normalize(48)} color={COLORS.textLight} />
          </View>
          <Text style={styles.emptyTitle}>Nenhum pedido encontrado</Text>
          <Text style={styles.emptySubtitle}>
            Você ainda não realizou nenhum pedido
          </Text>
          <TouchableOpacity style={styles.shopButton} onPress={onBack}>
            <Text style={styles.shopButtonText}>Começar a Comprar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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
        <Text style={styles.headerTitle}>Acompanhar Pedido</Text>
        <CartIcon onPress={onNavigateToCart} />
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Lista de Pedidos (se houver mais de um) */}
        {orders.length > 1 && (
          <View style={styles.ordersListSection}>
            <Text style={styles.ordersListTitle}>Seus Pedidos</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {orders.map((o) => (
                <TouchableOpacity
                  key={o.id}
                  style={[
                    styles.orderChip,
                    order.id === o.id && styles.orderChipActive,
                  ]}
                  onPress={() => setSelectedOrderId(o.id)}
                >
                  <Text
                    style={[
                      styles.orderChipText,
                      order.id === o.id && styles.orderChipTextActive,
                    ]}
                  >
                    {o.id}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Banner do Pedido */}
        <LinearGradient
          colors={[COLORS.gradientStart, COLORS.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.orderBanner}
        >
          <View style={styles.bannerIconContainer}>
            <Icon name="box" size={normalize(28)} color={COLORS.white} />
          </View>
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>Acompanhar Pedido</Text>
            <Text style={styles.bannerOrderId}>Pedido {order.id}</Text>
          </View>
        </LinearGradient>

        {/* Card de Informações do Pedido */}
        <View style={styles.orderCard}>
          <View style={styles.orderHeader}>
            <View>
              <Text style={styles.orderId}>Pedido {order.id}</Text>
              <Text style={styles.orderDate}>Realizado em {order.date}</Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{order.status}</Text>
            </View>
          </View>

          <View style={styles.estimateContainer}>
            <Icon name="clock" size={normalize(16)} color="#1976D2" style={styles.clockIcon} />
            <Text style={styles.estimateText}>
              Chega em até {order.estimatedDays} dias úteis
            </Text>
          </View>
        </View>

        {/* Produtos */}
        <View style={styles.productsSection}>
          <Text style={styles.sectionTitle}>Produtos:</Text>
          {order.products.map((product) => (
            <View key={product.id} style={styles.productItem}>
              <Image source={{ uri: product.image }} style={styles.productImage} />
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productQuantity}>Quantidade: {product.quantity}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Timeline de Status */}
        <View style={styles.timelineSection}>
          <Text style={styles.sectionTitle}>Status do Pedido</Text>
          <View style={styles.timeline}>
            {order.timeline.map((item, index) => (
              <View key={item.id} style={styles.timelineItem}>
                <View style={styles.timelineLeft}>
                  <View
                    style={[
                      styles.timelineIcon,
                      { backgroundColor: item.color },
                      item.status === 'pending' && styles.timelineIconPending,
                    ]}
                  >
                    <Icon name={item.icon} size={normalize(18)} color={COLORS.white} />
                  </View>
                  {index < order.timeline.length - 1 && (
                    <View
                      style={[
                        styles.timelineLine,
                        item.status === 'pending' && styles.timelineLinePending,
                      ]}
                    />
                  )}
                </View>

                <View style={styles.timelineContent}>
                  <Text
                    style={[
                      styles.timelineTitle,
                      item.status === 'pending' && styles.timelineTitlePending,
                    ]}
                  >
                    {item.title}
                  </Text>
                  {item.subtitle && (
                    <Text style={styles.timelineSubtitle}>{item.subtitle}</Text>
                  )}
                  {item.date && (
                    <Text style={styles.timelineDate}>
                      {item.date} - {item.time}
                    </Text>
                  )}
                  {item.description && item.status === 'current' && (
                    <View style={styles.currentStatusBadge}>
                      <Text style={styles.currentStatusText}>{item.description}</Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
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
  orderBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
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
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 4,
  },
  bannerOrderId: {
    fontSize: 13,
    color: COLORS.white,
    opacity: 0.95,
  },
  orderCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderId: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  statusBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  estimateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    padding: 10,
    borderRadius: 8,
  },
  clockIcon: {
    marginRight: 8,
  },
  estimateText: {
    fontSize: 12,
    color: '#1976D2',
    fontWeight: '600',
  },
  productsSection: {
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: COLORS.background,
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
  },
  productName: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  productQuantity: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  timelineSection: {
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  timeline: {
    marginTop: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: 16,
  },
  timelineIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineIconPending: {
    backgroundColor: '#E0E0E0',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: COLORS.secondary,
    marginTop: 4,
    minHeight: 40,
  },
  timelineLinePending: {
    backgroundColor: '#E0E0E0',
  },
  timelineContent: {
    flex: 1,
    paddingTop: 8,
  },
  timelineTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  timelineTitlePending: {
    color: COLORS.textLight,
  },
  timelineSubtitle: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 2,
  },
  timelineDate: {
    fontSize: 11,
    color: COLORS.textLight,
  },
  currentStatusBadge: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  currentStatusText: {
    fontSize: 11,
    color: '#F57C00',
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 20,
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
  shopButton: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 8,
  },
  shopButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 15,
  },
  // Orders List
  ordersListSection: {
    paddingVertical: 16,
    paddingLeft: 16,
    backgroundColor: COLORS.white,
    marginBottom: 16,
  },
  ordersListTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  orderChip: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 2,
    borderColor: COLORS.gray,
  },
  orderChipActive: {
    backgroundColor: COLORS.secondary,
    borderColor: COLORS.secondary,
  },
  orderChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  orderChipTextActive: {
    color: COLORS.white,
  },
});
