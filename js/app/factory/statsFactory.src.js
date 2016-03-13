siteApp.factory('statsFactory', function($http) {
  return {
    getUsers: function() {
      return $http.get('js/resources/assignment-table-data.json');
    },
    getUser: function() {
      return $http.get('js/resources/assignment-table-data-add.json');
    }
  };
});
