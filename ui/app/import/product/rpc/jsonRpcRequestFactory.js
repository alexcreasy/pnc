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
(function () {
  'use strict';

  var module = angular.module('pnc.import.product');

  module.factory('jsonRpcRequestFactory', [
    '$log',
    '$q',
    '$websocket',
    function($log, $q, $websocket) {
      var factory = {};

      var JSON_RPC_VERSION = '2.0';
      var ID_PREFIX = 'request_';
      var WEBSOCKET_URI;

      /*
       * Factory private fields
       */

      var socket;
      var promiseMap = {};

      /*
       * Factory private methods
       */

       function sendOnSocket(msg) {
         if (factory.isConnected()) {
           return socket.send(msg);
         } else {
           return factory.connect().then(function () {
             return socket.send(msg);
           });
         }
       }

      function makeRpcRequest(request) {
        var deferred = $q.defer();

        request.id = _.uniqueId(ID_PREFIX);
        promiseMap[request.id] = deferred;

        sendOnSocket(request).catch(function () {
          deferred.reject({
            code: 0,
            message: 'Error connecting to server'
          });
        });

        return deferred.promise;
      }

      function handleRpcResponse(response) {
        if (!promiseMap.hasOwnProperty(response.id)) {
          // This code path should be unreachable!
          throw new Error('Illegal State: Received JSON-RPC response with unknown id: `' + response.id + '`');
        }

        var deferred = promiseMap[response.id];

        if (response.hasOwnProperty('error')) {
          deferred.reject(response.error);
        } else {
          deferred.resolve(response.result);
        }
      }

      /*
       * Factory public methods
       */

      /**
       *
       */
      factory.connect = function () {
        var deferred = $q.defer();
        var connecting = true;

        $log.debug('Attempting to connect to WebSocket at: ' + WEBSOCKET_URI);
        socket = $websocket(WEBSOCKET_URI);

        socket.onMessage(function(msg) {
          $log.debug('Received JSON RPC response: `%s`', msg);
          handleRpcResponse(msg);
        });

        socket.onOpen(function() {
          $log.debug('Connected to WebSocket at: ' + socket.socket.url);
          connecting = false;
          deferred.resolve();
        });

        socket.onError(function() {
          $log.error('Error with WebSocket connection to: ' + socket.socket.url);

          // Check that the error occurs during connection and not sometime after
          // connection (when the promise will already be resolved).
          if (connecting) {
            deferred.reject();
          }
        });

        socket.onClose(function() {
          $log.debug('Disconnected from WebSocket at: ' + socket.socket.url);
        });

        return deferred.promise;
      };

      /**
       *
       */
      factory.disconnect = function (force) {
        socket.close(force);
      };

      /**
       *
       */
      factory.isConnected = function () {
        if (_.isUndefined(socket)) {
          return false;
        }
        return socket.readyState === 1;
      };

      /**
       *
       */
      factory.newRequest = function (method, params) {
        var request = {
          jsonrpc: JSON_RPC_VERSION,
          method: method,
          params: params
        };

        return makeRpcRequest(request);
      };

      return factory;
    }
  ]);

})();
