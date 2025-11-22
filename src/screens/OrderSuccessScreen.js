import React from 'react';
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
import Icon from '../components/Icon';

export default function OrderSuccessScreen({ order, onNavigateToHome }) {
  const insets = useSafeAreaInsets();

  if (!order) {
    return null;
  }

  const getPaymentMethodText = () => {
    if (order.payment.method === 'credit') return 'Cartão de Crédito';
    if (order.payment.method === 'debit') return 'Cartão de Débito';
    if (order.payment.method === 'pix') return 'PIX';
    return 'N/A';
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
        <Text style={styles.headerTitle}>Pedido Confirmado</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Success Icon */}
        <View style={styles.successContainer}>
          <LinearGradient
            colors={[COLORS.gradientStart, COLORS.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.successIconContainer}
          >
            <Icon name="check" size={normalize(48)} color={COLORS.white} />
          </LinearGradient>
          <Text style={styles.successTitle}>Pedido Realizado com Sucesso!</Text>
          <Text style={styles.successSubtitle}>
            Seu pedido foi confirmado e já está sendo processado
          </Text>
        </View>

        {/* Order Details Card */}
        <View style={styles.orderCard}>
          <View style={styles.orderHeader}>
            <Text style={styles.orderLabel}>Número do Pedido</Text>
            <Text style={styles.orderNumber}>{order.id}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.orderInfo}>
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Icon name="calendar" size={normalize(16)} color={COLORS.secondary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Data do Pedido</Text>
                <Text style={styles.infoValue}>{order.date}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Icon name="location" size={normalize(16)} color={COLORS.secondary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Endereço de Entrega</Text>
                <Text style={styles.infoValue}>
                  {order.address.rua}, {order.address.numero}
                  {order.address.complemento ? `, ${order.address.complemento}` : ''}
                </Text>
                <Text style={styles.infoValue}>
                  {order.address.bairro} - {order.address.cidade}/{order.address.estado}
                </Text>
                <Text style={styles.infoValue}>CEP: {order.address.cep}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Icon name="card" size={normalize(16)} color={COLORS.secondary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Pagamento</Text>
                <Text style={styles.infoValue}>{getPaymentMethodText()}</Text>
                {order.payment.cardNumber && (
                  <Text style={styles.infoValue}>**** **** **** {order.payment.cardNumber}</Text>
                )}
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Icon name="clock" size={normalize(16)} color={COLORS.secondary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Previsão de Entrega</Text>
                <Text style={styles.infoValue}>
                  Em até {order.estimatedDays} dias úteis
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Resumo do Pedido</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>R$ {order.subtotal.toFixed(2)}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Frete</Text>
            <Text style={[styles.summaryValue, order.shippingCost === 0 && styles.freeText]}>
              {order.shippingCost === 0 ? 'Grátis' : `R$ ${order.shippingCost.toFixed(2)}`}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>R$ {order.total.toFixed(2)}</Text>
          </View>
        </View>

        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <Icon name="info" size={normalize(20)} color="#1976D2" />
          <View style={styles.infoBannerContent}>
            <Text style={styles.infoBannerTitle}>Acompanhe seu pedido</Text>
            <Text style={styles.infoBannerText}>
              Você pode acompanhar o status do seu pedido na aba "Minha Conta" → "Acompanhar Pedidos"
            </Text>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* OK Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={onNavigateToHome}>
          <LinearGradient
            colors={[COLORS.gradientStart, COLORS.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.okButton}
          >
            <Text style={styles.okButtonText}>OK</Text>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  content: {
    flex: 1,
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  successIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  orderCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  orderLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  orderNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.secondary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.gray,
    marginVertical: 16,
  },
  orderInfo: {
    gap: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E8F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 13,
    color: COLORS.textLight,
    marginBottom: 2,
  },
  summaryCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    fontSize: 13,
    color: COLORS.text,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  freeText: {
    color: COLORS.secondary,
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
  infoBanner: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  infoBannerContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoBannerTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 4,
  },
  infoBannerText: {
    fontSize: 12,
    color: '#1976D2',
    lineHeight: 18,
  },
  bottomSpacing: {
    height: 20,
  },
  buttonContainer: {
    padding: 16,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray,
  },
  okButton: {
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  okButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
