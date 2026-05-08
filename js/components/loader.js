/**
 * components/loader.js
 * Loader de page pour Hax-ISA
 */
'use strict';

const LoaderComponent = (() => {

  function show() {
    const loader = document.getElementById('page-loader');
    if (!loader) return;
    loader.classList.remove('hidden');
    loader.setAttribute('aria-hidden', 'false');
  }

  function hide() {
    const loader = document.getElementById('page-loader');
    if (!loader) return;
    // Petit délai pour éviter le flash
    setTimeout(() => {
      loader.classList.add('hidden');
      loader.setAttribute('aria-hidden', 'true');
    }, 200);
  }

  return { show, hide };

})();

window.LoaderComponent = LoaderComponent;
