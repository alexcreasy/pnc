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
  var app = angular.module('pnc');

  app.provider('keycloak', function() {
    var keycloak;

    return {
      setKeycloak: function(kc) {
        keycloak = kc;
      },

      useMockKeycloak: function() {
        keycloak = newMockKeycloak();
      },

      $get: ['$log', function($log) {
        $log.debug('keycloak=%O', keycloak);
        return keycloak;
      }]
    };
  });

  app.factory('authService', [
    '$window',
    'keycloak',
    function($window, kc) {
      var keycloak = kc;

      return {
        isAuthenticated: function() {
          return keycloak.authenticated;
        },

        getPrinciple: function() {
          return keycloak.idTokenParsed.preferred_username; // jshint ignore:line
        },

        logout: function() {
          keycloak.logout({ redirectUri: $window.location.href });
        }
      };
    }
    ]);

  app.factory('httpAuthenticationInterceptor', [
    '$q',
    '$log',
    'keycloak',
    function ($q, $log, keycloak) {

      function addAuthHeaders(config, token) {
        config.headers = config.headers || {};
        config.headers.Authorization = 'Bearer ' + token;
      }

      return {

        request: function (config) {
          if (keycloak && keycloak.token) {

            // Prevents screen flicker by directly returning the config
            // object if the keycloak token does not need to be refreshed.
            if (!keycloak.isTokenExpired(5)) {

              addAuthHeaders(config, keycloak.token);
              return config;

            } else {

              var deferred = $q.defer();

              keycloak.updateToken(0).success(function () {
                addAuthHeaders(config, keycloak.token);
                deferred.resolve(config);
              }).error(function () {
                deferred.reject('Failed to refresh token');
              });

              return deferred.promise;
            }

            return config;

          }
        }

      };
    }
  ]);

  app.factory('httpResponseInterceptor', [
    '$log',
    'Notifications',
    'keycloak',
    function($log, Notifications, keycloak) {

      var defaultNotifications = {
        success: function(response) {
          if (response.config.method !== 'GET') {
            Notifications.success(response.status + ': ' + response.statusText);
          }
        },
        error: function(response) {
          Notifications.httpError('HTTP Error', response);
        }
      };

      function getNotifiers(response) {
        // Use defaults for success and error if no notification is specified
        if (!response.config || !response.config.hasOwnProperty('notification')) {
          return {
            success: function() {
              defaultNotifications.success(response);
            },
            error: function() {
              defaultNotifications.error(response);
            }
          };
        }

        // notification property is present but falsey, no notifications
        // are to be displayed for success or error cases.
        if (!response.config.notification) {
          return {
            success: function() {},
            error: function() {}
          };
        }

        var notifiers = defaultNotifications;

        if (response.config.notification.hasOwnProperty('success')) {
          if (angular.isFunction(response.config.notification.success)) {
            notifiers.success = function() {
              response.config.notification.success(response);
            }
          }
          if (!response.config.notification.success) {
            notifiers.sucess = function() {};
          }
        }

        if(response.config.notification.hasOwnProperty('error')) {
          if (angular.isFunction(response.config.notification.error)) {
            notifiers.error = function() {
              response.config.notification.error(response);
            }
          }
          if (!response.config.notification.error) {
            notifiers.error = function() {};
          }
        }

        return notifiers;
      }

      return {
        response: function(response) {
          getNotifiers(response).success();
          return response;
        },

        responseError: function(response) {
          switch(response.status) {
            case 0:
              Notifications.error('Unable to connect to server');
              break;
            case 401:
              keycloak.login();
              break;
            default:
              getNotifiers(response).error();
            break;
          }
          return response;
        }

      };
    }
  ]);

  function newMockKeycloak() {

    function nullFunction() {
      return null;
    }

    return {

      authenticated: false,
      logout: nullFunction,
      login: nullFunction,
      token: 'token',

      isTokenExpired: function() {
        return false;
      },

      idTokenParsed: {
        preferred_username: 'Authentication Disabled' // jshint ignore:line
      },

    };
  }

})();
