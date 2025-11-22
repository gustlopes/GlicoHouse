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
    name: 'Alimentação',
    icon: '🍎',
    color: '#FFF3E0',
  },
];

export const mockFeaturedProducts = [
  {
    id: '1',
    name: 'Adoçante Stevia Natural 100ml',
    brand: 'NaturalSweet',
    price: 24.90,
    rating: 4.3,
    reviewCount: 89,
    image: 'https://via.placeholder.com/200x200/E3F2FD/0077B6?text=Stevia',
    inStock: true,
    category: 'Alimentação',
  },
  {
    id: '2',
    name: 'Glicosímetro Accu-Chek Guide',
    brand: 'Roche',
    price: 89.90,
    oldPrice: 129.90,
    rating: 4.7,
    reviewCount: 189,
    image: 'https://via.placeholder.com/200x200/FCE4EC/C2185B?text=Glicosimetro',
    inStock: true,
    category: 'Monitores',
  },
  {
    id: '3',
    name: 'Monitor de Pressão Omron',
    brand: 'Omron',
    price: 185.90,
    rating: 4.9,
    reviewCount: 156,
    image: 'https://via.placeholder.com/200x200/E8F5E9/2E7D32?text=Monitor',
    inStock: true,
    category: 'Monitores',
  },
  {
    id: '4',
    name: 'Kit Lancetas Descartáveis 100un',
    brand: 'Abbott',
    price: 35.90,
    rating: 4.6,
    reviewCount: 72,
    image: 'https://via.placeholder.com/200x200/FFF3E0/E65100?text=Lancetas',
    inStock: true,
    category: 'Lancetas',
  },
];

export const mockHighlightProducts = [
  {
    id: '5',
    name: 'Tiras de Teste Glicose 50un',
    brand: 'Roche',
    price: 52.90,
    rating: 4.8,
    reviewCount: 98,
    image: 'https://via.placeholder.com/200x200/E1F5FE/0277BD?text=Tiras',
    inStock: true,
    category: 'Monitores',
  },
  {
    id: '6',
    name: 'Insulina Refrigerada Portátil',
    brand: 'Novo Nordisk',
    price: 145.90,
    rating: 4.7,
    reviewCount: 112,
    image: 'https://via.placeholder.com/200x200/F3E5F5/7B1FA2?text=Insulina',
    inStock: true,
    category: 'Insulina',
  },
  {
    id: '7',
    name: 'Suplemento Proteico Zero Açúcar',
    brand: 'VitalFarm',
    price: 82.90,
    rating: 4.9,
    reviewCount: 145,
    image: 'https://via.placeholder.com/200x200/E8EAF6/283593?text=Suplemento',
    inStock: true,
    category: 'Alimentação',
  },
  {
    id: '8',
    name: 'Faixa de Pressão Johnson & Johnson',
    brand: 'Johnson & Johnson',
    price: 39.90,
    rating: 4.8,
    reviewCount: 203,
    image: 'https://via.placeholder.com/200x200/FBE9E7/BF360C?text=Faixa',
    inStock: true,
    category: 'Monitores',
  },
];

export const mockShippingPromo = {
  minValue: 199,
  message: 'Frete grátis acima de R$ 199',
};
