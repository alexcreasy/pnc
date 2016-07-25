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

  angular.module('pnc.common.pnc-client', [
    'pnc.common.pnc-client.pagination',
    'pnc.common.pnc-client.resources'
  ])

  .run([
    '$log',
    'BuildRecord',
    function ($log, BuildRecord) {
      var br = BuildRecord.getDependencyArtifacts({ id: 112, pageSize: 2 });
      $log.debug('BuildRecord.getDependencyArtifacts(112) >> %O', br);

      br.$promise.then(function() {
        $log.debug('br.getTotalPages == %O // br.getConfig() == %O', br.getTotalPages(), br.getConfig());
        br.getPage(br.getPageIndex() + 1).then(function (response) {
          $log.debug('the next page == %O', response);
        });
      });
    }
  ]);

})();
