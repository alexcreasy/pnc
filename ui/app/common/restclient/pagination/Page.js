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

  var module = angular.module('pnc.common.restclient.pagination');

  /**
   * @author Alex Creasy
   */
  module.factory('pageFactory', function() {

    var Page = function(config, index, size, total) {
      this.$config = config;
      this.pageIndex = index;
      this.pageSize = size;
      this.totalPages = total;
    };

    Page.prototype.getPageIndex = function() {
      return this.pageIndex;
    };

    Page.prototype.getPageSize = function() {
      return this.pageSize;
    };

    Page.prototype.getTotalPages = function() {
      return this.totalPages;
    };

    Page.prototype.hasPage = function(index) {
      return 0 <= index && index < this.totalPages;
    };

    Page.prototype.getPage = function(index) {
      if (!this.hasPage(index)) {
        throw new RangeError('Page index (' + index + ') out of bounds, totalPages=' + this.totalPages);
      }
      var config;
      angular.copy(this.$config, config);
      config.params.pageIndex = index;
      return $http(config);
    };

    Page.prototype.hasNextPage = function() {
      return this.hasPage(this.totalPages + 1);
    };

    Page.prototype.getNextPage = function() {
      return this.getPage(this.pageIndex + 1);
    };

    Page.prototype.hasPreviousPage = function() {
      return this.hasPage(this.totalPages - 1);
    };

    Page.prototype.getPreviousPage = function() {
      return this.getPage(this.pageIndex - 1);
    };

    Page.prototype.getFirst = function() {
      return this.getPage(0);
    };

    Page.prototype.getLast = function() {
      return this.getPage(this.totalPages - 1);
    };




    var pageFactory = {};

    pageFactory.newPage = function(response) {
      var page = new Page(response);

      var x = {};
      x.data = response.data.content;
      x.prototype = page;

      return x;
    }

    return pageFactory;
  });

})();
