/*
 * JBoss, Home of Professional Open Source.
 * Copyright 2014 Red Hat, Inc., and individual contributors
 * as indicated by the @author tags.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

(function() {

  var module = angular.module('pnc.common.directives');

  module.directive('pncSelect', function() {

    var tmpl =
      '<ul class="list-group">' +
        '<li class="list-group-item" ng-repeat="item in selected">' +
          '{{ item.name }}' +
          '<button type="button" class="close" aria-label="Close" ng-click="removeItem(item)">' +
            '<span aria-hidden="true">×</span>' +
          '</button>' +
        '</li>' +
      '</ul>' +
      '<div>' +
        '<input type="text" ng-model="selectedItem" placeholder="Enter product version..." ' +
               'typeahead="item as item.name for item in query({$viewValue: $viewValue})" ' +
               'typeahead-editable="false" typeahead-loading="loadingLocations" class="form-control" ' +
               'typeahead-on-select="onSelect($item, $model, $label)" typeahead-wait-ms="200">' +
        '<span class="spinner spinner-xs spinner-inline"></span>' +
      '</div>'
    ;

    function ctrl($scope) {

      var findInArray = function(obj, array) {
        for (var i = 0; i < array.length; i++) {
          if (angular.equals(obj, array[i])) {
            return i;
          }
        }
        return -1;
      };

      $scope.removeItem = function(item) {
        var i = findInArray(item, $scope.selected);
        if (i >= 0) {
          $scope.selected.splice(i, 1);
        }
      };

      $scope.onSelect = function($item) {
        // Check item isn't already selected
        if (findInArray($item, $scope.selected) < 0) {
          $scope.selected.push($item);
        }
      };

    }

    return {
      scope: {
        selected: '=',
        query: '&'
      },
      template: tmpl,
      controller: ctrl
    };

  });

})();
