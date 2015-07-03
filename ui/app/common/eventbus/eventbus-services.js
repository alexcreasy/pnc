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

(function () {

  var module = angular.module('pnc.common.eventbus');

  module.factory('EventTypes', function() {
    var events = {

      BUILD_STARTED: 'BUILD_STARTED',

      BUILD_COMPLETED: 'BUILD_COMPLETED',

      BUILD_FAILED: 'BUILD_FAILED',

    };

    Object.freeze(events);
    return events;
  });

  module.factory('EventBus', [
    '$log',
    '$rootScope',
    'EventTypes',
    function ($log, $rootScope, EventTypes) {

      var listenersMap;

      // Returns a map with eventType as the key and an empty array
      // as each value.
      function initMap() {
        var result = {};
        angular.forEach(EventTypes, function(value, key) {
          result[key] = [];
        });
        return result;
      }

      /**
      * Returns a function that can be used to deregister an event
      * listener, this is returned to the user when they call
      * registerListener().
      */
      function createDeRegistrationFunction(eventType, callback) {
        var bucket = listenersMap[eventType];
        return function() {
          $log.debug('dereg function for: %O / %O - listenersMap=%O', eventType, callback, listenersMap);
          for (var i = 0; i < bucket.length; i++) {
            if (bucket[i] === callback) {
              // Not removing the item from the array provides thread
              // safety since the index of other callbacks in the array
              // won't be shifted. This could potentially cause a memory-leak
              // though.
              bucket[i] = function() {};
              $log.debug('registered listener: event: %O, callback: %O, listenersMap: %O', event, callback, listenersMap);
              return;
            }
          }
        };
      }

      listenersMap = initMap();

      return {
        broadcast: function(event, payload) {
          if (!EventTypes[event]) {
            throw new TypeError('event must be a valid event from EventTypes service');
          }
          if (!payload) {
            throw new TypeError('Empty param payload');
          }

          // Run the event through registered listeners before broadcasting.
          angular.forEach(listenersMap, function(value, key) {
            listenersMap[key].forEach(function(listener) {
              listener(payload);
            });
          });

          $rootScope.$broadcast(event, payload);
        },
        registerListener: function(event, callback) {
          if (!angular.isFunction(callback)) {
            throw new TypeError('Listener callback must be a function');
          }

          if (!EventTypes[event]) {
            throw new TypeError('event must be a valid event from EventTypes service');
          }

          listenersMap[event].push(callback);
          $log.debug('registered listener: event: %O, callback: %O', event, callback);
          // Returns a function that can be used to deregister the listener.
          return createDeRegistrationFunction(event, callback);
        }
      };
    }
  ]);

  module.factory('EventBusWebSocketListener', [
    '$log',
    function($log) {
      return {
        onMessage: function(m) {
          $log.debug('EBWSL Heard Message: %O', m);
        }
      };
    }
  ]);

})();
