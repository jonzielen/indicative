var siteApp = angular.module('statsPageApp', []);

siteApp.controller('StatsCtrl', function($scope, $http) {
    // local json call to data
    $http.get('js/assignment-table-data.json').then(successCallback, errorCallback);

    // successful json call
    function successCallback(response) {
      $scope.data = response.data;
      $scope.totalRecords = response.data.length;

      // counts
      var count = {
        males: [],
        females: [],
        fullColorList: [],
        signedup: [],
        viewedProfile: [],
        viewedItem: [],
        purchasedItem: []
      };

      $scope.data.forEach(function(user) {
        // count number of men/women
        genderCheck(user);

        // get a list of all the colors
        trueParentChild('purchased_item', 'color', user, count.fullColorList);

        // sign up stats
        trueParentChild('signed_up', 'date', user, count.signedup);

        // viewed a profile
        trueParentChild('viewed_profile', 'date', user, count.viewedProfile);

        // viewed an item
        trueParentChild('viewed_item', 'date', user, count.viewedItem);

        // purchased item
        trueParentChild('purchased_item', 'date', user, count.purchasedItem);
      });

      // checks if user has parent prop and child prop, then adds value to array
      function trueParentChild(parent, child, user, arrayCollection) {
        if (user.hasOwnProperty(parent) && user[parent].hasOwnProperty(child)) {
          arrayCollection.push(user[parent][child]);
        }
      }

      // checks gender
      function genderCheck(user) {
        switch (user.gender) {
          case 'Male':
            count.males.push('m');
            break;
          case 'Female':
            count.females.push('f');
            break;
        }
      }

      // makes percent
      function getPercent(item) {
        return (item / $scope.totalRecords) * 100;
      }

      $scope.gender = {
        men: getPercent(count.males.length),
        women: getPercent(count.females.length)
      };

      // get unique color
      var uniqueColorList = count.fullColorList.filter(function (keyword, index) {
        return count.fullColorList.lastIndexOf(keyword) === index;
      });

      // add colors length to scope
      $scope.colorsCount = uniqueColorList.length;

      // adds count props length to scope
      function buildScopeVars(props) {
        for (var prop in props) {
            if (props.hasOwnProperty(prop)) {
                $scope[prop] = props[prop].length;
            }
        }
      }

      buildScopeVars(count);






      //console.log(count);
    }

    // error calling json
    function errorCallback() {
      $scope.data = 'an error';
    }
});
