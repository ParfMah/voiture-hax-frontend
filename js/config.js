/**
 * config.js
 * Configuration globale du frontend Hax-ISA
 * Centralise toutes les constantes et paramètres de l'application
 */

'use strict';

// ============================================================
// CONFIGURATION GÉNÉRALE
// ============================================================
const HAX_CONFIG = Object.freeze({

  // Nom et infos de l'entreprise
  app: {
    name: 'Hax-ISA',
    fullName: 'Hax-ISA — International Sale of Automobiles',
    tagline: 'La tua auto, la tua libertà.',
    country: 'Italia',
    address: 'Via Roma 42, 20121 Milano, Italia',
    phone: '+39 02 1234 5678',
    email: 'info@hax-isa.it',
    vatNumber: 'IT12345678901',
  },

  // URL de l'API backend
  api: {
    baseUrl: 'http://localhost:3000/api',
    timeout: 10000, // 10 secondes
    version: 'v1',
  },

  // Paramètres du catalogue
  catalogue: {
    itemsPerPage: 12,
    defaultSort: 'createdAt',
    defaultOrder: 'desc',
    maxPriceFilter: 500000,
    minYearFilter: 1990,
  },

  // Paramètres du simulateur de crédit
  credit: {
    minRate: 2.0,    // Taux minimum 2%
    maxRate: 3.5,    // Taux maximum 3.5%
    defaultRate: 2.5,
    minDuration: 12,   // Durée min en mois
    maxDuration: 84,   // Durée max en mois (7 ans)
    defaultDuration: 36,
    minDeposit: 0,     // Apport minimum en euros
    minDepositPercent: 10, // % minimum de l'apport (bloquant)
    durationOptions: [12, 24, 36, 48, 60, 72, 84],
  },

  // Types de véhicules
  vehicleTypes: {
    NEW: 'nuovo',
    USED: 'usato',
  },

  // Statuts des commandes
  orderStatus: {
    PENDING: 'in_attesa',
    VALIDATED: 'validata',
    REFUSED: 'rifiutata',
    DELIVERED: 'consegnata',
  },

  // Durée de session locale (en millisecondes)
  session: {
    cartExpiry: 24 * 60 * 60 * 1000, // 24h
  },

  // Pages du site (navigation)
  pages: {
    home: '/',
    catalogue: '/pages/catalogue.html',
    vehicleDetail: '/pages/vehicle-detail.html',
    checkout: '/pages/checkout.html',
    confirmation: '/pages/confirmation.html',
    about: '/pages/about.html',
    contact: '/pages/contact.html',
  },

});

// Export vers window pour accès global (Vanilla JS, pas de modules)
window.HAX_CONFIG = HAX_CONFIG;
