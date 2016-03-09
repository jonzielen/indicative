(function() {
  'use strict';

  var header = document.getElementById('stats-header'),
  statsCol = document.getElementById('stats-columns');

  header.addEventListener('click', function() {
    statsCol.classList.toggle('show');
  });
})();
