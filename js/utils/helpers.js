/**
 * utils/helpers.js
 * Fonctions utilitaires globales pour Hax-ISA
 * Réutilisables dans tous les modules du frontend
 */

'use strict';

const Helpers = (() => {

  // ============================================================
  // FORMATAGE DES DONNÉES
  // ============================================================

  /**
   * Formate un prix en euros (format italien)
   * @param {number} amount - Montant en euros
   * @param {number} decimals - Nombre de décimales (défaut: 2)
   * @returns {string} Ex: "12.500,00 €"
   */
  function formatPrice(amount, decimals = 2) {
    if (isNaN(amount) || amount === null) return '—';
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(amount);
  }

  /**
   * Formate un kilométrage
   * @param {number} km - Kilométrage
   * @returns {string} Ex: "45.230 km"
   */
  function formatKm(km) {
    if (!km && km !== 0) return '—';
    return new Intl.NumberFormat('it-IT').format(km) + ' km';
  }

  /**
   * Formate une date en format italien
   * @param {string|Date} date - Date à formater
   * @returns {string} Ex: "15 marzo 2024"
   */
  function formatDate(date) {
    if (!date) return '—';
    return new Intl.DateTimeFormat('it-IT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(date));
  }

  /**
   * Formate un pourcentage
   * @param {number} value - Valeur entre 0 et 100
   * @returns {string} Ex: "2,50%"
   */
  function formatPercent(value) {
    if (isNaN(value)) return '—';
    return new Intl.NumberFormat('it-IT', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value / 100);
  }

  // ============================================================
  // MANIPULATION DU DOM
  // ============================================================

  /**
   * Sélecteur simplifié (querySelector)
   * @param {string} selector
   * @param {Element} context - Contexte (défaut: document)
   */
  function $(selector, context = document) {
    return context.querySelector(selector);
  }

  /**
   * Sélecteur multiple simplifié (querySelectorAll)
   * @param {string} selector
   * @param {Element} context - Contexte (défaut: document)
   * @returns {Array} Tableau d'éléments
   */
  function $$(selector, context = document) {
    return Array.from(context.querySelectorAll(selector));
  }

  /**
   * Crée un élément HTML avec attributs et contenu
   * @param {string} tag - Balise HTML
   * @param {Object} attrs - Attributs à ajouter
   * @param {string} innerHTML - Contenu HTML interne
   * @returns {Element}
   */
  function createElement(tag, attrs = {}, innerHTML = '') {
    const el = document.createElement(tag);
    Object.entries(attrs).forEach(([key, value]) => {
      if (key === 'class') el.className = value;
      else if (key === 'dataset') {
        Object.entries(value).forEach(([dKey, dVal]) => {
          el.dataset[dKey] = dVal;
        });
      } else el.setAttribute(key, value);
    });
    if (innerHTML) el.innerHTML = innerHTML;
    return el;
  }

  /**
   * Vide un élément DOM
   * @param {Element} el
   */
  function clearElement(el) {
    while (el.firstChild) el.removeChild(el.firstChild);
  }

  /**
   * Affiche/masque un élément
   * @param {Element} el
   * @param {boolean} show
   */
  function toggleVisibility(el, show) {
    if (!el) return;
    el.style.display = show ? '' : 'none';
    el.setAttribute('aria-hidden', show ? 'false' : 'true');
  }

  // ============================================================
  // VALIDATION
  // ============================================================

  /**
   * Valide une adresse email
   * @param {string} email
   * @returns {boolean}
   */
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /**
   * Valide un numéro de téléphone italien
   * @param {string} phone
   * @returns {boolean}
   */
  function isValidPhone(phone) {
    return /^(\+39|0039)?[\s\-]?(\d{2,4})[\s\-]?(\d{6,8})$/.test(phone.replace(/\s/g, ''));
  }

  /**
   * Valide un code postal italien
   * @param {string} cap
   * @returns {boolean}
   */
  function isValidCAP(cap) {
    return /^\d{5}$/.test(cap);
  }

  /**
   * Valide un code fiscal italien (Codice Fiscale)
   * @param {string} cf
   * @returns {boolean}
   */
  function isValidCodiceFiscale(cf) {
    return /^[A-Z]{6}[0-9LMNPQRSTUV]{2}[ABCDEHLMPRST]{1}[0-9LMNPQRSTUV]{2}[A-Z]{1}[0-9LMNPQRSTUV]{3}[A-Z]{1}$/i.test(cf);
  }

  // ============================================================
  // UTILITAIRES DIVERS
  // ============================================================

  /**
   * Debounce — limite l'appel répété d'une fonction
   * @param {Function} fn - Fonction à limiter
   * @param {number} delay - Délai en ms
   * @returns {Function}
   */
  function debounce(fn, delay) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  }

  /**
   * Throttle — limite la fréquence d'appel d'une fonction
   * @param {Function} fn
   * @param {number} limit - Intervalle minimum en ms
   * @returns {Function}
   */
  function throttle(fn, limit) {
    let lastCall = 0;
    return (...args) => {
      const now = Date.now();
      if (now - lastCall >= limit) {
        lastCall = now;
        return fn(...args);
      }
    };
  }

  /**
   * Génère un ID unique (UUID simplifié)
   * @returns {string}
   */
  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * Extrait les paramètres de l'URL courante
   * @returns {URLSearchParams}
   */
  function getUrlParams() {
    return new URLSearchParams(window.location.search);
  }

  /**
   * Tronque un texte à une longueur max
   * @param {string} text
   * @param {number} maxLength
   * @returns {string}
   */
  function truncate(text, maxLength = 100) {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength).trimEnd() + '…';
  }

  /**
   * Capitalise la première lettre d'un mot
   * @param {string} str
   * @returns {string}
   */
  function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  /**
   * Convertit un slug en label lisible
   * @param {string} slug - Ex: "in_attesa"
   * @returns {string} Ex: "In Attesa"
   */
  function slugToLabel(slug) {
    return slug.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  /**
   * Scroll animé vers un élément
   * @param {string|Element} target - Sélecteur ou élément
   * @param {number} offset - Décalage en pixels (défaut: 80 pour la navbar)
   */
  function scrollTo(target, offset = 80) {
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  // ============================================================
  // IMAGES
  // ============================================================

  /**
   * Retourne l'URL d'une image de véhicule avec fallback
   * @param {string} imageUrl
   * @returns {string}
   */
  function getVehicleImageUrl(imageUrl) {
    if (!imageUrl) return '../assets/images/placeholder-car.svg';
    // Si URL relative, préfixer avec l'URL de l'API
    if (imageUrl.startsWith('/')) {
      return HAX_CONFIG.api.baseUrl.replace('/api', '') + imageUrl;
    }
    return imageUrl;
  }

  // ============================================================
  // EXPORT PUBLIC
  // ============================================================
  return {
    formatPrice,
    formatKm,
    formatDate,
    formatPercent,
    $,
    $$,
    createElement,
    clearElement,
    toggleVisibility,
    isValidEmail,
    isValidPhone,
    isValidCAP,
    isValidCodiceFiscale,
    debounce,
    throttle,
    generateId,
    getUrlParams,
    truncate,
    capitalize,
    slugToLabel,
    scrollTo,
    getVehicleImageUrl,
  };

})();

// Rendre accessible globalement
window.Helpers = Helpers;
