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

  var module = angular.module('pnc.dashboard');

  /**
   * @ngdoc directive
   * @name pnc.dashboard:pncMyBuildSetsPanel
   * @restrict E
   * @description
   * @example
   * @author Alex Creasy
   */
  module.directive('pncMyBuildSetsPanel', [
    '$log',
    'authService',
    'PageFactory',
    'BuildConfigurationSetRecordDAO',
    'BuildRecordDAO',
    'UserDAO',
    'eventTypes',
    function ($log, authService, PageFactory, BuildConfigurationSetRecordDAO,
              BuildRecordDAO, UserDAO, eventTypes) {
      return {
        restrict: 'E',
        templateUrl: 'dashboard/directives/pnc-my-build-sets-panel.html',
        scope: {},
        link: function (scope) {

          scope.page = {};

          scope.show = function() {
            return authService.isAuthenticated();
          };

          function updateOnStart(event, payload) {
            $log.debug('updateOnStart >> event=[%O], payload=[%O]', event, payload);

            if (payload.userId !== authService.getPncUser().id) {
              $log.debug('pncMyBuildSetsPanel::updateOnStart() dropping payload=[%O] as current userId [%d] does not match', payload, authService.getPncUser().id);
              return;
            }

            if (scope.page.getPageIndex() !== 0) {
              $log.debug('pncMyBuildSetsPanel::updateOnStart() dropping payload=[%O] as not viewing first page');
              return;
            }

            // scope.page.data.unshift({
            //   id: payload.id,
            //   buildConfigurationSetId: payload.buildSetConfigurationId,
            //   buildConfigurationSetName: payload.buildSetConfigurationName,
            //   startTime: payload.buildSetStartTime,
            //   endTime: payload.buildSetEndTime,
            //   status: 'BUILDING'
            // });
            BuildConfigurationSetRecordDAO.get({ recordId: payload.id}).$promise.then(function(result) {
                $log.debug('Adding content to view: [%O]', result);
                scope.page.data.unshift(result);
                if (scope.page.data.length > scope.page.getPageSize()) {
                  scope.page.data.pop();
                }
            });
          }

          function updateOnFinish(event, payload) {
            $log.debug('updateOnFinish >> event=[%O], payload=[%O]', event, payload);

            if (payload.userId !== authService.getPncUser().id) {
              $log.debug('pncMyBuildSetsPanel::updateOnFinish() dropping payload=[%O] as current userId [%d] does not match', payload, authService.getPncUser().id);
              return;
            }

            var resource = _.find(scope.page.data, { id: payload.id });

            if (!_.isUndefined(resource)) {
              // resource.endTime = payload.buildSetEndTime;
              // resource.status = payload.buildStatus;
              BuildConfigurationSetRecordDAO.get({ recordId: payload.id}).$promise.then(function(result) {
                  $log.debug('Adding content to view: [%O]', result);
                  _.remove(scope.page.data, { id: payload.id });

                  if (scope.page.getPageIndex() !== 0) {
                    scope.page.data.unshift(result);
                    if (scope.page.data.length > scope.page.getPageSize()) {
                      scope.page.data.pop();
                    }
                  }
              });
            }
          }

          function getPage() {
            return PageFactory.build(BuildConfigurationSetRecordDAO, function (pageIndex, pageSize, searchText) {
              return UserDAO.getAuthenticatedUser().$promise.then(function(result) {
                return BuildConfigurationSetRecordDAO._getByUser({
                   userId: result.id,
                   pageIndex: pageIndex,
                   pageSize: pageSize,
                   search: searchText,
                   sort: 'sort=desc=id'
                }).$promise;
              });
            });
          }

          function init() {
            scope.page = getPage();

            scope.$on(eventTypes.BUILD_SET_STARTED, updateOnStart);
            scope.$on(eventTypes.BUILD_SET_FINISHED, updateOnFinish);
          }

          if (authService.isAuthenticated()) {
            init();
          }
        }
      };
    }
  ]);

})();
