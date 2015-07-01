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

  var module = angular.module('pnc.common.eventbus', [
    'ui.router',
    'pnc.common.websockets'
  ]);

  module.config([
    '$stateProvider',
    'WebSocketsProvider',
    function ($stateProvider, WebSocketsProvider) {

      WebSocketsProvider.registerListener('EventBusWebSocketListener');
      WebSocketsProvider.setEndpoint('ws://localhost:8080/pnc-rest/ws/build-records/notifications');

      $stateProvider.state('event', {
        abstract: true,
        url: '/event',
        views: {
          'content@': {
            templateUrl: 'common/templates/single-col.tmpl.html'
          }
        }
      });

      $stateProvider.state('event.test', {
        url: '/test',
        controller: 'EventTestController',
        controllerAs: 'eventCtrl',
        templateUrl: 'common/eventbus/views/eventbus.test.html'
      });
    }
  ]);

  module.run(function(WebSockets) {
    console.log(WebSockets);
  });

})();
