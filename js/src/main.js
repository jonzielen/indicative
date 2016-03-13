(function() {
  'use strict';

  var header = document.getElementById('stats-header'),
  statsCol = document.getElementById('stats-columns');

  // show/hide columns when header is clicked
  header.addEventListener('click', function() {
    statsCol.classList.toggle('show');
    tableAdjust();
  });



  function tableAdjust() {
    var viewPortHeight = window.innerHeight,
    upperPart = document.querySelector('.upper').clientHeight,
    thead = document.querySelector('table thead').clientHeight,
    tbody = document.querySelector('table tbody');
    // need table top margin and th heught

    console.log(upperPart);


    tbody.style.height = viewPortHeight - upperPart - thead + 'px';
  }

  tableAdjust();


})();
