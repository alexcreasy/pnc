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

  module.factory('BuildRecordNotifications', [
    '$log',
    '$websocket',
    'DEFAULT_WS_ENDPOINT',
    function ($log, $websocket, DEFAULT_WS_ENDPOINT) {

      var socket = $websocket(DEFAULT_WS_ENDPOINT);

      var callbacks = [];

      socket.onOpen(function () {
        $log.debug('Socket open.');
      });

      socket.onMessage(function (m) {
        var data = JSON.parse(m.data);
        $log.debug('Socket received ', data);
        callbacks.forEach(function (callback) {
          callback(data);
        });
      });

      return {
        listen: function (callback) {
          callbacks.push(callback);
        }
      };
    }
  ]);

})();
