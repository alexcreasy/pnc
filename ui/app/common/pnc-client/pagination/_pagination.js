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

  var module = angular.module('pnc.common.pnc-client.pagination', [
    'ngResource'
  ]);

  module.config([
    '$provide',
    '$resourceProvider',
    function ($provide, $resourceProvider) {

      function isPage(object) {
        return angular.isDefined(object.pageIndex) &&
            angular.isDefined(object.pageSize) &&
            angular.isDefined(object.totalPages) &&
            angular.isDefined(object.content);
      }

      /**
       * Decorate the $resource service to register pagination interceptors with
       * correct resource actions. This also allows us to grab the resource
       * constructor so we can pass it to the created page.
       */
      $provide.decorator('$resource', function ($delegate) {
        return function (url, paramDefaults, actions, options) {
          var Resource;

          // Add all default actions that haven't been explicitly overridden (they
          // will already be in `actions` if they have). So that we can add
          // a pagination interceptor where appropriate.
          Object.keys($resourceProvider.defaults.actions).forEach(function (key) {
            if (!actions.hasOwnProperty(key)) {
              actions[key] = $resourceProvider.defaults.actions[key];
            }
          });

          // Add the response interceptor to the required actions as it lets us
          // grab the original resource object and the method the user invoked
          //    so we can make requests for new pages.
          Object.keys(actions).forEach(function (key) {
            var action = actions[key];

            if ((action.method === 'GET' || !action.method) && action.isArray) {

              // Transform the object response into an array with additional
              // meta data properties. This stops ngResource throwing an exception
              // because it got an Object when it expected an Array.
              action.transformResponse = function (data) {
                var jsonData,
                    response;

                // If the intercepted response isn't JSON leave it alone.
                try {
                  jsonData = JSON.parse(data);
                } catch (e) {
                  return data;
                }

                // Likewise if it's not a page leave it alone.
                if (isPage(jsonData)) {
                  response = jsonData.content;
                  response.pageIndex = jsonData.pageIndex;
                  response.pageSize = jsonData.pageSize;
                  response.totalPages = jsonData.totalPages;

                  return response;
                }

                return jsonData;
              };

              action.interceptor = action.interceptor || {};
              action.interceptor.response = function (response) {
                var pageService = angular
                    .injector(['pnc.common.pnc-client.pagination'])
                    .get('pageService');

                var meta = {
                  pageIndex: response.data.pageIndex,
                  pageSize: response.data.pageSize,
                  totalPages: response.data.totalPages,
                  Resource: Resource
                };

                pageService.pagify(meta, response.config, response.resource);
              };
            }
          });

          Resource = $delegate(url, paramDefaults, actions, options);
          return Resource;
        };
      });
    }
  ]);

})();
