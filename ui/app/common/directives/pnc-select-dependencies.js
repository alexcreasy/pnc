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

  /**
   * @ngdoc directive
   * @name pnc.common.directives:pncSelectDependencies
   * @restrict E
   * @author Alex Creasy
   */
  module.directive('pncSelectDependencies', function() {

    return {
      scope: {
        name: '=?',
        pncPreload: '=',
      },
      template: '<pnc-select selected-items="ctrl.selected" display-property="name" query="ctrl.getItems($viewValue)" placeholder="Enter dependency name..."></pnc-select>',
      controllerAs: 'ctrl',
      bindToController: true,
      controller: [
        '$log',
        '$filter',
        'BuildConfiguration',
        function($log, $filter, BuildConfiguration) {
          var that = this;

          var configurations;

          this.selected = [];

          this.getItems = function($viewValue) {
            return $filter('filter')(configurations, {
              name: $viewValue
            });
          };

          // Expose an API for use in controllers.
          this.name = {
            getSelected: function() {
              return that.selected;
            },
            getSelectedIds: function() {
              var result = [];
              that.selected.forEach(function(dependency) {
                result.push(dependency.id);
              });
              return result;
            },
            reset: function() {
              that.selected = [];
            }
          };

          // Init directive

          if(this.pncPreload) {
            this.selected = angular.copy(this.pncPreload);
          }

          BuildConfiguration.query().$promise.then(function(result) {
            configurations = result;
          });

        }
      ]
    };

  });

})();
