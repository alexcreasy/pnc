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

  angular.module('pnc.build-configs').component('pncBuildConfigDetailsTab', {
    bindings: {
      buildConfig: '<'
    },
    require : {
      mainCtrl: '^^pncBuildConfigDetailMain'
    },
    templateUrl: 'build-configs/detail/details-tab/pnc-build-config-details-tab.html',
    controller: ['$log', Controller]
  });


  function Controller($log) {
    var $ctrl = this,
        editMode = false;

    // -- Controller API --

    $ctrl.notification = {
      visible: false,
      type: null,
      message: null,
      header: null,
      persistant: false,
      remove: function () {
        $ctrl.notification.visible = false;
      }
    };

    $ctrl.isEditModeActive = isEditModeActive;
    $ctrl.onCancelEdit = onCancelEdit;
    $ctrl.onSuccess = onSuccess;

    // --------------------


    $ctrl.$onInit = function () {
      $ctrl.mainCtrl.registerOnEdit(toggleEdit);
    };

    function notify(type, header, message, isPersistant) {
      $ctrl.notification.type = type;
      $ctrl.notification.header = header;
      $ctrl.notification.message = message;
      $ctrl.notification.persistant = isPersistant;
      $ctrl.notification.visible = true;
    }

    function toggleEdit() {
      editMode = !editMode;
    }

    function isEditModeActive() {
      return editMode;
    }

    function onCancelEdit() {
      toggleEdit();
    }

    function onSuccess(buildConfig) {
      toggleEdit();
      notify('success', null, 'Update Successful', true);
    }
  }

})();
