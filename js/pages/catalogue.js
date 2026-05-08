/**
 * pages/catalogue.js
 * Module catalogue Hax-ISA — filtres, recherche, tri, pagination, vues
 */
'use strict';

const CataloguePage = (() => {

  // ============================================================
  // DONNÉES DE DÉMO
  // ============================================================
  const DEMO_VEHICLES = [
    { _id:'v01', marca:'BMW',        modello:'Serie 5 520d xDrive',    tipo:'nuovo',  anno:2024, chilometri:0,     prezzo:58900,  carburante:'Diesel',  cambio:'Automatico', potenza:'190 CV', colore:'Grigio', posti:5, categoria:'berlina',  immagini:[] },
    { _id:'v02', marca:'Mercedes',   modello:'GLC 300 4MATIC AMG',     tipo:'nuovo',  anno:2024, chilometri:0,     prezzo:72400,  carburante:'Benzina', cambio:'Automatico', potenza:'258 CV', colore:'Bianco', posti:5, categoria:'suv',      immagini:[] },
    { _id:'v03', marca:'Audi',       modello:'A4 35 TDI S line',       tipo:'usato',  anno:2022, chilometri:38000, prezzo:34500,  carburante:'Diesel',  cambio:'Automatico', potenza:'163 CV', colore:'Nero',   posti:5, categoria:'berlina',  immagini:[], prezzoOld:38900 },
    { _id:'v04', marca:'Volkswagen', modello:'Golf 8 GTI',             tipo:'usato',  anno:2023, chilometri:12500, prezzo:39900,  carburante:'Benzina', cambio:'DSG',        potenza:'245 CV', colore:'Rosso',  posti:5, categoria:'berlina',  immagini:[], prezzoOld:43500 },
    { _id:'v05', marca:'Toyota',     modello:'RAV4 Hybrid GR Sport',   tipo:'nuovo',  anno:2024, chilometri:0,     prezzo:47500,  carburante:'Ibrido',  cambio:'CVT',        potenza:'222 CV', colore:'Blu',    posti:5, categoria:'suv',      immagini:[] },
    { _id:'v06', marca:'Porsche',    modello:'Cayenne 3.0 V6',         tipo:'usato',  anno:2021, chilometri:54000, prezzo:69800,  carburante:'Benzina', cambio:'Automatico', potenza:'340 CV', colore:'Bianco', posti:5, categoria:'suv',      immagini:[], prezzoOld:78000 },
    { _id:'v07', marca:'Ford',       modello:'Mustang Mach-E GT',      tipo:'nuovo',  anno:2024, chilometri:0,     prezzo:67900,  carburante:'Elettrico',cambio:'Automatico',potenza:'358 CV', colore:'Grigio', posti:5, categoria:'suv',      immagini:[] },
    { _id:'v08', marca:'BMW',        modello:'X5 xDrive40d M Sport',   tipo:'usato',  anno:2022, chilometri:28000, prezzo:74500,  carburante:'Diesel',  cambio:'Automatico', potenza:'340 CV', colore:'Nero',   posti:7, categoria:'suv',      immagini:[], prezzoOld:82000 },
    { _id:'v09', marca:'Audi',       modello:'Q7 55 TFSI quattro',     tipo:'nuovo',  anno:2024, chilometri:0,     prezzo:91200,  carburante:'Benzina', cambio:'Automatico', potenza:'340 CV', colore:'Bianco', posti:7, categoria:'suv',      immagini:[] },
    { _id:'v10', marca:'Peugeot',    modello:'408 PHEV 225',           tipo:'nuovo',  anno:2024, chilometri:0,     prezzo:42800,  carburante:'Ibrido',  cambio:'Automatico', potenza:'225 CV', colore:'Grigio', posti:5, categoria:'berlina',  immagini:[] },
    { _id:'v11', marca:'Renault',    modello:'Austral E-Tech 200',     tipo:'usato',  anno:2023, chilometri:18000, prezzo:32400,  carburante:'Ibrido',  cambio:'Automatico', potenza:'200 CV', colore:'Blu',    posti:5, categoria:'suv',      immagini:[] },
    { _id:'v12', marca:'Volvo',      modello:'XC60 T6 AWD Inscription',tipo:'usato',  anno:2022, chilometri:44000, prezzo:49900,  carburante:'Benzina', cambio:'Automatico', potenza:'310 CV', colore:'Grigio', posti:5, categoria:'suv',      immagini:[], prezzoOld:55000 },
    { _id:'v13', marca:'Tesla',      modello:'Model 3 Long Range AWD', tipo:'nuovo',  anno:2024, chilometri:0,     prezzo:54990,  carburante:'Elettrico',cambio:'Automatico',potenza:'358 CV', colore:'Bianco', posti:5, categoria:'berlina',  immagini:[] },
    { _id:'v14', marca:'BMW',        modello:'320d xDrive M Sport',    tipo:'usato',  anno:2023, chilometri:21000, prezzo:44900,  carburante:'Diesel',  cambio:'Automatico', potenza:'190 CV', colore:'Blu',    posti:5, categoria:'berlina',  immagini:[], prezzoOld:48500 },
    { _id:'v15', marca:'Mercedes',   modello:'A 200 AMG Line',         tipo:'nuovo',  anno:2024, chilometri:0,     prezzo:38900,  carburante:'Benzina', cambio:'Automatico', potenza:'163 CV', colore:'Rosso',  posti:5, categoria:'berlina',  immagini:[] },
    { _id:'v16', marca:'Kia',        modello:'EV6 GT 585 CV',          tipo:'nuovo',  anno:2024, chilometri:0,     prezzo:62900,  carburante:'Elettrico',cambio:'Automatico',potenza:'585 CV', colore:'Nero',   posti:5, categoria:'suv',      immagini:[] },
    { _id:'v17', marca:'Alfa Romeo', modello:'Stelvio 2.0T Q4 Veloce', tipo:'usato', anno:2022, chilometri:31000, prezzo:46500,  carburante:'Benzina', cambio:'Automatico', potenza:'280 CV', colore:'Rosso',  posti:5, categoria:'suv',      immagini:[], prezzoOld:52000 },
    { _id:'v18', marca:'Volkswagen', modello:'ID.4 GTX 4MOTION',       tipo:'nuovo',  anno:2024, chilometri:0,     prezzo:55900,  carburante:'Elettrico',cambio:'Automatico',potenza:'299 CV', colore:'Bianco', posti:5, categoria:'suv',      immagini:[] },
    { _id:'v19', marca:'Porsche',    modello:'Macan S',                tipo:'usato',  anno:2023, chilometri:9000,  prezzo:72900,  carburante:'Benzina', cambio:'Automatico', potenza:'265 CV', colore:'Grigio', posti:5, categoria:'suv',      immagini:[], prezzoOld:79500 },
    { _id:'v20', marca:'Skoda',      modello:'Octavia RS 245 Combi',   tipo:'usato',  anno:2022, chilometri:42000, prezzo:27900,  carburante:'Benzina', cambio:'DSG',        potenza:'245 CV', colore:'Grigio', posti:5, categoria:'familiare', immagini:[] },
    { _id:'v21', marca:'Hyundai',    modello:'IONIQ 5 N 650 CV',       tipo:'nuovo',  anno:2024, chilometri:0,     prezzo:72900,  carburante:'Elettrico',cambio:'Automatico',potenza:'650 CV', colore:'Bianco', posti:5, categoria:'suv',      immagini:[] },
    { _id:'v22', marca:'Land Rover', modello:'Defender 110 D300 SE',   tipo:'usato',  anno:2022, chilometri:38500, prezzo:79500,  carburante:'Diesel',  cambio:'Automatico', potenza:'300 CV', colore:'Verde',  posti:7, categoria:'suv',      immagini:[], prezzoOld:88000 },
    { _id:'v23', marca:'Fiat',       modello:'500e La Prima',          tipo:'nuovo',  anno:2024, chilometri:0,     prezzo:33900,  carburante:'Elettrico',cambio:'Automatico',potenza:'118 CV', colore:'Bianco', posti:4, categoria:'citycar',  immagini:[] },
    { _id:'v24', marca:'Mazda',      modello:'CX-60 e-Skyactiv PHEV',  tipo:'nuovo',  anno:2024, chilometri:0,     prezzo:51900,  carburante:'Ibrido',  cambio:'Automatico', potenza:'327 CV', colore:'Rosso',  posti:5, categoria:'suv',      immagini:[] },
  ];

  // ============================================================
  // STATO DELL'APPLICAZIONE
  // ============================================================
  let state = {
    vehicles:     [...DEMO_VEHICLES],
    filtered:     [...DEMO_VEHICLES],
    currentPage:  1,
    perPage:      HAX_CONFIG.catalogue.itemsPerPage,
    view:         'grid',       // grid | list
    sortBy:       'default',
    searchQuery:  '',
    filters: {
      tipo:       [],           // nuovo | usato
      marca:      [],
      carburante: [],
      categoria:  [],
      priceMin:   0,
      priceMax:   500000,
      annoMin:    1990,
      annoMax:    new Date().getFullYear() + 1,
    },
  };

  // ============================================================
  // EXTRACTION DES OPTIONS DE FILTRE
  // ============================================================
  function getFilterOptions() {
    return {
      marche:      [...new Set(DEMO_VEHICLES.map(v => v.marca))].sort(),
      carburanti:  [...new Set(DEMO_VEHICLES.map(v => v.carburante))].sort(),
      categorie:   [...new Set(DEMO_VEHICLES.map(v => v.categoria))].sort(),
      priceMin:    Math.min(...DEMO_VEHICLES.map(v => v.prezzo)),
      priceMax:    Math.max(...DEMO_VEHICLES.map(v => v.prezzo)),
      annoMin:     Math.min(...DEMO_VEHICLES.map(v => v.anno)),
      annoMax:     Math.max(...DEMO_VEHICLES.map(v => v.anno)),
    };
  }

  // ============================================================
  // FILTRAGE + TRI
  // ============================================================
  function applyFilters() {
    let result = [...state.vehicles];
    const f = state.filters;
    const q = state.searchQuery.toLowerCase().trim();

    // Recherche texte
    if (q) {
      result = result.filter(v =>
        `${v.marca} ${v.modello} ${v.carburante} ${v.colore}`.toLowerCase().includes(q)
      );
    }
    // Type
    if (f.tipo.length) result = result.filter(v => f.tipo.includes(v.tipo));
    // Marque
    if (f.marca.length) result = result.filter(v => f.marca.includes(v.marca));
    // Carburant
    if (f.carburante.length) result = result.filter(v => f.carburante.includes(v.carburante));
    // Catégorie
    if (f.categoria.length) result = result.filter(v => f.categoria.includes(v.categoria));
    // Prix
    result = result.filter(v => v.prezzo >= f.priceMin && v.prezzo <= f.priceMax);
    // Année
    result = result.filter(v => v.anno >= f.annoMin && v.anno <= f.annoMax);

    // Tri
    switch (state.sortBy) {
      case 'price-asc':  result.sort((a, b) => a.prezzo - b.prezzo); break;
      case 'price-desc': result.sort((a, b) => b.prezzo - a.prezzo); break;
      case 'year-desc':  result.sort((a, b) => b.anno - a.anno); break;
      case 'year-asc':   result.sort((a, b) => a.anno - b.anno); break;
      case 'km-asc':     result.sort((a, b) => a.chilometri - b.chilometri); break;
      default: break;
    }

    state.filtered = result;
    state.currentPage = 1;
  }

  // ============================================================
  // RENDU DES FILTRES
  // ============================================================
  function renderFilters(container) {
    if (!container) return;
    const opts = getFilterOptions();
    const activeCount = getActiveFilterCount();

    container.innerHTML = `
      <div class="filters-panel__header">
        <span class="filters-panel__title">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
          </svg>
          Filtri ${activeCount > 0 ? `<span class="badge badge--primary">${activeCount}</span>` : ''}
        </span>
        <button class="filters-panel__reset" onclick="CataloguePage.resetFilters()">Reset</button>
      </div>
      <div class="filters-panel__body">

        <!-- Tipo -->
        <div class="filter-group open">
          <button class="filter-group__toggle" onclick="CataloguePage.toggleFilterGroup(this)">
            Tipo Veicolo
            <svg class="filter-group__toggle-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
          <div class="filter-group__body">
            <div class="filter-radio-group">
              <label class="filter-radio ${state.filters.tipo.includes('nuovo') ? 'selected' : ''}">
                <input type="checkbox" value="nuovo" onchange="CataloguePage.toggleArrayFilter('tipo','nuovo')" ${state.filters.tipo.includes('nuovo') ? 'checked' : ''}/>
                ✨ Nuovo
              </label>
              <label class="filter-radio ${state.filters.tipo.includes('usato') ? 'selected' : ''}">
                <input type="checkbox" value="usato" onchange="CataloguePage.toggleArrayFilter('tipo','usato')" ${state.filters.tipo.includes('usato') ? 'checked' : ''}/>
                🔍 Usato
              </label>
            </div>
          </div>
        </div>

        <!-- Prezzo -->
        <div class="filter-group open">
          <button class="filter-group__toggle" onclick="CataloguePage.toggleFilterGroup(this)">
            Prezzo
            <svg class="filter-group__toggle-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
          <div class="filter-group__body">
            <div class="filter-range">
              <div class="filter-range__values">
                <span id="price-min-display">${Helpers.formatPrice(state.filters.priceMin, 0)}</span>
                <span id="price-max-display">${Helpers.formatPrice(state.filters.priceMax, 0)}</span>
              </div>
              <div class="filter-range__inputs">
                <input type="number" class="filter-range__input" placeholder="Min €"
                  value="${state.filters.priceMin || ''}"
                  onchange="CataloguePage.setRangeFilter('priceMin', this.value)"
                  min="0" max="500000" step="1000"/>
                <input type="number" class="filter-range__input" placeholder="Max €"
                  value="${state.filters.priceMax >= 500000 ? '' : state.filters.priceMax}"
                  onchange="CataloguePage.setRangeFilter('priceMax', this.value || 500000)"
                  min="0" max="500000" step="1000"/>
              </div>
            </div>
          </div>
        </div>

        <!-- Marche -->
        <div class="filter-group open">
          <button class="filter-group__toggle" onclick="CataloguePage.toggleFilterGroup(this)">
            Marca
            <svg class="filter-group__toggle-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
          <div class="filter-group__body">
            <div class="filter-options">
              ${opts.marche.map(m => {
                const count = DEMO_VEHICLES.filter(v => v.marca === m).length;
                return `<label class="filter-option">
                  <input type="checkbox" value="${m}"
                    ${state.filters.marca.includes(m) ? 'checked' : ''}
                    onchange="CataloguePage.toggleArrayFilter('marca','${m}')"/>
                  <span class="filter-option__label">${m}</span>
                  <span class="filter-option__count">${count}</span>
                </label>`;
              }).join('')}
            </div>
          </div>
        </div>

        <!-- Carburante -->
        <div class="filter-group open">
          <button class="filter-group__toggle" onclick="CataloguePage.toggleFilterGroup(this)">
            Alimentazione
            <svg class="filter-group__toggle-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
          <div class="filter-group__body">
            <div class="filter-options">
              ${opts.carburanti.map(c => {
                const count = DEMO_VEHICLES.filter(v => v.carburante === c).length;
                const icons = { Benzina:'⛽', Diesel:'🛢️', Elettrico:'⚡', Ibrido:'🔋' };
                return `<label class="filter-option">
                  <input type="checkbox" value="${c}"
                    ${state.filters.carburante.includes(c) ? 'checked' : ''}
                    onchange="CataloguePage.toggleArrayFilter('carburante','${c}')"/>
                  <span class="filter-option__label">${icons[c] || ''} ${c}</span>
                  <span class="filter-option__count">${count}</span>
                </label>`;
              }).join('')}
            </div>
          </div>
        </div>

        <!-- Categoria -->
        <div class="filter-group">
          <button class="filter-group__toggle" onclick="CataloguePage.toggleFilterGroup(this)">
            Categoria
            <svg class="filter-group__toggle-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
          <div class="filter-group__body">
            <div class="filter-options">
              ${opts.categorie.map(c => {
                const count = DEMO_VEHICLES.filter(v => v.categoria === c).length;
                return `<label class="filter-option">
                  <input type="checkbox" value="${c}"
                    ${state.filters.categoria.includes(c) ? 'checked' : ''}
                    onchange="CataloguePage.toggleArrayFilter('categoria','${c}')"/>
                  <span class="filter-option__label">${Helpers.capitalize(c)}</span>
                  <span class="filter-option__count">${count}</span>
                </label>`;
              }).join('')}
            </div>
          </div>
        </div>

        <!-- Anno -->
        <div class="filter-group">
          <button class="filter-group__toggle" onclick="CataloguePage.toggleFilterGroup(this)">
            Anno Immatricolazione
            <svg class="filter-group__toggle-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
          <div class="filter-group__body">
            <div class="filter-range__inputs">
              <input type="number" class="filter-range__input" placeholder="Dal"
                value="${state.filters.annoMin > 1990 ? state.filters.annoMin : ''}"
                onchange="CataloguePage.setRangeFilter('annoMin', this.value || 1990)"
                min="1990" max="2025"/>
              <input type="number" class="filter-range__input" placeholder="Al"
                value="${state.filters.annoMax <= new Date().getFullYear() ? state.filters.annoMax : ''}"
                onchange="CataloguePage.setRangeFilter('annoMax', this.value || 2025)"
                min="1990" max="2025"/>
            </div>
          </div>
        </div>

      </div>
    `;
  }

  // ============================================================
  // RENDU TOOLBAR
  // ============================================================
  function renderToolbar() {
    const toolbar = document.getElementById('catalogue-toolbar');
    if (!toolbar) return;

    toolbar.innerHTML = `
      <div style="display:flex;flex-direction:column;gap:var(--space-3);width:100%">
        <div style="display:flex;align-items:center;gap:var(--space-3);flex-wrap:wrap">
          <!-- Bouton filtres mobile -->
          <button class="filters-mobile-btn" onclick="CataloguePage.openMobileFilters()" id="filters-mobile-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
            </svg>
            Filtri
            <span class="filters-mobile-badge ${getActiveFilterCount() > 0 ? 'visible' : ''}" id="filter-mobile-badge">
              ${getActiveFilterCount()}
            </span>
          </button>

          <!-- Recherche -->
          <div class="catalogue-search-wrapper">
            <svg class="catalogue-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input type="search" class="catalogue-search" id="catalogue-search"
              placeholder="Cerca marca, modello, colore..."
              value="${state.searchQuery}"
              oninput="CataloguePage.handleSearch(this.value)"/>
            <button class="catalogue-search-clear ${state.searchQuery ? 'visible' : ''}"
              id="search-clear" onclick="CataloguePage.clearSearch()" aria-label="Cancella ricerca">✕</button>
          </div>

          <!-- Tri -->
          <select class="catalogue-sort" onchange="CataloguePage.setSort(this.value)" aria-label="Ordina per">
            <option value="default"    ${state.sortBy==='default'?'selected':''}>Rilevanza</option>
            <option value="price-asc"  ${state.sortBy==='price-asc'?'selected':''}>Prezzo ↑</option>
            <option value="price-desc" ${state.sortBy==='price-desc'?'selected':''}>Prezzo ↓</option>
            <option value="year-desc"  ${state.sortBy==='year-desc'?'selected':''}>Più Recenti</option>
            <option value="year-asc"   ${state.sortBy==='year-asc'?'selected':''}>Meno Recenti</option>
            <option value="km-asc"     ${state.sortBy==='km-asc'?'selected':''}>Km ↑</option>
          </select>

          <!-- Vue grille/liste -->
          <div class="catalogue-view-toggle">
            <button class="catalogue-view-btn ${state.view==='grid'?'active':''}"
              onclick="CataloguePage.setView('grid')" aria-label="Vista griglia">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
              </svg>
            </button>
            <button class="catalogue-view-btn ${state.view==='list'?'active':''}"
              onclick="CataloguePage.setView('list')" aria-label="Vista lista">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
          </div>

          <!-- Compteur -->
          <span class="catalogue-count">
            <strong>${state.filtered.length}</strong> veicoli trovati
          </span>
        </div>

        <!-- Tags filtri attivi -->
        <div class="active-filters" id="active-filters"></div>
      </div>
    `;

    renderActiveFilterTags();
  }

  // Tags filtri attivi
  function renderActiveFilterTags() {
    const container = document.getElementById('active-filters');
    if (!container) return;
    const tags = [];
    const f = state.filters;

    f.tipo.forEach(v => tags.push({ label: v === 'nuovo' ? '✨ Nuovo' : '🔍 Usato', key: 'tipo', val: v }));
    f.marca.forEach(v => tags.push({ label: v, key: 'marca', val: v }));
    f.carburante.forEach(v => tags.push({ label: v, key: 'carburante', val: v }));
    f.categoria.forEach(v => tags.push({ label: Helpers.capitalize(v), key: 'categoria', val: v }));
    if (f.priceMin > 0) tags.push({ label: `Min ${Helpers.formatPrice(f.priceMin, 0)}`, key: 'priceMin', val: 0, isRange: true });
    if (f.priceMax < 500000) tags.push({ label: `Max ${Helpers.formatPrice(f.priceMax, 0)}`, key: 'priceMax', val: 500000, isRange: true });

    container.innerHTML = tags.map(t => `
      <span class="active-filter-tag">
        ${t.label}
        <button class="active-filter-tag__remove"
          onclick="CataloguePage.removeFilterTag('${t.key}','${t.val}',${!!t.isRange})"
          aria-label="Rimuovi filtro ${t.label}">✕</button>
      </span>
    `).join('');
  }

  // ============================================================
  // RENDU GRILLE VÉHICULES
  // ============================================================
  function renderVehiclesGrid() {
    const grid = document.getElementById('vehicles-grid');
    if (!grid) return;

    const start = (state.currentPage - 1) * state.perPage;
    const page  = state.filtered.slice(start, start + state.perPage);

    grid.className = `vehicles-grid ${state.view === 'list' ? 'list-view' : ''}`;

    if (!page.length) {
      grid.innerHTML = `
        <div class="catalogue-empty">
          <div class="catalogue-empty__icon">🔍</div>
          <h3 class="catalogue-empty__title">Nessun veicolo trovato</h3>
          <p class="catalogue-empty__desc">Prova a modificare i filtri o la ricerca.</p>
          <button class="btn btn--primary" onclick="CataloguePage.resetFilters()">Reset Filtri</button>
        </div>`;
      return;
    }

    grid.innerHTML = page.map(v => buildVehicleCard(v)).join('');
  }

  function buildVehicleCard(v) {
    const img    = Helpers.getVehicleImageUrl(v.immagini?.[0]);
    const isUsed = v.tipo === 'usato';
    const monthly = computeMonthly(v.prezzo);
    return `
      <div class="vehicle-card" onclick="location.href='vehicle-detail.html?id=${v._id}'" data-animate="fade-up">
        <div class="vehicle-card__img-wrapper">
          <img src="${img}" alt="${v.marca} ${v.modello}" class="vehicle-card__img"
               onerror="this.src='../assets/images/placeholder-car.svg'" loading="lazy"/>
          <div class="vehicle-card__badges">
            <span class="badge badge--${v.tipo === 'nuovo' ? 'nuovo' : 'usato'}">
              ${v.tipo === 'nuovo' ? '✨ Nuovo' : '🔍 Usato'}
            </span>
            ${v.prezzoOld ? '<span class="badge badge--danger">Offerta</span>' : ''}
          </div>
          <button class="vehicle-card__wishlist"
            onclick="event.stopPropagation();this.classList.toggle('active');this.textContent=this.classList.contains('active')?'❤️':'🤍'"
            aria-label="Preferiti">🤍</button>
        </div>
        <div class="vehicle-card__body">
          <p class="vehicle-card__brand">${v.marca}</p>
          <h3 class="vehicle-card__name">${v.modello}</h3>
          <div class="vehicle-card__specs">
            <span class="vehicle-card__spec">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
              </svg>${v.anno}
            </span>
            <span class="vehicle-card__spec">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>${v.carburante}
            </span>
            <span class="vehicle-card__spec">⚡ ${v.potenza}</span>
            ${isUsed ? `<span class="vehicle-card__spec">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>${Helpers.formatKm(v.chilometri)}
            </span>` : ''}
            <span class="vehicle-card__spec">${v.cambio}</span>
          </div>
          <div class="vehicle-card__footer">
            <div class="vehicle-card__price-wrap">
              <span class="vehicle-card__price-label">Prezzo</span>
              ${v.prezzoOld ? `<span class="vehicle-card__price--old">${Helpers.formatPrice(v.prezzoOld)}</span>` : ''}
              <span class="vehicle-card__price">${Helpers.formatPrice(v.prezzo)}</span>
              <div class="vehicle-card__monthly">da ${Helpers.formatPrice(monthly, 0)}/mese</div>
            </div>
            <span class="vehicle-card__cta">
              Scopri
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </span>
          </div>
        </div>
      </div>`;
  }

  // ============================================================
  // PAGINATION
  // ============================================================
  function renderPagination() {
    const container = document.getElementById('catalogue-pagination');
    if (!container) return;

    const total = Math.ceil(state.filtered.length / state.perPage);
    if (total <= 1) { container.innerHTML = ''; return; }

    const cur   = state.currentPage;
    const pages = [];

    // Logique d'affichage des pages
    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      if (cur > 3) pages.push('...');
      for (let i = Math.max(2, cur - 1); i <= Math.min(total - 1, cur + 1); i++) pages.push(i);
      if (cur < total - 2) pages.push('...');
      pages.push(total);
    }

    const start = (cur - 1) * state.perPage + 1;
    const end   = Math.min(cur * state.perPage, state.filtered.length);

    container.innerHTML = `
      <button class="pagination__btn" onclick="CataloguePage.goToPage(${cur - 1})" ${cur === 1 ? 'disabled' : ''} aria-label="Pagina precedente">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>
      ${pages.map(p => p === '...'
        ? `<span class="pagination__dots">…</span>`
        : `<button class="pagination__btn ${p === cur ? 'active' : ''}" onclick="CataloguePage.goToPage(${p})">${p}</button>`
      ).join('')}
      <button class="pagination__btn" onclick="CataloguePage.goToPage(${cur + 1})" ${cur === total ? 'disabled' : ''} aria-label="Pagina successiva">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </button>
      <p class="pagination__info">Visualizzando ${start}–${end} di ${state.filtered.length} veicoli</p>
    `;
  }

  // ============================================================
  // UTILITAIRES
  // ============================================================
  function computeMonthly(price, months = 36) {
    const deposit = price * 0.20;
    const financed = price - deposit;
    const rate = HAX_CONFIG.credit.defaultRate / 100 / 12;
    const factor = Math.pow(1 + rate, months);
    return financed * (rate * factor) / (factor - 1);
  }

  function getActiveFilterCount() {
    const f = state.filters;
    return f.tipo.length + f.marca.length + f.carburante.length + f.categoria.length
      + (f.priceMin > 0 ? 1 : 0)
      + (f.priceMax < 500000 ? 1 : 0);
  }

  function fullRefresh() {
    applyFilters();
    renderToolbar();
    renderFilters(document.getElementById('filters-panel'));
    renderVehiclesGrid();
    renderPagination();
    window.scrollTo({ top: document.getElementById('catalogue-toolbar')?.offsetTop - 90 || 0, behavior: 'smooth' });
  }

  // ============================================================
  // API PUBLIQUE (appelée depuis les handlers inline)
  // ============================================================
  function toggleFilterGroup(btn) {
    btn.closest('.filter-group').classList.toggle('open');
  }

  function toggleArrayFilter(key, value) {
    const arr = state.filters[key];
    const idx = arr.indexOf(value);
    if (idx === -1) arr.push(value);
    else arr.splice(idx, 1);
    fullRefresh();
  }

  function setRangeFilter(key, value) {
    state.filters[key] = parseFloat(value) || 0;
    fullRefresh();
  }

  function removeFilterTag(key, val, isRange) {
    if (isRange) {
      state.filters[key] = key === 'priceMin' || key === 'annoMin' ? 0 : 500000;
    } else {
      const arr = state.filters[key];
      const idx = arr.indexOf(val);
      if (idx !== -1) arr.splice(idx, 1);
    }
    fullRefresh();
  }

  function resetFilters() {
    state.filters = { tipo:[], marca:[], carburante:[], categoria:[], priceMin:0, priceMax:500000, annoMin:1990, annoMax:2025 };
    state.searchQuery = '';
    state.sortBy = 'default';
    fullRefresh();
  }

  function handleSearch(query) {
    state.searchQuery = query;
    const clearBtn = document.getElementById('search-clear');
    if (clearBtn) clearBtn.classList.toggle('visible', !!query);
    applyFilters();
    renderVehiclesGrid();
    renderPagination();
    // Mise à jour compteur uniquement
    const countEl = document.querySelector('.catalogue-count');
    if (countEl) countEl.innerHTML = `<strong>${state.filtered.length}</strong> veicoli trovati`;
  }

  const handleSearchDebounced = Helpers.debounce(handleSearch, 300);

  function clearSearch() {
    state.searchQuery = '';
    const input = document.getElementById('catalogue-search');
    if (input) input.value = '';
    const clearBtn = document.getElementById('search-clear');
    if (clearBtn) clearBtn.classList.remove('visible');
    applyFilters();
    renderVehiclesGrid();
    renderPagination();
  }

  function setSort(value) {
    state.sortBy = value;
    fullRefresh();
  }

  function setView(view) {
    state.view = view;
    renderVehiclesGrid();
    renderToolbar();
  }

  function goToPage(page) {
    const total = Math.ceil(state.filtered.length / state.perPage);
    if (page < 1 || page > total) return;
    state.currentPage = page;
    renderVehiclesGrid();
    renderPagination();
    window.scrollTo({ top: document.getElementById('vehicles-grid')?.offsetTop - 100 || 0, behavior: 'smooth' });
  }

  // Filtres mobile drawer
  function openMobileFilters() {
    let drawer = document.getElementById('filters-drawer');
    if (!drawer) {
      const overlay = document.createElement('div');
      overlay.className = 'filters-drawer-overlay';
      overlay.id = 'filters-drawer-overlay';
      overlay.onclick = closeMobileFilters;

      drawer = document.createElement('div');
      drawer.className = 'filters-drawer';
      drawer.id = 'filters-drawer';
      drawer.innerHTML = `<div class="filters-drawer__handle"></div><div id="filters-drawer-inner"></div>`;
      document.body.append(overlay, drawer);
    }
    renderFilters(document.getElementById('filters-drawer-inner'));
    setTimeout(() => {
      document.getElementById('filters-drawer-overlay')?.classList.add('open');
      drawer.classList.add('open');
    }, 10);
  }

  function closeMobileFilters() {
    document.getElementById('filters-drawer-overlay')?.classList.remove('open');
    document.getElementById('filters-drawer')?.classList.remove('open');
  }

  // Lecture des paramètres URL au chargement
  function readUrlParams() {
    const params = Helpers.getUrlParams();
    if (params.get('tipo'))   state.filters.tipo.push(params.get('tipo'));
    if (params.get('marca'))  state.filters.marca.push(params.get('marca'));
    if (params.get('q'))      state.searchQuery = params.get('q');
  }

  // ============================================================
  // INITIALISATION
  // ============================================================
  function init() {
    readUrlParams();
    applyFilters();

    renderFilters(document.getElementById('filters-panel'));
    renderToolbar();
    renderVehiclesGrid();
    renderPagination();

    // Relier la recherche à l'input (fallback au cas où oninput inline ne suffit pas)
    document.getElementById('catalogue-search')?.addEventListener('input',
      (e) => handleSearch(e.target.value));
  }

  return {
    init,
    toggleFilterGroup, toggleArrayFilter, setRangeFilter,
    removeFilterTag, resetFilters,
    handleSearch: handleSearchDebounced,
    clearSearch, setSort, setView, goToPage,
    openMobileFilters, closeMobileFilters,
  };

})();

window.CataloguePage = CataloguePage;
