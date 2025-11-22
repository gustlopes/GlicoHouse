import { Dimensions, Platform, StatusBar } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Dimensões base (iPhone 11 Pro)
const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

/**
 * Escala proporcional baseada na largura da tela
 */
export const scale = (size) => (SCREEN_WIDTH / BASE_WIDTH) * size;

/**
 * Escala proporcional baseada na altura da tela
 */
export const verticalScale = (size) => (SCREEN_HEIGHT / BASE_HEIGHT) * size;

/**
 * Escala moderada - usa um fator de moderação para não escalar muito
 */
export const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

/**
 * Largura da tela
 */
export const screenWidth = SCREEN_WIDTH;

/**
 * Altura da tela
 */
export const screenHeight = SCREEN_HEIGHT;

/**
 * Altura do StatusBar
 */
export const statusBarHeight = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight || 0;

/**
 * Verifica se é um dispositivo pequeno (width < 375)
 */
export const isSmallDevice = SCREEN_WIDTH < 375;

/**
 * Verifica se é um dispositivo grande (width > 414)
 */
export const isLargeDevice = SCREEN_WIDTH > 414;

/**
 * Normaliza tamanhos de fonte
 */
export const normalize = (size) => {
  if (Platform.OS === 'ios') {
    return Math.round(moderateScale(size));
  }
  return Math.round(moderateScale(size)) - 1;
};
