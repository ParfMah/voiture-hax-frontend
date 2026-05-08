/**
 * pages/confirmation.js
 * Page de confirmation commande Hax-ISA
 */
'use strict';

const ConfirmationPage = (() => {

  function init() {
    const params  = Helpers.getUrlParams();
    const orderId = params.get('order') || 'HAX-DEMO';
    const data    = Storage.getCheckoutData();
    const content = document.getElementById('confirmation-content');
    if (!content) return;

    const v    = data?.vehicle    || { marca:'BMW', modello:'Serie 5', prezzo:58900, tipo:'nuovo', anno:2024 };
    const c    = data?.credit     || {};
    const cust = data?.customer   || {};
    const mode = data?.paymentMode|| 'cash';
    const isCash = mode === 'cash';

    content.innerHTML = `
      <!-- Icona successo -->
      <div class="confirmation-icon">
        <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
          <circle cx="26" cy="26" r="24" stroke="#27AE60" stroke-width="3" fill="none"/>
          <polyline points="14,27 22,35 38,18" stroke="#27AE60" stroke-width="3.5"
            fill="none" stroke-linecap="round" stroke-linejoin="round"
            class="confirmation-checkmark"/>
        </svg>
      </div>

      <h1 class="confirmation-title">
        Ordine Confermato! 🎉
      </h1>

      <div class="confirmation-order-id">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
        </svg>
        Ordine N° ${orderId}
      </div>

      <p class="confirmation-desc">
        Grazie ${cust.nome ? cust.nome + '!' : 'mille!'} Il tuo ordine è stato registrato con successo.
        Il nostro team ti contatterà entro <strong>24 ore lavorative</strong> per confermare i dettagli
        e organizzare la consegna del tuo veicolo.
      </p>

      <!-- Banner email -->
      <div class="confirmation-email-banner">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
          <polyline points="22,6 12,13 2,6"/>
        </svg>
        <span>
          Una copia del riepilogo è stata inviata a
          <strong>${cust.email || 'info@hax-isa.it'}</strong>.
          Controlla anche la cartella spam se non la ricevi entro pochi minuti.
        </span>
      </div>

      <!-- Dettagli ordine -->
      <div class="confirmation-details">
        <div class="confirmation-details__header">
          📄 Dettagli Ordine — ${orderId}
        </div>
        <div class="confirmation-details__body">
          <!-- Colonna veicolo -->
          <div class="confirmation-detail-col">
            <p class="confirmation-detail-col__title">🚗 Veicolo</p>
            <div class="confirmation-detail-row">
              <span class="confirmation-detail-row__label">Modello</span>
              <span class="confirmation-detail-row__value">${v.marca} ${v.modello}</span>
            </div>
            <div class="confirmation-detail-row">
              <span class="confirmation-detail-row__label">Anno</span>
              <span class="confirmation-detail-row__value">${v.anno}</span>
            </div>
            <div class="confirmation-detail-row">
              <span class="confirmation-detail-row__label">Tipo</span>
              <span class="confirmation-detail-row__value">${v.tipo === 'nuovo' ? '✨ Nuovo' : '🔍 Usato Verificato'}</span>
            </div>
            <div class="confirmation-detail-row">
              <span class="confirmation-detail-row__label">Prezzo</span>
              <span class="confirmation-detail-row__value confirmation-detail-row__value--highlight">
                ${Helpers.formatPrice(v.prezzo)}
              </span>
            </div>
            <div class="confirmation-detail-row">
              <span class="confirmation-detail-row__label">Pagamento</span>
              <span class="confirmation-detail-row__value">${isCash ? '💵 Contanti' : '💳 Finanziamento'}</span>
            </div>
            ${!isCash && c.monthly ? `
            <div class="confirmation-detail-row">
              <span class="confirmation-detail-row__label">Rata mensile</span>
              <span class="confirmation-detail-row__value confirmation-detail-row__value--highlight">
                ${Helpers.formatPrice(c.monthly)}/mese
              </span>
            </div>
            <div class="confirmation-detail-row">
              <span class="confirmation-detail-row__label">Acconto</span>
              <span class="confirmation-detail-row__value">${Helpers.formatPrice(c.deposit)}</span>
            </div>
            <div class="confirmation-detail-row">
              <span class="confirmation-detail-row__label">Durata</span>
              <span class="confirmation-detail-row__value">${c.duration} mesi — ${c.rate?.toFixed(2).replace('.',',')}% TAN</span>
            </div>
            ` : ''}
          </div>
          <!-- Colonna cliente -->
          <div class="confirmation-detail-col">
            <p class="confirmation-detail-col__title">👤 Cliente</p>
            <div class="confirmation-detail-row">
              <span class="confirmation-detail-row__label">Nome</span>
              <span class="confirmation-detail-row__value">${cust.nome || '—'} ${cust.cognome || ''}</span>
            </div>
            <div class="confirmation-detail-row">
              <span class="confirmation-detail-row__label">Email</span>
              <span class="confirmation-detail-row__value">${cust.email || '—'}</span>
            </div>
            <div class="confirmation-detail-row">
              <span class="confirmation-detail-row__label">Telefono</span>
              <span class="confirmation-detail-row__value">${cust.telefono || '—'}</span>
            </div>
            <div class="confirmation-detail-row">
              <span class="confirmation-detail-row__label">Codice Fiscale</span>
              <span class="confirmation-detail-row__value">${cust.codiceFiscale || '—'}</span>
            </div>
            <div class="confirmation-detail-row">
              <span class="confirmation-detail-row__label">Indirizzo</span>
              <span class="confirmation-detail-row__value">${cust.indirizzo ? `${cust.indirizzo}, ${cust.cap} ${cust.citta}` : '—'}</span>
            </div>
            <div class="confirmation-detail-row">
              <span class="confirmation-detail-row__label">Consegna</span>
              <span class="confirmation-detail-row__value">
                ${cust.consegnaIndirizzo ? `${cust.consegnaIndirizzo}, ${cust.consegnaCap} ${cust.consegnaCitta}` : 'Come residenza'}
              </span>
            </div>
            <div class="confirmation-detail-row">
              <span class="confirmation-detail-row__label">Data ordine</span>
              <span class="confirmation-detail-row__value">${Helpers.formatDate(new Date())}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Prossimi passi -->
      <h2 style="font-size:var(--text-xl);font-weight:var(--font-bold);margin-bottom:var(--space-6);color:var(--color-text-primary)">
        Cosa Succede Ora?
      </h2>
      <div class="confirmation-steps">
        <div class="confirmation-step">
          <div class="confirmation-step__number">1</div>
          <div class="confirmation-step__icon">📞</div>
          <h3 class="confirmation-step__title">Contatto del Team</h3>
          <p class="confirmation-step__desc">
            Un consulente Hax-ISA ti chiamerà entro 24 ore lavorative per confermare tutti i dettagli dell'ordine.
          </p>
        </div>
        <div class="confirmation-step">
          <div class="confirmation-step__number">2</div>
          <div class="confirmation-step__icon">📋</div>
          <h3 class="confirmation-step__title">Documentazione</h3>
          <p class="confirmation-step__desc">
            Riceverai via email tutti i documenti da firmare.
            ${!isCash ? 'La pratica di finanziamento verrà avviata entro 48 ore.' : 'Le istruzioni di pagamento saranno allegate.'}
          </p>
        </div>
        <div class="confirmation-step">
          <div class="confirmation-step__number">3</div>
          <div class="confirmation-step__icon">🚚</div>
          <h3 class="confirmation-step__title">Consegna a Domicilio</h3>
          <p class="confirmation-step__desc">
            Il tuo veicolo verrà consegnato direttamente al tuo indirizzo entro
            <strong>5–10 giorni lavorativi</strong> dalla firma dei documenti.
          </p>
        </div>
      </div>

      <!-- CTA finali -->
      <div class="confirmation-ctas">
        <a href="../index.html" class="btn btn--primary btn--lg">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          Torna alla Home
        </a>
        <a href="catalogue.html" class="btn btn--secondary btn--lg">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          Continua a Sfogliare
        </a>
        <button class="btn btn--ghost" onclick="window.print()">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6 9 6 2 18 2 18 9"/>
            <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/>
            <rect x="6" y="14" width="12" height="8"/>
          </svg>
          Stampa Riepilogo
        </button>
      </div>
    `;

    // Pulire i dati checkout dopo visualizzazione
    setTimeout(() => Storage.clearCheckoutData(), 3000);
  }

  return { init };

})();

window.ConfirmationPage = ConfirmationPage;
