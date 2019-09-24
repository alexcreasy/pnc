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
(function() {
  'use strict';

  angular.module('pnc.build-records').component('pncLogViewer', {
    bindings: {
      buildRecord: '<'
    },
    template: '<div class="log-container"></div>',
    controller: ['$element', Controller]
  });

  function Controller($element) {
    const $ctrl = this;

    let containerElem;

    // -- Controller API --


    // --------------------

    $ctrl.$postLink = () => {
      containerElem = $element[0];

      console.log('containerElem = %O', containerElem);

      appendLine(`2019-05-03T17:11:49.000Z org.wildfly.security ELY00001: WildFly Elytron version 1.8.0.Final-redhat-00001`);
      appendLine(`2019-05-03T17:11:49.000Z org.apache.kafka.clients.Metadata Cluster ID: uc10AX_0QMK6BFuPDcNzGg`);
      appendLine(`2019-05-03T17:11:50.000Z org.xnio XNIO version 3.6.5.Final-redhat-00001`);
      appendLine(`2019-05-03T17:11:51.000Z org.jboss.as.txn WFLYTX0013: The node-identifier attribute on the /subsystem=transactions is set to the default value. This is a danger for environments running multiple servers. Please make sure the attribute value is unique.`);

      /*
2019-05-03T17:11:49.000Z org.apache.kafka.clients.Metadata Cluster ID: uc10AX_0QMK6BFuPDcNzGg
2019-05-03T17:11:50.000Z org.jboss.as.controller.management-deprecated WFLYCTL0028: Attribute 'security-realm' in the resource at address '/subsystem=undertow/server=default-server/https-listener=https' is deprecated, and may be removed in a future version. See the attribute description in the output of the read-resource-description operation to learn more about the deprecation.
2019-05-03T17:11:50.000Z org.xnio XNIO version 3.6.5.Final-redhat-00001
2019-05-03T17:11:50.000Z org.jboss.remoting JBoss Remoting version 5.0.8.Final-redhat-1
2019-05-03T17:11:50.000Z org.jboss.as.controller.management-deprecated WFLYCTL0028: Attribute 'security-realm' in the resource at address '/core-service=management/management-interface=http-interface' is deprecated, and may be removed in a future version. See the attribute description in the output of the read-resource-description operation to learn more about the deprecation.
2019-05-03T17:11:50.000Z org.wildfly.extension.io WFLYIO001: Worker 'default' has auto-configured to 8 core threads with 64 task threads based on your 4 available processors
2019-05-03T17:11:50.000Z org.jboss.as.jaxrs WFLYRS0016: RESTEasy version 3.6.3.Final-redhat-00001
2019-05-03T17:11:50.000Z org.jboss.as.jsf WFLYJSF0007: Activated the following JSF Implementations: [main]
2019-05-03T17:11:50.000Z org.wildfly.extension.microprofile.config.smallrye._private WFLYCONF0001: Activating WildFly MicroProfile Config Subsystem
2019-05-03T17:11:50.000Z org.jboss.as.server WFLYSRV0039: Creating http management service using socket-binding (management-http)
2019-05-03T17:11:50.000Z org.xnio.nio XNIO NIO Implementation Version 3.6.5.Final-redhat-00001
2019-05-03T17:11:50.000Z org.jboss.as.clustering.infinispan WFLYCLINF0001: Activating Infinispan subsystem.
2019-05-03T17:11:50.000Z org.jboss.as.connector.subsystems.datasources WFLYJCA0004: Deploying JDBC-compliant driver class org.h2.Driver (version 1.4)
2019-05-03T17:11:50.000Z org.jboss.as.connector WFLYJCA0009: Starting JCA Subsystem (WildFly/IronJacamar 1.4.15.Final-redhat-00001)
2019-05-03T17:11:50.000Z org.jboss.as.naming WFLYNAM0001: Activating Naming Subsystem
2019-05-03T17:11:51.000Z org.jboss.as.connector.deployers.jdbc WFLYJCA0018: Started Driver service with driver-name = h2
2019-05-03T17:11:51.000Z org.wildfly.extension.microprofile.health.smallrye WFLYHEALTH0001: Activating Eclipse MicroProfile Health Subsystem
2019-05-03T17:11:51.000Z org.jboss.as.mail.extension WFLYMAIL0001: Bound mail session [java:jboss/mail/Default]
2019-05-03T17:11:51.000Z org.jboss.as.txn WFLYTX0013: The node-identifier attribute on the /subsystem=transactions is set to the default value. This is a danger for environments running multiple servers. Please make sure the attribute value is unique.
*/
    };

    function appendLine(text) {
      const line = `<div class="log-line>${text}</div>`;

      containerElem.appendChild(line);
    }


  }
})();
