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
  module.directive('pncBuilds', [
    '$log',
    'PncRestClient',
    'eventTypes',
    function($log, PncRestClient, eventTypes) {

      return {
        restrict: 'E',
        templateUrl: 'record/views/pnc-builds.html',
        scope: {
          pncFilterBy: '=',
          pncMode: '@'
        },
        link: function(scope) {

          var recordMap = new buckets.Dictionary();
          var filterSpec = scope.pncFilterBy;

          // Are we monitoring running or completed builds?
          if (!scope.pncMode) {
            throw new Error('Expected attribute `pnc-mode`');
          }
          var mode = scope.pncMode.toLowerCase();

          // The REST models to query for data for each mode.
          var restModels = {
            running: PncRestClient.Running,
            completed: PncRestClient.Record
          };

          // Event handlers for each mode.
          var eventHandlers = {
            running: function(eventType, record) {
              switch(eventType) {
                case eventTypes.BUILD_STARTED:
                  recordMap.set(record.id, record);
                  break;
                case eventTypes.BUILD_FAILED:
                case eventTypes.BUILD_COMPLETED:
                  recordMap.remove(record.id);
                  break;
              }
            },

            completed: function(eventType, record) {
              switch(eventType) {
                case eventTypes.BUILD_FAILED:
                case eventTypes.BUILD_COMPLETED:
                  recordMap.set(record.id, record);
                  break;
              }
            }
          };

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

          scope.getRecords = function() {
            $log.debug('runningRecords=%a',recordMap.values());
            return recordMap.values();
          };

          scope.onEvent = function(event, payload) {
            $log.debug('onRunningStatusChange(event=%O, payload=%O)',event, payload);
            PncRestClient.Running.get({ recordId: payload.id }).$promise.then(
              function(result) {

                if (isEligible(result, filterSpec)) {
                  $log.debug('Fetched running record: %O', result);
                  eventHandlers[mode](payload.eventType, result);
                }

              }
            );
          };

          // Initialise our map with id => record entries.
          restModels[mode].query().$promise.then(
            function success(result) {
              $log.debug('pncBuilds: success: %O', result);
              result.forEach(function(record) {
                if (isEligible(record, filterSpec)) {
                  recordMap.set(record.id, record);
                }
              });
            }
          );
        }
      };
    }
  ]);

})();
