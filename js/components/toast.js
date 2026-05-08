/**
 * components/toast.js
 * Système de notifications Toast pour Hax-ISA
 */
'use strict';

const ToastComponent = (() => {

  const ICONS = {
    success: '✅',
    error:   '❌',
    warning: '⚠️',
    info:    'ℹ️',
    default: '🔔',
  };
  const TITLES = {
    success: 'Operazione completata',
    error:   'Errore',
    warning: 'Attenzione',
    info:    'Informazione',
    default: 'Notifica',
  };
  const DEFAULT_DURATION = 4000;
  let container = null;

  function init() {
    container = document.getElementById('toast-container');
  }

  /**
   * Mostra un toast
   * @param {string} message
   * @param {string} type - success | error | warning | info
   * @param {object} options - { title, duration }
   */
  function show(message, type = 'info', options = {}) {
    if (!container) container = document.getElementById('toast-container');
    if (!container) return;

    const id      = Helpers.generateId();
    const icon    = ICONS[type]  || ICONS.default;
    const title   = options.title || TITLES[type] || TITLES.default;
    const duration = options.duration ?? DEFAULT_DURATION;

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.id = `toast-${id}`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
      <span class="toast__icon">${icon}</span>
      <div class="toast__body">
        <div class="toast__title">${title}</div>
        <div class="toast__message">${message}</div>
      </div>
      <button class="toast__close" aria-label="Chiudi notifica">✕</button>
    `;

    // Bouton fermeture
    toast.querySelector('.toast__close').addEventListener('click', () => dismiss(toast));

    container.appendChild(toast);

    // Forcer reflow avant animation
    void toast.offsetHeight;
    toast.classList.add('show');

    // Auto-dismiss
    if (duration > 0) {
      setTimeout(() => dismiss(toast), duration);
    }

    return id;
  }

  function dismiss(toast) {
    if (!toast || toast.classList.contains('hiding')) return;
    toast.classList.remove('show');
    toast.classList.add('hiding');
    setTimeout(() => toast.remove(), 400);
  }

  function dismissById(id) {
    const toast = document.getElementById(`toast-${id}`);
    if (toast) dismiss(toast);
  }

  // Raccourcis
  const success = (msg, opts) => show(msg, 'success', opts);
  const error   = (msg, opts) => show(msg, 'error',   opts);
  const warning = (msg, opts) => show(msg, 'warning', opts);
  const info    = (msg, opts) => show(msg, 'info',    opts);

  return { init, show, dismiss, dismissById, success, error, warning, info };

})();

window.ToastComponent = ToastComponent;
