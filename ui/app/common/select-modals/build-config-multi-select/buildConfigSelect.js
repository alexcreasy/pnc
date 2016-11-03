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

  angular.module('pnc.common.select-modals').component('buildConfigSelect', {
    bindings: {
      project: '<'
    },
    templateUrl: 'common/select-modals/build-config-multi-select/build-config-select.html',
    controller: ['Project', Controller]
  });

  function Controller(Project) {
    var $ctrl = this;

    // -- Controller API --

    $ctrl.config = config;
    $ctrl.actionButtons = actionButtons;
    $ctrl.buildConfigs = [];
    $ctrl.select = select;

    // --------------------


    // $ctrl.$onInit = function () {
    //   if ($ctrl.project && $ctrl.project.id) {
    //     fetchBuildConfigs();
    //   }
    // };
    //
    // $ctrl.onChanges = function (changes) {
    //   if (changes.project) {
    //     fetchBuildConfigs();
    //   }
    // };


    var config = {
     selectItems: false,
     multiSelect: false,
     dblClick: false,
     selectionMatchProp: 'id',
     showSelectBox: false,
    };

    var actionButtons = [
      {
        name: 'Add',
        title: 'Add this Build Config',
        actionFn: function (action, object) {
          if (action.name === 'Add') {
            $ctrl.add(object);
          }
        }
      }
    ];

    function select(item) {
      fetchBuildConfigs(item.id);
    }

    function fetchBuildConfigs(projectId) {
      Project.queryBuildConfigurations({ id: projectId }).$promise.then(function (page) {
        $ctrl.buildConfigs = page.data || [];
      });
    }
  }

})();
