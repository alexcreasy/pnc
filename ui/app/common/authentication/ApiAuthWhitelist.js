/*
 * JBoss, Home of Professional Open Source.
 * Copyright 2014-2019 Red Hat, Inc., and individual contributors
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

  /**
   * Controls which remote APIs will be sent the PNC authentication token.
   */

  angular.module('pnc.common.authentication').provider('ApiAuthWhitelist',[
    function () {
      const whitelist = [];

      function add(origin) {


        whitelist.push(origin);
      }

      function matches(request) {
        let policyMatches = 0;

        for (policy of whitelist) {
          if (matchesOrigin(request, policy) && matchesMethod(request, policy)) {
            policyMatches++;
          }
        }

        if (policyMatches > 1) {
          throw new Error('Multiple policies match this request, check your configuration');
        }

        return policyMatches === 1;
      }

      function matchesOrigin(request, policy) {
        const reqOrigin = new URL(request.url).origin;
        const policyOrigin = new URL(policy.origin).origin;

        return reqOrigin === policyOrigin;
      }

      function matchesMethod(request, policy) {
        let result = false;

        const reqMethod = request.methods.toUpperCase();

        if (angular.isString(policy.methods))
        {
          const policyMethod = policy.methods.toUpperCase();

          switch (policyMethod) {
            case 'ALL':
              result = true;
              break;
            case 'NOT-GET':
              result = reqMethod !== 'GET';
              break;
          }
        }
        else if (angular.isArray(policy.methods))
        {
          return policy.methods.find(policyMethod => policyMethod.toUpperCase() === reqMethod);
        }
        else
        {
          // Shouldn't arrive here unless input validation is broken.
          throw new TypeError('policy.methods must be a string or an array of strings');
        }

        return result;
      }

      function $get() {
        return Object.freeze({
          matches
        });
      }

      return Object.freeze({
        add,
        $get
      });
    }
  ]);

})();
