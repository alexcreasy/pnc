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

  /**
   * An enumeration of event types that are broadcasted by the message bus over
   * angularjs's event notification system.
   */
  angular.module('pnc.common.pnc-client.message-bus').constant('pncEventTypes', Object.freeze({

    USER_AUTHENTICATED: 'USER_AUTHENTICATED',

    BUILD_STARTED: 'BUILD_STARTED',

    BUILD_FINISHED: 'BUILD_FINISHED',

    BUILD_STATUS_CHANGED: 'BUILD_STATUS_CHANGED',

    BUILD_SET_STARTED: 'BUILD_SET_STARTED',

    BUILD_SET_FINISHED: 'BUILD_SET_FINISHED',

    BUILD_SET_STATUS_CHANGED: 'BUILD_SET_STATUS_CHANGED',

    BCC_BPM_NOTIFICATION: 'BCC_BPM_NOTIFICATION',

    RC_BPM_NOTIFICATION: 'RC_BPM_NOTIFICATION',

    BREW_PUSH_RESULT: 'BREW_PUSH_RESULT'

  }));

})();
