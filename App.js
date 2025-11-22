import React, { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CartProvider } from './src/context/CartContext';
import { AuthProvider } from './src/context/AuthContext';
import { OrderProvider } from './src/context/OrderContext';
import HomeScreen from './src/screens/HomeScreen';
import ProductsScreen from './src/screens/ProductsScreen';
import CategoriesScreen from './src/screens/CategoriesScreen';
import CartScreen from './src/screens/CartScreen';
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import AccountScreen from './src/screens/AccountScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import ConsultationScreen from './src/screens/ConsultationScreen';
import OffersScreen from './src/screens/OffersScreen';
import OrderTrackingScreen from './src/screens/OrderTrackingScreen';
import CheckoutScreen from './src/screens/CheckoutScreen';
import OrderSuccessScreen from './src/screens/OrderSuccessScreen';

function AppNavigator() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [completedOrder, setCompletedOrder] = useState(null);

  const navigateToProducts = (category = null) => {
    setSelectedCategory(category);
    setCurrentScreen('products');
  };

  const navigateToHome = () => {
    setSelectedCategory(null);
    setCurrentScreen('home');
  };

  const navigateToCategories = () => {
    setCurrentScreen('categories');
  };

  const navigateToCart = () => {
    setCurrentScreen('cart');
  };

  const navigateToProductDetail = (product) => {
    setSelectedProduct(product);
    setCurrentScreen('productDetail');
  };

  const navigateToAccount = () => {
    setCurrentScreen('account');
  };

  const navigateToLogin = () => {
    setCurrentScreen('login');
  };

  const navigateToRegister = () => {
    setCurrentScreen('register');
  };

  const handleLoginSuccess = (userData) => {
    console.log('Login bem-sucedido:', userData);
    // Aqui você pode salvar os dados do usuário em um Context ou AsyncStorage
    navigateToAccount();
  };

  const handleRegisterSuccess = (userData) => {
    console.log('Cadastro bem-sucedido:', userData);
    // Aqui você pode salvar os dados do usuário e fazer login automático
    navigateToAccount();
  };

  const navigateToConsultation = () => {
    setCurrentScreen('consultation');
  };

  const navigateToOffers = () => {
    setCurrentScreen('offers');
  };

  const navigateToOrderTracking = () => {
    setCurrentScreen('orderTracking');
  };

  const navigateToCheckout = () => {
    setCurrentScreen('checkout');
  };

  const handleOrderComplete = (order) => {
    setCompletedOrder(order);
    setCurrentScreen('orderSuccess');
  };

  if (currentScreen === 'products') {
    return (
      <ProductsScreen
        onBack={navigateToHome}
        filterCategory={selectedCategory}
        onNavigateToCart={navigateToCart}
        onProductPress={navigateToProductDetail}
        onNavigateToHome={navigateToHome}
        onNavigateToCategories={navigateToCategories}
        onNavigateToAccount={navigateToAccount}
      />
    );
  }

  if (currentScreen === 'categories') {
    return (
      <CategoriesScreen
        onNavigateToHome={navigateToHome}
        onNavigateToCart={navigateToCart}
        onProductPress={navigateToProductDetail}
        onNavigateToAccount={navigateToAccount}
      />
    );
  }

  if (currentScreen === 'cart') {
    return (
      <CartScreen
        onNavigateToHome={navigateToHome}
        onNavigateToCategories={navigateToCategories}
        onNavigateToAccount={navigateToAccount}
        onNavigateToCheckout={navigateToCheckout}
        onNavigateToLogin={navigateToLogin}
      />
    );
  }

  if (currentScreen === 'productDetail') {
    return (
      <ProductDetailScreen
        product={selectedProduct}
        onBack={navigateToHome}
        onNavigateToCart={navigateToCart}
      />
    );
  }

  if (currentScreen === 'account') {
    return (
      <AccountScreen
        onNavigateToHome={navigateToHome}
        onNavigateToCategories={navigateToCategories}
        onNavigateToCart={navigateToCart}
        onNavigateToLogin={navigateToLogin}
        onNavigateToConsultation={navigateToConsultation}
        onNavigateToOrderTracking={navigateToOrderTracking}
      />
    );
  }

  if (currentScreen === 'login') {
    return (
      <LoginScreen
        onBack={navigateToAccount}
        onNavigateToRegister={navigateToRegister}
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  if (currentScreen === 'register') {
    return (
      <RegisterScreen
        onBack={navigateToLogin}
        onRegisterSuccess={handleRegisterSuccess}
      />
    );
  }

  if (currentScreen === 'consultation') {
    return (
      <ConsultationScreen
        onBack={navigateToHome}
        onNavigateToCart={navigateToCart}
        onNavigateToRegister={navigateToRegister}
      />
    );
  }

  if (currentScreen === 'offers') {
    return (
      <OffersScreen
        onBack={navigateToHome}
        onNavigateToCart={navigateToCart}
        onProductPress={navigateToProductDetail}
      />
    );
  }

  if (currentScreen === 'orderTracking') {
    return (
      <OrderTrackingScreen
        onBack={navigateToHome}
        onNavigateToCart={navigateToCart}
      />
    );
  }

  if (currentScreen === 'checkout') {
    return (
      <CheckoutScreen
        onBack={navigateToCart}
        onOrderComplete={handleOrderComplete}
      />
    );
  }

  if (currentScreen === 'orderSuccess') {
    return (
      <OrderSuccessScreen
        order={completedOrder}
        onNavigateToHome={navigateToHome}
      />
    );
  }

  return (
    <HomeScreen
      onNavigateToProducts={navigateToProducts}
      onNavigateToCategories={navigateToCategories}
      onNavigateToCart={navigateToCart}
      onProductPress={navigateToProductDetail}
      onNavigateToAccount={navigateToAccount}
      onNavigateToConsultation={navigateToConsultation}
      onNavigateToOffers={navigateToOffers}
    />
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <CartProvider>
          <OrderProvider>
            <AppNavigator />
          </OrderProvider>
        </CartProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
