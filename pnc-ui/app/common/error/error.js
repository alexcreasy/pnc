'use strict';

(function() {

  var module = angular.module('pnc.error', ['pnc']);

  module.provider('httpError', function httpErrorProvider () {
    var handlers = {};

    var defaultHandler = function(response) {
      console.log('No default HTTP error handler: %O', response);
    };

    this.registerDefaultHandler = function(func) {
      defaultHandler = func;
    };

    this.registerHandler = function(status, func) {
      handlers[status] = func;
    };

    this.$get = function() {
      return {
        handle: function(response) {
          if (handlers[response.status]) {
            handlers[response.status](response);
          } else {
            defaultHandler(response);
          }
        }
      };
    };
  });

  module.factory('HttpErrorInterceptor', function($q, httpError) {
    return function(promise) {
      return promise.then(function(response) {
        return response;
      }, function(response) {
        httpError.handle(response);
        return $q.reject(response);
      });
    };
  });

  module.config(function($httpProvider, httpErrorProvider, $injector) {

    // Handle HTTP Code 401: Unauthorized.
    httpErrorProvider.registerHandler(401, function(response) {
      var $log = $injector.get('$log');
      var Auth = $injector.get('Auth');
      $log.warn('401 Unauthorized: %O', response);
      if (Auth.loggedIn) {
        // Probable session timeout.
        Auth.logout();
      } else {
        Auth.login();
      }
    });

    // Handle HTTP Code 403: Forbidden.
    httpErrorProvider.registerHandler(403, function(response) {
      var $log = $injector.get('$log');
      var Notifications = $injector.get('Notifications');
      $log.error('403: Forbidden');
      Notifications.error('403 Forbidden: %O', response);
    });

    $httpProvider.interceptors.push('HttpErrorInterceptor');
  });

})();
