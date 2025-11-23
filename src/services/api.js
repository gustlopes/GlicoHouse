import { mockBanner, mockStats, mockCategories, mockShippingPromo } from '../data/mockData';

// IP do seu PC (ajuste se necessário)
const BASE_URL = 'http://192.168.3.4:8765'; 

let authToken = null;

export const setAuthToken = (token) => {
  authToken = token;
};

const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
  };
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  return headers;
};

// Função para descobrir a categoria baseada no nome/descrição
const inferCategory = (name, description) => {
  const text = (name + " " + description).toLowerCase();
  
  if (text.includes('insulina')) return 'insulina';
  if (text.includes('tira')) return 'tiras';
  if (text.includes('lanceta') || text.includes('tambor')) return 'lancetas';
  if (text.includes('sensor') || text.includes('cgm') || text.includes('libre')) return 'monitores'; // Monitores CGM
  if (text.includes('medidor') || text.includes('monitor')) return 'glicosimetros'; // Medidores de dedo
  
  return 'geral';
};

const mapProduct = (p) => ({
  id: p.id,
  name: p.description, 
  brand: p.brand,
  price: p.convertedPrice || p.price,
  rating: 5.0,
  reviewCount: 10,
  image: p.imageUrl || 'https://via.placeholder.com/200', 
  inStock: p.stock > 0,
  // Aqui aplicamos a lógica de categoria automática
  category: inferCategory(p.description, p.especificacao || '') 
});

export const api = {
  // ... (login, register, createOrder mantêm-se iguais) ...
  async login(email, password) {
    /* ...código do login... */
    const response = await fetch(`${BASE_URL}/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    if (!response.ok) throw new Error('Falha no login');
    return await response.json();
  },

  async register(name, email, password) {
      const response = await fetch(`${BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      if (!response.ok) throw new Error('Falha no cadastro');
      return await response.json();
  },

  async createOrder(orderData) {
       const response = await fetch(`${BASE_URL}/ws/orders/create/${orderData.address.cep}`, {
          method: 'POST',
          headers: getHeaders()
       });
       if(!response.ok) throw new Error("Erro ao criar pedido");
       return await response.json();
  },
  
  // --- NOVAS FUNÇÕES DE PRODUTO ---

  // Busca TODOS os produtos (limite de 100 para garantir que venham todos)
  async getAllProducts() {
    try {
      const response = await fetch(`${BASE_URL}/product/BRL?page=0&size=100`);
      if (!response.ok) return [];
      const data = await response.json();
      return data.content.map(mapProduct);
    } catch (error) {
      console.error('Erro ao buscar todos os produtos:', error);
      return [];
    }
  },

  // Mantemos estas para a Home, se quiser
  async getFeaturedProducts() {
    try {
      const response = await fetch(`${BASE_URL}/product/BRL?page=0&size=10`);
      if (!response.ok) return [];
      const data = await response.json();
      return data.content.map(mapProduct);
    } catch (error) { return []; }
  },

  async getHighlightProducts() {
    try {
      const response = await fetch(`${BASE_URL}/product/BRL?page=1&size=10`);
      if (!response.ok) return [];
      const data = await response.json();
      return data.content.map(mapProduct);
    } catch (error) { return []; }
  },

  async getAddressByCep(cep) {
    try {
      const response = await fetch(`${BASE_URL}/enderecos/${cep}`, { headers: getHeaders() });
      if (!response.ok) throw new Error('CEP não encontrado');
      return await response.json();
    } catch (error) { throw error; }
  },

  // Agregador da Home
  async getHomeData() {
    try {
      const [featured, highlighted] = await Promise.all([
        this.getFeaturedProducts(),
        this.getHighlightProducts()
      ]);
      return {
        banner: mockBanner,
        stats: mockStats,
        categories: mockCategories,
        featuredProducts: featured,
        highlightProducts: highlighted,
        shippingPromo: mockShippingPromo,
      };
    } catch (error) {
      return {
         banner: mockBanner, categories: [], featuredProducts: [], highlightProducts: [], shippingPromo: null
      };
    }
  },
};