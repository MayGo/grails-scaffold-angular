(function () {

  angular
    .module('angularDemoApp')
    .controller('AppController', AppController);

  AppController.$inject = ['$mdSidenav', 'AutocompleteService'];

  function AppController($mdSidenav, AutocompleteService) {
    var ctrl = this;

    ctrl.autocompleteService = AutocompleteService;

    ctrl.toggleItemsList = toggleItemsList;

    function toggleItemsList() {
        $mdSidenav('left').toggle();
    }

  }

})();
