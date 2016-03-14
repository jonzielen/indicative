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
      var signedUpAndPurchased = getSignedUpAndPurchased(user, signedup, purchased),
          completePurchase = getCompletedPurchase(user, purchased),
          signupsBeforePurchase = getSignupsBeforePurchase(user, signedup, purchased, conditional),
          userConditional = hasConditional(user, conditional, signedup, purchased);

      if (signedUpAndPurchased && completePurchase && signupsBeforePurchase && userConditional) {
        arrayCollection.push(user);
      }
    }

    // returns true on users who signed up and purched an item
    function getSignedUpAndPurchased(user, signedup, purchased) {
      if (user.hasOwnProperty(signedup) && user.hasOwnProperty(purchased)) {
        return true;
      }
      return false;
    }

    // returns true on users who have a date associated with their purchase
    function getCompletedPurchase(user, purchased) {
      if (user[purchased] !== undefined && user[purchased].hasOwnProperty('date')) {
        return true;
      }
      return false;
    }

    // returns true if signup date is same or before purchased date
    function getSignupsBeforePurchase(user, signedup, purchased) {
      if (user[signedup] !== undefined &&
          user[purchased] !== undefined &&
          new Date(user[signedup].date).getTime() <= new Date(user[purchased].date).getTime()) {
        return true;
      }
      return false;
    }

    // returns true if conditional is true
    function hasConditional(user, conditional, signedup, purchased) {
      if (conditional === '') {
        return true;
      } else {
        // 1) check that start date is less than purchased date
        // 2) check that condtional date is greater than start date
        // 3) check that conditional date is less than purchased date
        if (user[signedup] !== undefined &&
            user[purchased] !== undefined &&
            user[conditional] !== undefined &&
            (new Date(user[signedup].date).getTime() <= new Date(user[purchased].date).getTime()) &&
            (new Date(user[conditional].date).getTime() >= new Date(user[signedup].date).getTime()) &&
            (new Date(user[conditional].date).getTime() < new Date(user[purchased].date).getTime())) {
          return true;
        }
        return false;
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

    // call to build build scope vars
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
