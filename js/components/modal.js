/**
 * components/modal.js
 * Composant Modal générique pour Hax-ISA
 */
'use strict';

const ModalComponent = (() => {

  let container = null;
  let onCloseCallback = null;

  function init() {
    container = document.getElementById('modal-container');
    if (!container) return;
    // Fermer au clic sur le backdrop
    container.addEventListener('click', (e) => {
      if (e.target === container) close();
    });
  }

  /**
   * Ouvre un modal
   * @param {object} opts - { title, content, size, onClose, footer }
   */
  function open(opts = {}) {
    if (!container) return;
    const { title = '', content = '', size = '', footer = '', onClose } = opts;
    onCloseCallback = onClose || null;

    container.innerHTML = `
      <div class="modal-backdrop"></div>
      <div class="modal ${size ? 'modal--' + size : ''}" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div class="modal__header">
          <h2 class="modal__title" id="modal-title">${title}</h2>
          <button class="modal__close" id="modal-close-btn" aria-label="Chiudi">✕</button>
        </div>
        <div class="modal__body">${content}</div>
        ${footer ? `<div class="modal__footer">${footer}</div>` : ''}
      </div>
    `;

    document.getElementById('modal-close-btn')?.addEventListener('click', close);
    container.setAttribute('aria-hidden', 'false');
    container.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Focus trap — focus sur le modal
    container.querySelector('.modal')?.focus();
  }

  function close() {
    if (!container) return;
    container.classList.remove('open');
    container.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (typeof onCloseCallback === 'function') onCloseCallback();
    onCloseCallback = null;
    setTimeout(() => { if (container) container.innerHTML = ''; }, 300);
  }

  // Echap pour fermer
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && container?.classList.contains('open')) close();
  });

  function confirm(opts = {}) {
    return new Promise((resolve) => {
      const { title = 'Conferma', message = 'Sei sicuro?', confirmText = 'Conferma', cancelText = 'Annulla' } = opts;
      open({
        title,
        content: `<p style="color:var(--color-text-secondary);line-height:1.6">${message}</p>`,
        footer: `
          <button class="btn btn--ghost" id="modal-cancel">
            ${cancelText}
          </button>
          <button class="btn btn--primary" id="modal-confirm">
            ${confirmText}
          </button>
        `,
        onClose: () => resolve(false),
      });
      document.getElementById('modal-confirm')?.addEventListener('click', () => { close(); resolve(true); });
      document.getElementById('modal-cancel')?.addEventListener('click',  () => { close(); resolve(false); });
    });
  }

  return { init, open, close, confirm };

})();

window.ModalComponent = ModalComponent;
