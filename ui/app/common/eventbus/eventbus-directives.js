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

  var module = angular.module('pnc.common.eventbus');

  /**
   * @ngdoc directive
   * @name pnc.common.directives:pncSelect
   * @restrict E
   * @param {array} selected-items
   * An array on the in scope controller that will hold the items selected by
   * the user. The array can be pre-populated to show items that are already
   * selected.
   * @param {function} query
   * A function that should return an array of possible items for the user to
   * select, filtered by what the user has currently entered, this is passed to
   * the function as the only parameter.
   * @param {string=} display-property
   * The name of the property on the item to search against and display.
   * @description
   * A directive that allows users to select multiple options from a list of
   * possible types. The user finds possible items by typing into a type-ahead
   * style input box. The selected items are presented to the user in a list.
   * The user is given the option to remove items from the list by pressing a
   * cross button next to the selected item.
   * @example
   * <pnc-select display-property="name" selected-items="ctrl.selected" query="ctrl.getItems($viewValue)">
   * </pnc-select>
   * @author Alex Creasy
   */
  module.directive('pncListen', function() {

    return {
      restrict: 'A',
      scope: {
        pncCallback: '&'
      },
      link: function(scope, element, attrs) {
        scope.$on(attrs.pncListen, function(event, payload) {
          scope.pncCallback({ event: event, payload: payload });
        });
      }
    };

  });

})();
