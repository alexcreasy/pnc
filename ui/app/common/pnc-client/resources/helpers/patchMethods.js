// /*
//  * JBoss, Home of Professional Open Source.
//  * Copyright 2014-2019 Red Hat, Inc., and individual contributors
//  * as indicated by the @author tags.
//  *
//  * Licensed under the Apache License, Version 2.0 (the "License");
//  * you may not use this file except in compliance with the License.
//  * You may obtain a copy of the License at
//  *
//  * http://www.apache.org/licenses/LICENSE-2.0
//  *
//  * Unless required by applicable law or agreed to in writing, software
//  * distributed under the License is distributed on an "AS IS" BASIS,
//  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  * See the License for the specific language governing permissions and
//  * limitations under the License.
//  */
// (function () {
//   'use strict';

//   angular.module('pnc.common.pnc-client.resources').factory('patchMethods', [
//     'resourceHelper',
//     '$http',
//     function (resourceHelper, $http) {

//       const { createNonDestructivePatch, normalize } = resourceHelper;

//       function safePatch(url, original, modified, config) {
//         const _original = normalize(original);
//         const _modified = normalize(modified);
//         const patch = createNonDestructivePatch(_original, _modified);

//         return doPatch(url, patch, config);
//       }

//       function destructivePatch(url, original, modified, config) {

//       }


//       function  transcludeUrl(resource, urlTemplate) {

//       }
//       function assignPatchMethods(ressource, urlTemplate) {

//         function patch() {

//         }


//         //Object.assign(resource, );
//       }

//       function patch(url, original, modified, destructive = false, config) {
//         const _original = normalize(original);
//         const _modified = normalize(modified);
//         let patch; 

//         if (destructive) {
//           patch = jsonpatch.compare(_original, _modified);
//         } else {
//           patch = createNonDestructivePatch(_original, _modified);
//         }

//         return doPatchRequest(url, patch, config);
//       }

//       function doPatchRequest(url, patch, config = {}) {
//         const _config = Object.assign({
//           method: 'PATCH',
//           url: url,
//           data: patch
//         },
//         config);

//         return $http(_config);
//       }

//       return Object.freeze({

//       });



//       function createNonDestructivePatch(original, modified) {
//         const left = normalize(original);
//         const right = normalize(modified);
  
//         return jsonpatch.compare(left, Object.assign({}, left, right));
//       }
  
//       function normalize(resource) {
//         return isResource(resource) ? resource.toJSON() : resource;
//       }
  
//       function isResource(obj) {
//         return obj.hasOwnProperty('$promise') && obj.hasOwnProperty('$resolved') && angular.isFunction(obj.toJSON);
//       }

//       const api = {
//         createNonDestructivePatch,
//         normalize,
//         isResource
//       };

//       Object.assign(this, api);

//       this.$get = () => api;
//     }

//   ]);

// })();
