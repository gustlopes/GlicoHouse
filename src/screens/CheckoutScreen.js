import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../constants/colors';
import { normalize } from '../utils/responsive';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import Icon from '../components/Icon';

export default function CheckoutScreen({ onBack, onOrderComplete }) {
  const insets = useSafeAreaInsets();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { createOrder } = useOrders();
  const [currentStep, setCurrentStep] = useState(1);

  // Estados do Endereço
  const [cep, setCep] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');

  // Estados do Pagamento
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardValidity, setCardValidity] = useState('');
  const [cardCVV, setCardCVV] = useState('');
  const [installments, setInstallments] = useState(1);
  const [showInstallmentsModal, setShowInstallmentsModal] = useState(false);
  const [couponCode, setCouponCode] = useState('');

  const subtotal = getCartTotal();
  const freeShippingThreshold = 149;
  const shippingCost = subtotal >= freeShippingThreshold ? 0 : 20;
  const total = subtotal + shippingCost;

  // Função para calcular valor da parcela
  const calculateInstallment = (numInstallments) => {
    if (numInstallments <= 4) {
      // Até 4x sem juros
      return total / numInstallments;
    } else {
      // De 5x a 12x com 5% de juros ao mês (juros compostos)
      const interestRate = 0.05; // 5% ao mês
      const totalWithInterest = total * Math.pow(1 + interestRate, numInstallments);
      return totalWithInterest / numInstallments;
    }
  };

  // Função para gerar opções de parcelamento
  const getInstallmentOptions = () => {
    const options = [];
    for (let i = 1; i <= 12; i++) {
      const value = calculateInstallment(i);
      const hasInterest = i > 4;
      options.push({
        number: i,
        value: value,
        hasInterest: hasInterest,
        label: hasInterest
          ? `${i}x de R$ ${value.toFixed(2)} com juros`
          : `${i}x de R$ ${value.toFixed(2)} sem juros`,
      });
    }
    return options;
  };

  const validateStep1 = () => {
    if (!cep || !rua || !numero || !bairro || !cidade || !estado) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos obrigatórios do endereço.');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (paymentMethod === 'credit' || paymentMethod === 'debit') {
      if (!cardNumber || !cardName || !cardValidity || !cardCVV) {
        Alert.alert('Atenção', 'Por favor, preencha todos os dados do cartão.');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (validateStep1()) {
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      if (validateStep2()) {
        setCurrentStep(3);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinishOrder = () => {
    const address = {
      cep,
      rua,
      numero,
      complemento,
      bairro,
      cidade,
      estado,
    };

    const payment = {
      method: paymentMethod,
      cardNumber: cardNumber.slice(-4),
      installments,
    };

    const orderData = {
      products: cartItems,
      address,
      payment,
      subtotal,
      shippingCost,
      // Passa o total com juros se for cartão de crédito e parcelado com juros
 total: paymentMethod === 'credit' ? (calculateInstallment(installments) * installments) : (paymentMethod === 'pix' ? total * 0.95 : total),
    };

    const newOrder = createOrder(orderData);
    clearCart();
    onOrderComplete(newOrder);
  }; 

  const interestAmount = paymentMethod === 'credit' && installments > 4 ? (calculateInstallment(installments) * installments) - total : 0;


  const renderStepIndicator = () => {
    const steps = [
      { id: 1, title: 'Endereço', icon: 'location' },
      { id: 2, title: 'Pagamento', icon: 'card' },
      { id: 3, title: 'Confirmar', icon: 'check' },
    ];

    return (
      <View style={styles.stepIndicator}>
        {steps.map((step, index) => (
          <View key={step.id} style={styles.stepItem}>
            <View
              style={[
                styles.stepCircle,
                currentStep >= step.id && styles.stepCircleActive,
              ]}
            >
              <Icon
                name={step.icon}
                size={normalize(18)}
                color={currentStep >= step.id ? COLORS.white : COLORS.textLight}
              />
            </View>
            <Text
              style={[
                styles.stepTitle,
                currentStep >= step.id && styles.stepTitleActive,
              ]}
            >
              {step.title}
            </Text>
            {index < steps.length - 1 && (
              <View
                style={[
                  styles.stepLine,
                  currentStep > step.id && styles.stepLineActive,
                ]}
              />
            )}
          </View>
        ))}
      </View>
    );
  };

  const renderStep1 = () => (
    <View style={styles.stepContent}>
      <View style={styles.sectionHeader}>
        <Icon name="location" size={normalize(20)} color={COLORS.secondary} />
        <Text style={styles.sectionTitle}>Endereço de Entrega</Text>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>CEP *</Text>
        <TextInput
          style={styles.input}
          placeholder="00000-000"
          placeholderTextColor={COLORS.textLight}
          value={cep.replace(/^(\d{5})(\d)/, '$1-$2')} // Formata para 00000-000
          onChangeText={(text) => {
            const cleaned = text.replace(/\D/g, ''); // Remove tudo que não for dígito
            setCep(cleaned);
          }}
          onBlur={() => {
            if (cep.length > 0 && cep.length !== 8) {
              Alert.alert('CEP inválido', 'Por favor, insira um CEP com 8 dígitos.');
            }
          }}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.formRow}>
        <View style={[styles.formGroup, { flex: 2 }]}>
          <Text style={styles.label}>Rua *</Text>
          <TextInput
            style={styles.input}
            placeholder="Nome da rua"
            placeholderTextColor={COLORS.textLight}
            value={rua}
            onChangeText={setRua}
            onBlur={() => {
              if (rua.length < 3 && rua.length > 0) Alert.alert('Rua inválida', 'Por favor, insira um nome de rua válido.');
            }}
          />
        </View>
        <View style={[styles.formGroup, { flex: 1, marginLeft: 12 }]}>
          <Text style={styles.label}>Número *</Text>
          <TextInput
            style={styles.input}
            placeholder="123"
            placeholderTextColor={COLORS.textLight}
            value={numero}
            onChangeText={setNumero}
            onBlur={() => {
              if (!/^\d+$/.test(numero) && numero.length > 0) Alert.alert('Número inválido', 'Por favor, insira apenas números.');
            }}
            keyboardType="numeric"
          />
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Complemento</Text>
        <TextInput
          style={styles.input}
          placeholder="Apartamento, bloco, etc."
          placeholderTextColor={COLORS.textLight}
          value={complemento}
          onChangeText={setComplemento}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Bairro *</Text>
        <TextInput
          style={styles.input}
          placeholder="Nome do bairro"
          placeholderTextColor={COLORS.textLight}
          value={bairro}
          onChangeText={setBairro}
            onBlur={() => {
              if (bairro.length < 3 && bairro.length > 0) Alert.alert('Bairro inválido', 'Por favor, insira um nome de bairro válido.');
            }}
        />
      </View>

      <View style={styles.formRow}>
        <View style={[styles.formGroup, { flex: 2 }]}>
          <Text style={styles.label}>Cidade *</Text>
          <TextInput
            style={styles.input}
            placeholder="Cidade"
            placeholderTextColor={COLORS.textLight}
            value={cidade}
            onChangeText={setCidade}
            onBlur={() => {
              if (cidade.length < 3 && cidade.length > 0) Alert.alert('Cidade inválida', 'Por favor, insira um nome de cidade válido.');
            }}
          />
        </View>
        <View style={[styles.formGroup, { flex: 1, marginLeft: 12 }]}>
          <Text style={styles.label}>Estado *</Text>
          <TextInput
            style={styles.input}
            placeholder="SP"
            placeholderTextColor={COLORS.textLight}
            value={estado}
            onChangeText={setEstado}
            onBlur={() => {
              if (!/^[A-Z]{2}$/.test(estado) && estado.length > 0) Alert.alert('Estado inválido', 'Por favor, insira a sigla do estado (ex: SP).');
            }}
            maxLength={2}
          />
        </View>
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContent}>
      <View style={styles.sectionHeader}>
        <Icon name="card" size={normalize(20)} color={COLORS.secondary} />
        <Text style={styles.sectionTitle}>Forma de Pagamento</Text>
      </View>

      <View style={styles.paymentMethods}>
        <TouchableOpacity
          style={[
            styles.paymentOption,
            paymentMethod === 'credit' && styles.paymentOptionActive,
          ]}
          onPress={() => setPaymentMethod('credit')}
        >
          <View
            style={[
              styles.radioButton,
              paymentMethod === 'credit' && styles.radioButtonActive,
            ]}
          >
            {paymentMethod === 'credit' && <View style={styles.radioButtonInner} />}
          </View>
          <Text style={styles.paymentText}>Cartão de Crédito</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.paymentOption,
            paymentMethod === 'debit' && styles.paymentOptionActive,
          ]}
          onPress={() => setPaymentMethod('debit')}
        >
          <View
            style={[
              styles.radioButton,
              paymentMethod === 'debit' && styles.radioButtonActive,
            ]}
          >
            {paymentMethod === 'debit' && <View style={styles.radioButtonInner} />}
          </View>
          <Text style={styles.paymentText}>Cartão de Débito</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.paymentOption,
            paymentMethod === 'pix' && styles.paymentOptionActive,
          ]}
          onPress={() => setPaymentMethod('pix')}
        >
          <View
            style={[
              styles.radioButton,
              paymentMethod === 'pix' && styles.radioButtonActive,
            ]}
          >
            {paymentMethod === 'pix' && <View style={styles.radioButtonInner} />}
          </View>
          <Text style={styles.paymentText}>PIX (5% de desconto)</Text>
        </TouchableOpacity>
      </View>

      {(paymentMethod === 'credit' || paymentMethod === 'debit') && (
        <>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Número do Cartão *</Text>
            <TextInput
              style={styles.input}
              placeholder="XXXX XXXX XXXX XXXX"
              placeholderTextColor={COLORS.textLight}
              value={cardNumber.replace(/(\d{4})(?=\d)/g, '$1 ')} // Adiciona espaço a cada 4 dígitos
              onChangeText={(text) => {
                const cleaned = text.replace(/\D/g, ''); // Remove tudo que não for dígito
                if (cleaned.length <= 16) {
                  setCardNumber(cleaned);
                }
              }}
              keyboardType="numeric"
              maxLength={19}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Nome no Cartão *</Text>
            <TextInput
              style={styles.input}
              placeholder="Como impresso no cartão"
              placeholderTextColor={COLORS.textLight}
              value={cardName}
              onChangeText={setCardName}
              onBlur={() => {
                if (cardName.length < 3 && cardName.length > 0) Alert.alert('Nome inválido', 'Por favor, insira o nome completo como impresso no cartão.');
              }}
            />
          </View>

          <View style={styles.formRow}>
            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={styles.label}>Validade *</Text>
              <TextInput
                style={styles.input}
                placeholder="MM/YY"
                placeholderTextColor={COLORS.textLight}
                value={cardValidity.replace(/^(\d{2})(\d)/, '$1/$2')} // Formata para MM/AA
                onChangeText={(text) => {
                  const cleaned = text.replace(/\D/g, ''); // Remove tudo que não for dígito
                  if (cleaned.length <= 4) {
                    setCardValidity(cleaned);
                  }
                }}
                maxLength={5}
              />
            </View>
            <View style={[styles.formGroup, { flex: 1, marginLeft: 12 }]}>
              <Text style={styles.label}>CVV *</Text>
              <TextInput
                style={styles.input}
                placeholder="123"
                placeholderTextColor={COLORS.textLight}
                value={cardCVV.replace(/\D/g, '')} // Garante que apenas dígitos sejam exibidos
                onChangeText={(text) => {
                  const cleaned = text.replace(/\D/g, ''); // Remove tudo que não for dígito
                  if (cleaned.length <= 3) {
                    setCardCVV(cleaned);
                  }
                }}
                onBlur={() => {
                  if (!/^\d{3}$/.test(cardCVV) && cardCVV.length > 0) Alert.alert('CVV inválido', 'Por favor, insira um CVV de 3 dígitos.');
                }}
                keyboardType="numeric"
                maxLength={3}
                secureTextEntry
              />
            </View>
          </View>

          {paymentMethod === 'credit' && (
            <View style={styles.formGroup}>
              <Text style={styles.label}>Parcelamento</Text>
              <TouchableOpacity
                style={styles.installmentsContainer}
                onPress={() => setShowInstallmentsModal(true)}
              >
                <Text style={styles.installmentsText}>
                  {installments}x de R$ {calculateInstallment(installments).toFixed(2)}{' '}
                  {installments <= 4 ? 'sem juros' : 'com juros'}
                </Text>
                <Text style={styles.dropdownArrow}>▼</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}

      <View style={styles.couponSection}>
        <View style={styles.sectionHeader}>
          <Icon name="tag" size={normalize(18)} color={COLORS.secondary} />
          <Text style={styles.sectionTitle}>Cupom de Desconto</Text>
        </View>
        <View style={styles.couponInputContainer}>
          <TextInput
            style={styles.couponInput}
            placeholder="Digite o código do cupom"
            placeholderTextColor={COLORS.textLight}
            value={couponCode}
            onChangeText={setCouponCode}
          />
          <TouchableOpacity style={styles.applyCouponButton}>
            <Text style={styles.applyCouponText}>Aplicar</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.couponTip}>
          <Icon name="info" size={normalize(14)} color="#1976D2" />
          <Text style={styles.couponTipText}>
            Use o cupom 1compra e ganhe 10% de desconto na sua primeira compra!
          </Text>
        </View>
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContent}>
      <View style={styles.sectionHeader}>
        <Icon name="check-circle" size={normalize(20)} color={COLORS.secondary} />
        <Text style={styles.sectionTitle}>Resumo do Pedido</Text>
      </View>

      <View style={styles.summarySection}>
        <Text style={styles.summaryLabel}>Endereço de Entrega:</Text>
        <Text style={styles.summaryValue}>
          {rua}, {numero}
          {complemento ? `, ${complemento}` : ''}
        </Text>
        <Text style={styles.summaryValue}>
          {bairro} - {cidade}/{estado}
        </Text>
        <Text style={styles.summaryValue}>CEP: {cep}</Text>
      </View>

      <View style={styles.summarySection}>
        <Text style={styles.summaryLabel}>Pagamento:</Text>
        <Text style={styles.summaryValue}>
          {paymentMethod === 'credit' && 'Cartão de Crédito'}
          {paymentMethod === 'debit' && 'Cartão de Débito'}
          {paymentMethod === 'pix' && 'PIX (5% de desconto)'}
        </Text>
        {(paymentMethod === 'credit' || paymentMethod === 'debit') && (
          <Text style={styles.summaryValue}>**** **** **** {cardNumber.slice(-4)}</Text>
        )}
      </View>

      <View style={styles.orderSummary}>
        <View style={styles.orderSummaryRow}>
          <Text style={styles.orderSummaryLabel}>Subtotal:</Text>
          <Text style={styles.orderSummaryValue}>R$ {subtotal.toFixed(2)}</Text>
        </View>
        <View style={styles.orderSummaryRow}>
          <Text style={styles.orderSummaryLabel}>Frete:</Text>
          <Text style={[styles.orderSummaryValue, shippingCost === 0 && styles.freeText]}>
            {shippingCost === 0 ? 'Grátis' : `R$ ${shippingCost.toFixed(2)}`}
            </Text>
        </View>
        {interestAmount > 0 && (
 <View style={styles.orderSummaryRow}>
 <Text style={styles.orderSummaryLabel}>Juros:</Text>
 <Text style={styles.orderSummaryValue}>R$ {interestAmount.toFixed(2)}</Text>
 </View>
 )}
        <View style={[styles.orderSummaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalValue}>R$ {(paymentMethod === 'credit' ? (calculateInstallment(installments) * installments) : (paymentMethod === 'pix' ? total * 0.95 : total)).toFixed(2)}</Text>
        </View>
 </View>
 </View>
 );

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
        <Text style={styles.headerTitle}>Finalizar Compra</Text>
        <View style={styles.placeholder} />
      </LinearGradient>

      {/* Step Indicator */}
      {renderStepIndicator()}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={styles.navigationButtons}>
        {currentStep > 1 && (
          <TouchableOpacity
            style={styles.previousButton}
            onPress={handlePrevious}
          >
            <Text style={styles.previousButtonText}>Anterior</Text>
          </TouchableOpacity>
        )}

        {currentStep < 3 ? (
          <TouchableOpacity
            style={[styles.nextButton, currentStep === 1 && styles.nextButtonFull]}
            onPress={handleNext}
          >
            <LinearGradient
              colors={[COLORS.gradientStart, COLORS.gradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.nextButtonGradient}
            >
              <Text style={styles.nextButtonText}>Próximo</Text>
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.finishButton}
            onPress={handleFinishOrder}
          >
            <LinearGradient
              colors={[COLORS.gradientStart, COLORS.gradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.nextButtonGradient}
            >
              <Text style={styles.nextButtonText}>Finalizar Pedido</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>

      {/* Modal de Parcelamento */}
      <Modal
        visible={showInstallmentsModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowInstallmentsModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowInstallmentsModal(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Escolha o parcelamento</Text>
              <TouchableOpacity onPress={() => setShowInstallmentsModal(false)}>
                <Icon name="close" size={normalize(24)} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.installmentsScrollView} showsVerticalScrollIndicator={false}>
              {getInstallmentOptions().map((option) => (
                <TouchableOpacity
                  key={option.number}
                  style={[
                    styles.installmentOption,
                    installments === option.number && styles.installmentOptionActive,
                  ]}
                  onPress={() => {
                    setInstallments(option.number);
                    setShowInstallmentsModal(false);
                  }}
                >
                  <View style={styles.installmentOptionContent}>
                    <Text
                      style={[
                        styles.installmentOptionText,
                        installments === option.number && styles.installmentOptionTextActive,
                      ]}
                    >
                      {option.label}
                    </Text>
                    {option.number === 1 && (
                      <View style={styles.recommendedBadge}>
                        <Text style={styles.recommendedText}>Recomendado</Text>
                      </View>
                    )}
                    {option.number === 4 && !option.hasInterest && (
                      <View style={styles.noInterestBadge}>
                        <Text style={styles.noInterestText}>Sem juros</Text>
                      </View>
                    )}
                  </View>
                  {option.hasInterest && (
                    <Text style={styles.totalWithInterestText}>
                      Total: R$ {(option.value * option.number).toFixed(2)}
                    </Text>
                  )}
                  {installments === option.number && (
                    <Icon name="check" size={normalize(20)} color={COLORS.secondary} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
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
    textAlign: 'center',
  },
  placeholder: {
    width: 32,
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  stepItem: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.gray,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  stepCircleActive: {
    backgroundColor: COLORS.secondary,
  },
  stepTitle: {
    fontSize: 11,
    color: COLORS.textLight,
    fontWeight: '600',
  },
  stepTitleActive: {
    color: COLORS.secondary,
  },
  stepLine: {
    position: 'absolute',
    top: 20,
    left: '50%',
    width: '100%',
    height: 2,
    backgroundColor: COLORS.gray,
    zIndex: -1,
  },
  stepLineActive: {
    backgroundColor: COLORS.secondary,
  },
  content: {
    flex: 1,
  },
  stepContent: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginLeft: 8,
  },
  formGroup: {
    marginBottom: 16,
  },
  formRow: {
    flexDirection: 'row',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: COLORS.text,
  },
  paymentMethods: {
    marginBottom: 16,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: COLORS.gray,
  },
  paymentOptionActive: {
    borderColor: COLORS.secondary,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.gray,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioButtonActive: {
    borderColor: COLORS.secondary,
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.secondary,
  },
  paymentText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  installmentsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 8,
    padding: 12,
  },
  installmentsText: {
    fontSize: 13,
    color: COLORS.text,
    flex: 1,
  },
  dropdownArrow: {
    fontSize: 10,
    color: COLORS.textLight,
    marginLeft: 8,
  },
  couponSection: {
    marginTop: 16,
    padding: 16,
    backgroundColor: COLORS.white,
    borderRadius: 12,
  },
  couponInputContainer: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  couponInput: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
  },
  applyCouponButton: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
  },
  applyCouponText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 13,
  },
  couponTip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    padding: 10,
    borderRadius: 8,
    marginTop: 12,
  },
  couponTipText: {
    flex: 1,
    fontSize: 11,
    color: '#1976D2',
    marginLeft: 8,
  },
  summarySection: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 13,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  orderSummary: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
  },
  orderSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  orderSummaryLabel: {
    fontSize: 13,
    color: COLORS.text,
  },
  orderSummaryValue: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  freeText: {
    color: COLORS.secondary,
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
  bottomSpacing: {
    height: 20,
  },
  navigationButtons: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray,
    gap: 12,
  },
  previousButton: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.secondary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previousButtonText: {
    color: COLORS.secondary,
    fontWeight: 'bold',
    fontSize: 15,
  },
  nextButton: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  nextButtonFull: {
    flex: 2,
  },
  finishButton: {
    flex: 2,
    borderRadius: 8,
    overflow: 'hidden',
  },
  nextButtonGradient: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 15,
  },
  // Estilos do Modal de Parcelamento
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  installmentsScrollView: {
    padding: 16,
  },
  installmentOption: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  installmentOptionActive: {
    borderColor: COLORS.secondary,
    backgroundColor: '#E8F5F5',
  },
  installmentOptionContent: {
    flex: 1,
  },
  installmentOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  installmentOptionTextActive: {
    color: COLORS.secondary,
  },
  totalWithInterestText: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 4,
  },
  recommendedBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  recommendedText: {
    fontSize: 10,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  noInterestBadge: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  noInterestText: {
    fontSize: 10,
    color: COLORS.white,
    fontWeight: 'bold',
  },
});
