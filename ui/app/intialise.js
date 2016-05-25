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
(function(Keycloak) {
  'use strict';

  var CONFIG_OVERIDE = {
    'pnc-url': '/pnc-rest/rest',
    'pnc-notifications-url': 'ws://' + window.location.host + '/pnc-rest/ws/build-records/notifications',
    'da-url': '/da/rest/v-0.4',
    'da-import-url': '/da-bcg/rest/v-0.3'
   };

  /**
   * Entrypoint to the application. Initializes the UI with the supplied
   * configuration. These paramaters can be accessed in the angular application
   * through the 'properties' service in the pnc.common.properties modules.
   *
   * @param config - An object containing configuration paramaters for the UI.
   * @author Alex Creasy
   */
  function bootstrap(config) {

    if (!config) {
      throw new Error('Bootstrap error: No configuration provided to UI');
    }

    angular.element(document).ready(function () {
      var keycloak;
      var kcInitParams = {
        onLoad: 'check-sso'
      };

      // In case PNC is running with authentication disabled we give the
      // keycloak library just enough paramaters to function. That way the UI
      // can run as normal without further modification.
      if (!config.keycloak) {
        config.keycloak = {
          url: 'none',
          clientId: 'none',
          realm: 'none'
        };
        // Stops the keycloak library trying to "phone home" after loading,
        // since there is no server to call.
        kcInitParams = undefined;
      }

      keycloak = new Keycloak(config.keycloak);

      // Prevents redirect to a 404 when attempting to login and
      // authentication is disabled on the PNC backend.
      if(config.keycloak.url === 'none') {
        keycloak.login = function () {
          console.warn('Authentication is disabled, keycloak.login ignored');
        };
      }

      // Configure the properties and keycloak services here as they
      // both depend on an asynchronous request being completed before
      // angular is bootstrapped.
      angular.module('pnc').config([
        'propertiesProvider',
        'keycloakProvider',
        function(propertiesProvider, keycloakProvider) {
          propertiesProvider.setProperties(config);
          keycloakProvider.setKeycloak(keycloak);
        }
      ]);

      keycloak.init(kcInitParams).success(function () {
        angular.bootstrap(document, ['pnc']);
      });
    });
  }

  bootstrap(CONFIG_OVERIDE);

})(Keycloak);
