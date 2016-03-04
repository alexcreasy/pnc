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

  var module = angular.module('pnc.common.directives');

  /**
   * @ngdoc directive
   * @name pnc.common.directives:pncBuildz
   * @restrict E
   * @description
   * @example
   * @author Alex Creasy
   */
  module.directive('pncBuildz', [
    '$log',
    'BuildsDAO',
    'UserDAO',
    'eventTypes',
    function ($log, BuildsDAO, UserDAO, eventTypes) {

      function link(scope, elem, attrs, ctrl) {
        $log.debug('%O, %O, %O, %O', scope, elem, attrs, ctrl);

        function convertEventToResource(eventPayload) {
          $log.debug('eventPayload === %O', eventPayload);

          var resource = {
            id: eventPayload.id,
            status: eventPayload.buildCoordinationStatus,
            buildConfigurationId: eventPayload.buildConfigurationId,
            buildConfigurationName: eventPayload.buildConfigurationName,
            startTime: eventPayload.buildStartTime,
            endTime: eventPayload.buildEndTime,
            userId: eventPayload.userId,
            username: null
          };
          UserDAO.get({ userId: eventPayload.userId }).$promise.then(function (user) {
            resource.username = user.username;
          });
          return resource;
        }


        function eventHandler(event, payload) {
          ctrl.insert(convertEventToResource(payload));
        }

        ctrl.setTitle('Builds');

        var page = BuildsDAO.getPaged();
        $log.debug('page==%O', page);
        ctrl.setPage(page);
        page.$promise.then(function() {
          scope.$on(eventTypes.BUILD_STARTED, eventHandler);
          scope.$on(eventTypes.BUILD_FINISHED, eventHandler);
        });
      }

      return {
        restrict: 'EA',
        require: '^pncBuildzPanel',
        link: link
      };
    }
  ]);

})();
