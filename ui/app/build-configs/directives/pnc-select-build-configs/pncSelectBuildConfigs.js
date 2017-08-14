(function () {
  'use strict';

  angular.module('pnc.build-configs').component('pncSelectBuildConfigs', {
    templateUrl: 'build-configs/directives/pnc-select-build-configs/pnc-select-build-configs.html',
    controller: Controller,
    bindings: {
      buildConfigs: '=ngModel',
      onAdd: '&',
      onRemove: '&'
    }
  });

  function Controller() {
    var $ctrl = this,

        listConfig = {
         selectItems: false,
         multiSelect: false,
         dblClick: false,
         selectionMatchProp: 'id',
         showSelectBox: false,
       },

       listActionButtons = [
         {
           name: 'Remove',
           title: 'Remove this dependency',
           actionFn: function (action, object) {
             $ctrl.remove(object);
           }
         }
       ];


    // -- Controller API --

    $ctrl.listConfig = listConfig;
    $ctrl.listActionButtons = listActionButtons;
    $ctrl.add = add;
    $ctrl.remove = remove;

    // --------------------


    $ctrl.$onInit = function () {
      if (!angular.isArray($ctrl.buildConfigs)) {
        $ctrl.buildConfigs = [];
      }
    };

    function add(buildConfig) {
      $ctrl.buildConfigs.push(buildConfig);
      $ctrl.buildConfig = undefined;
      $ctrl.onAdd({ buildConfig: buildConfig });
    }

    function remove(buildConfig) {
      var index = $ctrl.buildConfigs.findIndex(function (bc) {
        return bc.id === buildConfig.id;
      });

      if (index > -1) {
        $ctrl.buildConfigs.splice(index, 1);
      }
      $ctrl.onRemove({ buildConfig: buildConfig });
    }

    // $ctrl.add = function () {
    //   $log.debug('add :: $ctrl.buildConfigs / $ctrl.buildConfig', $ctrl.buildConfigs, $ctrl.buildConfig);
    //   $ctrl.buildConfigs.push($ctrl.buildConfig);
    //   $ctrl.buildConfig = undefined;
    // };
    //
    // $ctrl.remove = function (buildConfig) {
    //   var index = $ctrl.buildConfigs.findIndex(function (bc) {
    //     return bc.id === buildConfig.id;
    //   });
    //
    //   if (index > -1) {
    //     $ctrl.buildConfigs.splice(index, 1);
    //   }
    // };

    // $ctrl.findBuildConfigs = function () {
    //   return [
    //   {
    //     'id': 1,
    //     'name': 'pnc-1.0.0.DR1',
    //     'description': 'Test build config for project newcastle',
    //     'buildScript': 'mvn clean deploy -DskipTests=true',
    //     'repositoryConfiguration': {
    //       'id': 1,
    //       'internalUrl': 'https://github.com/project-ncl/pnc.git',
    //       'externalUrl': null,
    //       'preBuildSyncEnabled': true
    //     },
    //     'scmRevision': '*/v0.2',
    //     'creationTime': 1499699685504,
    //     'lastModificationTime': 1499699685475,
    //     'archived': false,
    //     'project': {
    //       'id': 1,
    //       'name': 'Project Newcastle Demo Project 1',
    //       'description': 'Example Project for Newcastle Demo',
    //       'issueTrackerUrl': null,
    //       'projectUrl': 'https://github.com/project-ncl/pnc',
    //       'configurationIds': [
    //         1
    //       ],
    //       'licenseId': null
    //     },
    //     'environment': {
    //       'id': 1,
    //       'name': 'Demo Environment 1',
    //       'description': 'Basic Java and Maven Environment',
    //       'systemImageRepositoryUrl': 'my.registry/newcastle',
    //       'systemImageId': '12345678',
    //       'attributes': {
    //         'JDK': '1.7.0',
    //         'OS': 'Linux'
    //       },
    //       'systemImageType': 'DOCKER_IMAGE',
    //       'imageRepositoryUrl': 'my.registry/newcastle'
    //     },
    //     'dependencyIds': [],
    //     'productVersionId': 1,
    //     'buildConfigurationSetIds': null,
    //     'genericParameters': {}
    //   },
    //   {
    //     'id': 2,
    //     'name': 'jboss-modules-1.5.0',
    //     'description': 'Test config for JBoss modules build master branch.',
    //     'buildScript': 'mvn clean deploy -DskipTests=true',
    //     'repositoryConfiguration': {
    //       'id': 2,
    //       'internalUrl': 'https://github.com/jboss-modules/jboss-modules.git',
    //       'externalUrl': null,
    //       'preBuildSyncEnabled': true
    //     },
    //     'scmRevision': '9e7115771a791feaa5be23b1255416197f2cda38',
    //     'creationTime': 1499699685509,
    //     'lastModificationTime': 1499699685507,
    //     'archived': false,
    //     'project': {
    //       'id': 2,
    //       'name': 'JBoss Modules',
    //       'description': 'JBoss Modules Project',
    //       'issueTrackerUrl': 'https://issues.jboss.org/browse/MODULES',
    //       'projectUrl': 'https://github.com/jboss-modules/jboss-modules',
    //       'configurationIds': [
    //         2
    //       ],
    //       'licenseId': null
    //     },
    //     'environment': {
    //       'id': 1,
    //       'name': 'Demo Environment 1',
    //       'description': 'Basic Java and Maven Environment',
    //       'systemImageRepositoryUrl': 'my.registry/newcastle',
    //       'systemImageId': '12345678',
    //       'attributes': {
    //         'JDK': '1.7.0',
    //         'OS': 'Linux'
    //       },
    //       'systemImageType': 'DOCKER_IMAGE',
    //       'imageRepositoryUrl': 'my.registry/newcastle'
    //     },
    //     'dependencyIds': [],
    //     'productVersionId': 1,
    //     'buildConfigurationSetIds': null,
    //     'genericParameters': {}
    //   }
    //   ];
    // };
  }

})();
