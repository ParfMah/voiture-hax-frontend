/**
 * utils/api.js
 * Module de communication avec l'API backend Hax-ISA
 * Gère tous les appels HTTP (fetch), les headers et les erreurs
 */

'use strict';

const API = (() => {

  // ============================================================
  // CONFIGURATION
  // ============================================================
  const BASE_URL = HAX_CONFIG.api.baseUrl;
  const TIMEOUT  = HAX_CONFIG.api.timeout;

  // ============================================================
  // FONCTION FETCH CENTRALISÉE
  // ============================================================

  /**
   * Wrapper autour de fetch() avec gestion timeout, headers, erreurs
   * @param {string} endpoint - Chemin relatif (ex: '/vehicles')
   * @param {Object} options - Options fetch
   * @returns {Promise<any>} Données JSON parsées
   */
  async function request(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`;

    // Récupérer le token JWT s'il existe
    const token = Storage.getToken();

    // Construction des headers
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    // Contrôleur d'annulation (timeout)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Gestion des erreurs HTTP
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new APIError(
          errorData.message || `Errore HTTP ${response.status}`,
          response.status,
          errorData
        );
      }

      // Réponse vide (ex: DELETE 204)
      if (response.status === 204) return null;

      return await response.json();

    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new APIError('Timeout della richiesta. Riprova più tardi.', 408);
      }
      throw error;
    }
  }

  // ============================================================
  // CLASSE D'ERREUR PERSONNALISÉE
  // ============================================================
  class APIError extends Error {
    constructor(message, status, data = {}) {
      super(message);
      this.name = 'APIError';
      this.status = status;
      this.data = data;
    }
  }

  // ============================================================
  // MÉTHODES HTTP SIMPLIFIÉES
  // ============================================================

  const get = (endpoint, params = {}) => {
    const query = Object.keys(params).length
      ? '?' + new URLSearchParams(params).toString()
      : '';
    return request(`${endpoint}${query}`, { method: 'GET' });
  };

  const post = (endpoint, body) =>
    request(endpoint, { method: 'POST', body: JSON.stringify(body) });

  const put = (endpoint, body) =>
    request(endpoint, { method: 'PUT', body: JSON.stringify(body) });

  const patch = (endpoint, body) =>
    request(endpoint, { method: 'PATCH', body: JSON.stringify(body) });

  const del = (endpoint) =>
    request(endpoint, { method: 'DELETE' });

  // Upload avec FormData (images véhicules)
  const upload = (endpoint, formData) =>
    request(endpoint, {
      method: 'POST',
      body: formData,
      headers: {}, // Pas de Content-Type pour FormData (navigateur le gère)
    });

  // ============================================================
  // ENDPOINTS VÉHICULES
  // ============================================================
  const vehicles = {
    getAll: (params = {}) => get('/vehicles', params),
    getById: (id) => get(`/vehicles/${id}`),
    getFeatured: () => get('/vehicles/featured'),
    getSimilar: (id) => get(`/vehicles/${id}/similar`),
    search: (query) => get('/vehicles/search', { q: query }),
    create: (data) => post('/vehicles', data),
    update: (id, data) => put(`/vehicles/${id}`, data),
    delete: (id) => del(`/vehicles/${id}`),
    uploadImage: (id, formData) => upload(`/vehicles/${id}/image`, formData),
  };

  // ============================================================
  // ENDPOINTS COMMANDES
  // ============================================================
  const orders = {
    create: (data) => post('/orders', data),
    getById: (id) => get(`/orders/${id}`),
    getAll: (params = {}) => get('/orders', params),
    updateStatus: (id, status) => patch(`/orders/${id}/status`, { status }),
    getByCustomer: (customerId) => get(`/orders/customer/${customerId}`),
  };

  // ============================================================
  // ENDPOINTS CRÉDIT / SIMULATION
  // ============================================================
  const credit = {
    simulate: (data) => post('/credit/simulate', data),
    validateRequest: (data) => post('/credit/validate', data),
  };

  // ============================================================
  // ENDPOINTS AUTHENTIFICATION
  // ============================================================
  const auth = {
    login: (credentials) => post('/auth/login', credentials),
    logout: () => post('/auth/logout', {}),
    me: () => get('/auth/me'),
    refreshToken: () => post('/auth/refresh', {}),
  };

  // ============================================================
  // ENDPOINTS UTILISATEURS
  // ============================================================
  const users = {
    getAll: (params = {}) => get('/users', params),
    getById: (id) => get(`/users/${id}`),
    create: (data) => post('/users', data),
    update: (id, data) => put(`/users/${id}`, data),
    delete: (id) => del(`/users/${id}`),
  };

  // ============================================================
  // ENDPOINTS CONTENU (CMS)
  // ============================================================
  const content = {
    getAll: () => get('/content'),
    getByKey: (key) => get(`/content/${key}`),
    update: (key, data) => put(`/content/${key}`, data),
  };

  // ============================================================
  // ENDPOINTS DASHBOARD / STATS
  // ============================================================
  const stats = {
    getDashboard: () => get('/stats/dashboard'),
    getVehicleStats: () => get('/stats/vehicles'),
    getOrderStats: () => get('/stats/orders'),
  };

  // ============================================================
  // EXPORT PUBLIC
  // ============================================================
  return {
    get,
    post,
    put,
    patch,
    delete: del,
    upload,
    vehicles,
    orders,
    credit,
    auth,
    users,
    content,
    stats,
    APIError,
  };

})();

window.API = API;
