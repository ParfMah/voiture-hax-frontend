/**
 * pages/checkout.js
 * Parcours commande Hax-ISA — 5 étapes
 *
 * Étape 1 : Choix paiement (contanti / credito)
 * Étape 2 : Finanziamento (simulateur crédit — si credito)
 * Étape 3 : Dati personali (formulaire client)
 * Étape 4 : Riepilogo + checkbox engagement OBLIGATOIRE
 * Étape 5 : Conferma (soumission + redirect)
 */
'use strict';

const CheckoutPage = (() => {

  // ============================================================
  // ÉTAT GLOBAL DU CHECKOUT
  // ============================================================
  let state = {
    currentStep: 1,
    totalSteps:  5,

    // Véhicule
    vehicle: null,
    vehicleId: null,

    // Choix paiement
    paymentMode: null,    // 'cash' | 'credit'

    // Données crédit (depuis simulateur)
    credit: {
      deposit:   0,
      duration:  36,
      rate:      2.5,
      financed:  0,
      monthly:   0,
      totalCost: 0,
      isValid:   false,
    },

    // Données client (étape 3)
    customer: {
      nome:           '',
      cognome:        '',
      email:          '',
      telefono:       '',
      codiceFiscale:  '',
      dataNascita:    '',
      indirizzo:      '',
      cap:            '',
      citta:          '',
      provincia:      '',
      paese:          'Italia',
      consegnaIndirizzo: '',
      consegnaCap:    '',
      consegnaCitta:  '',
      noteConsegna:   '',
    },

    // Engagement (étape 4)
    committed: false,

    // Résultat
    orderId: null,
  };

  // ============================================================
  // DONNÉES DEMO VÉHICULES
  // ============================================================
  const DEMO_VEHICLES = {
    v01: { _id:'v01', marca:'BMW', modello:'Serie 5 520d xDrive', prezzo:58900, tipo:'nuovo', anno:2024, carburante:'Diesel', cambio:'Automatico', potenza:'190 CV', immagini:[] },
    v02: { _id:'v02', marca:'Mercedes', modello:'GLC 300 4MATIC', prezzo:72400, tipo:'nuovo', anno:2024, carburante:'Benzina', cambio:'Automatico', potenza:'258 CV', immagini:[] },
    v03: { _id:'v03', marca:'Audi', modello:'A4 35 TDI S line', prezzo:34500, tipo:'usato', anno:2022, carburante:'Diesel', cambio:'Automatico', potenza:'163 CV', immagini:[] },
  };

  const PLACEHOLDER = '../assets/images/placeholder-car.svg';

  // ============================================================
  // INITIALISATION
  // ============================================================
  function init() {
    const params = Helpers.getUrlParams();
    const id     = params.get('id') || 'v01';
    const mode   = params.get('mode');

    // Charger les données du véhicule (démo)
    state.vehicleId  = id;
    state.vehicle    = DEMO_VEHICLES[id] || DEMO_VEHICLES.v01;
    state.paymentMode = mode || null;

    // Pré-remplir crédit depuis URL
    if (params.get('deposit'))  state.credit.deposit  = parseFloat(params.get('deposit'))  || 0;
    if (params.get('duration')) state.credit.duration = parseInt(params.get('duration'))   || 36;
    if (params.get('rate'))     state.credit.rate     = parseFloat(params.get('rate'))     || 2.5;

    // Si mode déjà choisi, passer directement à l'étape correcte
    if (mode === 'cash')   { state.paymentMode = 'cash';   state.currentStep = 3; }
    if (mode === 'credit') { state.paymentMode = 'credit'; state.currentStep = 2; }

    renderAll();
  }

  // ============================================================
  // RENDU COMPLET
  // ============================================================
  function renderAll() {
    renderStepIndicator();
    renderSummary();
    renderCurrentStep();
  }

  // ============================================================
  // INDICATEUR D'ÉTAPES
  // ============================================================
  function renderStepIndicator() {
    const list = document.getElementById('checkout-steps-indicator');
    if (!list) return;
    const steps = ['Scelta', 'Finanziamento', 'Dati Personali', 'Riepilogo', 'Conferma'];
    list.innerHTML = steps.map((label, i) => {
      const n    = i + 1;
      const skip = state.paymentMode === 'cash' && n === 2;
      let cls = '';
      if (n < state.currentStep || skip) cls = 'completed';
      else if (n === state.currentStep)  cls = 'active';
      return `
        <li class="step ${cls}" data-step="${n}">
          <span class="step__number"><span>${n}</span></span>
          <span class="step__label">${label}</span>
        </li>`;
    }).join('');
  }

  // ============================================================
  // RÉCAPITULATIF LATÉRAL
  // ============================================================
  function renderSummary() {
    const aside = document.getElementById('checkout-summary');
    if (!aside) return;
    const v = state.vehicle;
    const c = state.credit;
    const mode = state.paymentMode;

    const isCash   = mode === 'cash';
    const isCredit = mode === 'credit';

    // Calcul affichage
    const displayTotal = isCredit && c.isValid
      ? c.totalCost
      : v?.prezzo || 0;
    const displayMonthly = isCredit && c.isValid ? c.monthly : 0;

    aside.innerHTML = `
      <div class="checkout-summary-card">
        <div class="checkout-summary-card__header">
          <p class="checkout-summary-card__title">📋 Riepilogo Ordine</p>
        </div>
        <div class="checkout-summary-card__body">

          <!-- Véhicule mini -->
          <div class="summary-vehicle-mini">
            <img src="${PLACEHOLDER}" alt="${v?.marca} ${v?.modello}" class="summary-vehicle-mini__img"/>
            <div>
              <p class="summary-vehicle-mini__name">${v?.marca} ${v?.modello}</p>
              <p class="summary-vehicle-mini__type">
                ${v?.tipo === 'nuovo' ? '✨ Nuovo' : '🔍 Usato'} — ${v?.anno}
              </p>
            </div>
          </div>

          <!-- Righe prezzo -->
          <div class="summary-price-rows">
            <div class="summary-price-row">
              <span class="summary-price-row__label">Prezzo veicolo</span>
              <span class="summary-price-row__value">${Helpers.formatPrice(v?.prezzo)}</span>
            </div>
            ${isCredit && c.deposit > 0 ? `
              <div class="summary-price-row">
                <span class="summary-price-row__label">Acconto</span>
                <span class="summary-price-row__value" style="color:var(--color-success)">${Helpers.formatPrice(c.deposit)}</span>
              </div>
              <div class="summary-price-row">
                <span class="summary-price-row__label">Importo finanziato</span>
                <span class="summary-price-row__value">${Helpers.formatPrice(c.financed || (v?.prezzo - c.deposit))}</span>
              </div>
              <div class="summary-price-row">
                <span class="summary-price-row__label">Durata</span>
                <span class="summary-price-row__value">${c.duration} mesi</span>
              </div>
              <div class="summary-price-row">
                <span class="summary-price-row__label">Tasso TAN</span>
                <span class="summary-price-row__value">${c.rate.toFixed(2).replace('.',',')}%</span>
              </div>
            ` : ''}
            <div class="summary-price-total">
              <span class="summary-price-total__label">
                ${isCredit && c.isValid ? 'Rata mensile' : 'Totale'}
              </span>
              <span class="summary-price-total__value">
                ${isCredit && c.isValid
                  ? `${Helpers.formatPrice(displayMonthly)}<small style="font-size:0.5em;font-weight:500">/mese</small>`
                  : Helpers.formatPrice(v?.prezzo)}
              </span>
            </div>
            ${isCredit && c.isValid ? `
              <div class="summary-price-row" style="margin-top:var(--space-2)">
                <span class="summary-price-row__label">Costo totale</span>
                <span class="summary-price-row__value">${Helpers.formatPrice(c.totalCost)}</span>
              </div>
            ` : ''}
          </div>

        </div>
        <div class="checkout-summary-card__footer">
          <div class="checkout-trust-items">
            ${['Transazione sicura SSL','Nessun costo nascosto','Supporto dedicato','Consegna assicurata'].map(t => `
              <div class="checkout-trust-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                ${t}
              </div>`).join('')}
          </div>
        </div>
      </div>
    `;
  }

  // ============================================================
  // DISPATCHER ÉTAPES
  // ============================================================
  function renderCurrentStep() {
    const container = document.getElementById('checkout-main');
    if (!container) return;

    // Passer l'étape 2 si paiement comptant
    let step = state.currentStep;
    if (step === 2 && state.paymentMode === 'cash') step = 3;

    const renderers = {
      1: renderStep1,
      2: renderStep2,
      3: renderStep3,
      4: renderStep4,
      5: renderStep5,
    };
    (renderers[step] || renderers[1])(container);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ============================================================
  // ÉTAPE 1 — Scelta modalità acquisto
  // ============================================================
  function renderStep1(container) {
    const v = state.vehicle;
    container.innerHTML = `
      <div class="checkout-step-panel">
        <div class="checkout-step-header">
          <div class="checkout-step-header__icon">🚗</div>
          <div>
            <h2 class="checkout-step-header__title">Scegli la Modalità di Acquisto</h2>
            <p class="checkout-step-header__subtitle">Contanti o finanziamento rateale?</p>
          </div>
        </div>
        <div class="checkout-step-body">

          <!-- Récap véhicule -->
          <div class="checkout-vehicle-recap">
            <img src="${PLACEHOLDER}" alt="${v?.marca}" class="checkout-vehicle-recap__img"/>
            <div>
              <p class="checkout-vehicle-recap__name">${v?.marca} ${v?.modello}</p>
              <p class="checkout-vehicle-recap__specs">${v?.anno} · ${v?.carburante} · ${v?.potenza}</p>
            </div>
            <span class="checkout-vehicle-recap__price">${Helpers.formatPrice(v?.prezzo)}</span>
          </div>

          <!-- Choix paiement -->
          <div class="payment-choice-grid">
            <label class="payment-choice-card ${state.paymentMode === 'cash' ? 'selected' : ''}">
              <input type="radio" name="payment" value="cash"
                onchange="CheckoutPage.setPaymentMode('cash')"/>
              <div class="payment-choice-card__check">
                ${state.paymentMode === 'cash' ? '✓' : ''}
              </div>
              <div class="payment-choice-card__icon">💵</div>
              <h3 class="payment-choice-card__title">Acquisto in Contanti</h3>
              <p class="payment-choice-card__desc">
                Paga l'intero importo in un'unica soluzione.
                Nessun interesse, nessuna rata mensile.
              </p>
              <span class="payment-choice-card__tag">Senza interessi</span>
            </label>

            <label class="payment-choice-card ${state.paymentMode === 'credit' ? 'selected' : ''}">
              <input type="radio" name="payment" value="credit"
                onchange="CheckoutPage.setPaymentMode('credit')"/>
              <div class="payment-choice-card__check">
                ${state.paymentMode === 'credit' ? '✓' : ''}
              </div>
              <div class="payment-choice-card__icon">💳</div>
              <h3 class="payment-choice-card__title">Acquisto a Credito</h3>
              <p class="payment-choice-card__desc">
                Paga in rate mensili con tassi dal ${HAX_CONFIG.credit.minRate}%.
                Acconto minimo obbligatorio del ${HAX_CONFIG.credit.minDepositPercent}%.
              </p>
              <span class="payment-choice-card__tag">Da ${Helpers.formatPrice(computeMonthly(v?.prezzo || 0), 0)}/mese</span>
            </label>
          </div>

        </div>
        <div class="checkout-step-nav">
          <a href="catalogue.html" class="btn btn--ghost">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Torna al Catalogo
          </a>
          <button class="btn btn--primary"
            onclick="CheckoutPage.nextStep()"
            ${!state.paymentMode ? 'disabled style="opacity:.5;cursor:not-allowed"' : ''}>
            Continua
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>
      </div>
    `;
  }

  // ============================================================
  // ÉTAPE 2 — Simulatore Finanziamento
  // ============================================================
  function renderStep2(container) {
    container.innerHTML = `
      <div class="checkout-step-panel">
        <div class="checkout-step-header">
          <div class="checkout-step-header__icon">💳</div>
          <div>
            <h2 class="checkout-step-header__title">Configura il Finanziamento</h2>
            <p class="checkout-step-header__subtitle">Inserisci l'acconto e scegli la durata</p>
          </div>
        </div>
        <div class="checkout-step-body" style="padding:0">
          <div class="checkout-sim-wrapper">
            <div id="checkout-credit-sim"></div>
          </div>
        </div>
        <div class="checkout-step-nav">
          <button class="btn btn--ghost" onclick="CheckoutPage.prevStep()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Indietro
          </button>
          <button class="btn btn--primary" id="step2-next"
            onclick="CheckoutPage.validateStep2()"
            ${!state.credit.isValid ? 'disabled style="opacity:.5;cursor:not-allowed"' : ''}>
            Continua
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>
      </div>
    `;

    // Initialiser le simulateur dans le checkout
    if (window.CreditSimulator) {
      CreditSimulator.init({
        container:    document.getElementById('checkout-credit-sim'),
        vehiclePrice: state.vehicle?.prezzo || 0,
        vehicleId:    state.vehicleId,
        vehicleName:  `${state.vehicle?.marca} ${state.vehicle?.modello}`,
        deposit:      state.credit.deposit,
        duration:     state.credit.duration,
        rate:         state.credit.rate,
        onResult:     (result) => {
          state.credit = { ...state.credit, ...result };
          // Activer/désactiver bouton Continua
          const btn = document.getElementById('step2-next');
          if (btn) {
            btn.disabled = !result.isValid;
            btn.style.opacity = result.isValid ? '1' : '0.5';
            btn.style.cursor  = result.isValid ? 'pointer' : 'not-allowed';
          }
          renderSummary();
        },
      });
    }
  }

  // ============================================================
  // ÉTAPE 3 — Dati Personali
  // ============================================================
  function renderStep3(container) {
    const c = state.customer;
    container.innerHTML = `
      <div class="checkout-step-panel">
        <div class="checkout-step-header">
          <div class="checkout-step-header__icon">👤</div>
          <div>
            <h2 class="checkout-step-header__title">I Tuoi Dati Personali</h2>
            <p class="checkout-step-header__subtitle">Tutti i campi contrassegnati con * sono obbligatori</p>
          </div>
        </div>
        <div class="checkout-step-body">
          <div class="checkout-form-grid">

            <div class="checkout-section-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
              Anagrafica
            </div>

            <div class="form-group">
              <label class="form-label form-label--required">Nome</label>
              <input type="text" class="form-control" id="f-nome"
                value="${c.nome}" placeholder="Mario"
                oninput="CheckoutPage.updateCustomer('nome', this.value)"/>
              <div class="form-error" id="e-nome">Campo obbligatorio</div>
            </div>
            <div class="form-group">
              <label class="form-label form-label--required">Cognome</label>
              <input type="text" class="form-control" id="f-cognome"
                value="${c.cognome}" placeholder="Rossi"
                oninput="CheckoutPage.updateCustomer('cognome', this.value)"/>
              <div class="form-error" id="e-cognome">Campo obbligatorio</div>
            </div>

            <div class="form-group">
              <label class="form-label form-label--required">Email</label>
              <input type="email" class="form-control" id="f-email"
                value="${c.email}" placeholder="mario.rossi@email.it"
                oninput="CheckoutPage.updateCustomer('email', this.value)"/>
              <div class="form-error" id="e-email">Inserisci un'email valida</div>
            </div>
            <div class="form-group">
              <label class="form-label form-label--required">Telefono</label>
              <input type="tel" class="form-control" id="f-telefono"
                value="${c.telefono}" placeholder="+39 333 123 4567"
                oninput="CheckoutPage.updateCustomer('telefono', this.value)"/>
              <div class="form-error" id="e-telefono">Inserisci un numero valido</div>
            </div>

            <div class="form-group">
              <label class="form-label form-label--required">Codice Fiscale</label>
              <input type="text" class="form-control" id="f-cf"
                value="${c.codiceFiscale}" placeholder="RSSMRA80A01H501U"
                maxlength="16" style="text-transform:uppercase"
                oninput="CheckoutPage.updateCustomer('codiceFiscale', this.value.toUpperCase())"/>
              <div class="form-error" id="e-cf">Codice fiscale non valido (16 caratteri)</div>
            </div>
            <div class="form-group">
              <label class="form-label form-label--required">Data di Nascita</label>
              <input type="date" class="form-control" id="f-dob"
                value="${c.dataNascita}"
                oninput="CheckoutPage.updateCustomer('dataNascita', this.value)"/>
              <div class="form-error" id="e-dob">Campo obbligatorio</div>
            </div>

            <!-- Indirizzo residenza -->
            <div class="checkout-section-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              Indirizzo di Residenza
            </div>

            <div class="form-group form-group--full">
              <label class="form-label form-label--required">Indirizzo</label>
              <input type="text" class="form-control" id="f-ind"
                value="${c.indirizzo}" placeholder="Via Roma 42"
                oninput="CheckoutPage.updateCustomer('indirizzo', this.value)"/>
              <div class="form-error" id="e-ind">Campo obbligatorio</div>
            </div>

            <div class="form-group">
              <label class="form-label form-label--required">CAP</label>
              <input type="text" class="form-control" id="f-cap"
                value="${c.cap}" placeholder="20121" maxlength="5"
                oninput="CheckoutPage.updateCustomer('cap', this.value)"/>
              <div class="form-error" id="e-cap">CAP non valido (5 cifre)</div>
            </div>
            <div class="form-group">
              <label class="form-label form-label--required">Città</label>
              <input type="text" class="form-control" id="f-citta"
                value="${c.citta}" placeholder="Milano"
                oninput="CheckoutPage.updateCustomer('citta', this.value)"/>
              <div class="form-error" id="e-citta">Campo obbligatorio</div>
            </div>

            <div class="form-group">
              <label class="form-label">Provincia</label>
              <input type="text" class="form-control" id="f-prov"
                value="${c.provincia}" placeholder="MI" maxlength="2"
                style="text-transform:uppercase"
                oninput="CheckoutPage.updateCustomer('provincia', this.value.toUpperCase())"/>
            </div>
            <div class="form-group">
              <label class="form-label form-label--required">Paese</label>
              <select class="form-control" id="f-paese"
                onchange="CheckoutPage.updateCustomer('paese', this.value)">
                ${['Italia','Francia','Germania','Spagna','Svizzera','Austria','Belgio','Olanda','Portogallo','Polonia'].map(p =>
                  `<option value="${p}" ${c.paese === p ? 'selected' : ''}>${p}</option>`
                ).join('')}
              </select>
            </div>

            <!-- Indirizzo consegna -->
            <div class="checkout-section-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
              </svg>
              Indirizzo di Consegna
              <span style="font-size:var(--text-xs);color:var(--color-text-muted);text-transform:none;letter-spacing:0;font-weight:400">
                (lascia vuoto se uguale alla residenza)
              </span>
            </div>

            <div class="form-group form-group--full">
              <label class="form-label">Indirizzo di Consegna</label>
              <input type="text" class="form-control" id="f-cons-ind"
                value="${c.consegnaIndirizzo}" placeholder="Via della Consegna 1 (opzionale)"
                oninput="CheckoutPage.updateCustomer('consegnaIndirizzo', this.value)"/>
            </div>
            <div class="form-group">
              <label class="form-label">CAP Consegna</label>
              <input type="text" class="form-control" id="f-cons-cap"
                value="${c.consegnaCap}" placeholder="00100"
                oninput="CheckoutPage.updateCustomer('consegnaCap', this.value)"/>
            </div>
            <div class="form-group">
              <label class="form-label">Città Consegna</label>
              <input type="text" class="form-control" id="f-cons-citta"
                value="${c.consegnaCitta}" placeholder="Roma"
                oninput="CheckoutPage.updateCustomer('consegnaCitta', this.value)"/>
            </div>
            <div class="form-group form-group--full">
              <label class="form-label">Note per la Consegna</label>
              <textarea class="form-control" id="f-note" rows="2"
                placeholder="Citofono, orari preferiti, istruzioni particolari..."
                oninput="CheckoutPage.updateCustomer('noteConsegna', this.value)">${c.noteConsegna}</textarea>
            </div>

          </div>
        </div>
        <div class="checkout-step-nav">
          <button class="btn btn--ghost" onclick="CheckoutPage.prevStep()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Indietro
          </button>
          <button class="btn btn--primary" onclick="CheckoutPage.validateStep3()">
            Continua
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>
      </div>
    `;
  }

  // ============================================================
  // ÉTAPE 4 — Riepilogo + Engagement
  // ============================================================
  function renderStep4(container) {
    const v = state.vehicle;
    const c = state.credit;
    const p = state.customer;
    const isCash = state.paymentMode === 'cash';

    container.innerHTML = `
      <div class="checkout-step-panel">
        <div class="checkout-step-header">
          <div class="checkout-step-header__icon">📋</div>
          <div>
            <h2 class="checkout-step-header__title">Riepilogo Completo</h2>
            <p class="checkout-step-header__subtitle">Verifica tutti i dati prima di confermare</p>
          </div>
        </div>
        <div class="checkout-step-body">

          <!-- Bloc véhicule -->
          <div class="summary-block">
            <div class="summary-block__header">🚗 Veicolo</div>
            <div class="summary-block__body">
              <div class="summary-row"><span class="summary-row__label">Modello</span><span class="summary-row__value">${v?.marca} ${v?.modello}</span></div>
              <div class="summary-row"><span class="summary-row__label">Anno</span><span class="summary-row__value">${v?.anno}</span></div>
              <div class="summary-row"><span class="summary-row__label">Tipo</span><span class="summary-row__value">${v?.tipo === 'nuovo' ? '✨ Nuovo' : '🔍 Usato Verificato'}</span></div>
              <div class="summary-row"><span class="summary-row__label">Carburante</span><span class="summary-row__value">${v?.carburante}</span></div>
              <div class="summary-row summary-row--total"><span class="summary-row__label">Prezzo Veicolo</span><span class="summary-row__value">${Helpers.formatPrice(v?.prezzo)}</span></div>
            </div>
          </div>

          <!-- Bloc paiement -->
          <div class="summary-block">
            <div class="summary-block__header">💳 Modalità di Pagamento</div>
            <div class="summary-block__body">
              ${isCash ? `
                <div class="summary-row"><span class="summary-row__label">Modalità</span><span class="summary-row__value">💵 Acquisto in Contanti</span></div>
                <div class="summary-row summary-row--total"><span class="summary-row__label">Totale da Pagare</span><span class="summary-row__value">${Helpers.formatPrice(v?.prezzo)}</span></div>
              ` : `
                <div class="summary-row"><span class="summary-row__label">Modalità</span><span class="summary-row__value">💳 Finanziamento Rateale</span></div>
                <div class="summary-row"><span class="summary-row__label">Acconto versato</span><span class="summary-row__value" style="color:var(--color-success)">${Helpers.formatPrice(c.deposit)}</span></div>
                <div class="summary-row"><span class="summary-row__label">Importo finanziato</span><span class="summary-row__value">${Helpers.formatPrice(c.financed)}</span></div>
                <div class="summary-row"><span class="summary-row__label">Durata</span><span class="summary-row__value">${c.duration} mesi</span></div>
                <div class="summary-row"><span class="summary-row__label">Tasso TAN</span><span class="summary-row__value">${c.rate.toFixed(2).replace('.',',')}%</span></div>
                <div class="summary-row"><span class="summary-row__label">Rata mensile</span><span class="summary-row__value" style="color:var(--color-primary);font-size:var(--text-lg)">${Helpers.formatPrice(c.monthly)}</span></div>
                <div class="summary-row summary-row--total"><span class="summary-row__label">Costo Totale</span><span class="summary-row__value">${Helpers.formatPrice(c.totalCost)}</span></div>
              `}
            </div>
          </div>

          <!-- Bloc client -->
          <div class="summary-block">
            <div class="summary-block__header">👤 Dati Cliente</div>
            <div class="summary-block__body">
              <div class="summary-row"><span class="summary-row__label">Nome Completo</span><span class="summary-row__value">${p.nome} ${p.cognome}</span></div>
              <div class="summary-row"><span class="summary-row__label">Email</span><span class="summary-row__value">${p.email}</span></div>
              <div class="summary-row"><span class="summary-row__label">Telefono</span><span class="summary-row__value">${p.telefono}</span></div>
              <div class="summary-row"><span class="summary-row__label">Codice Fiscale</span><span class="summary-row__value">${p.codiceFiscale}</span></div>
              <div class="summary-row"><span class="summary-row__label">Indirizzo</span><span class="summary-row__value">${p.indirizzo}, ${p.cap} ${p.citta}</span></div>
              <div class="summary-row"><span class="summary-row__label">Consegna</span><span class="summary-row__value">${p.consegnaIndirizzo ? `${p.consegnaIndirizzo}, ${p.consegnaCap} ${p.consegnaCitta}` : 'Come residenza'}</span></div>
            </div>
          </div>

          <!-- Engagement OBLIGATOIRE -->
          <div class="checkout-commitment ${state.committed ? 'accepted' : ''}" id="commitment-box">
            <p class="checkout-commitment__title">
              ${state.committed ? '✅' : '⚠️'} Impegno Obbligatorio
            </p>
            <label class="form-check" style="cursor:pointer">
              <input type="checkbox" id="commitment-check"
                ${state.committed ? 'checked' : ''}
                onchange="CheckoutPage.toggleCommitment(this.checked)"/>
              <span class="form-check-label">
                Dichiaro di aver letto e accettato i
                <a href="#" style="color:var(--color-primary);text-decoration:underline">Termini e Condizioni</a>
                e la
                <a href="#" style="color:var(--color-primary);text-decoration:underline">Privacy Policy</a>
                di Hax-ISA. Confermo che tutti i dati inseriti sono veritieri e mi impegno a completare l'acquisto secondo le modalità indicate.
                <strong>Comprendo che questo ordine costituisce un impegno di acquisto vincolante.</strong>
              </span>
            </label>
          </div>

        </div>
        <div class="checkout-step-nav">
          <button class="btn btn--ghost" onclick="CheckoutPage.prevStep()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Indietro
          </button>
          <button class="btn btn--primary" id="confirm-btn"
            onclick="CheckoutPage.validateStep4()"
            ${!state.committed ? 'disabled style="opacity:.5;cursor:not-allowed"' : ''}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            Conferma Ordine
          </button>
        </div>
      </div>
    `;
  }

  // ============================================================
  // ÉTAPE 5 — Invio + Loading + Redirect confirmation
  // ============================================================
  function renderStep5(container) {
    container.innerHTML = `
      <div class="checkout-step-panel">
        <div class="checkout-step-body" style="text-align:center;padding:var(--space-16)">
          <div class="spinner spinner--lg" style="margin:0 auto var(--space-6)"></div>
          <h2 style="font-size:var(--text-2xl);font-weight:var(--font-bold);margin-bottom:var(--space-3)">
            Elaborazione in corso...
          </h2>
          <p style="color:var(--color-text-muted)">
            Stiamo registrando il tuo ordine. Attendi qualche secondo.
          </p>
        </div>
      </div>
    `;

    // Simuler l'appel API
    submitOrder()
      .then(result => {
        Storage.setCheckoutData({
          orderId:     result.orderId,
          vehicle:     state.vehicle,
          paymentMode: state.paymentMode,
          credit:      state.credit,
          customer:    state.customer,
        });
        window.location.href = `confirmation.html?order=${result.orderId}`;
      })
      .catch(err => {
        ToastComponent.show('Errore durante l\'invio. Riprova.', 'error');
        state.currentStep = 4;
        renderAll();
      });
  }

  // ============================================================
  // SOUMISSION COMMANDE (API ou démo)
  // ============================================================
  async function submitOrder() {
    const payload = {
      vehicleId:   state.vehicleId,
      paymentMode: state.paymentMode,
      credit:      state.paymentMode === 'credit' ? state.credit : null,
      customer:    state.customer,
    };

    try {
      const result = await API.orders.create(payload);
      return { orderId: result._id || result.orderId };
    } catch (e) {
      // Démo : générer un ID fictif
      await new Promise(r => setTimeout(r, 1800));
      return { orderId: 'HAX-' + Date.now().toString(36).toUpperCase() };
    }
  }

  // ============================================================
  // VALIDATIONS
  // ============================================================
  function validateStep2() {
    if (!state.credit.isValid) {
      ToastComponent.show('Completa la simulazione del finanziamento con un acconto valido.', 'warning');
      return;
    }
    nextStep();
  }

  function validateStep3() {
    const p   = state.customer;
    let valid = true;

    const checks = [
      { field:'nome',         id:'f-nome',   err:'e-nome',   test: v => v.length >= 2 },
      { field:'cognome',      id:'f-cognome',err:'e-cognome',test: v => v.length >= 2 },
      { field:'email',        id:'f-email',  err:'e-email',  test: v => Helpers.isValidEmail(v) },
      { field:'telefono',     id:'f-telefono',err:'e-telefono',test: v => v.length >= 8 },
      { field:'codiceFiscale',id:'f-cf',     err:'e-cf',     test: v => v.length === 16 },
      { field:'dataNascita',  id:'f-dob',    err:'e-dob',    test: v => !!v },
      { field:'indirizzo',    id:'f-ind',    err:'e-ind',    test: v => v.length >= 5 },
      { field:'cap',          id:'f-cap',    err:'e-cap',    test: v => Helpers.isValidCAP(v) },
      { field:'citta',        id:'f-citta',  err:'e-citta',  test: v => v.length >= 2 },
    ];

    checks.forEach(({ field, id, err, test }) => {
      const val = p[field] || '';
      const ok  = test(val);
      const inputEl = document.getElementById(id);
      const errEl   = document.getElementById(err);
      if (inputEl) inputEl.classList.toggle('is-invalid', !ok);
      if (errEl)   errEl.style.display = ok ? 'none' : 'block';
      if (!ok) { valid = false; }
    });

    if (!valid) {
      ToastComponent.show('Correggi i campi evidenziati in rosso.', 'error');
      // Scroll vers le premier champ invalide
      document.querySelector('.form-control.is-invalid')?.scrollIntoView({ behavior:'smooth', block:'center' });
      return;
    }
    nextStep();
  }

  function validateStep4() {
    if (!state.committed) {
      ToastComponent.show('Devi accettare i termini e condizioni per procedere.', 'warning');
      document.getElementById('commitment-check')?.focus();
      return;
    }
    nextStep();
  }

  // ============================================================
  // NAVIGATION
  // ============================================================
  function nextStep() {
    if (state.currentStep >= state.totalSteps) return;
    state.currentStep++;
    // Sauter étape 2 si comptant
    if (state.currentStep === 2 && state.paymentMode === 'cash') state.currentStep = 3;
    renderAll();
  }

  function prevStep() {
    if (state.currentStep <= 1) return;
    state.currentStep--;
    if (state.currentStep === 2 && state.paymentMode === 'cash') state.currentStep = 1;
    renderAll();
  }

  // ============================================================
  // SETTERS
  // ============================================================
  function setPaymentMode(mode) {
    state.paymentMode = mode;
    renderStep1(document.getElementById('checkout-main'));
    renderSummary();
  }

  function updateCustomer(field, value) {
    state.customer[field] = value;
  }

  function toggleCommitment(checked) {
    state.committed = checked;
    const box = document.getElementById('commitment-box');
    if (box) box.classList.toggle('accepted', checked);
    const btn = document.getElementById('confirm-btn');
    if (btn) {
      btn.disabled = !checked;
      btn.style.opacity = checked ? '1' : '0.5';
      btn.style.cursor  = checked ? 'pointer' : 'not-allowed';
    }
  }

  function computeMonthly(price, months = 36) {
    const deposit  = price * 0.20;
    const financed = price - deposit;
    const r        = HAX_CONFIG.credit.defaultRate / 100 / 12;
    const factor   = Math.pow(1 + r, months);
    return financed * (r * factor) / (factor - 1);
  }

  return {
    init, nextStep, prevStep,
    setPaymentMode, updateCustomer, toggleCommitment,
    validateStep2, validateStep3, validateStep4,
  };

})();

window.CheckoutPage = CheckoutPage;
