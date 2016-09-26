/**
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
package org.jboss.pnc.integration.client;

import com.jayway.restassured.response.Response;
import org.jboss.pnc.integration.client.util.RestResponse;
import org.jboss.pnc.model.BuildConfigurationSet;
import org.jboss.pnc.rest.restmodel.BuildConfigurationSetRest;
import org.jboss.pnc.rest.restmodel.ProductVersionRest;

import java.util.Collection;
import java.util.List;
import java.util.Set;

public class ProductVersionRestClient extends AbstractRestClient<ProductVersionRest> {

    public static final String PRODUCT_VERSION_REST_ENDPOINT = "/pnc-rest/rest/product-versions/";

    public ProductVersionRestClient() {
        super(PRODUCT_VERSION_REST_ENDPOINT, ProductVersionRest.class);
    }

//    public RestResponse<T> update(int id, T obj, boolean withValidation) {
//        Response response = put(collectionUrl + id, obj);
//
//        if(withValidation) {
//            response.then().statusCode(200);
//        }
//
//        return new RestResponse<>(response, get(id, withValidation).getValue());
//    }

    public RestResponse<List<BuildConfigurationSetRest>> updateBuildConfigurationSets(int id, List<BuildConfigurationSetRest> buildConfigurationSetRests) {
        Response response = put(null, buildConfigurationSetRests);

        response.then().statusCode(200);

        return new RestResponse<>(response, get(id).getValue().getBuildConfigurationSets());
    }
}
