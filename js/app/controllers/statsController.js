var siteApp = angular.module('statsPageApp', []);

siteApp.controller('StatsCtrl', function($scope, $http) {
    // json call to data
    // LIVE DATA $http.get('https://mockaroo.com/e7995d70/download?count=5000&key=015777f0').then(successCallback, errorCallback);

    // LOCAL DATA
    $http.get('js/assignment-table-data.json').then(successCallback, errorCallback);


    // successful json call
    function successCallback(response) {
      $scope.data = response.data;
    }


    // error calling json
    function errorCallback() {
      $scope.data = 'an error';
    }

});
