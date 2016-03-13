var siteApp = angular.module('statsPageApp', []);

siteApp.controller('StatsCtrl', function($scope, statsFactory) {
  // json call
  statsFactory.getUsers()
  .success(function(users) {
    successCallback(users);
  })
  .error(function(error) {
    throw 'There was an error loading the user data: ' + error.message;
  });

  // successful json call
  function successCallback(response) {
    $scope.users = response;

    // stats
    var stats = {
      percents: {
        males: [],
        females: [],
        conversions: [],
        conversionsViewedProfile: [],
        conversionsViewedItem: []
      },
      counts: {
        totalRecords: response,
        fullColorList: [],
        colorsCount: [],
        signedup: [],
        viewedProfile: [],
        viewedItem: [],
        purchasedItem: []
      }
    };

    $scope.users.forEach(function(user) {
      // count number of men/women
      genderCheck(user);

      // get a list of all the colors
      trueParentChild('purchased_item', 'color', user, stats.counts.fullColorList);

      // sign up stats
      trueParentChild('signed_up', 'date', user, stats.counts.signedup);

      // viewed a profile
      trueParentChild('viewed_profile', 'date', user, stats.counts.viewedProfile);

      // viewed an item
      trueParentChild('viewed_item', 'date', user, stats.counts.viewedItem);

      // purchased item
      trueParentChild('purchased_item', 'date', user, stats.counts.purchasedItem);

      // conversions
      conversions('signed_up', 'purchased_item', user, '', stats.percents.conversions);

      // conversions with viewed profile conditional
      conversions('signed_up', 'purchased_item', user, 'viewed_profile', stats.percents.conversionsViewedProfile);

      // conversions with viewed profile conditional
      conversions('signed_up', 'purchased_item', user, 'viewed_item', stats.percents.conversionsViewedItem);
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
          stats.percents.males.push(user);
          break;
        case 'Female':
          stats.percents.females.push(user);
          break;
      }
    }

    // returns percent of total records
    function getPercent(item, totalItems) {
      return (item / totalItems) * 100;
    }

    // get unique color
    var uniqueColorList = stats.counts.fullColorList.filter(function (keyword, index) {
      return stats.counts.fullColorList.lastIndexOf(keyword) === index;
    });

    // add colors length to stats
    stats.counts.colorsCount = uniqueColorList;

    // gets conversions
    function conversions(signedup, purchased, user, conditional, arrayCollection) {

      //console.log(conditional);

      // check if user has signed up and has purchased prop
      if (user.hasOwnProperty(signedup) && user.hasOwnProperty(purchased)) {
        // check if purchased was comeplete, by checking date
        if (user[purchased].hasOwnProperty('date')) {
          // if the user signup date is the same or before purchase date
          if (new Date(user[signedup].date) <= new Date(user[purchased].date)) {
            arrayCollection.push(user);
          }
        }
      }
    }

    // adds stats props to scope
    function buildScopeVars(props) {
      // gets length for counted items
      if (props.counts) {
        for (var count in props.counts) {
          $scope[count] = props.counts[count].length;
        }
      }

      // gets percent of total items
      if (props.percents) {
        for (var percent in props.percents) {
          $scope[percent] = getPercent(props.percents[percent].length, $scope.totalRecords);
        }
      }
    }

    // call to build buil scope vars
    buildScopeVars(stats);

    $scope.addRow = function() {
      statsFactory.getUser()
      .success(function(u) {
        $scope.users.unshift(u[0]);
        $scope.clicked = true;
        successCallback($scope.users);
      })
      .error(function(error) {
        throw 'Could not add user: ' + error.message;
      });
    };
  }
});
