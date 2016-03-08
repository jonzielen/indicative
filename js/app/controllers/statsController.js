var siteApp = angular.module('statsPageApp', []);

siteApp.controller('StatsCtrl', function($scope, $http) {
    // json call to data
    $http.get('https://mockaroo.com/e7995d70/download?count=5000&key=015777f0').then(successCallback, errorCallback);

    // successful json call
    function successCallback(data) {
      $scope.data = data;
    }


    // error calling json
    function errorCallback() {
      $scope.data = 'an error';
    }

});
