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
import CartIcon from '../components/CartIcon';
import BottomNavigation from '../components/BottomNavigation';
import Icon from '../components/Icon';
import { useAuth } from '../context/AuthContext';

export default function AccountScreen({ onNavigateToHome, onNavigateToCategories, onNavigateToCart, onNavigateToLogin, onNavigateToConsultation, onNavigateToOrderTracking }) {
  const { isLoggedIn, user, logout } = useAuth();
  const insets = useSafeAreaInsets();

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
        <Text style={styles.headerTitle}>Minha Conta</Text>
        <CartIcon onPress={onNavigateToCart} />
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Perfil do Usuário */}
        <View style={styles.profileSection}>
          {/* Avatar */}
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Icon name="user" size={normalize(48)} color="#5B8FAD" />
            </View>
          </View>

          {/* Info do usuário */}
          {isLoggedIn ? (
            <>
              <Text style={styles.profileTitle}>{user?.name || 'Usuário'}</Text>
              <Text style={styles.profileSubtitle}>{user?.email}</Text>

              {/* Botão de Logout */}
              <TouchableOpacity onPress={logout}>
                <View style={styles.logoutButton}>
                  <Text style={styles.logoutButtonText}>Sair</Text>
                </View>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.profileTitle}>Minha Conta</Text>
              <Text style={styles.profileSubtitle}>Faça login para acessar sua conta</Text>

              {/* Botão de Login */}
              <TouchableOpacity onPress={onNavigateToLogin}>
                <View style={styles.loginButton}>
                  <Text style={styles.loginButtonText}>Fazer Login</Text>
                </View>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Seção de Serviços */}
        <View style={styles.servicesSection}>
          <Text style={styles.sectionTitle}>Serviços</Text>

          {/* Card: Consulta Especializada */}
          <TouchableOpacity
            style={styles.serviceCard}
            onPress={onNavigateToConsultation}
          >
            <View style={[styles.serviceIconContainer, styles.serviceIconGreen]}>
              <Icon name="medical" size={normalize(24)} color={COLORS.secondary} />
            </View>
            <View style={styles.serviceInfo}>
              <Text style={styles.serviceTitle}>Consulta Especializada</Text>
              <Text style={styles.serviceSubtitle}>Fale com nossos especialistas</Text>
            </View>
            <Icon name="arrow-forward" size={normalize(20)} color={COLORS.textLight} style={styles.serviceArrow} />
          </TouchableOpacity>

          {/* Card: Acompanhar Pedidos */}
          <TouchableOpacity
            style={styles.serviceCard}
            onPress={onNavigateToOrderTracking}
          >
            <View style={[styles.serviceIconContainer, styles.serviceIconOrange]}>
              <Icon name="box" size={normalize(24)} color="#F57C00" />
            </View>
            <View style={styles.serviceInfo}>
              <Text style={styles.serviceTitle}>Acompanhar Pedidos</Text>
              <Text style={styles.serviceSubtitle}>Veja o status dos seus pedidos</Text>
            </View>
            <Icon name="arrow-forward" size={normalize(20)} color={COLORS.textLight} style={styles.serviceArrow} />
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Navegação inferior */}
      <BottomNavigation
        activeTab="account"
        onNavigate={(tabId) => {
          if (tabId === 'home') {
            onNavigateToHome();
          } else if (tabId === 'categories') {
            onNavigateToCategories();
          } else if (tabId === 'cart') {
            onNavigateToCart();
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
  content: {
    flex: 1,
  },
  profileSection: {
    backgroundColor: COLORS.white,
    paddingVertical: 32,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 8,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#D4E8F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  profileSubtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 24,
  },
  loginButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  loginButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.white,
  },
  logoutButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#DC3545',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  logoutButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#DC3545',
  },
  servicesSection: {
    backgroundColor: COLORS.white,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  serviceIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  serviceIconGreen: {
    backgroundColor: '#D1F2E8',
  },
  serviceIconOrange: {
    backgroundColor: '#FFE5D9',
  },
  serviceInfo: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  serviceSubtitle: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  serviceArrow: {
    marginLeft: 8,
  },
  bottomSpacing: {
    height: 20,
  },
});
