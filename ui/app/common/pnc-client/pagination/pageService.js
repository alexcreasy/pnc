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

  var module = angular.module('pnc.common.pnc-client.pagination');

  /**
   * @ngdoc service
   * @name pnc.common.pnc-client.pagination:pageService
   * @description
   * A service that provides functions for handling paginated resources fetched
   * from RESTful services.
   * @author Alex Creasy
   */
  module.service('pageService', [
    '$log',
    '$injector',
    function ($log, $injector) {

      /**
       * Decorates an array with pagination functions.
       *
       * @param {Object} meta - Meta data describing the page to be created.
       * The object has following properties:
       * - index {Number} - the index of the current page
       * - size  {Number} - the size of the current page
       * - total {Number} - the total number of pages available
       * - Resource {Object} [optional] - A resource "class" object created using
       *   the $resource function of the ngResource module. If present all
       *   items in a fetched page will be converted to the given resource type
       *   see: https://docs.angularjs.org/api/ngResource/service/$resource
       * @param {Object} config - the $http config object used to fetch the
       * data for the page being created.
       * see: https://docs.angularjs.org/api/ng/service/$http#usage
       * @param {Array} [optional] dest - The destination array (i.e. the page to
       * be decorated), if no supplied a new empty array will be used.
       * @return {Array} the supplied, or newly created page array.
       */
      this.pagify = function pagify(meta, config, dest) {
        var page = dest || [];

        var fields = {
          index: meta.pageIndex,
          size: meta.pageSize,
          total: meta.totalPages,
          Resource: meta.Resource,
          config: angular.copy(config)
        };

        /**
         * Gets the $http config object used to fetch the page.
         *
         * @return {Object} The $http config object
         * see: https://docs.angularjs.org/api/ng/service/$http#usage
         */
        page.getConfig = function () {
          return angular.copy(fields.config);
        };

        /**
         * Gets the index of the page
         *
         * @return {Number} the page index.
         */
        page.getPageIndex = function () {
          return fields.index;
        };

        /**
         * Gets the size of the page
         *
         * @return {Number} the page size
         */
        page.getPageSize = function () {
          return fields.size;
        };

        /**
         * Gets the total number of pages available for the resource
         *
         * @return {Number} the total page count
         */
        page.getTotalPages = function () {
          return fields.total;
        };

        /**
         * Fetches a page from the same resource using the given paramaters. This
         * may be useful for filtering pages or otherwise supplying additional
         * querystring paramaters to this resource.
         *
         * @param {Object} params - Map of strings or objects which will be
         * serialized and appended to the http request as GET parameters.
         * @return {Promise} A promise that will be resolved with a page object
         * representing the requested resource.
         */
        page.fetch = function (params) {
          var config = page.getConfig();
          config.params = params;

          return $injector.get('$http')(config).then(function(response) {
            var page;
            var meta = {
              pageIndex: response.data.pageIndex,
              pageSize: response.data.pageSize,
              totalPages: response.data.totalPages,
            };

            if (fields.Resource) {
              meta.Resource = fields.Resource;
            }

            page = pagify(meta, response.config);

            response.data.forEach(function(item) {
              page.push(fields.Resource ? new fields.Resource(item) : item);
            });

            return page;
          });
        };

        /**
         * Fetches the page with the specified index.
         *
         * @param {Number} index - the page index to fetch.
         * @return {Promise} A promise that will be resolved with a page object
         * representing the requested resource.
         */
        page.getPage = function (index) {
          var params;

          if (!page.hasPage(index)) {
            throw new RangeError('Requested page index: ' + index + ' out of bounds');
          }

          params = page.getConfig().params || {};
          params.pageIndex = index;
          return page.fetch(params);
        };

        /**
         * Fetches the first page.
         *
         * @return {Promise} A promise that will be resolved with a page object
         * representing the requested resource.
         */
        page.getFirstPage = function () {
          return page.getPage(0);
        };

        /**
         * Fetches the last page.
         *
         * @return {Promise} A promise that will be resolved with a page object
         * representing the requested resource.
         */
        page.getLastPage = function () {
          return page.getPage(fields.total - 1);
        };

        /**
         * Fetches the next page.
         *
         * @return {Promise} A promise that will be resolved with a page object
         * representing the requested resource.
         */
        page.getNextPage = function () {
          return page.getPage(fields.index + 1);
        };

        /**
         * Fetches the previous page.
         *
         * @return {Promise} A promise that will be resolved with a page object
         * representing the requested resource.
         */
        page.getPreviousPage = function () {
          return page.getPage(fields.index - 1);
        };

        /**
         * Check if a given page index exists.
         *
         * @return {Boolean} Returns true if the specified page index exists.
         * Otherwise returns false.
         */
        page.hasPage = function (index) {
          return index >= 0 && index < fields.total;
        };

        /**
         * Check if there is another page after the current one.
         *
         * @return {Boolean} Returns true if the nexy page index exists.
         * Otherwise returns false.
         */
        page.hasNext = function () {
          return page.hasPage(fields.index + 1);
        };

        /**
         * Check if there is another page before the current one.
         *
         * @return {Boolean} Returns true if the page index immediately prior to
         * the current one exists. Otherwise returns false.
         */
        page.hasPrevious = function () {
          return page.hasPage(fields.index - 1);
        };

        return page;
      };
    }
  ]);

})();
