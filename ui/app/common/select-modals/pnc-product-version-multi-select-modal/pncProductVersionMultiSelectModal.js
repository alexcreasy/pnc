/*
 * JBoss, Home of Professional Open Source.
 * Copyright 2014-2018 Red Hat, Inc., and individual contributors
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

  angular.module('pnc.common.select-modals').component('pncProductVersionMultiSelectModal', {
    bindings: {
      close: '&',
      dismiss: '&',
      modalInstance: '<',
      resolve: '<'
    },
    templateUrl: 'common/select-modals/pnc-product-version-multi-select-modal/pnc-product-version-multi-select-modal.html',
    controller: [Controller]
  });

  function Controller() {
    const $ctrl = this;

    // -- Controller API --

    $ctrl.save = save;
    $ctrl.cancel = cancel;
    $ctrl.onRemove = onRemove;
    $ctrl.onAdd = onAdd;
    $ctrl.onSelect = onSelect;

    $ctrl.title = $ctrl.resolve.config.title;
    $ctrl.selected = [];
    
    $ctrl.config = {
      selectItems: false,
      multiSelect: false,
      dblClick: false,
      selectionMatchProp: 'id',
      showSelectBox: false,
     };

     $ctrl.actionButtons = [
       {
         name: 'Remove',
         title: 'Remove this Product Version',
         actionFn: function (action, object) {
           $ctrl.onRemove(object);
         }
       }
     ];

    // --------------------


    $ctrl.$onInit = () => {
      $ctrl.selected.concat($ctrl.resolve.productVersions);
    }


    function save() {
      $ctrl.close({ $value: $ctrl.selected });
    }

    function cancel() {
      $ctrl.dismiss();
    }

    function onAdd(productVersion) {
      if (indexOf(productVersion) === -1) {
        $ctrl.selected.push(productVersion);
      }
      console.log('Add %O / selected: %O', productVersion, $ctrl.selected);
    }

    function onRemove(productVersion) {
      const index = indexOf(productVersion);

      if (index >= 0) {
        $ctrl.selected.splice(index , 1);
      }
      console.log('Remove %O / selected: %O', productVersion, $ctrl.selected);
    }

    function onSelect(productVersion) {
      if (angular.isDefined(productVersion)) {
        onAdd(productVersion);
      }
    }

    function indexOf(productVersion) {
      return $ctrl.selected.findIndex(p => p.id === productVersion.id);
    }
  }

})();
