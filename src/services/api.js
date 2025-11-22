import { mockBanner, mockStats, mockCategories, mockShippingPromo } from '../data/mockData';

// Endereço do Gateway no Android Emulator
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

// Adaptador para converter o Produto do Java para o formato do App
const mapProduct = (p) => ({
  id: p.id,
  name: p.description, // Java usa description, App usa name
  brand: p.brand,
  price: p.convertedPrice || p.price, // Usa o preço convertido se houver
  rating: 5.0, // Valor padrão (backend não tem rating)
  reviewCount: 10, // Valor padrão
  image: p.imageUrl || 'https://via.placeholder.com/200', 
  inStock: p.stock > 0,
  category: 'Geral' // Backend não tem categoria explícita no DTO atual
});

export const api = {
  // --- Autenticação (Auth-Service) ---
  async login(email, password) {
    try {
      const response = await fetch(`${BASE_URL}/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) throw new Error('Falha no login');
      
      const data = await response.json();
      // O backend retorna { user: {...}, token: "..." }
      return data;
    } catch (error) {
      console.error('Erro login:', error);
      throw error;
    }
  },

  async register(name, email, password) {
    try {
      const response = await fetch(`${BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      if (!response.ok) throw new Error('Falha no cadastro');
      return await response.json();
    } catch (error) {
      console.error('Erro cadastro:', error);
      throw error;
    }
  },

  // --- Produtos (Product-Service via Gateway) ---
  async getFeaturedProducts() {
    try {
      // Buscando produtos convertidos para BRL
      const response = await fetch(`${BASE_URL}/product/BRL?page=0&size=10`);
      if (!response.ok) return [];
      const data = await response.json();
      // O Spring Data Rest retorna array em 'content'
      return data.content.map(mapProduct);
    } catch (error) {
      console.log('Erro produtos destaque:', error);
      return [];
    }
  },

  async getHighlightProducts() {
    try {
      // Pode criar endpoints diferentes no backend, aqui reusamos mudando a paginação
      const response = await fetch(`${BASE_URL}/product/BRL?page=1&size=10`);
      if (!response.ok) return [];
      const data = await response.json();
      return data.content.map(mapProduct);
    } catch (error) {
      return [];
    }
  },

  // --- Endereço (Maps-Service) ---
  async getAddressByCep(cep) {
    try {
      const response = await fetch(`${BASE_URL}/enderecos/${cep}`, {
        headers: getHeaders()
      });
      if (!response.ok) throw new Error('CEP não encontrado');
      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  // --- Pedidos (Order-Service) ---
  async createOrder(orderData) {
    // Implementação simplificada
    // O backend espera criar pedido baseado no Carrinho do usuário
    // POST /ws/orders/create/{cep} com Headers de Auth
    try {
       const response = await fetch(`${BASE_URL}/ws/orders/create/${orderData.address.cep}`, {
          method: 'POST',
          headers: getHeaders()
       });
       if(!response.ok) throw new Error("Erro ao criar pedido");
       return await response.json();
    } catch (error) {
       console.error(error);
       throw error;
    }
  },

  // --- Dados Estáticos/Mockados (Para manter o layout funcionando onde não tem API) ---
  async getBanner() { return mockBanner; },
  async getStats() { return mockStats; },
  async getCategories() { return mockCategories; },
  async getShippingPromo() { return mockShippingPromo; },

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
        featuredProducts: featured.length > 0 ? featured : [],
        highlightProducts: highlighted.length > 0 ? highlighted : [],
        shippingPromo: mockShippingPromo,
      };
    } catch (error) {
      console.error("Erro home data", error);
      // Fallback para não quebrar o app
      return {
         banner: mockBanner,
         categories: [],
         featuredProducts: [],
         highlightProducts: [],
         shippingPromo: null
      };
    }
  },
};