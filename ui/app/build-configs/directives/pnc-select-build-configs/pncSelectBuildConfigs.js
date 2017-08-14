(function () {
  'use strict';

  angular.module('pnc.build-configs').component('pncSelectBuildConfigs', {
    templateUrl: 'build-configs/directives/pnc-select-build-configs/pnc-select-build-configs.html',
    bindings: {
      onAdd: '&',
      onRemove: '&'
    },
    require: {
      ngModel: '?ngModel'
    },
    controller: ['$log', '$scope', Controller]
  });

  function Controller($log, $scope) {
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

    $ctrl.buildConfigs = [];
    $ctrl.listConfig = listConfig;
    $ctrl.listActionButtons = listActionButtons;
    $ctrl.add = add;
    $ctrl.remove = remove;

    // --------------------


    $ctrl.$onInit = function () {
      // if (!angular.isArray($ctrl.buildConfigs)) {
      //   $ctrl.buildConfigs = [];
      // }

      $scope.$watch(function () {
        return hash($ctrl.buildConfigs);
      }, function () {
        $ctrl.ngModel.$setViewValue($ctrl.buildConfigs);
      });

      // $ctrl.ngModel.$parsers.push(function (viewValue) {
      //   if (angular.isObject(viewValue) && angular.isDefined($ctrl.modelProperty)) {
      //     return viewValue[$ctrl.modelProperty];
      //   }
      //
      //   return viewValue;
      // });

      // Respond to programmatic changes to the ng-model value, to propagate
      // changes back to the combobox's displayed value.
      $ctrl.ngModel.$render = function () {
        // if (!$ctrl.ngModel.$isEmpty($ctrl.ngModel.$viewValue) && angular.isDefined($ctrl.modelProperty)) {
        //   $log.warn('pnc-build-config-combobox: programatic changing of the ng-model value is not fully supported when model-value parameter is used. The display value of the combobox will not be correctly mapped');
        // }

        if (!$ctrl.ngModel.$isEmpty($ctrl.ngModel.$viewValue)) {
          $ctrl.buildConfigs = $ctrl.ngModel.$viewValue;
        } else {
          $ctrl.buildConfigs = [];
        }
      };
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

    function hash(buildConfigs) {
      var result = 17;

      buildConfigs.forEach(function (buildConfig) {
        var c;

        if (typeof buildConfig === 'number') {
          c = buildConfig;
        } else if (angular.isObject(buildConfig) && angular.isDefined(buildConfig.id)) {
          c = buildConfig.id;
        } else {
          throw new TypeError('Unable to hash illegal type: expected a BuildConfig (object) or a BuildConfig id (number), but recieved: ' + buildConfig);
        }

        result = 31 * result + c;
      });

      return result;
    }
  }

})();
