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

  module.controller('EventTestController', [
    '$log',
    '$rootScope',
    function($log, $rootScope) {
      $log.debug('thisCtrl = %O', this);

      var data = [
        {
          id: 0,
          name: 'pnc-1.0',
          status: 'RUNNING',
        }, {
          id: 1,
          name: 'websocket-1.0',
          status: 'RUNNING'
        }, {
          id: 2,
          name: 'jboss-eap-1.0',
          status: 'RUNNING'
        }
      ];

      this.data = data;

      this.getData = function() {
        return data;
      };

      // this.changeWs = function(status) {
      //   broadcast('buildStatus', newEvent('completed', 1, status, 'acreasy'));
      // };


      this.update = function(event, payload) {
        data[payload.id].status = payload.status;
      };

      this.fireEvent = function(obj) {
        broadcast('buildStatus', newEvent('completed', obj.id, 'COMPLETED', 'acreasy'));
      };

      var newEvent = function(type, affectedId, newStatus, userId) {
        return {
          notificationType: type,
          id: affectedId,
          status: newStatus,
          userId: userId
        };
      };

      var broadcast = function(eventType, object) {
        $rootScope.$broadcast(eventType, object);
      };

      // this.update = function(obj) {
      //   broadcast('buildStatus', newEvent('completed', obj.id, 'COMPLETED', 'acreasy'));
      // };

      // $scope.$on('buildStatus', function(event, payload) {
      //   data[payload.id].status = payload.status;
      // });
    }
  ]);

})();
