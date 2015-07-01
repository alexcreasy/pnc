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

  module.factory('PncEventTypes', function() {
    var events = {

      'BUILD_STARTED': 'BUILD_STARTED',

      'BUILD_COMPLETED': 'BUILD_COMPLETED',

      'BUILD_FAILED': 'BUILD_FAILED',

      'BUILD_STATE_FINAL': 'BUILD_STATE_FINAL'

    };

    // Make events immutable.
    Object.freeze(events);
    return events;
  });

  module.factory('EventBus', [
    '$log',
    '$rootScope',
    'EventBusWebSocketListener',
    function ($log, $rootScope, EventBusWebSocketListener) {
      return {
        nudge: function() {
          EventBusWebSocketListener.onMessage({ name: 'bleh' });
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
