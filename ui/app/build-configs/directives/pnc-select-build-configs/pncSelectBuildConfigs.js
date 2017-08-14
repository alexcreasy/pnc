(function () {
  'use strict';

  angular.module('pnc.build-configs').component('pncSelectBuildConfigs', {
    templateUrl: 'build-configs/directives/pnc-select-build-configs/pnc-select-build-configs.html',
    controller: Controller,
    bindings: {
      buildConfigs: '=ngModel',
      onAdd: '&',
      onRemove: '&'
    }
  });

  function Controller() {
    var $ctrl = this,

        listConfig = {
         selectItems: false,
         multiSelect: false,
         dblClick: false,
         selectionMatchProp: 'id',
         showSelectBox: false,
       },

       listActionButtons = [
         {
           name: 'Remove',
           title: 'Remove this dependency',
           actionFn: function (action, object) {
             $ctrl.remove(object);
           }
         }
       ];


    // -- Controller API --

    $ctrl.listConfig = listConfig;
    $ctrl.listActionButtons = listActionButtons;
    $ctrl.add = add;
    $ctrl.remove = remove;

    // --------------------


    $ctrl.$onInit = function () {
      if (!angular.isArray($ctrl.buildConfigs)) {
        $ctrl.buildConfigs = [];
      }
    };

    function add(buildConfig) {
      $ctrl.buildConfigs.push(buildConfig);
      $ctrl.buildConfig = undefined;
      $ctrl.onAdd({ buildConfig: buildConfig });
    }

    function remove(buildConfig) {
      var index = $ctrl.buildConfigs.findIndex(function (bc) {
        return bc.id === buildConfig.id;
      });

      if (index > -1) {
        $ctrl.buildConfigs.splice(index, 1);
      }
      $ctrl.onRemove({ buildConfig: buildConfig });
    }

  }

})();
