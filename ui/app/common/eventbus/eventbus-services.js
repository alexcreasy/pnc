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

      BUILD_STATE_FINAL: 'BUILD_STATE_FINAL'

    };

    events.prototype.forEach = function(fn) {
      var e = events.getOwnPropertyNames();
      for (var i = 0; i < e.length; i++) {
        fn(e[i]);
      }
    };
    // Make events immutable.
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
        var eventTypesArr = EventTypes.getOwnPropertyNames();
        for (var i = 0; i < eventTypesArr.length; i++) {
          result[eventTypesArr[i]] = [];
        }
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
          for (var i = 0; i < bucket.length; i++) {
            if (bucket[i] === callback) {
              // Not removing the item from the array provides thread
              // safety since the index of other callbacks in the array
              // won't be shifted.
              bucket[i] = function() {};
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

          // Run the event through registered listeners before broadcasting.

          listenersMap[0].forEach(function(listener) {
            listener(payload);
          });

          $rootScope.broadcast(event, payload);
        },
        registerListener: function(event, callback) {
          if (callback.typeof !== 'function') {
            throw new TypeError('Listener callback must be a function');
          }

          if (!EventTypes[event]) {
            throw new TypeError('event must be a valid event from EventTypes service');
          }

          listenersMap[event].push(callback);

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
