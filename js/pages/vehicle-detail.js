/**
 * pages/vehicle-detail.js
 * Module page détail véhicule Hax-ISA
 * Galerie, specs, tabs, similaires, breadcrumb
 */
'use strict';

const VehicleDetailPage = (() => {

  // ============================================================
  // BASE DE DONNÉES DE DÉMO
  // ============================================================
  const ALL_VEHICLES = [
    {
      _id:'v01', marca:'BMW', modello:'Serie 5 520d xDrive', tipo:'nuovo', anno:2024,
      chilometri:0, prezzo:58900, prezzoOld:null, carburante:'Diesel', cambio:'Automatico',
      potenza:'190 CV', cilindrata:'1995 cc', colore:'Grigio Sophistograu', posti:5,
      porte:4, categoria:'berlina', immagini:[], trazione:'Integrale xDrive',
      consumo:'5.2 l/100km', emissioni:'137 g/km CO₂', peso:'1.715 kg',
      lunghezza:'4963 mm', larghezza:'1868 mm', velocita:'240 km/h',
      accelerazione:'7.1 sec (0–100)',
      descrizione: 'La BMW Serie 5 rappresenta l\'eccellenza nella categoria berlina di lusso. Con il motore diesel da 190 CV e la trazione integrale xDrive, offre prestazioni eccezionali e comfort ineguagliabile. Gli interni sono rivestiti in pelle Vernasca e dispongono di tutti i comfort più moderni.',
      equipaggiamento: {
        'Sicurezza': ['ABS e ASC', 'Airbag frontali e laterali', 'Controllo della stabilità DSC', 'Assistenza alla frenata in curva', 'Riconoscimento pedoni', 'Avviso di collisione frontale'],
        'Comfort': ['Climatizzatore automatico bi-zona', 'Sedili anteriori riscaldabili', 'Tetto apribile panoramico', 'Head-up display', 'Specchi retrovisori pieghevoli elettricamente', 'Parcheggio automatico'],
        'Connettività': ['BMW Live Cockpit Professional 12.3"', 'Apple CarPlay / Android Auto', 'Navigazione con traffico in tempo reale', 'Bluetooth con profilo A2DP', 'USB-C x4', 'Wi-Fi Hotspot'],
        'Esterno': ['Cerchi in lega 18" Streamline', 'Fari LED adattativi', 'Specchi con funzione anti-abbagliamento', 'Sensori di parcheggio anteriori e posteriori', 'Telecamera posteriore'],
      },
      storia: [
        { data: 'Gennaio 2024', titolo: 'Prima immatricolazione', desc: 'Veicolo nuovo, mai immatricolato' },
        { data: 'In magazzino', titolo: 'Disponibile immediatamente', desc: 'Pronto per la consegna entro 5 giorni lavorativi' },
      ],
    },
    {
      _id:'v02', marca:'Mercedes', modello:'GLC 300 4MATIC AMG Line', tipo:'nuovo', anno:2024,
      chilometri:0, prezzo:72400, prezzoOld:null, carburante:'Benzina', cambio:'Automatico',
      potenza:'258 CV', cilindrata:'1999 cc', colore:'Bianco Polare', posti:5,
      porte:5, categoria:'suv', immagini:[], trazione:'4MATIC',
      consumo:'8.1 l/100km', emissioni:'183 g/km CO₂', peso:'1.920 kg',
      lunghezza:'4716 mm', larghezza:'1890 mm', velocita:'240 km/h',
      accelerazione:'6.2 sec (0–100)',
      descrizione:'Il Mercedes GLC rappresenta la perfezione nel segmento SUV premium. La linea AMG conferisce sportività e dinamismo, mentre il motore turbo benzina da 258 CV garantisce prestazioni entusiasmanti con la trazione integrale 4MATIC.',
      equipaggiamento:{
        'Sicurezza':['PRE-SAFE Plus','Active Brake Assist','Blind Spot Assist','Attention Assist','Airbag a tendina'],
        'Comfort':['MBUX con display 11.9"','Sedili AMG in Artico/Dinamica','Clima bizona','Tetto panoramico','Keyless-Go'],
        'Connettività':['MBUX Navigation Plus','Apple CarPlay/Android Auto','Burmester 3D Surround','USB-C x3'],
        'Esterno':['Cerchi AMG 20" bicolor','Fari Multibeam LED','Pacchetto esterno AMG','Portellone elettrico'],
      },
      storia:[{data:'2024',titolo:'Nuovo',desc:'Mai immatricolato'}],
    },
    {
      _id:'v03', marca:'Audi', modello:'A4 35 TDI S line', tipo:'usato', anno:2022,
      chilometri:38000, prezzo:34500, prezzoOld:38900, carburante:'Diesel', cambio:'Automatico',
      potenza:'163 CV', cilindrata:'1968 cc', colore:'Nero Mythos', posti:5,
      porte:4, categoria:'berlina', immagini:[], trazione:'Trazione anteriore',
      consumo:'4.8 l/100km', emissioni:'127 g/km CO₂', peso:'1.480 kg',
      lunghezza:'4762 mm', larghezza:'1847 mm', velocita:'230 km/h',
      accelerazione:'8.1 sec (0–100)',
      descrizione:'Audi A4 in versione S line con allestimento sportivo e motore diesel efficiente. Unico proprietario, sempre revisionata in Audi Service. Condizioni eccellenti, nessun graffio o ammaccatura. Pneumatici invernali inclusi.',
      equipaggiamento:{
        'Sicurezza':['Audi Pre Sense City','Avviso corsia','ACC adattativo','6 airbag'],
        'Comfort':['Virtual Cockpit Plus 12.3"','MMI Navigation plus','Sedili in pelle Dakota','Clima bizona'],
        'Connettività':['MMI Navigation plus','Apple CarPlay','Bluetooth','4 USB'],
        'Esterno':['Cerchi S line 18"','Fari LED con luce diurna','Vetri oscurati'],
      },
      storia:[
        {data:'Mar 2022',titolo:'Prima immatricolazione',desc:'Acquistata nuova da privato a Milano'},
        {data:'Ott 2022',titolo:'Tagliando 15.000 km',desc:'Effettuato presso Audi Service Milano'},
        {data:'Apr 2023',titolo:'Tagliando 30.000 km',desc:'Effettuato presso Audi Service Torino'},
        {data:'Nov 2023',titolo:'Revisione',desc:'Superata con esito positivo'},
        {data:'Gen 2024',titolo:'Vendita a Hax-ISA',desc:'Acquistata e certificata dal nostro team'},
      ],
    },
  ];

  // Trouver un véhicule par ID
  function findVehicle(id) {
    return ALL_VEHICLES.find(v => v._id === id) || ALL_VEHICLES[0];
  }

  // Véhicules similaires
  function getSimilar(vehicle) {
    return ALL_VEHICLES.filter(v => v._id !== vehicle._id).slice(0, 3);
  }

  // ============================================================
  // ÉTAT GALERIE
  // ============================================================
  let galleryState = { current: 0, images: [] };

  const PLACEHOLDER = '../assets/images/placeholder-car.svg';

  function getImages(vehicle) {
    // Génère des placeholders en attendant les vraies images
    return vehicle.immagini?.length
      ? vehicle.immagini
      : [PLACEHOLDER, PLACEHOLDER, PLACEHOLDER];
  }

  // ============================================================
  // RENDU BREADCRUMB
  // ============================================================
  function renderBreadcrumb(vehicle) {
    const list = document.getElementById('breadcrumb-list');
    if (!list) return;
    list.innerHTML = `
      <li><a href="../index.html">Home</a></li>
      <li><a href="catalogue.html">Catalogo</a></li>
      <li><a href="catalogue.html?marca=${vehicle.marca}">${vehicle.marca}</a></li>
      <li>${vehicle.marca} ${vehicle.modello}</li>
    `;
  }

  // ============================================================
  // RENDU GALERIE
  // ============================================================
  function renderGallery(vehicle) {
    galleryState.images = getImages(vehicle);
    galleryState.current = 0;

    const thumbsHTML = galleryState.images.map((src, i) => `
      <div class="gallery-thumb ${i === 0 ? 'active' : ''}" onclick="VehicleDetailPage.goToImage(${i})">
        <img src="${src}" alt="Foto ${i+1}" onerror="this.src='${PLACEHOLDER}'" loading="lazy"/>
      </div>
    `).join('');

    return `
      <div class="vehicle-gallery">
        <div class="gallery-main" id="gallery-main">
          <img id="gallery-main-img" src="${galleryState.images[0]}"
               alt="${vehicle.marca} ${vehicle.modello}"
               class="gallery-main__img"
               onerror="this.src='${PLACEHOLDER}'"
               onclick="VehicleDetailPage.openLightbox()"/>
          <button class="gallery-nav gallery-nav--prev" onclick="VehicleDetailPage.prevImage()" aria-label="Foto precedente">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <button class="gallery-nav gallery-nav--next" onclick="VehicleDetailPage.nextImage()" aria-label="Foto successiva">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
          <span class="gallery-counter" id="gallery-counter">
            1 / ${galleryState.images.length}
          </span>
          <button class="gallery-fullscreen-btn" onclick="VehicleDetailPage.openLightbox()" aria-label="Schermo intero">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"/>
            </svg>
          </button>
        </div>
        <div class="gallery-thumbs">${thumbsHTML}</div>
      </div>

      <!-- Lightbox -->
      <div class="gallery-lightbox" id="gallery-lightbox" onclick="VehicleDetailPage.closeLightbox()">
        <img id="lightbox-img" class="gallery-lightbox__img" src="${galleryState.images[0]}" alt=""/>
        <button class="gallery-lightbox__close" onclick="VehicleDetailPage.closeLightbox()">✕</button>
      </div>
    `;
  }

  // ============================================================
  // RENDU PANNEAU LATÉRAL
  // ============================================================
  function renderAside(vehicle) {
    const monthly = computeMonthly(vehicle.prezzo);
    const discount = vehicle.prezzoOld
      ? Math.round((1 - vehicle.prezzo / vehicle.prezzoOld) * 100)
      : null;

    return `
      <div class="vehicle-aside">

        <!-- Header -->
        <div class="vehicle-header">
          <div class="vehicle-header__brand">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>
            ${vehicle.marca} — ${Helpers.capitalize(vehicle.categoria)}
          </div>
          <h1 class="vehicle-header__name">${vehicle.modello}</h1>
          <div class="vehicle-header__badges">
            <span class="badge badge--${vehicle.tipo === 'nuovo' ? 'nuovo' : 'usato'}">
              ${vehicle.tipo === 'nuovo' ? '✨ Nuovo' : '🔍 Usato Verificato'}
            </span>
            <span class="badge badge--dark">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
              </svg>
              ${vehicle.anno}
            </span>
            ${vehicle.chilometri > 0
              ? `<span class="badge badge--info">${Helpers.formatKm(vehicle.chilometri)}</span>`
              : '<span class="badge badge--success">0 km</span>'}
            ${discount ? `<span class="badge badge--danger">-${discount}%</span>` : ''}
          </div>
        </div>

        <!-- Prezzo -->
        <div class="vehicle-price-card">
          <p class="vehicle-price-card__label">Prezzo di Vendita</p>
          <div class="vehicle-price-card__price-row">
            <span class="vehicle-price-card__price">${Helpers.formatPrice(vehicle.prezzo)}</span>
            ${vehicle.prezzoOld ? `<span class="vehicle-price-card__old">${Helpers.formatPrice(vehicle.prezzoOld)}</span>` : ''}
            ${discount ? `<span class="vehicle-price-card__discount">Risparmi ${Helpers.formatPrice(vehicle.prezzoOld - vehicle.prezzo)}</span>` : ''}
          </div>
          <p class="vehicle-price-card__monthly">
            Oppure da <strong>${Helpers.formatPrice(monthly)}/mese</strong>
            con 36 rate — tasso ${HAX_CONFIG.credit.defaultRate}%
          </p>
        </div>

        <!-- CTA -->
        <div class="vehicle-cta-group">
          <a href="checkout.html?id=${vehicle._id}&mode=cash" class="btn btn--primary btn--lg">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            Acquista in Contanti
          </a>
          <a href="checkout.html?id=${vehicle._id}&mode=credit" class="btn btn--secondary btn--lg">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
              <line x1="1" y1="10" x2="23" y2="10"/>
            </svg>
            Acquista a Credito
          </a>
          <button class="btn btn--ghost" onclick="VehicleDetailPage.requestInfo('${vehicle._id}')">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
            </svg>
            Richiedi Informazioni
          </button>
        </div>

        <!-- Specifiche rapide -->
        <div class="vehicle-quick-specs">
          ${[
            { icon:'⛽', label:'Carburante',    value: vehicle.carburante },
            { icon:'⚙️', label:'Cambio',        value: vehicle.cambio },
            { icon:'⚡', label:'Potenza',       value: vehicle.potenza },
            { icon:'🔧', label:'Cilindrata',    value: vehicle.cilindrata || '—' },
            { icon:'🎨', label:'Colore',        value: vehicle.colore },
            { icon:'👥', label:'Posti / Porte', value: `${vehicle.posti}p / ${vehicle.porte}p` },
            { icon:'🏎️', label:'Trazione',      value: vehicle.trazione || '—' },
            { icon:'📊', label:'Consumo',       value: vehicle.consumo || '—' },
          ].map(s => `
            <div class="vehicle-quick-spec">
              <span class="vehicle-quick-spec__icon-label">
                <span>${s.icon}</span>${s.label}
              </span>
              <span class="vehicle-quick-spec__value">${s.value}</span>
            </div>
          `).join('')}
        </div>

        <!-- Garanzie -->
        <div class="vehicle-guarantees">
          ${[
            'Garanzia soddisfatti o rimborsati 7 giorni',
            'Veicolo controllato a 100 punti',
            'Storico completo e chilometraggio certificato',
            'Consegna a domicilio in tutta Europa',
            'Assistenza post-vendita dedicata',
          ].map(g => `
            <div class="vehicle-guarantee">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              ${g}
            </div>
          `).join('')}
        </div>

      </div>
    `;
  }

  // ============================================================
  // RENDU TABS DETTAGLIO
  // ============================================================
  function renderTabs(vehicle) {
    const specsHTML = [
      { icon:'⚡', label:'Potenza massima',    value: vehicle.potenza },
      { icon:'🔧', label:'Cilindrata',         value: vehicle.cilindrata || '—' },
      { icon:'⛽', label:'Alimentazione',      value: vehicle.carburante },
      { icon:'⚙️', label:'Cambio',             value: vehicle.cambio },
      { icon:'🏎️', label:'Trazione',           value: vehicle.trazione || '—' },
      { icon:'💨', label:'Emissioni CO₂',      value: vehicle.emissioni || '—' },
      { icon:'📊', label:'Consumo medio',      value: vehicle.consumo || '—' },
      { icon:'⚖️', label:'Peso a vuoto',       value: vehicle.peso || '—' },
      { icon:'📏', label:'Lunghezza',          value: vehicle.lunghezza || '—' },
      { icon:'↔️', label:'Larghezza',          value: vehicle.larghezza || '—' },
      { icon:'🚀', label:'Velocità massima',   value: vehicle.velocita || '—' },
      { icon:'⏱️', label:'0–100 km/h',         value: vehicle.accelerazione || '—' },
    ].map(s => `
      <div class="spec-item" data-animate="fade-up">
        <div class="spec-item__icon">${s.icon}</div>
        <div>
          <p class="spec-item__label">${s.label}</p>
          <p class="spec-item__value">${s.value}</p>
        </div>
      </div>
    `).join('');

    const equipHTML = Object.entries(vehicle.equipaggiamento || {}).map(([cat, items]) => `
      <div class="equipment-category">
        <h4 class="equipment-category__title">
          ${cat === 'Sicurezza' ? '🛡️' : cat === 'Comfort' ? '🛋️' : cat === 'Connettività' ? '📡' : '🎨'}
          ${cat}
        </h4>
        <div class="equipment-list">
          ${items.map(item => `<div class="equipment-item">${item}</div>`).join('')}
        </div>
      </div>
    `).join('');

    const storiaHTML = (vehicle.storia || []).map(h => `
      <div class="history-item">
        <div class="history-item__dot"></div>
        <span class="history-item__date">${h.data}</span>
        <div class="history-item__content">
          <p class="history-item__title">${h.titolo}</p>
          <p class="history-item__desc">${h.desc}</p>
        </div>
      </div>
    `).join('');

    return `
      <div class="vehicle-tabs-section">
        <div class="vehicle-tabs" role="tablist">
          <button class="vehicle-tab-btn active" role="tab" onclick="VehicleDetailPage.switchTab('specs', this)">
            📋 Scheda Tecnica
          </button>
          <button class="vehicle-tab-btn" role="tab" onclick="VehicleDetailPage.switchTab('equipment', this)">
            🛠️ Equipaggiamento
          </button>
          <button class="vehicle-tab-btn" role="tab" onclick="VehicleDetailPage.switchTab('history', this)">
            📄 Storia del Veicolo
          </button>
          <button class="vehicle-tab-btn" role="tab" onclick="VehicleDetailPage.switchTab('description', this)">
            ℹ️ Descrizione
          </button>
        </div>

        <div id="tab-specs" class="vehicle-tab-panel active" role="tabpanel">
          <div class="specs-grid">${specsHTML}</div>
        </div>

        <div id="tab-equipment" class="vehicle-tab-panel" role="tabpanel">
          <div class="equipment-grid">${equipHTML}</div>
        </div>

        <div id="tab-history" class="vehicle-tab-panel" role="tabpanel">
          <div class="vehicle-history">${storiaHTML}</div>
        </div>

        <div id="tab-description" class="vehicle-tab-panel" role="tabpanel">
          <div style="max-width:72ch">
            <p style="font-size:var(--text-md);line-height:var(--leading-relaxed);color:var(--color-text-secondary)">
              ${vehicle.descrizione || ''}
            </p>
          </div>
        </div>
      </div>
    `;
  }

  // ============================================================
  // RENDU VÉHICULES SIMILAIRES
  // ============================================================
  function renderSimilar(vehicles) {
    const grid = document.getElementById('similar-vehicles-grid');
    if (!grid) return;
    grid.innerHTML = vehicles.map(v => {
      const monthly = computeMonthly(v.prezzo);
      return `
        <div class="vehicle-card" onclick="location.href='vehicle-detail.html?id=${v._id}'" style="cursor:pointer">
          <div class="vehicle-card__img-wrapper">
            <img src="${PLACEHOLDER}" alt="${v.marca} ${v.modello}" class="vehicle-card__img" loading="lazy"/>
            <div class="vehicle-card__badges">
              <span class="badge badge--${v.tipo === 'nuovo' ? 'nuovo' : 'usato'}">${v.tipo === 'nuovo' ? '✨ Nuovo' : '🔍 Usato'}</span>
            </div>
          </div>
          <div class="vehicle-card__body">
            <p class="vehicle-card__brand">${v.marca}</p>
            <h3 class="vehicle-card__name">${v.modello}</h3>
            <div class="vehicle-card__footer">
              <div class="vehicle-card__price-wrap">
                <span class="vehicle-card__price">${Helpers.formatPrice(v.prezzo)}</span>
                <div class="vehicle-card__monthly">da ${Helpers.formatPrice(monthly, 0)}/mese</div>
              </div>
              <span class="vehicle-card__cta">Scopri →</span>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // ============================================================
  // GALERIE ACTIONS
  // ============================================================
  function goToImage(idx) {
    const imgs   = galleryState.images;
    if (idx < 0 || idx >= imgs.length) return;
    galleryState.current = idx;

    const mainImg = document.getElementById('gallery-main-img');
    const counter = document.getElementById('gallery-counter');
    const thumbs  = document.querySelectorAll('.gallery-thumb');
    const lbImg   = document.getElementById('lightbox-img');

    if (mainImg) {
      mainImg.classList.add('transitioning');
      setTimeout(() => {
        mainImg.src = imgs[idx];
        mainImg.classList.remove('transitioning');
      }, 200);
    }
    if (counter) counter.textContent = `${idx + 1} / ${imgs.length}`;
    if (lbImg)   lbImg.src = imgs[idx];
    thumbs.forEach((t, i) => t.classList.toggle('active', i === idx));
  }

  function nextImage() { goToImage((galleryState.current + 1) % galleryState.images.length); }
  function prevImage() { goToImage((galleryState.current - 1 + galleryState.images.length) % galleryState.images.length); }

  function openLightbox() {
    const lb = document.getElementById('gallery-lightbox');
    if (lb) lb.classList.add('open');
  }
  function closeLightbox() {
    const lb = document.getElementById('gallery-lightbox');
    if (lb) lb.classList.remove('open');
  }

  // ============================================================
  // SWITCH TABS
  // ============================================================
  function switchTab(tabId, btn) {
    document.querySelectorAll('.vehicle-tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.vehicle-tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(`tab-${tabId}`)?.classList.add('active');
  }

  // ============================================================
  // MODAL RICHIESTA INFO
  // ============================================================
  function requestInfo(vehicleId) {
    ModalComponent.open({
      title: 'Richiedi Informazioni',
      content: `
        <p style="color:var(--color-text-muted);margin-bottom:var(--space-5)">
          Lascia i tuoi dati e ti risponderemo entro 2 ore lavorative.
        </p>
        <div class="form-group">
          <label class="form-label form-label--required">Nome e Cognome</label>
          <input type="text" class="form-control" id="info-name" placeholder="Mario Rossi"/>
        </div>
        <div class="form-group">
          <label class="form-label form-label--required">Telefono</label>
          <input type="tel" class="form-control" id="info-phone" placeholder="+39 333 123 4567"/>
        </div>
        <div class="form-group">
          <label class="form-label">Messaggio</label>
          <textarea class="form-control" id="info-msg" rows="3" placeholder="Ho visto questo veicolo sul vostro sito e vorrei..."></textarea>
        </div>
      `,
      footer: `
        <button class="btn btn--ghost" onclick="ModalComponent.close()">Annulla</button>
        <button class="btn btn--primary" onclick="VehicleDetailPage.submitInfoRequest()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
          Invia Richiesta
        </button>
      `,
    });
  }

  function submitInfoRequest() {
    const name  = document.getElementById('info-name')?.value.trim();
    const phone = document.getElementById('info-phone')?.value.trim();
    if (!name || !phone) {
      ToastComponent.show('Compila i campi obbligatori.', 'warning');
      return;
    }
    ModalComponent.close();
    ToastComponent.show('Richiesta inviata! Ti contatteremo al più presto.', 'success');
  }

  // ============================================================
  // CALCUL MENSUALITÉ
  // ============================================================
  function computeMonthly(price, months = 36) {
    const deposit = price * 0.20;
    const financed = price - deposit;
    const rate = HAX_CONFIG.credit.defaultRate / 100 / 12;
    const factor = Math.pow(1 + rate, months);
    return financed * (rate * factor) / (factor - 1);
  }

  // ============================================================
  // POINT D'ENTRÉE
  // ============================================================
  function init() {
    const params  = Helpers.getUrlParams();
    const id      = params.get('id') || 'v01';
    const vehicle = findVehicle(id);

    // Breadcrumb
    renderBreadcrumb(vehicle);

    // Contenu principal
    const content = document.getElementById('vehicle-detail-content');
    if (content) {
      content.innerHTML = `
        <div class="vehicle-gallery-col">
          ${renderGallery(vehicle)}
        </div>
        ${renderAside(vehicle)}
        ${renderTabs(vehicle)}
      `;
    }

    // Simulateur crédit (widget latéral)
    if (window.CreditSimulator) {
      CreditSimulator.init({
        container: document.getElementById('credit-simulator-widget'),
        vehiclePrice: vehicle.prezzo,
        vehicleId: vehicle._id,
      });
    }

    // Véhicules similaires
    renderSimilar(getSimilar(vehicle));

    // Keyboard navigation lightbox
    document.addEventListener('keydown', (e) => {
      const lb = document.getElementById('gallery-lightbox');
      if (!lb?.classList.contains('open')) return;
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft')  prevImage();
      if (e.key === 'Escape')     closeLightbox();
    });
  }

  return {
    init, goToImage, nextImage, prevImage,
    openLightbox, closeLightbox,
    switchTab, requestInfo, submitInfoRequest,
  };

})();

window.VehicleDetailPage = VehicleDetailPage;
