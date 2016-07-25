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
  module.factory('Page', [
    '$log',
    '$http',
    function ($log, $http) {

      function Page(spec) {
        /**
         * The page contents
         */
        this.data = spec.data;

        /**
         * Gets the index of the current page
         *
         * @return {Number} the page index.
         */
        this.getPageIndex = function () {
          return spec.pageIndex;
        };

        /**
         * Gets the size of the current page
         *
         * @return {Number} the page size
         */
        this.getPageSize = function () {
          return spec.pageSize;
        };

        /**
         * Gets the total number of pages available for the resource
         *
         * @return {Number} the total page count
         */
        this.getTotalPages = function () {
          return spec.totalPages;
        };


        /**
         * Gets the $http config object used to fetch the page.
         *
         * @return {Object} The $http config object
         * see: https://docs.angularjs.org/api/ng/service/$http#usage
         */
        this.getConfig = function () {
          return angular.copy(spec.config);
        };

        this.getResource = function () {
          return spec.Resource;
        };
      }

      /**
       *
       */
      Page.prototype.forEach = function (callback) {
        this.data.forEach(function () {
          callback.apply(this.data, arguments);
        });
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
      Page.prototype.fetch = function (params) {
        var Resource = this.getResource();
        var config = this.getConfig();
        config.params = params;

        return $http(config).then(function(response) {
          var page = new Page({
            pageIndex: response.data.pageIndex,
            pageSize: response.data.pageSize,
            totalPages: response.data.totalPages,
            data: response.data.content,
            Resource: Resource,
            config: response.config
          });

          if (Resource) {
            for (var i = 0; i < page.data.length; i++) {
              page.data[i] = new Resource(page.data[i]);
            }
          }

          return page;
        });
      };

      /**
       * Check if a given page index exists.
       *
       * @return {Boolean} Returns true if the specified page index exists.
       * Otherwise returns false.
       */
      Page.prototype.hasPage = function (index) {
        return index >= 0 && index < this.getTotalPages();
      };

      /**
       * Fetches the page with the specified index.
       *
       * @param {Number} index - the page index to fetch.
       * @return {Promise} A promise that will be resolved with a page object
       * representing the requested resource.
       */
      Page.prototype.getPage = function (index) {
        var params;

        if (!this.hasPage(index)) {
          throw new RangeError('Requested page index: ' + index + ' out of bounds');
        }

        params = this.getConfig().params || {};
        params.pageIndex = index;
        return this.fetch(params);
      };

      /**
       * Check if there is another page after the current one.
       *
       * @return {Boolean} Returns true if the nexy page index exists.
       * Otherwise returns false.
       */
      Page.prototype.hasNext = function () {
        return this.hasPage(this.getPageIndex() + 1);
      };

      /**
       * Check if there is another page before the current one.
       *
       * @return {Boolean} Returns true if the page index immediately prior to
       * the current one exists. Otherwise returns false.
       */
      Page.prototype.hasPrevious = function () {
        return this.hasPage(this.getPageIndex() - 1);
      };

      /**
       * Fetches the first page.
       *
       * @return {Promise} A promise that will be resolved with a page object
       * representing the requested resource.
       */
      Page.prototype.getFirstPage = function () {
        return this.getPage(0);
      };

      /**
       * Fetches the last page.
       *
       * @return {Promise} A promise that will be resolved with a page object
       * representing the requested resource.
       */
      Page.prototype.getLastPage = function () {
        return this.getPage(this.getTotalPages() - 1);
      };

      /**
       * Fetches the next page.
       *
       * @return {Promise} A promise that will be resolved with a page object
       * representing the requested resource.
       */
      Page.prototype.getNextPage = function () {
        return this.getPage(this.getPageIndex() + 1);
      };

      /**
       * Fetches the previous page.
       *
       * @return {Promise} A promise that will be resolved with a page object
       * representing the requested resource.
       */
      Page.prototype.getPreviousPage = function () {
        return this.getPage(this.getPageIndex() - 1);
      };

      return Page;
    }
  ]);

})();
