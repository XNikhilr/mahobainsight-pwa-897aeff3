/* Mahoba Insight — front-end JS */
(function () {
  'use strict';
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }
  var ticker = document.querySelector('.ticker-inner');
  if (ticker) {
    ticker.addEventListener('mouseenter', function () { ticker.style.animationPlayState = 'paused'; });
    ticker.addEventListener('mouseleave', function () { ticker.style.animationPlayState = 'running'; });
  }
})();