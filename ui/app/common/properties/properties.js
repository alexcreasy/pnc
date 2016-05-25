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

  var module = angular.module('pnc.common.properties');

  /**
   * Serves runtime configuration properties.
   *
   * Usage:
   *
   * Setting the properties:
   * Inject propertiesProvider into a module config block and set the
   * properties by calling propertiesProvider.setProperties with on object
   * containing the key -> value pairs.
   *
   * Accessing the properties:
   * At runtime inject the properties service where required and call the
   * get method with the key.
   *
   * @author Alex Creasy
   */
  module.provider('properties', [
    function() {
      var propertyStore;

      /**
       * Setter method for setting the UI properties during the
       * config phase.
       */
      this.setProperties = function (propertyMap) {
        propertyStore = propertyMap;
      };

      this.$get = function() {
        var properties = {};

        /**
         * Returns the value associated with the given key.
         */
        properties.get = function(key) {
          return propertyStore[key];
        };

        return properties;
      };
    }
  ]);

})();
