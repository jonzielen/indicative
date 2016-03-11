var siteApp = angular.module('statsPageApp', []);

siteApp.controller('StatsCtrl', function($scope, dataFactory) {
  // json call
  dataFactory.getUsers()
  .success(function(users) {
    successCallback(users);
  })
  .error(function(error) {
    throw 'There was an error loading the user data: ' + error.message;
  });

  // successful json call
  function successCallback(response) {
    $scope.users = response;
    $scope.totalRecords = response.length;

    // counts
    var count = {
      males: [],
      females: [],
      fullColorList: [],
      signedup: [],
      viewedProfile: [],
      viewedItem: [],
      purchasedItem: [],
      conversions: []
    };

    $scope.users.forEach(function(user) {
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

      // conversions
      testConversions('signed_up', 'purchased_item', user, '', count.conversions);
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



    // tests conversions
    function testConversions(signedup, purchased, user, viewed, arrayCollection) {
      // check if user has signed up and has purchased prop
      if (user.hasOwnProperty(signedup) && user.hasOwnProperty(purchased)) {
        // check if purchased was comeplete, by checking date
        if (user[purchased].hasOwnProperty('date')) {
          // if the user signup date is the same or before purchase date
          if (new Date(user[signedup].date) <= new Date(user[purchased].date)) {
            console.log(user);
            console.log(user[signedup].date);
            console.log(user[purchased].date);
            console.log('---------------');
            arrayCollection.push(user);
          }
        }
      }
    }



    // adds count props to scope
    function buildScopeVars(props) {
      for (var prop in props) {
          if (props.hasOwnProperty(prop)) {
              $scope[prop] = props[prop].length;
          }
      }
    }

    buildScopeVars(count);



    console.log(count);

    $scope.addRow = function() {
      dataFactory.getUser()
      .success(function(u) {
        $scope.users.unshift(u[0]);
        $scope.clicked = true;
      })
      .error(function(error) {
        throw 'Could not add user: ' + error.message;
      });
    };

  }
});
