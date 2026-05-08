/**
 * pages/home.js
 * Module complet de la page d'accueil Hax-ISA
 * Gère : Hero, Services, Véhicules en vedette, Simulateur teaser, À propos, Témoignages
 */

'use strict';

const HomePage = (() => {

  // ============================================================
  // DONNÉES STATIQUES DE DÉMO
  // (remplacées par appels API une fois le backend actif)
  // ============================================================

  const FEATURED_VEHICLES = [
    {
      _id: 'demo1',
      marca: 'BMW', modello: 'Serie 5 520d',
      tipo: 'nuovo', anno: 2024, chilometri: 0,
      prezzo: 58900, prezzoOld: null,
      carburante: 'Diesel', cambio: 'Automatico', potenza: '190 CV',
      colore: 'Grigio Sophistograu', posti: 5,
      immagini: [],
      mensile: 489,
    },
    {
      _id: 'demo2',
      marca: 'Mercedes-Benz', modello: 'GLC 300 4MATIC',
      tipo: 'nuovo', anno: 2024, chilometri: 0,
      prezzo: 72400, prezzoOld: null,
      carburante: 'Benzina', cambio: 'Automatico', potenza: '258 CV',
      colore: 'Bianco Polare', posti: 5,
      immagini: [],
      mensile: 602,
    },
    {
      _id: 'demo3',
      marca: 'Audi', modello: 'A4 35 TDI S line',
      tipo: 'usato', anno: 2022, chilometri: 38000,
      prezzo: 34500, prezzoOld: 38900,
      carburante: 'Diesel', cambio: 'Automatico', potenza: '163 CV',
      colore: 'Nero Mythos', posti: 5,
      immagini: [],
      mensile: 287,
    },
    {
      _id: 'demo4',
      marca: 'Volkswagen', modello: 'Golf 8 GTI',
      tipo: 'usato', anno: 2023, chilometri: 12500,
      prezzo: 39900, prezzoOld: 43500,
      carburante: 'Benzina', cambio: 'DSG', potenza: '245 CV',
      colore: 'Rosso Kings Red', posti: 5,
      immagini: [],
      mensile: 332,
    },
    {
      _id: 'demo5',
      marca: 'Toyota', modello: 'RAV4 Hybrid GR Sport',
      tipo: 'nuovo', anno: 2024, chilometri: 0,
      prezzo: 47500, prezzoOld: null,
      carburante: 'Ibrido', cambio: 'CVT', potenza: '222 CV',
      colore: 'Blu Celestite', posti: 5,
      immagini: [],
      mensile: 395,
    },
    {
      _id: 'demo6',
      marca: 'Porsche', modello: 'Cayenne 3.0 V6',
      tipo: 'usato', anno: 2021, chilometri: 54000,
      prezzo: 69800, prezzoOld: 78000,
      carburante: 'Benzina', cambio: 'Automatico', potenza: '340 CV',
      colore: 'Bianco Carrara', posti: 5,
      immagini: [],
      mensile: 581,
    },
  ];

  const TESTIMONIALS = [
    {
      name: 'Marco Bianchi', location: 'Milano, IT', vehicle: 'BMW Serie 5',
      rating: 5, text: 'Esperienza eccezionale! Ho acquistato la mia BMW tramite Hax-ISA e il processo è stato impeccabile. Dal primo contatto alla consegna a domicilio, tutto perfetto. Il team è estremamente professionale.',
      initials: 'MB',
    },
    {
      name: 'Sofia Ricci', location: 'Roma, IT', vehicle: 'Audi Q5',
      rating: 5, text: 'Finalmente un concessionario che rispetta i tempi! Ho simulato il finanziamento online in pochi minuti e il consulente mi ha guidato passo passo. La mia Audi era esattamente come descritta.',
      initials: 'SR',
    },
    {
      name: 'Luca Ferrari', location: 'Torino, IT', vehicle: 'Volkswagen Tiguan',
      rating: 5, text: 'Il simulatore di credito è fantastico: trasparente, preciso, senza sorprese. Ho ottenuto un tasso di interesse ottimo e la consegna è avvenuta puntualissima. Consigliatissimo!',
      initials: 'LF',
    },
    {
      name: 'Giulia Esposito', location: 'Napoli, IT', vehicle: 'Toyota RAV4',
      rating: 5, text: 'Hax-ISA ha reso l\'acquisto di un\'auto usata finalmente sicuro. Garanzia completa, documentazione chiara, veicolo in perfette condizioni. Non acquisterò mai più da un privato!',
      initials: 'GE',
    },
    {
      name: 'Alessandro Costa', location: 'Firenze, IT', vehicle: 'Mercedes-Benz GLA',
      rating: 5, text: 'Il servizio di consegna a domicilio è una comodità incredibile. In meno di 10 giorni avevo la mia Mercedes parcheggiata sotto casa. Il processo online è intuitivo e ben fatto.',
      initials: 'AC',
    },
  ];

  const SERVICES = [
    {
      icon: '🏎️', title: 'Auto Nuove',
      desc: 'Gamma completa di vetture nuove delle migliori marche europee. Consegna rapida con garanzia ufficiale.',
    },
    {
      icon: '🔍', title: 'Auto Usate Verificate',
      desc: 'Ogni veicolo usato è sottoposto a controllo tecnico a 100 punti. Storico completo e chilometraggio certificato.',
    },
    {
      icon: '💳', title: 'Finanziamento Personalizzato',
      desc: 'Tassi a partire dal 2%. Simula la tua rata in tempo reale. Risposta in 24 ore senza busta paga.',
    },
    {
      icon: '🚚', title: 'Consegna a Domicilio',
      desc: 'Riceviamo il tuo veicolo direttamente a casa tua in tutta Europa. Nessun viaggio, nessuna attesa.',
    },
  ];

  // ============================================================
  // HERO — Rendering
  // ============================================================
  function renderHero() {
    const heroEl = document.getElementById('hero');
    if (!heroEl) return;

    // Générer les particules
    const particles = Array.from({ length: 12 }, (_, i) => {
      const size = Math.random() * 80 + 20;
      const left = Math.random() * 100;
      const delay = Math.random() * 15;
      const duration = Math.random() * 15 + 15;
      return `<div class="hero__particle" style="
        width:${size}px;height:${size}px;
        left:${left}%;
        animation-duration:${duration}s;
        animation-delay:${delay}s;
      "></div>`;
    }).join('');

    // Voiture mise en avant (première de la liste)
    const featuredCar = FEATURED_VEHICLES[0];
    const carImg = Helpers.getVehicleImageUrl(featuredCar.immagini[0]);
    const carDots = FEATURED_VEHICLES.slice(0, 4).map((_, i) =>
      `<button class="hero__car-dot ${i === 0 ? 'active' : ''}" data-idx="${i}" aria-label="Veicolo ${i+1}"></button>`
    ).join('');

    heroEl.innerHTML = `
      <!-- Fond -->
      <div class="hero__bg">
        <div class="hero__bg-image" style="background:linear-gradient(135deg,#1a252f 0%,#2c3e50 50%,#922b21 100%);width:100%;height:100%;"></div>
        <div class="hero__overlay"></div>
      </div>
      <div class="hero__particles">${particles}</div>

      <!-- Contenu principal -->
      <div class="hero__content">

        <!-- Colonne texte -->
        <div class="hero__text">
          <div class="hero__eyebrow">
            <span class="hero__eyebrow-dot"></span>
            International Sale of Automobiles
          </div>

          <h1 class="hero__title">
            Il Tuo Prossimo
            <span class="hero__title-accent">Sogno su Ruote</span>
            Ti Aspetta
          </h1>

          <p class="hero__subtitle">
            Scopri centinaia di veicoli nuovi e usati selezionati per te.
            Acquista online, finanzia in pochi minuti e
            ricevi la tua auto <strong style="color:rgba(255,255,255,0.9)">direttamente a domicilio</strong>.
          </p>

          <div class="hero__ctas">
            <a href="pages/catalogue.html" class="hero__cta-primary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              Sfoglia il Catalogo
            </a>
            <a href="#credit-teaser" class="hero__cta-secondary" onclick="Helpers.scrollTo('#credit-teaser');return false;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                <line x1="1" y1="10" x2="23" y2="10"/>
              </svg>
              Simula il Finanziamento
            </a>
          </div>

          <div class="hero__stats">
            <div class="hero__stat">
              <span class="hero__stat-number" id="stat-vehicles">1.200+</span>
              <span class="hero__stat-label">Veicoli Disponibili</span>
            </div>
            <div class="hero__stat-sep"></div>
            <div class="hero__stat">
              <span class="hero__stat-number" id="stat-clients">8.400+</span>
              <span class="hero__stat-label">Clienti Soddisfatti</span>
            </div>
            <div class="hero__stat-sep"></div>
            <div class="hero__stat">
              <span class="hero__stat-number" id="stat-brands">35+</span>
              <span class="hero__stat-label">Marchi Europei</span>
            </div>
          </div>
        </div>

        <!-- Colonne visuel / carte voiture -->
        <div class="hero__visual">
          <div class="hero__car-card" id="hero-car-card">
            <div class="hero__car-img-wrapper">
              <img src="${carImg}" alt="${featuredCar.marca} ${featuredCar.modello}"
                   class="hero__car-img" onerror="this.src='assets/images/placeholder-car.svg'" />
              <span class="hero__car-badge">${featuredCar.tipo === 'nuovo' ? '✨ Nuovo' : '🔍 Usato Verificato'}</span>
            </div>
            <div class="hero__car-info">
              <p class="hero__car-name">${featuredCar.marca} ${featuredCar.modello}</p>
              <div class="hero__car-specs">
                <span class="hero__car-spec"><span class="hero__car-spec-dot"></span>${featuredCar.anno}</span>
                <span class="hero__car-spec"><span class="hero__car-spec-dot"></span>${featuredCar.carburante}</span>
                <span class="hero__car-spec"><span class="hero__car-spec-dot"></span>${featuredCar.potenza}</span>
                ${featuredCar.chilometri > 0 ? `<span class="hero__car-spec"><span class="hero__car-spec-dot"></span>${Helpers.formatKm(featuredCar.chilometri)}</span>` : ''}
              </div>
              <div class="hero__car-footer">
                <div>
                  <span class="hero__car-price-label">Prezzo</span>
                  <span class="hero__car-price">${Helpers.formatPrice(featuredCar.prezzo)}</span>
                </div>
                <a href="pages/vehicle-detail.html?id=${featuredCar._id}" class="hero__car-btn">
                  Scopri
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                  </svg>
                </a>
              </div>
            </div>
            <div class="hero__car-dots">${carDots}</div>
          </div>
        </div>

      </div><!-- /hero__content -->

      <!-- Scroll indicator -->
      <div class="hero__scroll" onclick="Helpers.scrollTo('#services')">
        <span class="hero__scroll-text">Scorri</span>
        <div class="hero__scroll-mouse">
          <span class="hero__scroll-wheel"></span>
        </div>
      </div>
    `;

    // Init carousel hero
    initHeroCarousel();
  }

  // Carousel des voitures dans le hero
  function initHeroCarousel() {
    const dots = document.querySelectorAll('.hero__car-dot');
    let current = 0;

    function showCar(idx) {
      const car = FEATURED_VEHICLES[idx];
      if (!car) return;
      current = idx;

      // Mise à jour de la carte
      const img = document.querySelector('.hero__car-img');
      const name = document.querySelector('.hero__car-name');
      const badge = document.querySelector('.hero__car-badge');
      const price = document.querySelector('.hero__car-price');
      const link = document.querySelector('.hero__car-btn');
      const specs = document.querySelector('.hero__car-specs');

      if (img) { img.style.opacity = 0; setTimeout(() => { img.src = Helpers.getVehicleImageUrl(car.immagini[0]); img.style.opacity = 1; }, 200); }
      if (name) name.textContent = `${car.marca} ${car.modello}`;
      if (badge) badge.textContent = car.tipo === 'nuovo' ? '✨ Nuovo' : '🔍 Usato Verificato';
      if (price) price.textContent = Helpers.formatPrice(car.prezzo);
      if (link) link.href = `pages/vehicle-detail.html?id=${car._id}`;
      if (specs) specs.innerHTML = `
        <span class="hero__car-spec"><span class="hero__car-spec-dot"></span>${car.anno}</span>
        <span class="hero__car-spec"><span class="hero__car-spec-dot"></span>${car.carburante}</span>
        <span class="hero__car-spec"><span class="hero__car-spec-dot"></span>${car.potenza}</span>
      `;

      dots.forEach((d, i) => d.classList.toggle('active', i === idx));
    }

    dots.forEach((dot, i) => dot.addEventListener('click', () => showCar(i)));

    // Auto-play toutes les 5s
    setInterval(() => showCar((current + 1) % Math.min(dots.length, FEATURED_VEHICLES.length)), 5000);
  }

  // ============================================================
  // SERVICES
  // ============================================================
  function renderServices() {
    const section = document.getElementById('services');
    if (!section) return;

    const cardsHTML = SERVICES.map((s, i) => `
      <div class="service-card" data-animate="fade-up" data-animate-delay="${i * 100}">
        <div class="service-card__icon">${s.icon}</div>
        <h3 class="service-card__title">${s.title}</h3>
        <p class="service-card__desc">${s.desc}</p>
      </div>
    `).join('');

    section.innerHTML = `
      <div class="container">
        <div class="section-header">
          <h2 class="section-title section-title--center" data-animate="fade-up">
            Perché Scegliere Hax-ISA
          </h2>
          <p class="section-subtitle" style="margin:var(--space-4) auto 0;text-align:center" data-animate="fade-up" data-animate-delay="100">
            Un'esperienza d'acquisto completa, trasparente e senza stress
          </p>
        </div>
        <div class="services-grid">
          ${cardsHTML}
        </div>
      </div>
    `;
  }

  // ============================================================
  // VÉHICULES EN VEDETTE
  // ============================================================
  function renderFeaturedVehicles() {
    const section = document.getElementById('featured-vehicles');
    if (!section) return;

    let activeTab = 'all';

    function buildVehicleCard(v) {
      const img = Helpers.getVehicleImageUrl(v.immagini[0]);
      const isUsed = v.tipo === 'usato';
      return `
        <div class="vehicle-card" onclick="location.href='pages/vehicle-detail.html?id=${v._id}'" data-animate="fade-up">
          <div class="vehicle-card__img-wrapper">
            <img src="${img}" alt="${v.marca} ${v.modello}" class="vehicle-card__img"
                 onerror="this.src='assets/images/placeholder-car.svg'" loading="lazy"/>
            <div class="vehicle-card__badges">
              <span class="badge badge--${v.tipo === 'nuovo' ? 'nuovo' : 'usato'}">
                ${v.tipo === 'nuovo' ? '✨ Nuovo' : '🔍 Usato'}
              </span>
              ${v.prezzoOld ? '<span class="badge badge--danger">Offerta</span>' : ''}
            </div>
            <button class="vehicle-card__wishlist" onclick="event.stopPropagation();this.classList.toggle('active');this.textContent=this.classList.contains('active')?'❤️':'🤍'" aria-label="Aggiungi ai preferiti">🤍</button>
          </div>
          <div class="vehicle-card__body">
            <p class="vehicle-card__brand">${v.marca}</p>
            <h3 class="vehicle-card__name">${v.modello}</h3>
            <div class="vehicle-card__specs">
              <span class="vehicle-card__spec">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                </svg>
                ${v.anno}
              </span>
              <span class="vehicle-card__spec">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <ellipse cx="12" cy="12" rx="10" ry="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                ${v.carburante}
              </span>
              ${isUsed ? `<span class="vehicle-card__spec">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 12h18M3 6h18M3 18h18"/>
                </svg>
                ${Helpers.formatKm(v.chilometri)}
              </span>` : ''}
              <span class="vehicle-card__spec">⚡ ${v.potenza}</span>
            </div>
            <div class="vehicle-card__footer">
              <div class="vehicle-card__price-wrap">
                <span class="vehicle-card__price-label">Prezzo</span>
                ${v.prezzoOld ? `<span class="vehicle-card__price--old">${Helpers.formatPrice(v.prezzoOld)}</span>` : ''}
                <span class="vehicle-card__price">${Helpers.formatPrice(v.prezzo)}</span>
                <div class="vehicle-card__monthly">da ${Helpers.formatPrice(v.mensile, 0)}/mese</div>
              </div>
              <span class="vehicle-card__cta">
                Scopri
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </span>
            </div>
          </div>
        </div>
      `;
    }

    function getFilteredVehicles() {
      if (activeTab === 'all') return FEATURED_VEHICLES;
      return FEATURED_VEHICLES.filter(v => v.tipo === activeTab);
    }

    function render() {
      const grid = document.getElementById('featured-vehicles-grid');
      if (!grid) return;
      const vehicles = getFilteredVehicles();
      grid.innerHTML = vehicles.length
        ? vehicles.map(buildVehicleCard).join('')
        : `<div style="grid-column:1/-1;text-align:center;padding:var(--space-12);color:var(--color-text-muted)">Nessun veicolo trovato</div>`;

      // Réactiver les animations
      if (window.initScrollAnimations) window.initScrollAnimations();
    }

    section.innerHTML = `
      <div class="container">
        <div class="section-header">
          <h2 class="section-title section-title--center" data-animate="fade-up">Veicoli in Evidenza</h2>
          <p class="section-subtitle" style="margin:var(--space-4) auto 0;text-align:center" data-animate="fade-up" data-animate-delay="100">
            Selezionati per qualità, prezzo e disponibilità immediata
          </p>
        </div>
        <div class="featured-tabs" data-animate="fade-up" data-animate-delay="200">
          <button class="featured-tab active" data-tab="all">Tutti</button>
          <button class="featured-tab" data-tab="nuovo">🏎️ Nuovi</button>
          <button class="featured-tab" data-tab="usato">🔍 Usati</button>
        </div>
        <div id="featured-vehicles-grid" class="vehicles-grid"></div>
        <div class="featured-cta" data-animate="fade-up">
          <a href="pages/catalogue.html" class="btn btn--primary btn--lg">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            Vedi Tutto il Catalogo
          </a>
        </div>
      </div>
    `;

    render();

    // Tabs
    section.querySelectorAll('.featured-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        section.querySelectorAll('.featured-tab').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeTab = btn.dataset.tab;
        render();
      });
    });
  }

  // ============================================================
  // SIMULATEUR CRÉDIT TEASER
  // ============================================================
  function renderCreditTeaser() {
    const section = document.getElementById('credit-teaser');
    if (!section) return;

    section.innerHTML = `
      <div class="container">
        <div class="credit-teaser-layout">
          <div class="credit-teaser__text">
            <h2 class="section-title" data-animate="fade-up">
              Finanzia la Tua Auto<br/>
              <span style="color:var(--color-secondary-light)">in Pochi Minuti</span>
            </h2>
            <p class="credit-teaser__desc" data-animate="fade-up" data-animate-delay="100">
              Il nostro simulatore ti mostra immediatamente quanto pagheresti ogni mese.
              Tassi competitivi, totale trasparenza, nessuna sorpresa.
            </p>
            <div class="credit-teaser__features" data-animate="fade-up" data-animate-delay="200">
              <div class="credit-feature">
                <div class="credit-feature__icon">💰</div>
                <div>
                  <p class="credit-feature__title">Tassi dal 2% al 3,5%</p>
                  <p class="credit-feature__desc">Tra i tassi più competitivi sul mercato europeo</p>
                </div>
              </div>
              <div class="credit-feature">
                <div class="credit-feature__icon">📅</div>
                <div>
                  <p class="credit-feature__title">Da 12 a 84 mesi</p>
                  <p class="credit-feature__desc">Scegli la durata che si adatta al tuo budget</p>
                </div>
              </div>
              <div class="credit-feature">
                <div class="credit-feature__icon">✅</div>
                <div>
                  <p class="credit-feature__title">Risposta in 24 ore</p>
                  <p class="credit-feature__desc">Approvazione rapida con documentazione semplice</p>
                </div>
              </div>
            </div>
            <a href="pages/catalogue.html" class="btn btn--gold btn--lg" data-animate="fade-up" data-animate-delay="300">
              Inizia la Simulazione
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </a>
          </div>

          <!-- Widget simulateur rapide -->
          <div class="credit-teaser__widget" data-animate="fade-left" data-animate-delay="200">
            <h3 class="credit-widget__title">⚡ Simulatore Rapido</h3>
            <div class="credit-widget__row">
              <label class="credit-widget__label">Prezzo Veicolo (€)</label>
              <input type="number" class="credit-widget__input" id="teaser-price" placeholder="es. 25.000" min="5000" max="500000" value="25000"/>
            </div>
            <div class="credit-widget__row">
              <label class="credit-widget__label">Acconto (€) <span style="color:var(--color-danger);font-size:0.8em">*Obbligatorio</span></label>
              <input type="number" class="credit-widget__input" id="teaser-deposit" placeholder="Min. 10% del prezzo" min="0" value="5000"/>
            </div>
            <div class="credit-widget__row">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-2)">
                <label class="credit-widget__label">Durata</label>
                <span style="color:var(--color-secondary-light);font-weight:700;font-size:var(--text-md)" id="teaser-duration-display">36 mesi</span>
              </div>
              <div class="credit-widget__slider-wrap">
                <input type="range" class="credit-widget__slider" id="teaser-duration"
                       min="12" max="84" step="12" value="36"/>
                <div class="credit-widget__slider-labels">
                  <span>12 mesi</span><span>84 mesi</span>
                </div>
              </div>
            </div>
            <div class="credit-widget__result" id="teaser-result">
              <div class="credit-result-item">
                <p class="credit-result-item__label">Importo Finanziato</p>
                <p class="credit-result-item__value" id="teaser-financed">—</p>
              </div>
              <div class="credit-result-item">
                <p class="credit-result-item__label">Rata Mensile</p>
                <p class="credit-result-item__value credit-result-item__value--highlight" id="teaser-monthly">—</p>
              </div>
              <div class="credit-result-item">
                <p class="credit-result-item__label">Tasso Annuo</p>
                <p class="credit-result-item__value" id="teaser-rate">2,50%</p>
              </div>
              <div class="credit-result-item">
                <p class="credit-result-item__label">Costo Totale</p>
                <p class="credit-result-item__value" id="teaser-total">—</p>
              </div>
            </div>
            <p style="font-size:var(--text-xs);color:rgba(255,255,255,0.3);text-align:center;margin-top:var(--space-3)">
              * Simulazione indicativa. Tasso effettivo definito in fase di approvazione.
            </p>
          </div>
        </div>
      </div>
    `;

    initCreditTeaserCalculator();
  }

  // Calcul simplifié du simulateur teaser
  function initCreditTeaserCalculator() {
    const priceInput   = document.getElementById('teaser-price');
    const depositInput = document.getElementById('teaser-deposit');
    const durationSlider = document.getElementById('teaser-duration');
    const durationDisplay = document.getElementById('teaser-duration-display');

    function calculate() {
      const price    = parseFloat(priceInput?.value)   || 0;
      const deposit  = parseFloat(depositInput?.value) || 0;
      const duration = parseInt(durationSlider?.value) || 36;
      const rate     = HAX_CONFIG.credit.defaultRate / 100 / 12; // taux mensuel

      if (durationDisplay) durationDisplay.textContent = `${duration} mesi`;

      const minDeposit = price * (HAX_CONFIG.credit.minDepositPercent / 100);
      const financed   = Math.max(0, price - deposit);
      const validDeposit = deposit >= minDeposit;

      // Formule de mensualité : M = P * [r(1+r)^n] / [(1+r)^n - 1]
      let monthly = 0;
      let total   = 0;
      if (financed > 0 && rate > 0 && validDeposit) {
        const factor = Math.pow(1 + rate, duration);
        monthly = financed * (rate * factor) / (factor - 1);
        total   = monthly * duration + deposit;
      }

      // Mettre à jour l'affichage
      const financedEl = document.getElementById('teaser-financed');
      const monthlyEl  = document.getElementById('teaser-monthly');
      const totalEl    = document.getElementById('teaser-total');
      const rateEl     = document.getElementById('teaser-rate');

      if (financedEl) financedEl.textContent = financed > 0 ? Helpers.formatPrice(financed) : '—';
      if (rateEl)     rateEl.textContent = `${HAX_CONFIG.credit.defaultRate.toFixed(2).replace('.',',')}%`;

      if (!validDeposit && deposit > 0 && price > 0) {
        if (monthlyEl) monthlyEl.textContent = '⚠️ Acconto insufficiente';
        if (totalEl)   totalEl.textContent = `Min. ${Helpers.formatPrice(minDeposit)}`;
      } else if (financed > 0 && monthly > 0) {
        if (monthlyEl) monthlyEl.textContent = Helpers.formatPrice(monthly);
        if (totalEl)   totalEl.textContent   = Helpers.formatPrice(total);
      } else {
        if (monthlyEl) monthlyEl.textContent = '—';
        if (totalEl)   totalEl.textContent   = '—';
      }
    }

    priceInput?.addEventListener('input',   Helpers.debounce(calculate, 300));
    depositInput?.addEventListener('input', Helpers.debounce(calculate, 300));
    durationSlider?.addEventListener('input', calculate);
    calculate(); // Appel initial
  }

  // ============================================================
  // SECTION À PROPOS (teaser)
  // ============================================================
  function renderAbout() {
    const section = document.getElementById('about');
    if (!section) return;

    section.innerHTML = `
      <div class="container">
        <div class="about-layout">
          <div class="about-images">
            <div style="width:100%;aspect-ratio:4/3;background:linear-gradient(135deg,#1a252f 0%,#C0392B 100%);border-radius:var(--radius-2xl);display:flex;align-items:center;justify-content:center;">
              <span style="font-size:5rem">🏢</span>
            </div>
          </div>
          <div class="about-text">
            <h2 class="section-title" data-animate="fade-up">La Nostra Storia,<br/>Il Tuo Viaggio</h2>
            <p style="color:var(--color-text-secondary);line-height:var(--leading-relaxed);margin:var(--space-6) 0" data-animate="fade-up" data-animate-delay="100">
              Fondata a Milano nel 2010, <strong>Hax-ISA</strong> è oggi uno dei più importanti dealer automobilistici internazionali d'Europa.
              La nostra missione è semplice: rendere l'acquisto di un'auto un'esperienza piacevole, trasparente e conveniente.
            </p>
            <p style="color:var(--color-text-secondary);line-height:var(--leading-relaxed);margin-bottom:var(--space-8)" data-animate="fade-up" data-animate-delay="150">
              Con una rete di oltre 200 partner in 15 paesi europei, garantiamo selezione, qualità e consegna in tutto il continente.
            </p>
            <div class="about-text__kpis" data-animate="fade-up" data-animate-delay="200">
              <div class="about-kpi">
                <div class="about-kpi__value">14+</div>
                <div class="about-kpi__label">Anni di Esperienza</div>
              </div>
              <div class="about-kpi">
                <div class="about-kpi__value">8.400+</div>
                <div class="about-kpi__label">Clienti Soddisfatti</div>
              </div>
              <div class="about-kpi">
                <div class="about-kpi__value">15</div>
                <div class="about-kpi__label">Paesi Europei</div>
              </div>
            </div>
            <a href="pages/about.html" class="btn btn--secondary btn--lg" data-animate="fade-up" data-animate-delay="250">
              Scopri chi Siamo
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    `;
  }

  // ============================================================
  // TÉMOIGNAGES
  // ============================================================
  function renderTestimonials() {
    const section = document.getElementById('testimonials');
    if (!section) return;

    let currentIdx = 0;
    const visibleCount = window.innerWidth < 768 ? 1 : window.innerWidth < 1200 ? 2 : 3;

    const cardsHTML = TESTIMONIALS.map(t => `
      <div class="testimonial-card">
        <span class="testimonial-card__quote">"</span>
        <div class="testimonial-card__stars">${'★'.repeat(t.rating)}</div>
        <p class="testimonial-card__text">${t.text}</p>
        <div class="testimonial-card__author">
          <div class="testimonial-card__avatar">${t.initials}</div>
          <div>
            <p class="testimonial-card__name">${t.name}</p>
            <p class="testimonial-card__location">📍 ${t.location}</p>
            <p class="testimonial-card__vehicle">🚗 ${t.vehicle}</p>
          </div>
        </div>
      </div>
    `).join('');

    const maxIdx = TESTIMONIALS.length - visibleCount;
    const dotsHTML = Array.from({ length: maxIdx + 1 }, (_, i) =>
      `<button class="testimonials-dot ${i === 0 ? 'active' : ''}" data-idx="${i}" aria-label="Testimonianza ${i+1}"></button>`
    ).join('');

    section.innerHTML = `
      <div class="container">
        <div class="section-header">
          <h2 class="section-title section-title--center" data-animate="fade-up">Cosa Dicono i Nostri Clienti</h2>
          <p class="section-subtitle" style="margin:var(--space-4) auto 0;text-align:center" data-animate="fade-up" data-animate-delay="100">
            Oltre 8.400 clienti ci hanno già scelto in tutta Europa
          </p>
        </div>
        <div class="testimonials-track-wrapper" data-animate="fade-up" data-animate-delay="200">
          <div class="testimonials-track" id="testimonials-track">
            ${cardsHTML}
          </div>
        </div>
        <div class="testimonials-controls">
          <button class="testimonials-btn" id="test-prev" aria-label="Precedente" disabled>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <div class="testimonials-dots" id="test-dots">${dotsHTML}</div>
          <button class="testimonials-btn" id="test-next" aria-label="Successivo">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>
      </div>
    `;

    // Slider logic
    const track  = document.getElementById('testimonials-track');
    const btnPrev = document.getElementById('test-prev');
    const btnNext = document.getElementById('test-next');
    const dots   = section.querySelectorAll('.testimonials-dot');
    const CARD_W = 380 + 24; // card width + gap

    function goTo(idx) {
      currentIdx = Math.max(0, Math.min(idx, maxIdx));
      track.style.transform = `translateX(-${currentIdx * CARD_W}px)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === currentIdx));
      btnPrev.disabled = currentIdx === 0;
      btnNext.disabled = currentIdx >= maxIdx;
    }

    btnPrev?.addEventListener('click', () => goTo(currentIdx - 1));
    btnNext?.addEventListener('click', () => goTo(currentIdx + 1));
    dots.forEach(dot => dot.addEventListener('click', () => goTo(parseInt(dot.dataset.idx))));

    // Auto-play
    setInterval(() => goTo(currentIdx >= maxIdx ? 0 : currentIdx + 1), 6000);
  }

  // ============================================================
  // POINT D'ENTRÉE
  // ============================================================
  function init() {
    renderHero();
    renderServices();
    renderFeaturedVehicles();
    renderCreditTeaser();
    renderAbout();
    renderTestimonials();
  }

  return { init };

})();

window.HomePage = HomePage;
