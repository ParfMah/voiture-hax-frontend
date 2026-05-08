/**
 * pages/about.js — Page Chi Siamo
 */
'use strict';
const AboutPage = (() => {
  function init() {
    const el = document.getElementById('about-main');
    if (!el) return;
    el.innerHTML = `
      <div class="about-grid-container">
        <div>
          <h2 class="section-title" data-animate="fade-up">La Nostra Storia</h2>
          <p style="margin:var(--space-6) 0;color:var(--color-text-secondary);line-height:var(--leading-relaxed)" data-animate="fade-up" data-animate-delay="100">
            Fondata nel 2010 a Milano, <strong>Hax-ISA</strong> nasce con un obiettivo chiaro:
            democratizzare l'accesso alle migliori automobili europee, portando trasparenza e professionalità
            in un settore spesso opaco.
          </p>
          <p style="margin-bottom:var(--space-6);color:var(--color-text-secondary);line-height:var(--leading-relaxed)" data-animate="fade-up" data-animate-delay="150">
            In 14 anni di attività, abbiamo consegnato oltre 8.400 veicoli in 15 paesi europei,
            costruendo una reputazione basata su tre pilastri: <strong>qualità certificata</strong>,
            <strong>prezzi trasparenti</strong> e <strong>servizio impeccabile</strong>.
          </p>
          <div class="stats-grid" data-animate="fade-up" data-animate-delay="200">
            ${[['14+','Anni'],['8.400+','Clienti'],['15','Paesi'],['1.200+','Veicoli'],['200+','Partner'],['98%','Soddisfazione']].map(([n,l])=>`
              <div style="text-align:center;padding:var(--space-4);background:var(--color-bg-secondary);border-radius:var(--radius-lg);border:1px solid var(--color-border)">
                <div style="font-size:var(--text-2xl);font-weight:var(--font-black);color:var(--color-primary)">${n}</div>
                <div style="font-size:var(--text-xs);color:var(--color-text-muted);text-transform:uppercase;letter-spacing:var(--tracking-wider);margin-top:4px">${l}</div>
              </div>`).join('')}
          </div>
          <a href="contact.html" class="btn btn--primary btn--lg" data-animate="fade-up" data-animate-delay="250">
            Contattaci
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </a>
        </div>
        <div data-animate="fade-left">
          <div style="background:var(--gradient-dark);border-radius:var(--radius-2xl);padding:var(--space-10);color:white">
            <h3 style="font-size:var(--text-xl);font-weight:var(--font-bold);margin-bottom:var(--space-6)">I Nostri Valori</h3>
            ${[
              ['🎯','Trasparenza totale','Nessun costo nascosto, nessuna sorpresa. Il prezzo che vedi è quello che paghi.'],
              ['🔍','Qualità certificata','Ogni veicolo supera un controllo a 100 punti prima di essere proposto ai clienti.'],
              ['🤝','Servizio dedicato','Un consulente personale ti segue dall\'acquisto fino alla consegna.'],
              ['🚚','Consegna a domicilio','Portiamo il tuo veicolo dove vuoi tu, in tutta Europa.'],
            ].map(([i,t,d])=>`
              <div style="display:flex;gap:var(--space-4);margin-bottom:var(--space-6)">
                <div style="width:44px;height:44px;background:rgba(255,255,255,0.1);border-radius:var(--radius-md);display:flex;align-items:center;justify-content:center;font-size:1.3rem;flex-shrink:0">${i}</div>
                <div>
                  <p style="font-weight:var(--font-bold);color:white;margin-bottom:4px">${t}</p>
                  <p style="font-size:var(--text-sm);color:rgba(255,255,255,0.6);line-height:var(--leading-relaxed)">${d}</p>
                </div>
              </div>`).join('')}
          </div>
        </div>
      </div>
    `;
  }
  return { init };
})();
window.AboutPage = AboutPage;
