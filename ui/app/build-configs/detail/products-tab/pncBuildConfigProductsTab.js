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

  angular.module('pnc.build-configs').component('pncBuildConfigProductsTab', {
    bindings: {
      buildConfig: '<',
      productVersions: '<'
    },
    require : {
      mainCtrl: '^^pncBuildConfigDetailMain'
    },
    templateUrl: 'build-configs/detail/products-tab/pnc-build-config-products-tab.html',
    controller: ['$log', 'paginator', Controller]
  });


  function Controller($log, paginator) {
    var $ctrl = this;

    // -- Controller API --

    $ctrl.page = paginator($ctrl.productVersions);
    $ctrl.displayFields = ['name'];

    $ctrl.onRemove = onRemove;
    $ctrl.onEdit = onEdit;

    // --------------------


    $ctrl.$onInit = function () {

    };

    function onRemove(productVersion) {
      $log.debug('Table action: remove ProductVersion %O', productVersion);
    }

    function onEdit(newProductVersions) {
      $log.debug('<pnc-build-config-products-tab>::onEdit newProductVersions: %O', newProductVersions);
    }
  }

})();
