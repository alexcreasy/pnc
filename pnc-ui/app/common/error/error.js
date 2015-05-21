'use strict';

(function() {

  var module = angular.module('pnc.error', ['pnc']);

  module.service('HttpErrorService', function($log) {
    var handlers = {};

    var defaultHandler = function(response) {
      $log.warn('No default HTTP error handler: %O', response);
    };

    this.registerDefaultHandler = function(func) {
      defaultHandler = func;
    };

    this.registerHandler = function(status, func) {
      handlers[status] = func;
    };

    this.handle = function(response) {
      if (handlers[response.status]) {
        handlers[response.status](response);
      } else {
        defaultHandler(response);
      }
    };
  });

  module.factory('HttpErrorInterceptor', function($q, HttpErrorService) {
    return function(promise) {
      return promise.then(function(response) {
        return response;
      }, function(response) {
        HttpErrorService.handle(response);
        return $q.reject(response);
      });
    };
  });

  module.config(function($httpProvider, Auth, HttpErrorService,
                         Notifications) {

    // Handle HTTP Code 401: Unauthorized.
    HttpErrorService.registerHandler(401, function(response) {
      //$log.warn('401 Unauthorized: %O', response);
      if (Auth.loggedIn) {
        // Probable session timeout.
        Auth.logout();
      } else {
        Auth.login();
      }
    });

    // Handle HTTP Code 403: Forbidden.
    HttpErrorService.registerHandler(403, function(response) {
      //$log.error('403: Forbidden');
      Notifications.error('403 Forbidden: %O', response);
    });

    $httpProvider.interceptors.push('HttpErrorInterceptor');
  });

})();
