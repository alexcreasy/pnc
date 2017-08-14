(function () {
  'use strict';

  angular.module('pnc.build-configs').component('pncSelectBuildConfigs', {
    templateUrl: 'build-configs/directives/pnc-select-build-configs/pnc-select-build-configs.html',
    bindings: {
      /**
       *
       *
       */
      onAdd: '&',
      /**
       *
       */
      onRemove: '&',
      /**
       *
       */
      collectById: '@',
      /**
       * {Array} of BuildConfig objects. This parameter is required if and only if
       * collect-by-id=true is used. It is an array of the BuildConfigs to initially
       * populate
       */
      initialValues: '<'
    },
    require: {
      ngModel: '?ngModel'
    },
    controller: ['$log', '$scope', 'utils', Controller]
  });

  function Controller($log, $scope, utils) {
    var $ctrl = this,

        collectById = utils.parseBoolean($ctrl.collectById),

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


    $ctrl.$postLink = function () {
      if ($ctrl.ngModel) {

        $scope.$watch(function () {
          return hash($ctrl.buildConfigs);
        }, function () {
          $ctrl.ngModel.$setViewValue($ctrl.buildConfigs);
        });


        $ctrl.ngModel.$parsers.push(function (viewValue) {
          if (collectById) {
            return viewValue.map(function (bc) { return bc.id; });
          }

          return viewValue;
        });

        $ctrl.ngModel.$parsers.push(function (viewValue) {
          return viewValue;
        });

        /*
         * When the model value is changed, if collect-by-id=true is set we
         * need to map the array of ids back to BC objects to display those to
         * the user.
         */
        $ctrl.ngModel.$formatters.push(function (modelValue) {
          if (angular.isArray(modelValue)) {

            if (collectById) {

              return modelValue.map(function (id) {
                return $ctrl.initialValues.find(function (bc) {
                  return bc.id === id;
                });
              });

            }

            return modelValue;
          }

          return [];
        });

        $ctrl.ngModel.$render = function () {

          if (!$ctrl.ngModel.$isEmpty($ctrl.ngModel.$viewValue)) {
            $ctrl.buildConfigs = $ctrl.ngModel.$viewValue;

          // } else if (collectById) {


            // $ctrl.buildConfigs = $ctrl.ngModel.$viewValue.map(function (id) {
            //   return $ctrl.initialValues.find(function (bc) {
            //     return bc.id === id;
            //   });
            // });

          } else {
            $ctrl.buildConfigs = [];
          }
        };

        if (collectById && $ctrl.initialValues && $ctrl.initialValues.length > 0) {
          $ctrl.buildConfigs = $ctrl.initialValues.map(function (bc) { return bc.id; });
        }
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
