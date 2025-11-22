import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../constants/colors';
import { normalize } from '../utils/responsive';
import CartIcon from '../components/CartIcon';
import Icon from '../components/Icon';
import { useAuth } from '../context/AuthContext';

export default function ConsultationScreen({ onBack, onNavigateToCart, onNavigateToRegister }) {
  const { isLoggedIn } = useAuth();
  const [isNotified, setIsNotified] = useState(false);
  const insets = useSafeAreaInsets();

  const handleNotifyMe = () => {
    if (!isLoggedIn) {
      // Se não estiver logado, navega para o cadastro
      onNavigateToRegister && onNavigateToRegister();
    } else {
      // Se já estiver logado, marca como notificado e mostra mensagem
      setIsNotified(true);
      Alert.alert(
        'Notificação Ativada',
        'Você já está cadastrado e será notificado assim que o serviço estiver disponível.',
        [{ text: 'OK' }]
      );
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
        <Text style={styles.headerTitle}>Consulta Especializada</Text>
        <CartIcon onPress={onNavigateToCart} />
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Banner de Consulta */}
        <View style={styles.bannerContainer}>
          <LinearGradient
            colors={['#0077B6', '#00C896']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.banner}
          >
            <View style={styles.bannerIconContainer}>
              <Text style={styles.bannerIcon}>💬</Text>
            </View>
            <View style={styles.bannerContent}>
              <Text style={styles.bannerTitle}>Consulta Especializada</Text>
              <Text style={styles.bannerSubtitle}>
                Orientação profissional para diabetes
              </Text>
            </View>
          </LinearGradient>
        </View>

        {/* Card de Status - Em Desenvolvimento */}
        <View style={styles.statusCard}>
          <View style={styles.statusIconContainer}>
            <Text style={styles.statusIcon}>🕐</Text>
          </View>
          <Text style={styles.statusTitle}>Em Desenvolvimento</Text>
          <Text style={styles.statusDescription}>
            Estamos preparando um serviço completo de consultas online com
            especialistas em diabetes.
          </Text>
          <Text style={styles.statusSubDescription}>
            Em breve você poderá agendar consultas com endocrinologistas e
            nutricionistas especializados.
          </Text>
        </View>

        {/* O que você poderá fazer */}
        <View style={styles.featuresSection}>
          <Text style={styles.featuresTitle}>O que você poderá fazer:</Text>

          {/* Feature 1 */}
          <View style={styles.featureItem}>
            <View style={styles.checkmarkContainer}>
              <Icon name="check" size={normalize(14)} color={COLORS.secondary} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>
                Consultas online com endocrinologistas
              </Text>
              <Text style={styles.featureDescription}>
                Especialistas em diabetes tipo 1 e 2
              </Text>
            </View>
          </View>

          {/* Feature 2 */}
          <View style={styles.featureItem}>
            <View style={styles.checkmarkContainer}>
              <Icon name="check" size={normalize(14)} color={COLORS.secondary} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>
                Orientação nutricional personalizada
              </Text>
              <Text style={styles.featureDescription}>
                Cardápios específicos para diabéticos
              </Text>
            </View>
          </View>

          {/* Feature 3 */}
          <View style={styles.featureItem}>
            <View style={styles.checkmarkContainer}>
              <Icon name="check" size={normalize(14)} color={COLORS.secondary} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Acompanhamento de resultados</Text>
              <Text style={styles.featureDescription}>
                Análise dos dados do seu glicosímetro
              </Text>
            </View>
          </View>

          {/* Feature 4 */}
          <View style={styles.featureItem}>
            <View style={styles.checkmarkContainer}>
              <Icon name="check" size={normalize(14)} color={COLORS.secondary} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>
                Orientação sobre medicamentos
              </Text>
              <Text style={styles.featureDescription}>
                Ajuste na insulina e outros medicamentos
              </Text>
            </View>
          </View>
        </View>

        {/* Estatísticas */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>150+</Text>
            <Text style={styles.statLabel}>Especialistas</Text>
            <Text style={styles.statLabel}>Cadastrados</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>24h</Text>
            <Text style={styles.statLabel}>Disponibilidade</Text>
            <Text style={styles.statLabel}>de Atendimento</Text>
          </View>
        </View>

        {/* Card de Notificação */}
        <View style={styles.notificationCard}>
          <View style={styles.notificationHeader}>
            <Text style={styles.notificationIcon}>🔔</Text>
            <Text style={styles.notificationTitle}>
              {isNotified && isLoggedIn ? 'Notificação Ativada' : 'Seja notificado'}
            </Text>
          </View>
          <Text style={styles.notificationDescription}>
            {isNotified && isLoggedIn
              ? 'Você já está cadastrado e será notificado assim que o serviço estiver disponível'
              : 'Cadastre-se para receber um aviso quando o serviço estiver disponível'}
          </Text>
          {(!isNotified || !isLoggedIn) && (
            <TouchableOpacity
              style={styles.notifyButton}
              onPress={handleNotifyMe}
            >
              <Text style={styles.notifyButtonText}>Quero ser notificado</Text>
            </TouchableOpacity>
          )}
          {isNotified && isLoggedIn && (
            <View style={styles.notifiedBadge}>
              <Icon name="check" size={normalize(16)} color={COLORS.secondary} style={styles.notifiedIcon} />
              <Text style={styles.notifiedText}>Você será notificado</Text>
            </View>
          )}
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
  content: {
    flex: 1,
  },
  bannerContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  bannerIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  bannerIcon: {
    fontSize: 24,
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
  bannerSubtitle: {
    fontSize: 13,
    color: COLORS.white,
    opacity: 0.9,
  },
  statusCard: {
    backgroundColor: '#FFF9E6',
    marginHorizontal: 16,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  statusIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFE082',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  statusIcon: {
    fontSize: 32,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  statusDescription: {
    fontSize: 14,
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 12,
  },
  statusSubDescription: {
    fontSize: 13,
    color: COLORS.secondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  featuresSection: {
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  checkmarkContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E8F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  checkmark: {
    fontSize: 14,
    color: COLORS.secondary,
    fontWeight: 'bold',
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  featureDescription: {
    fontSize: 12,
    color: COLORS.textLight,
    lineHeight: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.secondary,
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.text,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.gray,
    marginHorizontal: 16,
  },
  notificationCard: {
    backgroundColor: '#E8F5F5',
    marginHorizontal: 16,
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  notificationIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  notificationDescription: {
    fontSize: 13,
    color: COLORS.text,
    lineHeight: 18,
    marginBottom: 16,
  },
  notifyButton: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  notifyButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  notifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.secondary,
  },
  notifiedIcon: {
    fontSize: 16,
    color: COLORS.secondary,
    marginRight: 8,
    fontWeight: 'bold',
  },
  notifiedText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.secondary,
  },
  bottomSpacing: {
    height: 20,
  },
});
