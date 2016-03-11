siteApp.factory('dataFactory', function($http) {
  return {
    getUsers: function() {
      return $http.get('js/assignment-table-data.json');
    },
    getUser: function() {
      return $http.get('js/assignment-table-data-add.json');
    }
  };
});
