// API Client for Vercel Postgres Database
// This replaces localStorage with real database calls

const API_BASE = '/api';

async function apiCall(endpoint: string, options: RequestInit = {}) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(error.error || error.message || 'API request failed');
    }

    return await response.json();
  } catch (error: any) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
}

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    return apiCall('/auth', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  register: async (userData: any) => {
    return apiCall('/auth', {
      method: 'POST',
      body: JSON.stringify({ ...userData, action: 'register' }),
    });
  },
};

// Users API
export const usersApi = {
  getAll: async () => {
    const result = await apiCall('/users');
    return result.data || [];
  },

  getById: async (id: string) => {
    const users = await usersApi.getAll();
    return users.find((u: any) => u.id === id);
  },

  create: async (userData: any) => {
    return apiCall('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  update: async (id: string, updates: any) => {
    return apiCall('/users', {
      method: 'PUT',
      body: JSON.stringify({ userId: id, updates }),
    });
  },

  delete: async (id: string) => {
    return apiCall('/users', {
      method: 'DELETE',
      body: JSON.stringify({ userId: id }),
    });
  },
};

// Products API
export const productsApi = {
  getAll: async () => {
    const result = await apiCall('/products');
    return result.data || [];
  },

  getById: async (id: string) => {
    const products = await productsApi.getAll();
    return products.find((p: any) => p.id === id);
  },

  create: async (productData: any) => {
    return apiCall('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },

  update: async (id: string, updates: any) => {
    return apiCall('/products', {
      method: 'PUT',
      body: JSON.stringify({ productId: id, updates }),
    });
  },

  delete: async (id: string) => {
    return apiCall('/products', {
      method: 'DELETE',
      body: JSON.stringify({ productId: id }),
    });
  },
};

// Orders API
export const ordersApi = {
  getAll: async () => {
    const result = await apiCall('/orders');
    return result.data || [];
  },

  getById: async (id: string) => {
    const orders = await ordersApi.getAll();
    return orders.find((o: any) => o.id === id);
  },

  create: async (orderData: any) => {
    return apiCall('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  update: async (id: string, updates: any) => {
    return apiCall('/orders', {
      method: 'PUT',
      body: JSON.stringify({ orderId: id, updates }),
    });
  },

  delete: async (id: string) => {
    return apiCall('/orders', {
      method: 'DELETE',
      body: JSON.stringify({ orderId: id }),
    });
  },
};

// Real-time sync helper
export const syncApi = {
  // Get last sync timestamp from server
  getLastSync: async () => {
    try {
      const result = await apiCall('/sync?endpoint=last');
      return result.timestamp || 0;
    } catch {
      return Date.now();
    }
  },

  // Check for updates since last sync
  checkUpdates: async (lastSync: number) => {
    try {
      const result = await apiCall(`/sync?endpoint=updates&since=${lastSync}`);
      return result;
    } catch {
      return { hasUpdates: false };
    }
  },
};

