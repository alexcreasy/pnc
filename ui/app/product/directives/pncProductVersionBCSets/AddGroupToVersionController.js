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

  angular.module('pnc.product').controller('AddGroupToVersionController', [
    '$log',
    'product',
    'version',
    'BuildConfigurationSet',
    'rsqlQuery',
    function ($log, product, version, BuildConfigurationSet, rsqlQuery) {
      var ctrl = this;

      $log.debug('product %O version %O', product, version);

      ctrl.product = product;
      ctrl.version = version;

      ctrl.groups = angular.copy(version.buildConfigurationSets) || [];

      ctrl.addGroup = function (group) {
        ctrl.groups.push(group);
      };

      ctrl.removeGroup = function (group) {
        ctrl.groups.splice(ctrl.groups.indexOf(group), 1);
      };

      ctrl.save = function () {
        ctrl.$close(ctrl.groups);
      };

      ctrl.close = function () {
        ctrl.$dismiss();
      };

      ctrl.onSelect = function ($item) {
        ctrl.addGroup($item);
        ctrl.selected = undefined;
      };

      ctrl.fetchGroups = function ($viewValue) {
        return BuildConfigurationSet.query( { q: rsqlQuery().where('name').like($viewValue + '%').end() }).$promise.then(function (page) {
          return page.data;
        });
      };

      ctrl.config = {
       selectItems: false,
       multiSelect: false,
       dblClick: false,
       selectionMatchProp: 'id',
       showSelectBox: false,
      };

      ctrl.actionButtons = [
        {
          name: 'Remove',
          title: 'Remove this Build Group from ' + product.name + ': ' + version.version,
          actionFn: function (action, object) {
            if (action.name === 'Remove') {
              ctrl.removeGroup(object);
            }
          }
        }
      ];
    }
  ]);

})();
