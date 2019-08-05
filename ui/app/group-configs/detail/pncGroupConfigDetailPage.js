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
    controller: ['$scope', '$state', 'modalSelectService', 'GroupConfigResource', Controller]
  });

  function Controller($scope, $state, modalSelectService, GroupConfigResource) {
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


    function resetState(groupConfig, productVersion) {
      $ctrl.groupConfig = groupConfig;
      $ctrl.productVersion = productVersion;
      $ctrl.formModel = $ctrl.groupConfig.toJSON();
    }

    function update(data) {      
      console.log('Update -> data: %O / $ctrl.groupConfig: %O', data, $ctrl.groupConfig);

      return GroupConfigResource.safePatch($ctrl.groupConfig, data).$promise.then(
        response => console.log('response = %O', response),
        // String retval signals to x-editable lib that the request failed and to rollback the changes in the view.
        error => error.data.errorMessage
      );
    }

    function deleteGroupConfig() {
      $ctrl.groupConfig
          .$delete()
          .then(() => $state.go('group-configs.list'));
    }

    function linkWithProductVersion() {
      
      const modal = modalSelectService.openForProductVersion({
        title: 'Link ' + $ctrl.groupConfig.name + ' with a product version'
      });

      modal.result.then(result => {

        GroupConfigResource.safePatch($ctrl.groupConfig, { productVersion: { id: result.id }}).$promise.then(
            response => {
              console.log('response: %O, result: %O', response, result);
              $scope.$applyAsync(() => resetState(response, result));
            },
            err => console.log('Patch request error: %O', err));  

        // GroupConfigResource.patch($ctrl.groupConfig, { productVersion: { id: res.id } }).$promise.then(
        //     res => console.log ('Patch request result: %O', res),
        //     err => console.log('Patch request error: %O', err)
        // );
      //   const patch = resourceHelper.createNonDestructivePatch($ctrl.groupConfig, { productVersion: { id: res.id }});
      //   console.log('patch = %O', patch);
      //   GroupConfigResource.patch({ id: $ctrl.groupConfig.id }, patch).$promise.then(
      //       res => console.log ('Patch request result: %O', res),
      //       err => console.log('Patch request error: %O', err)        
      //   );
      });
    }

    function unlinkFromProductVersion() {
      // GroupConfigResource.patch($ctrl.groupConfig, { productVersion: null }).$promise.then(
      //   res => console.log ('Patch request result: %O', res),
      //   err => console.log('Patch request error: %O', err)
      // );

      // const patch = resourceHelper.createNonDestructivePatch($ctrl.groupConfig, { productVersion: null });
      // console.log('patch: %O', patch);
      // GroupConfigResource.patch({ id: $ctrl.groupConfig.id }, patch).$promise.then(
      //     res => console.log ('Patch request result: %O', res),
      //     err => console.log('Patch request error: %O', err)        
      // );

      GroupConfigResource.safePatch($ctrl.groupConfig, { productVersion: null }).$promise.then(
          res => console.log ('Patch request result: %O', res),
          err => console.log('Patch request error: %O', err));
    }
  }

})();
