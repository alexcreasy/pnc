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
  * @param {string}

  * @param {pncCallback} query

  * @description

  * @example

  * @author Alex Creasy
  */
  module.directive('pncRunningBuilds', [
    '$log',
    'PncRestClient',
    'eventTypes',
    function($log, PncRestClient, eventTypes) {

      return {
        restrict: 'E',
        // controllerAs: 'ctrl',
        templateUrl: 'record/views/pnc-running-builds.html',
        scope: {
          pncFilterBy: '=',
          pncType: '@'
        },
        link: function(scope) {

          var runningMap = new buckets.Dictionary();
          var filterSpec = scope.pncFilterBy;

          var isEligible = function(entity, filterSpec) {
            if (angular.isUndefined(filterSpec)) {
              return true;
            }

            var result = true;
            Object.getOwnPropertyNames(filterSpec).forEach(function(key) {
              $log.debug('isEligible: key = `' + key + '` entity[key] = `' + entity[key] + '` filterSpec[key] = `' + filterSpec[key] +'`');
              if (filterSpec[key] !== entity[key]) {
                result = false;
              }
            });
            return result;
          };

          // Initialise our map with id => record entries.
          PncRestClient.Running.query().$promise.then(
            function success(result) {
              $log.debug('pncRunningBuildsSmall: success: %O', result);
              result.forEach(function(record) {
                if (isEligible(record, filterSpec)) {
                  runningMap.set(record.id, record);
                }
              });
            }
          );

          scope.getRecords = function() {
            $log.debug('runningRecords=%a',runningMap.values());
            return runningMap.values();
          };

          scope.onEvent = function(event, payload) {
            $log.debug('onRunningStatusChange(event=%O, payload=%O)',event, payload);
            PncRestClient.Running.get({ recordId: payload.id }).$promise.then(
                function(result) {

                  if (isEligible(result, filterSpec)) {

                    $log.debug('Fetched running record: %O', result);
                    switch(payload.eventType) {
                      case eventTypes.BUILD_STARTED:
                        runningMap.set(result.id, result);
                        break;
                      case eventTypes.BUILD_FAILED:
                      case eventTypes.BUILD_COMPLETED:
                        runningMap.remove(result.id);
                        break;
                    }
                  }
              }
            );
          };
        }
      };
    }
  ]);

})();
