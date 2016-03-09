var siteApp = angular.module('statsPageApp', []);

siteApp.controller('StatsCtrl', function($scope, $http) {
    // json call to data
    // LIVE DATA $http.get('https://mockaroo.com/e7995d70/download?count=5000&key=015777f0').then(successCallback, errorCallback);

    // LOCAL DATA
    $http.get('js/assignment-table-data.json').then(successCallback, errorCallback);


    // successful json call
    function successCallback(response) {
      $scope.data = response.data;
      $scope.totalRecords = response.data.length;

      var count = {
        males: [],
        females: []
      };

      // count number of men/women
      response.data.forEach(function(g) {
        switch (g.gender) {
          case 'Male':
            count.males.push('m');
            break;
          case 'Female':
            count.females.push('f');
            break;
        }
      });

      function getPercent(item) {
        return (item / $scope.totalRecords) * 100;
      }

      $scope.gender = {
        men: getPercent(count.males.length),
        women: getPercent(count.females.length)
      };
    }

    // error calling json
    function errorCallback() {
      $scope.data = 'an error';
    }
});
