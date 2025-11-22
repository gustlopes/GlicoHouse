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

export default function RegisterScreen({ onBack, onRegisterSuccess }) {
  const { register } = useAuth();
  const insets = useSafeAreaInsets();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validatePassword = (password) => {
    const validations = {
      minLength: password.length >= 8,
      hasNumber: /\d/.test(password),
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    return validations;
  };

  const getPasswordStrength = (password) => {
    const validations = validatePassword(password);
    const score = Object.values(validations).filter(Boolean).length;

    if (score === 5) return { text: 'Forte', color: '#28A745' };
    if (score >= 3) return { text: 'Média', color: '#FFC107' };
    return { text: 'Fraca', color: '#DC3545' };
  };

  const validateForm = () => {
    const newErrors = {};

    // Validar nome
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Nome é obrigatório';
    }

    // Validar sobrenome
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Sobrenome é obrigatório';
    }

    // Validar email
    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    // Validar senha
    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else {
      const validations = validatePassword(formData.password);
      if (!validations.minLength) {
        newErrors.password = 'Senha deve ter no mínimo 8 caracteres';
      } else if (!validations.hasNumber) {
        newErrors.password = 'Senha deve conter pelo menos 1 número';
      } else if (!validations.hasUpperCase) {
        newErrors.password = 'Senha deve conter pelo menos 1 letra maiúscula';
      } else if (!validations.hasLowerCase) {
        newErrors.password = 'Senha deve conter pelo menos 1 letra minúscula';
      } else if (!validations.hasSpecialChar) {
        newErrors.password = 'Senha deve conter pelo menos 1 caractere especial';
      }
    }

    // Validar confirmação de senha
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirme sua senha';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleRegister = async () => {
  if (validateForm()) {
    const success = await register({
       name: formData.firstName + ' ' + formData.lastName,
       email: formData.email,
       password: formData.password
    });

    if (success) {
       if (onRegisterSuccess) onRegisterSuccess();
    } else {
       alert("Erro ao realizar cadastro.");
    }
  }
};

  const updateField = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  const passwordValidations = formData.password
    ? validatePassword(formData.password)
    : null;
  const passwordStrength = formData.password
    ? getPasswordStrength(formData.password)
    : null;

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
        <Text style={styles.headerTitle}>Cadastro</Text>
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
          <View style={styles.formContainer}>
            <Text style={styles.welcomeTitle}>Criar uma conta</Text>
            <Text style={styles.welcomeSubtitle}>
              Preencha os dados abaixo para se cadastrar
            </Text>

            {/* Nome */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nome</Text>
              <TextInput
                style={[styles.input, errors.firstName && styles.inputError]}
                placeholder="Seu nome"
                placeholderTextColor={COLORS.textLight}
                value={formData.firstName}
                onChangeText={(text) => updateField('firstName', text)}
                autoCapitalize="words"
              />
              {errors.firstName && (
                <Text style={styles.errorText}>{errors.firstName}</Text>
              )}
            </View>

            {/* Sobrenome */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Sobrenome</Text>
              <TextInput
                style={[styles.input, errors.lastName && styles.inputError]}
                placeholder="Seu sobrenome"
                placeholderTextColor={COLORS.textLight}
                value={formData.lastName}
                onChangeText={(text) => updateField('lastName', text)}
                autoCapitalize="words"
              />
              {errors.lastName && (
                <Text style={styles.errorText}>{errors.lastName}</Text>
              )}
            </View>

            {/* Email */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                placeholder="seu@email.com"
                placeholderTextColor={COLORS.textLight}
                value={formData.email}
                onChangeText={(text) => updateField('email', text)}
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
                  value={formData.password}
                  onChangeText={(text) => updateField('password', text)}
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

              {/* Indicador de força da senha */}
              {formData.password && passwordStrength && (
                <View style={styles.passwordStrengthContainer}>
                  <Text style={styles.passwordStrengthLabel}>
                    Força da senha:{' '}
                    <Text style={{ color: passwordStrength.color }}>
                      {passwordStrength.text}
                    </Text>
                  </Text>
                </View>
              )}

              {/* Requisitos da senha */}
              {formData.password && passwordValidations && (
                <View style={styles.passwordRequirements}>
                  <Text style={styles.requirementsTitle}>A senha deve conter:</Text>
                  <View style={styles.requirement}>
                    <Text
                      style={[
                        styles.requirementIcon,
                        passwordValidations.minLength && styles.requirementValid,
                      ]}
                    >
                      {passwordValidations.minLength ? <Icon name="check" size={normalize(12)} color="#28A745" /> : '○'}
                    </Text>
                    <Text style={styles.requirementText}>
                      Mínimo de 8 caracteres
                    </Text>
                  </View>
                  <View style={styles.requirement}>
                    <Text
                      style={[
                        styles.requirementIcon,
                        passwordValidations.hasNumber && styles.requirementValid,
                      ]}
                    >
                      {passwordValidations.hasNumber ? <Icon name="check" size={normalize(12)} color="#28A745" /> : '○'}
                    </Text>
                    <Text style={styles.requirementText}>Pelo menos 1 número</Text>
                  </View>
                  <View style={styles.requirement}>
                    <Text
                      style={[
                        styles.requirementIcon,
                        passwordValidations.hasUpperCase && styles.requirementValid,
                      ]}
                    >
                      {passwordValidations.hasUpperCase ? <Icon name="check" size={normalize(12)} color="#28A745" /> : '○'}
                    </Text>
                    <Text style={styles.requirementText}>
                      Pelo menos 1 letra maiúscula
                    </Text>
                  </View>
                  <View style={styles.requirement}>
                    <Text
                      style={[
                        styles.requirementIcon,
                        passwordValidations.hasLowerCase && styles.requirementValid,
                      ]}
                    >
                      {passwordValidations.hasLowerCase ? <Icon name="check" size={normalize(12)} color="#28A745" /> : '○'}
                    </Text>
                    <Text style={styles.requirementText}>
                      Pelo menos 1 letra minúscula
                    </Text>
                  </View>
                  <View style={styles.requirement}>
                    <Text
                      style={[
                        styles.requirementIcon,
                        passwordValidations.hasSpecialChar && styles.requirementValid,
                      ]}
                    >
                      {passwordValidations.hasSpecialChar ? <Icon name="check" size={normalize(12)} color="#28A745" /> : '○'}
                    </Text>
                    <Text style={styles.requirementText}>
                      Pelo menos 1 caractere especial
                    </Text>
                  </View>
                </View>
              )}
            </View>

            {/* Confirmar Senha */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirmar Senha</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[
                    styles.input,
                    styles.passwordInput,
                    errors.confirmPassword && styles.inputError,
                  ]}
                  placeholder="••••••••"
                  placeholderTextColor={COLORS.textLight}
                  value={formData.confirmPassword}
                  onChangeText={(text) => updateField('confirmPassword', text)}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Text style={styles.eyeIcon}>
                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                  </Text>
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && (
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
              )}
            </View>

            {/* Botão de Cadastro */}
            <TouchableOpacity onPress={handleRegister}>
              <LinearGradient
                colors={[COLORS.gradientStart, COLORS.gradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.registerButton}
              >
                <Text style={styles.registerButtonText}>Criar Conta</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Link para Login */}
            <View style={styles.loginLink}>
              <Text style={styles.loginLinkText}>Já tem uma conta? </Text>
              <TouchableOpacity onPress={onBack}>
                <Text style={styles.loginLinkButton}>Fazer login</Text>
              </TouchableOpacity>
            </View>
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
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  formContainer: {
    flex: 1,
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
  passwordStrengthContainer: {
    marginTop: 8,
  },
  passwordStrengthLabel: {
    fontSize: 12,
    color: COLORS.text,
  },
  passwordRequirements: {
    marginTop: 12,
    backgroundColor: COLORS.white,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.gray,
  },
  requirementsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  requirement: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  requirementIcon: {
    fontSize: 12,
    color: COLORS.textLight,
    marginRight: 8,
    width: 16,
  },
  requirementValid: {
    color: '#28A745',
  },
  requirementText: {
    fontSize: 12,
    color: COLORS.text,
  },
  registerButton: {
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  registerButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  loginLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginLinkText: {
    fontSize: 14,
    color: COLORS.text,
  },
  loginLinkButton: {
    fontSize: 14,
    color: COLORS.secondary,
    fontWeight: '600',
  },
});
