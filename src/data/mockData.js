import { COLORS } from '../constants/colors';

// Mock de dados que virão da API
export const mockBanner = {
  id: '1',
  title: 'Cuide da sua saúde!',
  subtitle: 'Hardware e agilidade para alcançar uma vida mais saudável',
  backgroundColor: COLORS.secondary,
  textColor: COLORS.white,
};

export const mockStats = {
  pendingOrders: 0,
  pendingDeliveries: 0,
  cashback: 0,
};

export const mockCategories = [
  {
    id: '1',
    name: 'Monitores',
    icon: '📱',
    color: '#E8F5E9',
  },
  {
    id: '2',
    name: 'Lancetas',
    icon: '🩸',
    color: '#FCE4EC',
  },
  {
    id: '3',
    name: 'Insulina',
    icon: '💉',
    color: '#E3F2FD',
  },
  {
    id: '4',
    name: 'Tiras',
    icon: '🧪',
    color: '#FFF3E0',
  },
];


export const mockShippingPromo = {
  minValue: 199,
  message: 'Frete grátis acima de R$ 199',
};
