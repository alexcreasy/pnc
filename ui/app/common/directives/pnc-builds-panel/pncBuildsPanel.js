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
   * @name pnc.common.directives:pncBuildzPanel
   * @restrict E
   * @description
   * @example
   * @author Alex Creasy
   */
  module.directive('pncBuildzPanel', function () {
    var DEFAULT_TEMPLATE = 'common/directives/pnc-builds-panel/pnc-builds-panel.html';

    function Controller($log) {
      var self = this;
      var page,
          title;

      self.getTitle = function () {
        return title;
      };

      self.setTitle = function (newTitle) {
        title = newTitle;
      };

      self.getPage = function () {
        return page;
      };

      self.setPage = function (newPage) {
        page = newPage;
      };

      self.insert = function (record) {

        // Inserts the record at the given index in the page.
        function insertAt(index, record) {
          page.data.splice(index, 0, record);
          // Ensure page doesn't grow in size.
          if (page.data.length > page.getPageSize()) {
            page.data.pop();
          }
        }

        $log.debug('pncBuildsPanel::insert [page == %O] [record == %O]', page, record);

        var replaceIndex = _.findIndex(page.data, { id: record.id });
        $log.debug('pncBuildsPanel::insert [replaceIndex == ' + replaceIndex + ']');

        if (replaceIndex !== -1) {
          // If the item is already visible in the page replace it.
          $log.debug('pncBuildsPanel::insert -> replacing record [%O] with [%O]', page.data[replaceIndex], record);
          page.data[replaceIndex] = record;
        } else {
          // Check at what position the record should be inserted on the current page.
          var insertIndex = _.sortedIndex(page, { id: record.id });
          $log.debug('pncBuildsPanel::insert [insertIndex == ' + insertIndex + '] [pageSize == ' + page.getPageSize() + '] [pageIndex == ' + page.getPageIndex() + ']');

          // If the record would lie in between the first and last
          // record on the current page. Insert. Edge case: handle first page
          // where records that fall at position 0 must always be inserted.
          if ((insertIndex > 0 && insertIndex < page.getPageSize()) ||
              (page.getPageIndex() === 0 && insertIndex === 0))  {
            $log.debug('pncBuildsPanel::insert -> inserting record [%O] at index [%d]', record, insertIndex);
            insertAt(insertIndex, record);
          } else if (page.getPageIndex() === page.getPageCount() - 1 && insertIndex === page.getPageSize()) {
            // Adding may cause an additional page to be created.
            page._rawData.totalPages++;
            page.onUpdate();
          }
        }
      };
    }

    return {
      restrict: 'E',
      templateUrl: function(elem, attrs) {
        return attrs.pncTemplate || DEFAULT_TEMPLATE;
      },
      scope: {},
      controller: ['$log', Controller],
      controllerAs: 'ctrl',
      bindToController: true
    };
  });

})();
