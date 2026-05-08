/**
 * main.js
 * Point d'entrée principal de l'application Hax-ISA
 * Initialise tous les composants communs à chaque page
 */

'use strict';

// ============================================================
// INITIALISATION GLOBALE AU CHARGEMENT DU DOM
// ============================================================
document.addEventListener('DOMContentLoaded', () => {

  // 1. Initialiser la navbar (présente sur toutes les pages)
  if (window.NavbarComponent) {
    window.NavbarComponent.init();
  }

  // 2. Initialiser le footer (présent sur toutes les pages)
  if (window.FooterComponent) {
    window.FooterComponent.init();
  }

  // 3. Initialiser le gestionnaire de toast (notifications)
  if (window.ToastComponent) {
    window.ToastComponent.init();
  }

  // 4. Initialiser le modal global
  if (window.ModalComponent) {
    window.ModalComponent.init();
  }

  // 5. Masquer le loader de page une fois tout chargé
  if (window.LoaderComponent) {
    window.LoaderComponent.hide();
  }

  // 6. Détecter la page courante et initialiser le module correspondant
  const currentPage = document.body.dataset.page;
  initCurrentPage(currentPage);

  // 7. Activer les animations d'apparition au scroll
  initScrollAnimations();

  // 8. Gestion du bouton retour en haut
  initBackToTop();

});

// ============================================================
// INITIALISATION DE LA PAGE COURANTE
// ============================================================
/**
 * Détecte la page active et appelle le bon module d'initialisation
 * @param {string} page - Identifiant de la page (data-page)
 */
function initCurrentPage(page) {
  const pageInitializers = {
    'home':           () => window.HomePage?.init(),
    'catalogue':      () => window.CataloguePage?.init(),
    'vehicle-detail': () => window.VehicleDetailPage?.init(),
    'checkout':       () => window.CheckoutPage?.init(),
    'confirmation':   () => window.ConfirmationPage?.init(),
    'about':          () => window.AboutPage?.init(),
    'contact':        () => window.ContactPage?.init(),
  };

  if (page && pageInitializers[page]) {
    pageInitializers[page]();
  }
}

// ============================================================
// ANIMATIONS AU SCROLL (Intersection Observer)
// ============================================================
/**
 * Active les animations CSS sur les éléments avec [data-animate]
 * quand ils entrent dans le viewport
 */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('[data-animate]');
  if (!animatedElements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        // Désobserver après animation pour économiser les ressources
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
  });

  animatedElements.forEach(el => observer.observe(el));
}

// ============================================================
// BOUTON RETOUR EN HAUT
// ============================================================
/**
 * Crée et gère un bouton "retour en haut de page"
 */
function initBackToTop() {
  // Créer le bouton dynamiquement
  const btn = document.createElement('button');
  btn.id = 'back-to-top';
  btn.className = 'back-to-top';
  btn.setAttribute('aria-label', 'Torna su');
  btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
    <polyline points="18 15 12 9 6 15"></polyline>
  </svg>`;
  document.body.appendChild(btn);

  // Afficher/masquer selon position de scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  // Action au clic
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ============================================================
// GESTION DES ERREURS GLOBALES
// ============================================================
window.addEventListener('error', (event) => {
  console.error('[HAX-ISA] Erreur globale:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('[HAX-ISA] Promesse rejetée:', event.reason);
});
