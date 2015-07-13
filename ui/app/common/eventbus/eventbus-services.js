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

  /**
   * @ngdoc constant
   * @name pnc.common.eventBus:eventTypes
   * @description
   * An enumeration of events
   *
   */
  module.constant('eventTypes', Object.freeze({

    BUILD_STATUS: 'BUILD_STATUS'

  }));

  module.factory('eventBroadcastingWebSocketListener', [
    '$log',
    '$rootScope',
    'eventTypes',
    function($log, $rootScope, eventTypes) {

      // Temporary shim to reformat messages until backend work is completed.
      function messageShim(message) {
       return {
         eventType: eventTypes.BUILD_STATUS,
         payload: message.payload
       };
      }

      return {

        onMessage: function(message) {
          var _message = messageShim(message);

          if (eventTypes[_message.eventType]) {
            $log.debug('Broadcasting Event: %O', _message);
            $rootScope.$broadcast(_message.eventType, _message.payload);
          } else {
            $log.warn('Received unrecognised event on socket: %O', _message);
          }
        },

        onOpen: function() {
          $log.info('WebSocket opened successfully');
        },

        onClose: function() {
          $log.info('WebSocket closed');
        },

        onError: function() {
          $log.error('WebSocket Error: ', arguments);
        }

      };
    }
  ]);

  module.factory('eventNotifier', [
    'Notifications',
    'PncRestClient',
    function(Notifications, PncRestClient) {

      function onBuildStart(payload) {
        Notifications.info('Build #' + payload.id + ' in progress');
      }

      function onBuildFinish(payload) {
        PncRestClient.Record.get({ recordId: payload.id }).$promise.then(
          function(result) {
            switch(result.status) {
              case 'SUCCESS':
                Notifications.success('Build #' + payload.id + ' completed');
                break;
              case 'FAILED':
              case 'SYSTEM_ERROR':
                Notifications.warn('Build #' + payload.id + ' failed');
                break;
            }
          }
        );
      }

      return {
        notify: function(event, payload) {
          switch(payload.buildStatus) {
            case 'REPO_SETTING_UP':
              onBuildStart(payload);
              break;
            case 'DONE':
            case 'REJECTED':
              onBuildFinish(payload);
              break;
          }
        }
      };
    }
  ]);

})();
