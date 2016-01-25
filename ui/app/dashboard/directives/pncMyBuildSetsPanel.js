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

  module.factory('PageInsertWrapper', function() {

    function PageInsertWrapper(page) {
      this.page = page;
    }

    var compare = function(itemA, itemB) {
      return itemA.id - itemB.id;
    };

    var insertIntoPage = function(item, page) {
      var finished = false;
      page.data.forEach(function(value, index) {
        if (index === 0 || finished) {
          return;
        }

        if (compare(item, page.data[index - 1]) > 0 && compare(item, value) < 0) {
          // Insert into the page at the current index
          page.data.splice(index, 0, value);

          // Ensure the page doesn't grow in size
          if (page.data.length > page.getPageSize()) {
            page.data.pop();
          }

          finished = true;
        }
      });
    }

    PageInsertWrapper.prototype.addIfVisible = function(item) {
      var page = this.page;
      // Allowing override of compare in future will enable 
      // this to be made more generic if needed.

      var index = _.findIndex(page.data, { id: item.id });

      if (index > -1) {
        // If the item is already visible on the page, replace the existing
        // reference in the page to point to the new item.
        page.data[index] = item;
      }
      else if (page.getPageIndex() === 0 && compare(item, page.data[0]) < 0)) {
        // If the user is currently viewing the first page and the item belongs
        // at the top of the page, add it.
        page.data.unshift(item);

        // Ensure the page doesn't grow in size
        if (page.data.length > page.getPageSize()) {
          page.data.pop();
        }
      }
      else if (compare(item, page.data[0]) > 0 && compare(item, page.data[page.length - 1] < 0) {
        // If the item is within the boundaries of this page add it.
        insertIntoPage(item, page);
      }
    }

    return PageInsertWrapper;
  });

  module.directive('pncAbstractMyBuildPanel', [
    function() {
      function pncAbstractMyBuildPanelCtrl($scope, authService, PageInsertWrapper) {
        var self = this;
        var page,
            pageWrapper,
            buildStartEvent,
            buildFinishEvent,
            getOne,
            getPage;

        self.bootstrap = function(buildStartEventType, buildFinishEventType, getOneFn, getPageFn) {
          buildStartEvent = buildStartEventType;
          buildFinishEvent = buildFinishEventType;
          getOne = getOneFn;
          getPage = getPageFn;
        };

        self.getData = function() {
          return page.data;
        };

        self.show = function() {
          return authService.isAuthenticated();
        };

        function updateOnStart(event, payload) {
          $log.debug('updateOnStart >> event=[%O], payload=[%O]', event, payload);

          if (payload.userId !== authService.getPncUser().id) {
            $log.debug('pncMyBuildSetsPanel::updateOnStart() dropping payload=[%O] as current userId [%d] does not match', payload, authService.getPncUser().id);
            return;
          }

          getOne(payload.id).then(function(result) {
            pageWrapper.addIfVisible(result);
          });
        }

        function updateOnFinish(event, payload) {
          $log.debug('updateOnFinish >> event=[%O], payload=[%O]', event, payload);

          if (payload.userId !== authService.getPncUser().id) {
            $log.debug('pncMyBuildSetsPanel::updateOnFinish() dropping payload=[%O] as current userId [%d] does not match', payload, authService.getPncUser().id);
            return;
          }

          getOne(payload.id).then(function(result) {
            pageWrapper.addIfVisible(result);
          });
        }

        function init() {
          page = getPage();
          pageWrapper = new PageInsertWrapper(page);
          $scope.$on(buildStartEvent, updateOnStart);
          $scope.$on(buildFinishEvent, updateOnFinish);
        }

        if (authService.isAuthenticated()) {
          init();
        }
      }

      return {
        restrict: 'EA',
        scope: {},
        controller: 'pncAbstractMyBuildPanelCtrl',
      }
    }
  ]);

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
        require: '^pncAbstractMyBuildPanel',
        link: function (scope, element, attrs, ctrl) {

        }
      }
    }
  ]);

})();
