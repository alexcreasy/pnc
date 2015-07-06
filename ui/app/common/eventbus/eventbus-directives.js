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
   * @name pnc.common.eventbus:pncListen
   * @restrict A
   * @param {array} selected-items

   * @param {function} query

   * @param {string=} display-property

   * @description

   * @example

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
