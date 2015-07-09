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
  // module.directive('pncBuilds', [
  //   '$log',
  //   'PncRestClient',
  //   'eventTypes',
  //   function($log, PncRestClient, eventTypes) {
  //
  //     return {
  //       restrict: 'E',
  //       templateUrl: 'record/views/pnc-builds.html',
  //       scope: {
  //         pncFilterBy: '=',
  //         pncMode: '@'
  //       },
  //       link: function(scope) {
  //
  //         var recordMap = new buckets.Dictionary();
  //         var filterSpec = scope.pncFilterBy;
  //         var eventHandler, query;
  //
  //         // Are we monitoring running or completed builds?
  //         if (!scope.pncMode) {
  //           throw new Error('Expected attribute `pnc-mode`');
  //         }
  //         var mode = scope.pncMode.toLowerCase();
  //
  //         var runningQuery = function() {
  //           return PncRestClient.Running.query().$promise;
  //         };
  //
  //         var runningEventHandler = {};
  //
  //         runningEventHandler[eventTypes.BUILD_STARTED] = function(event, payload) {
  //           PncRestClient.Running.get({ recordId: payload.id }).$promise.then(
  //             function(result) {
  //               if (isEligible(result, filterSpec)) {
  //                 recordMap.set(result.id, result);
  //               }
  //             }
  //           );
  //         };
  //
  //         runningEventHandler[eventTypes.BUILD_FAILED] =
  //           runningEventHandler[eventTypes.BUILD_COMPLETED] =
  //             function(event, payload) {
  //               if (isEligible(payload, filterSpec)) {
  //                 recordMap.remove(payload.id);
  //               }
  //             };
  //
  //         var completedQuery = function() {
  //           return PncRestClient.Record.query().$promise;
  //         };
  //
  //         var completedEventHandler = {};
  //
  //         completedEventHandler[eventTypes.BUILD_FAILED] =
  //           completedEventHandler[eventTypes.BUILD_COMPLETED] =
  //             function(event, payload) {
  //               PncRestClient.Record.get({ recordId: payload.id }).$promise.then(
  //                 function(result) {
  //                   if (isEligible(result, filterSpec)) {
  //                     recordMap.set(result.id, result);
  //                   }
  //                 }
  //               );
  //             };
  //
  //
  //         // var modeObjs = {
  //         //   running: {
  //         //     query: function() {
  //         //       return PncRestClient.Running.query().$promise;
  //         //     },
  //         //     get: function(model) {
  //         //       return PncRestClient.Running.get({
  //         //         recordId: model.id
  //         //       }).$promise;
  //         //     },
  //         //     handleEvent: function(event, payload) {
  //         //       switch(payload.eventType) {
  //         //         case eventTypes.BUILD_STARTED:
  //         //           recordMap.set(payload.id, payload);
  //         //           break;
  //         //         case eventTypes.BUILD_FAILED:
  //         //         case eventTypes.BUILD_COMPLETED:
  //         //           recordMap.remove(payload.id);
  //         //           break;
  //         //       }
  //         //     }
  //         //   },
  //         //   completed: {
  //         //     query: function() {
  //         //       return PncRestClient.Record.query().$promise;
  //         //     },
  //         //     handleEvent: function(event, payload) {
  //         //       switch(payload.eventType) {
  //         //         case eventTypes.BUILD_FAILED:
  //         //         case eventTypes.BUILD_COMPLETED:
  //         //           PncRestClient.Record.get({ recordId: model.id }).$promise.then(
  //         //             function(result) {
  //         //               if (isEligible(result, filterSpec)) {
  //         //                 recordMap.set(payload.id, payload);
  //         //               }
  //         //             }
  //         //           );
  //         //           break;
  //         //       }
  //         //     }
  //         //   },
  //         // };
  //
  //         /**
  //          * Compares each of the properties of filterSpec to the same named
  //          * properties of entity and returns true only if they are ALL strictly
  //          * equal.
  //          */
  //         var isEligible = function(entity, filterSpec) {
  //           if (angular.isUndefined(filterSpec)) {
  //             return true;
  //           }
  //
  //           var result = true;
  //           Object.getOwnPropertyNames(filterSpec).forEach(function(key) {
  //             $log.debug('isEligible: key = `' + key + '` entity[key] = `' + entity[key] + '` filterSpec[key] = `' + filterSpec[key] +'`');
  //             if (filterSpec[key] !== entity[key]) {
  //               result = false;
  //             }
  //           });
  //           return result;
  //         };
  //
  //         scope.getRecords = function() {
  //           return recordMap.values();
  //         };
  //
  //         scope.onEvent = function(event, payload) {
  //           $log.debug('onEvent(mode=%s, event=%O, payload=%O)', mode, event, payload);
  //           if (eventHandler[payload.eventType]) {
  //             eventHandler[payload.eventType](event, payload);
  //           }
  //         };
  //
  //         if (mode === 'running') {
  //           eventHandler = runningEventHandler;
  //           query = runningQuery;
  //         } else if (mode === 'completed') {
  //           eventHandler = completedEventHandler;
  //           query = completedQuery;
  //         }
  //
  //         // Initialise our map with id => record entries.
  //         PncRestClient.Record.query().$promise.then(
  //           function success(result) {
  //             $log.debug('pncBuilds: success: %O', result);
  //             result.forEach(function(record) {
  //               if (isEligible(record, filterSpec)) {
  //                 recordMap.set(record.id, record);
  //               }
  //             });
  //           }
  //         );
  //       }
  //     };
  //   }
  // ]);


  /**
   * Compares each of the properties of filterSpec to the same named
   * properties of entity and returns true only if they are ALL strictly
   * equal.
   */
  function isEligible(entity, filterSpec) {
    if (angular.isUndefined(filterSpec)) {
      return true;
    }

    var result = true;
    Object.getOwnPropertyNames(filterSpec).forEach(function(key) {
      if (filterSpec[key] !== entity[key]) {
        result = false;
      }
    });
    return result;
  }

  module.directive('pncRecentBuilds', [
    '$log',
    '$timeout',
    'PncRestClient',
    'eventTypes',
    function($log, $timeout, PncRestClient, eventTypes) {

      return {
        restrict: 'E',
        templateUrl: 'record/views/pnc-recent-builds.html',
        scope: {
          pncFilterBy: '=',
        },
        link: function(scope) {

          var recordMap = new buckets.Dictionary();
          var filterSpec = scope.pncFilterBy;

          var onBuildFinished = function(event, payload) {
            //$timeout
            PncRestClient.Record.get({ recordId: payload.id }).$promise.then(
              function(result) {
                if (isEligible(result, filterSpec)) {
                  recordMap.set(result.id, result);
                }
              }
            );
          };


          scope.getRecords = function() {
            return recordMap.values();
          };

          // Initialise our map with id => record entries.
          PncRestClient.Record.query().$promise.then(
            function success(result) {
              $log.debug('pnc-recent-builds: success: %O', result);
              result.forEach(function(record) {
                if (isEligible(record, filterSpec)) {
                  recordMap.set(record.id, record);
                }
              });

              scope.$on(eventTypes.BUILD_COMPLETED, onBuildFinished);
              scope.$on(eventTypes.BUILD_FAILED, onBuildFinished);
            }
          );
        }
      };
    }
  ]);

  module.directive('pncRunningBuilds', [
    '$log',
    'PncRestClient',
    'eventTypes',
    function($log, PncRestClient, eventTypes) {

      return {
        restrict: 'E',
        templateUrl: 'record/views/pnc-running-builds.html',
        scope: {
          pncFilterBy: '=',
        },
        link: function(scope) {

          var recordMap = new buckets.Dictionary();
          var filterSpec = scope.pncFilterBy;

          var onBuildStarted = function(event, payload) {
            PncRestClient.Running.get({ recordId: payload.id }).$promise.then(
              function(result) {
                if (isEligible(result, filterSpec)) {
                  recordMap.set(result.id, result);
                }
              }
            );
          };

          var onBuildFinished = function(event, payload) {
            if (isEligible(payload, filterSpec)) {
              recordMap.remove(payload.id, payload);
            }
          };

          scope.getRecords = function() {
            return recordMap.values();
          };

          // Initialise our map with id => record entries.
          PncRestClient.Running.query().$promise.then(
            function success(result) {
              $log.debug('pnc-running-builds: success: %O', result);
              result.forEach(function(record) {
                if (isEligible(record, filterSpec)) {
                  recordMap.set(record.id, record);
                }
              });
              scope.$on(eventTypes.BUILD_STARTED, onBuildStarted);
              scope.$on(eventTypes.BUILD_COMPLETED, onBuildFinished);
              scope.$on(eventTypes.BUILD_FAILED, onBuildFinished);
            }
          );
        }
      };
    }
  ]);

})();
