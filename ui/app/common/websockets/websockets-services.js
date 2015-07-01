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

  module.provider('WebSockets', [
    'WEBSOCKET_CONFIG',
    function (WEBSOCKET_CONFIG) {
      console.log('configuring ws');
      var socketURI = WEBSOCKET_CONFIG.DEFAULT_ENDPOINT;
      var socket;
      var listenerServiceNames = [];
      var listeners = [];

      return {
        registerListener: function(serviceName) {
          listenerServiceNames.push(serviceName);
        },
        deregisterListener: function(name) {
          throw 'WebSocket.deregisterListener('+name+') not yet implemented';
        },
        setEndpoint: function(uri) {
          if (!uri) {
            throw 'Invalid WebSocket endpoint uri';
          }
          socketURI = uri;
        },
        $get: [
          '$log',
          '$injector',
          '$websocket',
          function($log, $injector, $websocket) {
            $log.info('starting WS service');
            /*
            * Initialise the WebSocket connection
            */
            socket = $websocket(socketURI);

            socket.onOpen(function() {
              $log.debug('WebSocket connection opened');
            });

            socket.onClose(function() {
              $log.debug('WebSocket connection closed');
            });

            socket.onError(function() {
              for (var i = 0; i < listeners.length; i++) {
                if (listeners[i].onError) {
                  listeners[i].onError();
                }
              }
              $log.error('Error with WebSocket connection', arguments);
            });

            socket.onMessage(function(m) {
              var data = JSON.parse(m.data);
              $log.debug('Message received on WebSocket: ', data);
              listeners.forEach(function(listener) {
                listener.onMessage(data);
              });
            });

            /*
            * Use angular's dependency injector to retrieve all listeners.
            */
            for (var i = 0; i < listenerServiceNames.length; i++) {
              try {
                listeners.push($injector.get(listenerServiceNames[i]));
              } catch (e) {
                throw new Error('Unable to add service "' +
                  listenerServiceNames[i] +
                  '" as a WebSocketListener error: ' + e );
              }
            }

            /*
            * Provide a websocket control object.
            */
            return {
              close: function(force) {
                socket.close(force);
              }
            };
          }
        ]
      };
    }
  ]);

})();
