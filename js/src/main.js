(function() {
  'use strict';

  var header = document.getElementById('stats-header'),
  statsCol = document.getElementById('stats-columns');

  // show/hide columns when header is clicked
  header.addEventListener('click', function() {
    statsCol.classList.toggle('show');
  });
})();
