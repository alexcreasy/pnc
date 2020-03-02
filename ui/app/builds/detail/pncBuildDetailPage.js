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

  angular.module('pnc.builds').component('pncBuildDetailPage', {
    bindings: {
      build: '<',
      dependencyGraph: '<'
    },
    templateUrl: 'builds/detail/pnc-build-detail-page.html',
    controller: ['$scope', 'events', Controller]
  });


  function Controller($scope, events) {
    const $ctrl = this;

    // -- Controller API --

    $ctrl.brewPush = brewPush;

    // --------------------

    $ctrl.$onInit = function () {
      $ctrl.isFinished = $ctrl.build.progress === 'FINISHED';

      $scope.$on(events.BUILD_STATUS_CHANGED, (event, build) => {
        if ($ctrl.build.id === build.id) {
          $scope.$applyAsync(() => $ctrl.build = build);
        }
      });
    };

    function brewPush(tagName) {
      console.log(`Push build: ${$ctrl.build.$canonicalName()} to brew tag: ${tagName}`);
    }

  }

})();
