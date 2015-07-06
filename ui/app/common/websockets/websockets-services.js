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

  var module = angular.module('pnc.common.websockets');

  /**
   * @ngdoc provider
   * @name webSocketBusProvider
   * @description
   * Use `webSocketBusProvider` to configure the `webSocketBus` service. This
   * provider offers methods for overiding the default WebSocket endpoint URL,
   * as well as registering and de-registering listener services.
   * @author Alex Creasy
   */
  module.provider('webSocketBus', [
    'DEFAULT_WS_ENDPOINT',
    function (DEFAULT_WS_ENDPOINT) {

      var socketUrl = DEFAULT_WS_ENDPOINT;
      var socket;
      var listenerServiceNames = [];
      var listeners = [];

      /**
      * @ngdoc method
      * @name webSocketBusProvider#registerListener
      * @param {string} serviceName The name of the service to register as a listener.
      * @description
      */
      this.registerListener = function(serviceName) {
        listenerServiceNames.push(serviceName);
      };

      /**
      * @ngdoc method
      * @name webSocketBusProvider#deRegisterListener
      * @param {string} serviceName The name of the service to de-register as a listener.
      * @description
      */
      this.deRegisterListener = function(serviceName) {
        throw new Error('Method not implemented', serviceName);
      };

      /**
      * @ngdoc method
      * @name webSocketBusProvider#setEndpoint
      * @param {string} url
      * @description
      * Sets the
      */
      this.setEndpoint = function(url) {
        if (!url) {
          throw new TypeError('Invalid parameter URL');
        }
        socketUrl = url;
      };


      /**
      * @ngdoc service
      * @name webSocketBus
      * @requires $log
      * @requires $injector
      * @requires $websocket
      * @description
      * description
      * @example
      * example
      * @author Jakub Senko
      * @author Alex Creasy
      */
      this.$get = [
        '$log',
        '$injector',
        '$websocket',
        function($log, $injector, $websocket) {
          /*
           * Use angular's dependency injector to retrieve all listener services.
           */
          for (var i = 0; i < listenerServiceNames.length; i++) {
            try {
              listeners.push($injector.get(listenerServiceNames[i]));
            } catch (e) {
              throw e;
            }
          }

          return {

            /**
            * @ngdoc method
            * @name webSocketBus#open
            * @description
            * Opens the WebSocket connection.
            */
            open: function() {
              $log.debug('Initiating WebSocket connection to: ' + socketUrl);
              socket = $websocket(socketUrl);

              socket.onOpen(function() {
                $log.info('Setup WebSocket connection to: ' + socketUrl);
              });

              socket.onClose(function() {
                $log.info('Closed WebSocket connection to: ' + socketUrl);
              });

              socket.onError(function() {
                $log.error('Error with WebSocket connection', arguments);
              });

              socket.onMessage(function(m) {
                var data = JSON.parse(m.data);
                listeners.forEach(function(listener) {
                  listener.onMessage(data);
                });
              });
            },

            /**
            * @ngdoc method
            * @name webSocketBus#close
            * @param {boolean} force If `true` will force close the socket.
            * @description
            * Closes the WebSocket connection.
            */
            close: function(force) {
              socket.close(force);
            }

          };
        }
      ];
    }
  ]);

})();
