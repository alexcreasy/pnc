(function () {
  'use strict';

  angular.module('pnc.build-configs').component('pncRepositoryManager', {
    templateUrl: 'build-configs/directives/pnc-select-repository/pnc-select-repository.html',
    controller: Controller
  });

  function Controller($log, $q, $timeout) {
    var $ctrl = this;

    $ctrl.loading = 0;
    $ctrl.checkForRepo = checkForRepo;
    $ctrl.isLoading = isLoading;
    $ctrl.isRepoInternal = isRepoInternal;

    function checkForRepo(url) {
      $ctrl.loading++;
      $ctrl.repo = undefined;
      $log.debug('checkForRepo(%s)', url);
      doCheckForRepo(url).then(function (repo) {
        if (angular.isDefined(repo)) {
          $ctrl.repo = repo;
        }
      }).finally(function() { $ctrl.loading--; });
    }


    function doCheckForRepo(url) {
      return $q(function (resolve) {
        $timeout(function () {
          resolve(getRepo(url));
        }, 1000);
      });
    }

    function getRepo(url) {
      var repos = [
        {
          "id": 1,
          "internalUrl": "https://internal.com/pnc.git",
          "externalUrl": "https://github.com/project-ncl/pnc.git",
          "preBuildSyncEnabled": true
        }
      ];

      return repos.find(function (repo) {
        return repo.internalUrl === url || repo.externalUrl === url;
      });
    }

    function isLoading() {
      return $ctrl.loading > 0;
    }

    function isRepoInternal(url) {
      if (url) {
        return url.includes('internal.com');
      }
    }

  }

})();
