import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../constants/colors';
import { normalize } from '../utils/responsive';
import Icon from '../components/Icon';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen({ onBack, onNavigateToRegister, onLoginSuccess }) {
  const { login } = useAuth();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // Validar email
    if (!email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email inválido';
    }

    // Validar senha
    if (!password) {
      newErrors.password = 'Senha é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
const handleLogin = async () => {
  if (validateForm()) {
    const success = await login({ email, password }); // Passa objeto
    if (success) {
       if (onLoginSuccess) onLoginSuccess({ email });
    } else {
       alert("Erro ao fazer login. Verifique suas credenciais.");
    }
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
        <Text style={styles.headerTitle}>Login</Text>
        <View style={styles.placeholder} />
      </LinearGradient>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Formulário */}
          <View style={styles.formContainer}>
            <Text style={styles.welcomeTitle}>Bem-vindo de volta!</Text>
            <Text style={styles.welcomeSubtitle}>
              Faça login para acessar sua conta
            </Text>

            {/* Email */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                placeholder="seu@email.com"
                placeholderTextColor={COLORS.textLight}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errors.email) {
                    setErrors({ ...errors, email: null });
                  }
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}
            </View>

            {/* Senha */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Senha</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[
                    styles.input,
                    styles.passwordInput,
                    errors.password && styles.inputError,
                  ]}
                  placeholder="••••••••"
                  placeholderTextColor={COLORS.textLight}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (errors.password) {
                      setErrors({ ...errors, password: null });
                    }
                  }}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Text style={styles.eyeIcon}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
                </TouchableOpacity>
              </View>
              {errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}
            </View>

            {/* Esqueceu a senha */}
            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
            </TouchableOpacity>

            {/* Botão de Login */}
            <TouchableOpacity onPress={handleLogin}>
              <LinearGradient
                colors={[COLORS.gradientStart, COLORS.gradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.loginButton}
              >
                <Text style={styles.loginButtonText}>Entrar</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Divisor */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>ou</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Botão de Cadastro */}
            <TouchableOpacity
              style={styles.registerButton}
              onPress={onNavigateToRegister}
            >
              <Text style={styles.registerButtonText}>Criar uma conta</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  placeholder: {
    width: 32,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 15,
    color: COLORS.textLight,
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
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
    paddingVertical: 14,
    fontSize: 15,
    color: COLORS.text,
  },
  inputError: {
    borderColor: '#DC3545',
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  eyeIcon: {
    fontSize: 20,
  },
  errorText: {
    fontSize: 12,
    color: '#DC3545',
    marginTop: 4,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: COLORS.secondary,
    fontWeight: '600',
  },
  loginButton: {
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  loginButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.gray,
  },
  dividerText: {
    fontSize: 14,
    color: COLORS.textLight,
    marginHorizontal: 16,
  },
  registerButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  registerButtonText: {
    color: COLORS.secondary,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
