/**
 * components/footer.js
 * Composant Footer Hax-ISA — rendu dynamique
 */
'use strict';

const FooterComponent = (() => {

  function resolveHref(href) {
    const depth = window.location.pathname.split('/').filter(Boolean).length;
    if (depth >= 2) {
      if (href === '/') return '../index.html';
      if (href.startsWith('/pages/')) return href.replace('/pages/', '');
    }
    if (href === '/') return 'index.html';
    return href;
  }

  function buildHTML() {
    const year = new Date().getFullYear();
    return `
      <div class="container">
        <div class="footer__grid">

          <!-- Colonne marque -->
          <div class="footer__col">
            <a href="${resolveHref('/')}" class="footer__brand-logo">
              <div class="footer__brand-icon">HAX</div>
              <div>
                <div class="footer__brand-name">HAX-ISA</div>
                <div class="footer__brand-sub">International Sale of Automobiles</div>
              </div>
            </a>
            <p class="footer__brand-desc">
              La tua destinazione di fiducia per l'acquisto di auto nuove e usate in Europa.
              Qualità garantita, consegna a domicilio, finanziamento su misura.
            </p>
            <div class="footer__contacts">
              <div class="footer__contact-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                Via Roma 42, 20121 Milano, Italia
              </div>
              <div class="footer__contact-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.09 9.1a2 2 0 011.94-2.2h3a2 2 0 012 1.72 12.8 12.8 0 00.7 2.81 2 2 0 01-.45 2.11l-1.27 1.27a16 16 0 006.29 6.29l1.27-1.27a2 2 0 012.11-.45 12.8 12.8 0 002.81.7A2 2 0 0122 16.92z"/>
                </svg>
                +39 02 1234 5678
              </div>
              <div class="footer__contact-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                info@hax-isa.it
              </div>
            </div>
            <div class="footer__social">
              <a href="#" class="footer__social-link" aria-label="Facebook">f</a>
              <a href="#" class="footer__social-link" aria-label="Instagram">in</a>
              <a href="#" class="footer__social-link" aria-label="LinkedIn">li</a>
              <a href="#" class="footer__social-link" aria-label="YouTube">▶</a>
            </div>
          </div>

          <!-- Veicoli -->
          <div class="footer__col">
            <h4 class="footer__col-title">Veicoli</h4>
            <nav class="footer__links">
              <a href="${resolveHref('/pages/catalogue.html?tipo=nuovo')}" class="footer__link">Auto Nuove</a>
              <a href="${resolveHref('/pages/catalogue.html?tipo=usato')}" class="footer__link">Auto Usate</a>
              <a href="${resolveHref('/pages/catalogue.html?marca=bmw')}" class="footer__link">BMW</a>
              <a href="${resolveHref('/pages/catalogue.html?marca=mercedes')}" class="footer__link">Mercedes-Benz</a>
              <a href="${resolveHref('/pages/catalogue.html?marca=audi')}" class="footer__link">Audi</a>
              <a href="${resolveHref('/pages/catalogue.html?marca=volkswagen')}" class="footer__link">Volkswagen</a>
              <a href="${resolveHref('/pages/catalogue.html?marca=toyota')}" class="footer__link">Toyota</a>
            </nav>
          </div>

          <!-- Azienda -->
          <div class="footer__col">
            <h4 class="footer__col-title">Azienda</h4>
            <nav class="footer__links">
              <a href="${resolveHref('/pages/about.html')}" class="footer__link">Chi Siamo</a>
              <a href="${resolveHref('/pages/contact.html')}" class="footer__link">Contattaci</a>
              <a href="#" class="footer__link">Come Funziona</a>
              <a href="#" class="footer__link">Consegna a Domicilio</a>
              <a href="#" class="footer__link">Finanziamento</a>
              <a href="#" class="footer__link">Garanzia</a>
              <a href="#" class="footer__link">Carriere</a>
            </nav>
          </div>

          <!-- Newsletter -->
          <div class="footer__col">
            <h4 class="footer__col-title">Resta Aggiornato</h4>
            <p class="footer__newsletter-text">
              Ricevi in anteprima le migliori offerte e i nuovi arrivi direttamente nella tua casella email.
            </p>
            <div class="footer__newsletter-form">
              <input type="email" class="footer__newsletter-input" placeholder="La tua email" id="footer-email" />
              <button class="footer__newsletter-btn" onclick="FooterComponent.subscribeNewsletter()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </button>
            </div>
            <div class="footer__badges">
              <span class="footer__badge">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                Pagamento Sicuro
              </span>
              <span class="footer__badge">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                Garanzia Qualità
              </span>
              <span class="footer__badge">🇮🇹 Made in Italy</span>
            </div>
          </div>

        </div><!-- /footer__grid -->

        <!-- Barre inférieure -->
        <div class="footer__bottom">
          <p class="footer__copyright">
            © ${year} Hax-ISA S.r.l. — P.IVA IT12345678901 — Tutti i diritti riservati
          </p>
          <nav class="footer__legal" aria-label="Link legali">
            <a href="#" class="footer__legal-link">Privacy Policy</a>
            <a href="#" class="footer__legal-link">Cookie Policy</a>
            <a href="#" class="footer__legal-link">Termini di Servizio</a>
            <a href="#" class="footer__legal-link">Note Legali</a>
          </nav>
        </div>

      </div><!-- /container -->
    `;
  }

  function subscribeNewsletter() {
    const input = document.getElementById('footer-email');
    if (!input) return;
    const email = input.value.trim();
    if (!email || !Helpers.isValidEmail(email)) {
      ToastComponent.show('Inserisci un indirizzo email valido.', 'warning');
      return;
    }
    input.value = '';
    ToastComponent.show('Iscrizione completata! Grazie per esserti unito a noi.', 'success');
  }

  function init() {
    const footerEl = document.getElementById('main-footer');
    if (!footerEl) return;
    footerEl.innerHTML = buildHTML();
  }

  return { init, subscribeNewsletter };

})();

window.FooterComponent = FooterComponent;
