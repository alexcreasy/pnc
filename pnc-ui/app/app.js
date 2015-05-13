'use strict';

(function() {
  var app = angular.module('pnc', [
    'ui.router',
    'pnc.Dashboard',
    'pnc.remote',
    'pnc.product',
    'pnc.project',
    'pnc.configuration',
    'pnc.record',
    'pnc.configuration-set',
    'pnc.websockets',
    'pnc.environment'
    ]);


  function Authenticator(spec) {
    var authenticated = false;
    var principle = null;
    var config = spec.keycloakConfig;
    var keycloak = null;

    this.isAuthenticated = function() {
      return authenticated;
    };

    this.getPrinciple = function() {
      return principle;
    };

    this.login = function() {
      keycloak = new Keycloak(config);
      keycloak.init({ onLoad: 'login-required' }).
        success(function () {
          authenticated = true;
          keycloak.loadUserProfile().success(function() {
              principle = keycloak.profile;
          }.error(function() {
            console.log("Error logging in");
          });


      $log.debug('User Profile: %O ', Auth.keycloak.profile);
    }).error(function() {
      $log.debug('failed to load user profile');
    });

      }

  }

  if (pnc.enableAuth) {
    console.log('** Authentication Enabled **');
    var auth = {};

    angular.element(document).ready(function () {
      var keycloak = new Keycloak('keycloak.json');
      auth.loggedIn = false;

      keycloak.init({ onLoad: 'login-required' }).success(function () {
        auth.loggedIn = true;
        auth.keycloak = keycloak;
        auth.logout = function() {
          auth.loggedIn = false;
          auth.keycloak = null;
          window.location = keycloak.authServerUrl + '/realms/PNC.REDHAT.COM/tokens/logout?redirect_uri=/pnc-web/index.html';
        };
        angular.bootstrap(document, ['pnc']);
      }).error(function () {
        window.location.reload();
      });

    });

    app.factory('Auth', function () {
      return auth;
    });

    app.factory('authInterceptor', function ($q, $log, Auth) {
      return {
        request: function (config) {
          var deferred = $q.defer();

          // if (config.url === 'rest/sender' || config.url === 'rest/registry/device/importer') {
          //   return config;
          // }

          if (Auth.keycloak && Auth.keycloak.token) {
            Auth.keycloak.updateToken(5).success(function () {
              config.headers = config.headers || {};
              config.headers.Authorization = 'Bearer ' + Auth.keycloak.token;

              deferred.resolve(config);
            }).error(function () {
              deferred.reject('Failed to refresh token');
            });
          }
          return deferred.promise;
        }
      };
    });

    app.config(function ($httpProvider) {
      $httpProvider.interceptors.push('authInterceptor');
    });
  } else {
    angular.bootstrap(document, ['pnc']);
  }

  app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode(false).hashPrefix('!');

    $stateProvider.state('error', {
      url: '/error',
      views: {
        'content@': {
          templateUrl: 'error.html'
        }
      }
    });

      // Redirect any unmatched URLs to the error state.
      $urlRouterProvider.otherwise('/error');
    }
  );

  app.run(['$rootScope', '$log', 'ENV',
    function($rootScope, $log, ENV) {
      $log.debug('Environment=%O', ENV);
      // Handle errors with state changes.
      $rootScope.$on('$stateChangeError',
        function(event, toState, toParams, fromState, fromParams, error) {
          $log.debug('Caught $stateChangeError: event=%O, toState=%O, ' +
            'toParams=%O, fromState=%O, fromParams=%O, error=%O',
            event, toState, toParams, fromState, fromParams, error);
        }
      );
    }
  ]);

})();
