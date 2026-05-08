/**
 * components/credit-simulator.js
 * Simulateur de crédit Hax-ISA — composant réutilisable
 *
 * Logique financière :
 *   Mensualité = P × [r(1+r)^n] / [(1+r)^n − 1]
 *   P = prix - apport
 *   r = taux_annuel / 12 / 100
 *   n = durée en mois
 *
 * Contraintes bloquantes :
 *   - Apport OBLIGATOIRE ≥ minDepositPercent% du prix (défaut 10%)
 *   - Taux entre 2.0% et 3.5%
 *   - Durée entre 12 et 84 mois
 */
'use strict';

const CreditSimulator = (() => {

  // ============================================================
  // CONFIGURATION (référence HAX_CONFIG)
  // ============================================================
  const CFG = {
    MIN_RATE:        2.0,
    MAX_RATE:        3.5,
    DEFAULT_RATE:    2.5,
    RATE_OPTIONS:    [2.0, 2.5, 3.0, 3.5],
    DURATION_OPTIONS:[12, 24, 36, 48, 60, 72, 84],
    DEFAULT_DURATION:36,
    MIN_DEPOSIT_PCT: 10,   // % minimum du prix — BLOQUANT
  };

  // ============================================================
  // ÉTAT INTERNE
  // ============================================================
  let state = {
    vehiclePrice:  0,
    vehicleName:   '',
    vehicleId:     null,
    deposit:       0,
    duration:      CFG.DEFAULT_DURATION,
    rate:          CFG.DEFAULT_RATE,
    computed: {
      financed:    0,
      monthly:     0,
      totalCost:   0,
      totalInterest:0,
      isValid:     false,
      depositPct:  0,
      minDeposit:  0,
    },
    container:     null,
    onResult:      null,   // callback(result) pour le checkout
  };

  // ============================================================
  // CALCUL FINANCIER
  // ============================================================

  /**
   * Calcule la mensualité avec la formule d'amortissement
   * @param {number} principal  - Montant financé (prix - apport)
   * @param {number} annualRate - Taux annuel en %
   * @param {number} months     - Durée en mois
   * @returns {number} Mensualité arrondie à 2 décimales
   */
  function calcMonthly(principal, annualRate, months) {
    if (principal <= 0 || months <= 0) return 0;
    const r = annualRate / 100 / 12;
    if (r === 0) return principal / months;
    const factor = Math.pow(1 + r, months);
    return parseFloat((principal * (r * factor) / (factor - 1)).toFixed(2));
  }

  /**
   * Valide et calcule tous les champs
   */
  function compute() {
    const price      = state.vehiclePrice;
    const deposit    = state.deposit;
    const duration   = state.duration;
    const rate       = state.rate;

    const minDeposit = price * (CFG.MIN_DEPOSIT_PCT / 100);
    const depositPct = price > 0 ? (deposit / price) * 100 : 0;
    const isValid    = deposit >= minDeposit && price > 0;

    const financed      = Math.max(0, price - deposit);
    const monthly       = isValid ? calcMonthly(financed, rate, duration) : 0;
    const totalCost     = isValid ? (monthly * duration) + deposit : 0;
    const totalInterest = isValid ? (monthly * duration) - financed : 0;

    state.computed = {
      financed, monthly, totalCost, totalInterest,
      isValid, depositPct, minDeposit,
    };

    return state.computed;
  }

  // ============================================================
  // CONSTRUCTION DU HTML
  // ============================================================
  function buildHTML() {
    const price    = state.vehiclePrice;
    const minDep   = price * (CFG.MIN_DEPOSIT_PCT / 100);
    const rateOpts = CFG.RATE_OPTIONS.map(r =>
      `<button class="sim-rate-btn ${r === state.rate ? 'active' : ''}"
         onclick="CreditSimulator.setRate(${r})" data-rate="${r}">
         ${r.toFixed(1).replace('.',',')}%
       </button>`
    ).join('');

    const durationMarks = CFG.DURATION_OPTIONS.map(d => {
      const pct = ((d - 12) / (84 - 12)) * 100;
      return `<span class="sim-slider-mark ${d === state.duration ? 'active' : ''}"
                onclick="CreditSimulator.setDuration(${d})"
                style="position:absolute;left:${pct}%;transform:translateX(-50%)">${d}</span>`;
    }).join('');

    const sliderPct = ((state.duration - 12) / (84 - 12)) * 100;

    return `
      <!-- En-tête -->
      <div class="sim-header">
        <div>
          <div class="sim-header__title">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="1" y="4" width="22" height="16" rx="2"/>
              <line x1="1" y1="10" x2="23" y2="10"/>
            </svg>
            Simulatore Finanziamento
          </div>
          <div class="sim-header__subtitle">
            Calcolo indicativo — Tasso effettivo definito in fase di approvazione
          </div>
        </div>
        ${price > 0 ? `
          <div class="sim-header__vehicle">
            <div class="sim-header__vehicle-name">${state.vehicleName || 'Veicolo selezionato'}</div>
            <div class="sim-header__vehicle-price">${Helpers.formatPrice(price)}</div>
          </div>
        ` : ''}
      </div>

      <!-- Corpo -->
      <div class="sim-body">

        <!-- ===== INPUTS ===== -->
        <div class="sim-inputs">

          ${price <= 0 ? `
            <!-- Input prezzo (quando non è prefissato) -->
            <div class="sim-field">
              <div class="sim-label">
                Prezzo Veicolo
                <span class="sim-label__required">Obbligatorio</span>
              </div>
              <div class="sim-input-money">
                <span class="sim-input-money__prefix">€</span>
                <input type="number" id="sim-price-input"
                  placeholder="es. 30.000"
                  value="${price || ''}"
                  min="1000" max="999999" step="500"
                  oninput="CreditSimulator.setPrice(this.value)"
                  aria-label="Prezzo veicolo"/>
              </div>
            </div>
          ` : ''}

          <!-- Apport / Acconto -->
          <div class="sim-field">
            <div class="sim-label">
              Acconto Iniziale
              <span class="sim-label__required">⚠ Min ${CFG.MIN_DEPOSIT_PCT}% obbligatorio</span>
            </div>
            <div class="sim-input-money">
              <span class="sim-input-money__prefix">€</span>
              <input type="number" id="sim-deposit-input"
                placeholder="Minimo ${Helpers.formatPrice(minDep, 0)}"
                value="${state.deposit > 0 ? state.deposit : ''}"
                min="0" max="${price}"
                step="500"
                oninput="CreditSimulator.setDeposit(this.value)"
                aria-label="Acconto iniziale"/>
            </div>

            <!-- Barre de progression apport -->
            <div class="sim-deposit-progress">
              <div class="sim-deposit-bar-track">
                <div class="sim-deposit-bar-fill ${getDepositBarClass()}"
                     id="sim-deposit-bar"
                     style="width:${Math.min(100, state.computed.depositPct || 0)}%">
                </div>
              </div>
              <div class="sim-deposit-bar-labels">
                <span>0%</span>
                <span id="sim-deposit-pct-label">${(state.computed.depositPct || 0).toFixed(1).replace('.',',')}% del prezzo</span>
                <span>100%</span>
              </div>
              <div class="sim-deposit-feedback ${getDepositFeedbackClass()}" id="sim-deposit-feedback">
                ${getDepositFeedbackText()}
              </div>
            </div>
          </div>

          <!-- Durée -->
          <div class="sim-field">
            <div class="sim-label">
              Durata del Finanziamento
              <span class="sim-label__hint">${CFG.DURATION_OPTIONS[0]}–${CFG.DURATION_OPTIONS[CFG.DURATION_OPTIONS.length-1]} mesi</span>
            </div>
            <div class="sim-slider-container">
              <div class="sim-slider-value-display" id="sim-duration-display">
                ${state.duration}<span>mesi</span>
              </div>
              <input type="range" class="sim-range" id="sim-duration-slider"
                min="12" max="84" step="12"
                value="${state.duration}"
                style="--fill-pct:${sliderPct}%"
                oninput="CreditSimulator.setDurationFromSlider(this.value)"
                aria-label="Durata finanziamento"/>
              <div class="sim-slider-marks" style="position:relative;height:20px;margin-top:var(--space-1)">
                ${durationMarks}
              </div>
            </div>
          </div>

          <!-- Tasso -->
          <div class="sim-field">
            <div class="sim-label">
              Tasso Annuale (TAN)
              <span class="sim-label__hint">${CFG.MIN_RATE}%–${CFG.MAX_RATE}%</span>
            </div>
            <div class="sim-rate-selector" id="sim-rate-selector">
              ${rateOpts}
            </div>
          </div>

        </div><!-- /sim-inputs -->

        <!-- ===== RISULTATI ===== -->
        <div class="sim-results" id="sim-results-panel">
          ${buildResultsHTML()}
        </div>

      </div><!-- /sim-body -->

      <!-- Footer CTA -->
      <div class="sim-footer">
        <a href="${buildCheckoutUrl()}"
           id="sim-cta-credit"
           class="btn btn--primary ${state.computed.isValid ? '' : 'disabled'}"
           ${state.computed.isValid ? '' : 'onclick="return false;" style="opacity:.5;cursor:not-allowed"'}
           aria-disabled="${!state.computed.isValid}">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="1" y="4" width="22" height="16" rx="2"/>
            <line x1="1" y1="10" x2="23" y2="10"/>
          </svg>
          Acquista a Credito
        </a>
        <a href="${buildCheckoutUrl('cash')}"
           class="btn btn--ghost">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="1" x2="12" y2="23"/>
            <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
          </svg>
          Acquista in Contanti
        </a>
      </div>

      <!-- Disclaimer legale -->
      <p class="sim-disclaimer">
        * Simulazione indicativa a scopo informativo. Il tasso effettivo globale (TAEG) sarà comunicato in fase di richiesta formale.
        Offerta soggetta ad approvazione della finanziaria. Documento informativo precontrattuale disponibile su richiesta.
        Hax-ISA S.r.l. — Agente in attività finanziaria n. 12345 — OAM.
      </p>
    `;
  }

  // ============================================================
  // BLOC RÉSULTATS (rafraîchi à chaque calcul)
  // ============================================================
  function buildResultsHTML() {
    const c = state.computed;

    // État sans données suffisantes
    if (!state.vehiclePrice || state.deposit === 0) {
      return `
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:var(--space-4);text-align:center;padding:var(--space-8)">
          <div style="font-size:3rem">💳</div>
          <p style="color:var(--color-text-muted);font-size:var(--text-sm)">
            Inserisci l'acconto per vedere la simulazione completa
          </p>
        </div>
      `;
    }

    // État apport insuffisant — BLOQUANT
    if (!c.isValid) {
      return `
        <div style="display:flex;flex-direction:column;gap:var(--space-5)">
          <div class="sim-monthly-error show">
            <div style="font-size:2rem;margin-bottom:var(--space-3)">⚠️</div>
            <p style="font-weight:var(--font-bold);color:var(--color-danger);font-size:var(--text-md);margin-bottom:var(--space-2)">
              Acconto insufficiente
            </p>
            <p style="color:var(--color-danger);font-size:var(--text-sm)">
              L'acconto minimo obbligatorio è <strong>${Helpers.formatPrice(c.minDeposit)}</strong>
              (${CFG.MIN_DEPOSIT_PCT}% del prezzo del veicolo).
            </p>
            <p style="color:var(--color-text-muted);font-size:var(--text-xs);margin-top:var(--space-3)">
              Mancano ancora: <strong>${Helpers.formatPrice(c.minDeposit - state.deposit)}</strong>
            </p>
          </div>
          <div style="background:var(--color-warning-bg);border:1px solid var(--color-warning-border);border-radius:var(--radius-lg);padding:var(--space-4)">
            <p style="font-size:var(--text-xs);color:var(--color-warning);font-weight:var(--font-semibold)">
              💡 Perché è obbligatorio un acconto minimo?
            </p>
            <p style="font-size:var(--text-xs);color:var(--color-text-muted);margin-top:var(--space-2)">
              L'acconto riduce il rischio finanziario e ti garantisce rate mensili più basse.
              È una protezione per te e per la finanziaria.
            </p>
          </div>
        </div>
      `;
    }

    // Résultats valides
    const interestPct = c.financed > 0 ? ((c.totalInterest / c.totalCost) * 100) : 0;
    const principalPct = c.financed > 0 ? ((c.financed / c.totalCost) * 100) : 0;
    const depositPctOfTotal = c.totalCost > 0 ? ((state.deposit / c.totalCost) * 100) : 0;

    return `
      <!-- Mensualité principale -->
      <div class="sim-monthly-card">
        <p class="sim-monthly-label">Rata Mensile</p>
        <div class="sim-monthly-amount" id="sim-monthly-display">
          ${Helpers.formatPrice(c.monthly)}
        </div>
        <p class="sim-monthly-period">
          per ${state.duration} mesi — tasso ${state.rate.toFixed(1).replace('.',',')}% TAN
        </p>
      </div>

      <!-- Tableau récapitulatif -->
      <div class="sim-summary-table">
        ${[
          { icon:'💰', label:'Prezzo veicolo',      value: Helpers.formatPrice(state.vehiclePrice) },
          { icon:'✅', label:'Acconto versato',     value: Helpers.formatPrice(state.deposit),      highlight: true },
          { icon:'🏦', label:'Importo finanziato',  value: Helpers.formatPrice(c.financed) },
          { icon:'📅', label:'Durata',              value: `${state.duration} mesi` },
          { icon:'📊', label:'Tasso TAN',           value: `${state.rate.toFixed(2).replace('.',',')}%` },
          { icon:'➕', label:'Interessi totali',    value: Helpers.formatPrice(c.totalInterest) },
          { icon:'💳', label:'Costo totale',        value: Helpers.formatPrice(c.totalCost), total: true },
        ].map(row => `
          <div class="sim-summary-row ${row.total ? 'sim-summary-row--total' : ''} ${row.highlight ? 'sim-summary-row--highlight' : ''}">
            <span class="sim-summary-label">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
              </svg>
              ${row.label}
            </span>
            <span class="sim-summary-value">${row.value}</span>
          </div>
        `).join('')}
      </div>

      <!-- Répartition visuelle -->
      <div class="sim-cost-breakdown">
        <p class="sim-cost-breakdown__title">Ripartizione del Costo Totale</p>
        <div class="sim-cost-bar">
          <div class="sim-cost-bar__row">
            <span class="sim-cost-bar__label">🔵 Acconto</span>
            <span class="sim-cost-bar__value">${depositPctOfTotal.toFixed(1)}% — ${Helpers.formatPrice(state.deposit)}</span>
          </div>
          <div class="sim-cost-bar__track">
            <div class="sim-cost-bar__fill sim-cost-bar__fill--deposit"
                 style="width:${depositPctOfTotal.toFixed(1)}%"></div>
          </div>
        </div>
        <div class="sim-cost-bar">
          <div class="sim-cost-bar__row">
            <span class="sim-cost-bar__label">🔴 Capitale finanziato</span>
            <span class="sim-cost-bar__value">${principalPct.toFixed(1)}% — ${Helpers.formatPrice(c.financed)}</span>
          </div>
          <div class="sim-cost-bar__track">
            <div class="sim-cost-bar__fill sim-cost-bar__fill--principal"
                 style="width:${principalPct.toFixed(1)}%"></div>
          </div>
        </div>
        <div class="sim-cost-bar">
          <div class="sim-cost-bar__row">
            <span class="sim-cost-bar__label">🟦 Interessi</span>
            <span class="sim-cost-bar__value">${interestPct.toFixed(1)}% — ${Helpers.formatPrice(c.totalInterest)}</span>
          </div>
          <div class="sim-cost-bar__track">
            <div class="sim-cost-bar__fill sim-cost-bar__fill--interest"
                 style="width:${interestPct.toFixed(1)}%"></div>
          </div>
        </div>
      </div>
    `;
  }

  // ============================================================
  // HELPERS FEEDBACK APPORT
  // ============================================================
  function getDepositBarClass() {
    const pct = state.computed.depositPct || 0;
    if (pct < CFG.MIN_DEPOSIT_PCT)     return 'danger';
    if (pct < CFG.MIN_DEPOSIT_PCT + 5) return 'warning';
    return '';
  }

  function getDepositFeedbackClass() {
    if (!state.deposit || !state.vehiclePrice) return '';
    return state.computed.isValid ? 'show ok' : 'show error';
  }

  function getDepositFeedbackText() {
    if (!state.deposit || !state.vehiclePrice) return '';
    const c = state.computed;
    if (!c.isValid) {
      return `⛔ Acconto insufficiente — mancano ${Helpers.formatPrice(c.minDeposit - state.deposit)} (minimo ${Helpers.formatPrice(c.minDeposit)})`;
    }
    return `✅ Acconto valido — ${c.depositPct.toFixed(1).replace('.',',')}% del prezzo`;
  }

  function buildCheckoutUrl(mode = 'credit') {
    if (!state.vehicleId) return '#';
    const params = new URLSearchParams({
      id:       state.vehicleId,
      mode,
      deposit:  state.deposit,
      duration: state.duration,
      rate:     state.rate,
    });
    return `checkout.html?${params.toString()}`;
  }

  // ============================================================
  // RAFRAÎCHISSEMENT PARTIEL (pas de rebuild complet)
  // ============================================================
  function refreshResults() {
    compute();
    const panel = state.container?.querySelector('#sim-results-panel');
    if (panel) {
      panel.innerHTML = buildResultsHTML();
    }
    // Mettre à jour barre dépôt
    refreshDepositUI();
    // Mettre à jour CTA
    refreshCTA();
  }

  function refreshDepositUI() {
    const bar     = state.container?.querySelector('#sim-deposit-bar');
    const pctLbl  = state.container?.querySelector('#sim-deposit-pct-label');
    const feedback= state.container?.querySelector('#sim-deposit-feedback');
    const c       = state.computed;

    if (bar) {
      bar.style.width = `${Math.min(100, c.depositPct)}%`;
      bar.className = `sim-deposit-bar-fill ${getDepositBarClass()}`;
    }
    if (pctLbl) pctLbl.textContent = `${c.depositPct.toFixed(1).replace('.',',')}% del prezzo`;
    if (feedback) {
      feedback.className = `sim-deposit-feedback ${getDepositFeedbackClass()}`;
      feedback.textContent = getDepositFeedbackText();
    }
  }

  function refreshCTA() {
    const cta = state.container?.querySelector('#sim-cta-credit');
    if (!cta) return;
    const valid = state.computed.isValid;
    cta.href = valid ? buildCheckoutUrl('credit') : '#';
    cta.style.opacity = valid ? '1' : '0.5';
    cta.style.cursor  = valid ? 'pointer' : 'not-allowed';
    cta.setAttribute('aria-disabled', !valid);
    if (!valid) cta.setAttribute('onclick', 'return false;');
    else cta.removeAttribute('onclick');
  }

  function refreshDurationUI() {
    const display = state.container?.querySelector('#sim-duration-display');
    const slider  = state.container?.querySelector('#sim-duration-slider');
    const marks   = state.container?.querySelectorAll('.sim-slider-mark');
    const pct     = ((state.duration - 12) / (84 - 12)) * 100;

    if (display) display.innerHTML = `${state.duration}<span>mesi</span>`;
    if (slider)  {
      slider.value = state.duration;
      slider.style.setProperty('--fill-pct', `${pct}%`);
    }
    marks?.forEach(m => m.classList.toggle('active', parseInt(m.textContent) === state.duration));
  }

  function refreshRateUI() {
    const btns = state.container?.querySelectorAll('.sim-rate-btn');
    btns?.forEach(btn => btn.classList.toggle('active', parseFloat(btn.dataset.rate) === state.rate));
  }

  // ============================================================
  // SETTERS (appelés depuis les handlers inline HTML)
  // ============================================================
  function setPrice(value) {
    state.vehiclePrice = parseFloat(value) || 0;
    // Recalculer le dépôt minimum si nécessaire
    const minDep = state.vehiclePrice * (CFG.MIN_DEPOSIT_PCT / 100);
    if (state.deposit < minDep) state.deposit = 0;
    refreshResults();
  }

  function setDeposit(value) {
    state.deposit = parseFloat(value) || 0;
    compute();
    refreshDepositUI();
    refreshResults();

    // Callback pour le checkout
    if (typeof state.onResult === 'function') {
      state.onResult(getResult());
    }
  }

  function setDuration(months) {
    state.duration = parseInt(months);
    refreshDurationUI();
    refreshResults();
    if (typeof state.onResult === 'function') state.onResult(getResult());
  }

  function setDurationFromSlider(value) {
    // Arrondir au pas de 12 le plus proche
    const snapped = Math.round(parseInt(value) / 12) * 12;
    state.duration = Math.max(12, Math.min(84, snapped));
    refreshDurationUI();
    refreshResults();
    if (typeof state.onResult === 'function') state.onResult(getResult());
  }

  function setRate(rate) {
    state.rate = parseFloat(rate);
    refreshRateUI();
    refreshResults();
    if (typeof state.onResult === 'function') state.onResult(getResult());
  }

  // ============================================================
  // RÉSULTAT EXPORTABLE (pour le checkout)
  // ============================================================
  function getResult() {
    return {
      vehiclePrice:   state.vehiclePrice,
      vehicleId:      state.vehicleId,
      deposit:        state.deposit,
      duration:       state.duration,
      rate:           state.rate,
      financed:       state.computed.financed,
      monthly:        state.computed.monthly,
      totalCost:      state.computed.totalCost,
      totalInterest:  state.computed.totalInterest,
      isValid:        state.computed.isValid,
    };
  }

  // ============================================================
  // INITIALISATION
  // ============================================================

  /**
   * @param {object} opts
   * @param {HTMLElement} opts.container    - Élément cible
   * @param {number}      opts.vehiclePrice - Prix du véhicule
   * @param {string}      opts.vehicleId    - ID du véhicule
   * @param {string}      opts.vehicleName  - Nom du véhicule
   * @param {number}      opts.deposit      - Apport pré-rempli (depuis URL)
   * @param {number}      opts.duration     - Durée pré-remplie
   * @param {number}      opts.rate         - Taux pré-rempli
   * @param {function}    opts.onResult     - Callback résultat
   */
  function init(opts = {}) {
    const container = opts.container || document.getElementById('credit-simulator-widget');
    if (!container) return;

    // Lire les paramètres URL si présents
    const params = Helpers.getUrlParams();
    state = {
      vehiclePrice:  opts.vehiclePrice || parseFloat(params.get('price')) || 0,
      vehicleId:     opts.vehicleId    || params.get('id')    || null,
      vehicleName:   opts.vehicleName  || '',
      deposit:       opts.deposit      || parseFloat(params.get('deposit'))  || 0,
      duration:      opts.duration     || parseInt(params.get('duration'))   || CFG.DEFAULT_DURATION,
      rate:          opts.rate         || parseFloat(params.get('rate'))     || CFG.DEFAULT_RATE,
      computed:      {},
      container,
      onResult:      opts.onResult || null,
    };

    compute();
    container.innerHTML = buildHTML();
  }

  // ============================================================
  // EXPORT PUBLIC
  // ============================================================
  return {
    init,
    setPrice, setDeposit, setDuration, setDurationFromSlider, setRate,
    getResult, compute,
    CFG,
  };

})();

window.CreditSimulator = CreditSimulator;
