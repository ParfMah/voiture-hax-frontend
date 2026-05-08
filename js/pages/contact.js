/**
 * pages/contact.js — Page Contatti
 */
'use strict';
const ContactPage = (() => {
  function init() {
    const el = document.getElementById('contact-content');
    if (!el) return;
    el.innerHTML = `
      <div class="contact-grid-container">
        <!-- Info contatto -->
        <div data-animate="fade-up">
          <h2 class="section-title" style="margin-bottom:var(--space-6)">Parlaci</h2>
          ${[
            ['📞','Telefono','+39 02 1234 5678','Lun–Ven 9:00–18:00'],
            ['✉️','Email','info@hax-isa.it','Risposta entro 2 ore lavorative'],
            ['📍','Sede','Via Roma 42, 20121 Milano','Italia'],
            ['💬','WhatsApp','+39 333 000 0000','Disponibile 7 giorni su 7'],
          ].map(([i,t,v,s])=>`
            <div style="display:flex;gap:var(--space-4);padding:var(--space-5);background:var(--color-bg-secondary);border-radius:var(--radius-lg);border:1px solid var(--color-border);margin-bottom:var(--space-4)">
              <div style="font-size:1.5rem;width:44px;text-align:center;flex-shrink:0">${i}</div>
              <div>
                <p style="font-size:var(--text-xs);text-transform:uppercase;letter-spacing:var(--tracking-wider);color:var(--color-text-muted);font-weight:var(--font-bold)">${t}</p>
                <p style="font-weight:var(--font-semibold);color:var(--color-text-primary);margin-top:2px">${v}</p>
                <p style="font-size:var(--text-xs);color:var(--color-text-muted);margin-top:2px">${s}</p>
              </div>
            </div>`).join('')}
        </div>
        <!-- Formulaire -->
        <div data-animate="fade-up" data-animate-delay="100">
          <div style="background:var(--color-white);border-radius:var(--radius-2xl);padding:var(--space-8);border:1px solid var(--color-border);box-shadow:var(--shadow-md)">
            <h3 style="font-size:var(--text-xl);font-weight:var(--font-bold);margin-bottom:var(--space-6)">Inviaci un Messaggio</h3>
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label form-label--required">Nome</label>
                <input type="text" class="form-control" id="c-nome" placeholder="Mario"/>
              </div>
              <div class="form-group">
                <label class="form-label form-label--required">Email</label>
                <input type="email" class="form-control" id="c-email" placeholder="mario@email.it"/>
              </div>
              <div class="form-group" style="grid-column:1/-1">
                <label class="form-label form-label--required">Oggetto</label>
                <select class="form-control" id="c-oggetto">
                  <option value="">Seleziona...</option>
                  <option>Informazioni su un veicolo</option>
                  <option>Simulazione finanziamento</option>
                  <option>Assistenza post-vendita</option>
                  <option>Altro</option>
                </select>
              </div>
              <div class="form-group" style="grid-column:1/-1">
                <label class="form-label form-label--required">Messaggio</label>
                <textarea class="form-control" id="c-msg" rows="5" placeholder="Come possiamo aiutarti?"></textarea>
              </div>
            </div>
            <button class="btn btn--primary btn--full" style="margin-top:var(--space-4)"
              onclick="ContactPage.submit()">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
              Invia Messaggio
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function submit() {
    const nome   = document.getElementById('c-nome')?.value.trim();
    const email  = document.getElementById('c-email')?.value.trim();
    const msg    = document.getElementById('c-msg')?.value.trim();
    if (!nome || !email || !msg) {
      ToastComponent.show('Compila tutti i campi obbligatori.', 'warning'); return;
    }
    if (!Helpers.isValidEmail(email)) {
      ToastComponent.show('Inserisci un\'email valida.', 'error'); return;
    }
    ToastComponent.show('Messaggio inviato! Ti risponderemo entro 2 ore.', 'success');
    document.getElementById('c-nome').value = '';
    document.getElementById('c-email').value = '';
    document.getElementById('c-msg').value = '';
  }

  return { init, submit };
})();
window.ContactPage = ContactPage;
