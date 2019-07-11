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

  angular.module('pnc.group-configs').component('pncGroupConfigDetailPage', {
    bindings: {
      groupConfig: '<',
      productVersion: '<'
    },
    templateUrl: 'group-configs/detail/pnc-group-config-detail-page.html',
    controller: ['$state', 'modalSelectService', 'GroupConfigResource', Controller]
  });

  function Controller($state, modalSelectService, GroupConfigResource) {
    const $ctrl = this;

    // -- Controller API --

    $ctrl.update = update;
    $ctrl.delete = deleteGroupConfig;
    $ctrl.linkWithProductVersion = linkWithProductVersion;
    $ctrl.unlinkFromProductVersion = unlinkFromProductVersion;

    // --------------------

    $ctrl.$onInit = () => {
      $ctrl.formModel = $ctrl.groupConfig.toJSON();
      
      console.log('$ctrl.groupConfig == %O', $ctrl.groupConfig);
      console.log('$ctrl.productVersion == %O', $ctrl.productVersion);
    };


    function update(data) {      
      console.log('Update -> data: %O / $ctrl.groupConfig: %O', data, $ctrl.groupConfig);

      return GroupConfigResource.patch($ctrl.groupConfig, data).$promise.then(
          res => console.log('res = %O', res),
          // String response signals to x-editable component that the request failed and to rollback the local view model.
          err => err.data.errorMessage 
      );
    }

    function deleteGroupConfig() {

      $ctrl.groupConfig.$patch({ productVersion: { id: 1 }});
      // $ctrl.groupConfig
      //     .$delete()
      //     .then(() => $state.go('group-configs.list'));
    }

    function linkWithProductVersion() {
      
      const modal = modalSelectService.openForProductVersion({
        title: 'Link ' + $ctrl.groupConfig.name + ' with a product version'
      });

      modal.result.then(res => {
        GroupConfigResource.patch($ctrl.groupConfig, { productVersion: { id: res.id } }).then(
            res => console.log ('Patch request result: %O', res),
            err => console.log('Patch request error: %O', err)
        );
      });
    }

    function unlinkFromProductVersion() {
      GroupConfigResource.patch($ctrl.groupConfig, { productVersion: null }).then(
        res => console.log ('Patch request result: %O', res),
        err => console.log('Patch request error: %O', err)
      );
    }
  }

})();
