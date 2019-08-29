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

  angular.module('pnc.common.components').component('pncDataTable', {
    bindings: {
      page: '<',
      search: '@'
    },
    transclude: {
      'table': 'tableSlot'
    },
    templateUrl: 'common/components/pnc-data-table/pnc-data-table.html',
    controller: ['filteringPaginator', 'utils', '$transclude', '$element', Controller]
  });

  function Controller(filteringPaginator, utils, $transclude, $element) {
    var $ctrl = this;

    // -- Controller API --

    $ctrl.searchEnabled = searchEnabled;    
    $ctrl.search = search;

    // --------------------

    $ctrl.$onInit = () => {
      $ctrl.filteringPaginator = filteringPaginator($ctrl.page, ['name']);
    };

    $ctrl.postLink = () => {
      $
    };

    function searchEnabled() {
      if (angular.isUndefined($ctrl.search)) {
        return true;
      }
      return utils.parseBoolean($ctrl.search);
    }

    function search(query) {
      console.log('search: %O', query);
      return $ctrl.filteringPaginator.search(query);
    }
  }

})();
