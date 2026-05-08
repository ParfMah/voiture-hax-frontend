/**
 * utils/storage.js
 * Gestion du stockage local (localStorage/sessionStorage) pour Hax-ISA
 * Encapsule les opérations de persistance côté client
 */

'use strict';

const Storage = (() => {

  // Préfixe pour éviter les conflits avec d'autres apps
  const PREFIX = 'haxisa_';

  // Clés de stockage utilisées dans l'application
  const KEYS = {
    TOKEN:       `${PREFIX}token`,
    USER:        `${PREFIX}user`,
    CART:        `${PREFIX}cart`,
    CHECKOUT:    `${PREFIX}checkout`,
    FILTERS:     `${PREFIX}filters`,
    THEME:       `${PREFIX}theme`,
    LANGUAGE:    `${PREFIX}lang`,
  };

  // ============================================================
  // OPÉRATIONS GÉNÉRIQUES localStorage
  // ============================================================

  /**
   * Sauvegarde une valeur (sérialisée en JSON) dans localStorage
   * @param {string} key
   * @param {any} value
   */
  function set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('[Storage] Impossible de sauvegarder:', key, e);
    }
  }

  /**
   * Récupère et désérialise une valeur depuis localStorage
   * @param {string} key
   * @param {any} defaultValue - Valeur par défaut si absente
   * @returns {any}
   */
  function get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue;
      return JSON.parse(item);
    } catch (e) {
      console.warn('[Storage] Impossible de lire:', key, e);
      return defaultValue;
    }
  }

  /**
   * Supprime un élément du localStorage
   * @param {string} key
   */
  function remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn('[Storage] Impossible de supprimer:', key, e);
    }
  }

  /**
   * Vide tout le localStorage (avec préfixe uniquement)
   */
  function clearAll() {
    Object.values(KEYS).forEach(key => remove(key));
  }

  // ============================================================
  // TOKEN JWT
  // ============================================================

  function setToken(token) { set(KEYS.TOKEN, token); }
  function getToken() { return get(KEYS.TOKEN); }
  function removeToken() { remove(KEYS.TOKEN); }

  // ============================================================
  // UTILISATEUR CONNECTÉ
  // ============================================================

  function setUser(user) { set(KEYS.USER, user); }
  function getUser() { return get(KEYS.USER); }
  function removeUser() { remove(KEYS.USER); }
  function isLoggedIn() { return !!getToken(); }

  // ============================================================
  // PANIER / SÉLECTION CHECKOUT
  // ============================================================

  /**
   * Sauvegarde les données de checkout (véhicule sélectionné, mode paiement, etc.)
   * @param {Object} data
   */
  function setCheckoutData(data) {
    const entry = {
      data,
      timestamp: Date.now(),
      expiry: Date.now() + HAX_CONFIG.session.cartExpiry,
    };
    set(KEYS.CHECKOUT, entry);
  }

  /**
   * Récupère les données de checkout (vérifie l'expiration)
   * @returns {Object|null}
   */
  function getCheckoutData() {
    const entry = get(KEYS.CHECKOUT);
    if (!entry) return null;
    // Vérifier expiration
    if (entry.expiry && Date.now() > entry.expiry) {
      remove(KEYS.CHECKOUT);
      return null;
    }
    return entry.data;
  }

  function clearCheckoutData() { remove(KEYS.CHECKOUT); }

  // ============================================================
  // FILTRES CATALOGUE
  // ============================================================

  function setFilters(filters) { set(KEYS.FILTERS, filters); }
  function getFilters() { return get(KEYS.FILTERS, {}); }
  function clearFilters() { remove(KEYS.FILTERS); }

  // ============================================================
  // EXPORT PUBLIC
  // ============================================================
  return {
    KEYS,
    set,
    get,
    remove,
    clearAll,
    setToken,
    getToken,
    removeToken,
    setUser,
    getUser,
    removeUser,
    isLoggedIn,
    setCheckoutData,
    getCheckoutData,
    clearCheckoutData,
    setFilters,
    getFilters,
    clearFilters,
  };

})();

window.Storage = Storage;
