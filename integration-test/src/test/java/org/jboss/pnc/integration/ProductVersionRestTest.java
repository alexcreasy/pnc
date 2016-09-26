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
package org.jboss.pnc.integration;

import org.jboss.arquillian.container.test.api.Deployment;
import org.jboss.arquillian.junit.Arquillian;
import org.jboss.arquillian.junit.InSequence;
import org.jboss.pnc.AbstractTest;
import org.jboss.pnc.integration.client.AbstractRestClient;
import org.jboss.pnc.integration.client.ProductVersionRestClient;
import org.jboss.pnc.integration.client.util.RestResponse;
import org.jboss.pnc.integration.deployments.Deployments;
import org.jboss.pnc.integration.env.IntegrationTestEnv;
import org.jboss.pnc.integration.utils.AuthUtils;
import org.jboss.pnc.model.BuildConfigurationSet;
import org.jboss.pnc.rest.provider.ProductVersionProvider;
import org.jboss.pnc.rest.restmodel.ProductVersionRest;
import org.jboss.pnc.spi.datastore.repositories.BuildConfigurationSetRepository;
import org.jboss.pnc.spi.datastore.repositories.ProductVersionRepository;
import org.jboss.pnc.test.category.ContainerTest;
import org.jboss.shrinkwrap.api.spec.EnterpriseArchive;
import org.jboss.shrinkwrap.api.spec.WebArchive;
import org.junit.Before;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.inject.Inject;
import java.lang.invoke.MethodHandles;

import static org.assertj.core.api.Assertions.assertThat;

@RunWith(Arquillian.class)
@Category(ContainerTest.class)
public class ProductVersionRestTest {

    public static final Logger logger = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());

    private static ProductVersionRestClient productVersionRestClient;

    @Inject
    private ProductVersionProvider productVersionProvider;

    @Inject
    private ProductVersionRepository productVersionRepository;

    @Inject
    private BuildConfigurationSetRepository buildConfigurationSetRepository;

    @Deployment
    public static EnterpriseArchive deploy() {
        EnterpriseArchive enterpriseArchive = Deployments.baseEarWithTestDependencies();
        WebArchive war = enterpriseArchive.getAsType(WebArchive.class, AbstractTest.REST_WAR_PATH);
        war.addClass(ProductVersionRestTest.class);
        war.addClass(ProductVersionRestClient.class);
        war.addClass(AbstractRestClient.class);
        war.addClass(IntegrationTestEnv.class);
        war.addClass(RestResponse.class);
        war.addPackage(AuthUtils.class.getPackage());

        logger.info(enterpriseArchive.toString(true));
        return enterpriseArchive;
    }

    @Before
    public void before() {
        if(productVersionRestClient == null) {
            productVersionRestClient = new ProductVersionRestClient();
        }
    }

    @Test
    @InSequence(-1)
    public void shouldAddtoDB() {
        BuildConfigurationSet bcset1 = BuildConfigurationSet.Builder.newBuilder().name("product-version-test-bcset-1").build();
        BuildConfigurationSet bcset2 = BuildConfigurationSet.Builder.newBuilder().name("product-version-test-bcset-2").build();

        buildConfigurationSetRepository.save(bcset1);
        buildConfigurationSetRepository.save(bcset2);
    }

    @Test
    public void shouldGetSpecificProductVersion() throws Exception {
        //when
        int productVersionId = productVersionRestClient.firstNotNull().getValue().getId();
        RestResponse<ProductVersionRest> clientResponse = productVersionRestClient.get(productVersionId);

        //then
        assertThat(clientResponse.hasValue()).isEqualTo(true);
    }

    @Test
    public void shouldCreateNewProductVersion() throws Exception {
        //given
        int productId = productVersionRestClient.firstNotNull().getValue().getId();

        ProductVersionRest productVersion = new ProductVersionRest();
        productVersion.setProductId(productId);
        productVersion.setVersion("99.0");

        //when
        RestResponse<ProductVersionRest> clientResponse = productVersionRestClient.createNew(productVersion);

        //then
        assertThat(clientResponse.hasValue()).isEqualTo(true);
        assertThat(clientResponse.getValue().getId()).isNotNegative();
    }

    @Test
    public void shouldUpdateProductVersion() throws Exception {
        //given
        ProductVersionRest productVersionRest = productVersionRestClient.firstNotNull().getValue();
        productVersionRest.setVersion("100.0");

        //when
        RestResponse<ProductVersionRest> updateResponse = productVersionRestClient.update(productVersionRest.getId(),
                productVersionRest);

        //then
        assertThat(updateResponse.hasValue()).isEqualTo(true);
        assertThat(updateResponse.getValue().getVersion()).isEqualTo("100.0");
    }
}
