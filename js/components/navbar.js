/**
 * components/navbar.js
 * Composant Navbar Hax-ISA
 * Gère le rendu, le scroll effect, le menu mobile et la page active
 */

'use strict';

const NavbarComponent = (() => {

  // Structure des liens de navigation
  const NAV_LINKS = [
    { label: 'Home',       href: '/',                        page: 'home' },
    { label: 'Catalogo',   href: '/pages/catalogue.html',    page: 'catalogue',
      dropdown: [
        { label: 'Auto Nuove',  href: '/pages/catalogue.html?tipo=nuovo',  icon: '🏎️' },
        { label: 'Auto Usate',  href: '/pages/catalogue.html?tipo=usato',  icon: '🚗' },
      ]
    },
    { label: 'Chi Siamo',  href: '/pages/about.html',        page: 'about' },
    { label: 'Contatti',   href: '/pages/contact.html',      page: 'contact' },
  ];

  // Déterminer le chemin relatif correct selon la profondeur
  function resolveHref(href) {
    const depth = window.location.pathname.split('/').filter(Boolean).length;
    if (depth >= 2) {
      // On est dans /pages/ — corriger les href absolus
      if (href === '/') return '../index.html';
      if (href.startsWith('/pages/')) return href.replace('/pages/', '');
      return href;
    }
    if (href === '/') return 'index.html';
    return href;
  }

  // Construire le HTML de la navbar
  function buildNavbarHTML() {
    const currentPage = document.body.dataset.page || 'home';

    const dropdownItems = (items) => items.map(item => `
      <a href="${resolveHref(item.href)}" class="navbar__dropdown-item">
        <span>${item.icon}</span>
        <span>${item.label}</span>
      </a>
    `).join('');

    const desktopLinks = NAV_LINKS.map(link => {
      const isActive = link.page === currentPage ? 'active' : '';
      if (link.dropdown) {
        return `
          <div class="navbar__dropdown">
            <a href="${resolveHref(link.href)}" class="navbar__link ${isActive}" aria-haspopup="true">
              ${link.label}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </a>
            <div class="navbar__dropdown-menu" role="menu">
              ${dropdownItems(link.dropdown)}
            </div>
          </div>`;
      }
      return `<a href="${resolveHref(link.href)}" class="navbar__link ${isActive}">${link.label}</a>`;
    }).join('');

    const mobileLinks = NAV_LINKS.map(link => {
      const isActive = link.page === currentPage ? 'active' : '';
      const items = link.dropdown
        ? link.dropdown.map(d => `<a href="${resolveHref(d.href)}" class="navbar__mobile-link" style="padding-left:2rem;font-size:var(--text-sm)">${d.icon} ${d.label}</a>`).join('')
        : '';
      return `
        <a href="${resolveHref(link.href)}" class="navbar__mobile-link ${isActive}">${link.label}</a>
        ${items}`;
    }).join('');

    const homeHref = resolveHref('/');

    return `
      <a href="${homeHref}" class="navbar__logo" aria-label="Hax-ISA — Home">
        <div class="navbar__logo-icon">HAX</div>
        <div class="navbar__logo-text">
          <span class="navbar__logo-name">HAX-ISA</span>
          <span class="navbar__logo-tagline">International Sale of Automobiles</span>
        </div>
      </a>

      <nav class="navbar__nav" role="navigation" aria-label="Menu principale">
        ${desktopLinks}
      </nav>

      <div class="navbar__actions">
        <a href="tel:+390212345678" class="navbar__phone" aria-label="Chiama Hax-ISA">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.09 9.1a2 2 0 011.94-2.2h3a2 2 0 012 1.72 12.8 12.8 0 00.7 2.81 2 2 0 01-.45 2.11l-1.27 1.27a16 16 0 006.29 6.29l1.27-1.27a2 2 0 012.11-.45 12.8 12.8 0 002.81.7A2 2 0 0122 16.92z"/>
          </svg>
          +39 02 1234 5678
        </a>
        <a href="${resolveHref('/pages/catalogue.html')}" class="navbar__cta">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          Trova la tua Auto
        </a>
        <button class="navbar__burger" id="navbar-burger" aria-label="Apri menu" aria-expanded="false">
          <span class="navbar__burger-line"></span>
          <span class="navbar__burger-line"></span>
          <span class="navbar__burger-line"></span>
        </button>
      </div>

      <!-- Menu mobile -->
      <div class="navbar__mobile-menu" id="navbar-mobile-menu" aria-hidden="true" role="dialog">
        <nav class="navbar__mobile-nav">
          ${mobileLinks}
          <div class="navbar__mobile-separator"></div>
          <a href="tel:+390212345678" class="navbar__mobile-link">
            📞 +39 02 1234 5678
          </a>
          <a href="mailto:info@hax-isa.it" class="navbar__mobile-link">
            ✉️ info@hax-isa.it
          </a>
        </nav>
        <a href="${resolveHref('/pages/catalogue.html')}" class="navbar__mobile-cta">
          🚗 Sfoglia il Catalogo
        </a>
      </div>
    `;
  }

  // Gestion du scroll — ajout classe .scrolled
  function initScrollEffect() {
    const header = document.getElementById('main-header');
    if (!header) return;

    const onScroll = () => {
      if (window.scrollY > 30) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // Appel initial
  }

  // Gestion du menu mobile
  function initMobileMenu() {
    const burger = document.getElementById('navbar-burger');
    const mobileMenu = document.getElementById('navbar-mobile-menu');
    if (!burger || !mobileMenu) return;

    let isOpen = false;

    burger.addEventListener('click', () => {
      isOpen = !isOpen;
      burger.classList.toggle('open', isOpen);
      mobileMenu.classList.toggle('open', isOpen);
      burger.setAttribute('aria-expanded', isOpen);
      mobileMenu.setAttribute('aria-hidden', !isOpen);
      // Bloquer le scroll body quand le menu est ouvert
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Fermer au clic sur un lien
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        isOpen = false;
        burger.classList.remove('open');
        mobileMenu.classList.remove('open');
        burger.setAttribute('aria-expanded', false);
        mobileMenu.setAttribute('aria-hidden', true);
        document.body.style.overflow = '';
      });
    });

    // Fermer avec Echap
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen) {
        isOpen = false;
        burger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
        burger.focus();
      }
    });
  }

  // Point d'entrée
  function init() {
    const navEl = document.getElementById('main-nav');
    if (!navEl) return;

    navEl.innerHTML = buildNavbarHTML();
    initScrollEffect();
    initMobileMenu();
  }

  return { init };

})();

window.NavbarComponent = NavbarComponent;
