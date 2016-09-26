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
import org.jboss.pnc.model.Product;
import org.jboss.pnc.model.ProductVersion;
import org.jboss.pnc.rest.provider.BuildConfigurationSetProvider;
import org.jboss.pnc.rest.provider.ProductVersionProvider;
import org.jboss.pnc.rest.restmodel.BuildConfigurationSetRest;
import org.jboss.pnc.rest.restmodel.ProductRest;
import org.jboss.pnc.rest.restmodel.ProductVersionRest;
import org.jboss.pnc.spi.datastore.repositories.BuildConfigurationSetRepository;
import org.jboss.pnc.spi.datastore.repositories.ProductRepository;
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
import java.util.LinkedList;
import java.util.List;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.stream.Collectors;

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

    @Inject
    private BuildConfigurationSetProvider buildConfigurationSetProvider;

    @Inject
    private ProductRepository productRepository;

    private ProductVersionRest productVersionRest1;

    private AtomicBoolean dbInitialised = new AtomicBoolean(false);

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

        if (!dbInitialised.getAndSet(true)) {
            Product product1 = productRepository.save(Product.Builder.newBuilder()
                    .name("product-version-rest-test-product-1")
                    .build());

            ProductVersion productVersion1 = productVersionRepository.save(ProductVersion.Builder.newBuilder()
                    .product(product1)
                    .version("1.0")
                    .build());


            BuildConfigurationSet bcset1 = buildConfigurationSetRepository.save(BuildConfigurationSet.Builder.newBuilder()
                    .name("product-version-test-bcset-1")
                    .productVersion(productVersion1)
                    .build());

            BuildConfigurationSet bcset2 = buildConfigurationSetRepository.save(BuildConfigurationSet.Builder.newBuilder()
                    .name("product-version-test-bcset-2")
                    .productVersion(productVersion1)
                    .build());

//        BuildConfigurationSet bcset3 = buildConfigurationSetRepository.save(BuildConfigurationSet.Builder.newBuilder()
//                .name("product-version-test-bcset-3")
//                .build());
//
//        BuildConfigurationSet bcset4 = buildConfigurationSetRepository.save(BuildConfigurationSet.Builder.newBuilder()
//                .name("product-version-test-bcset-4")
//                .build());

            productVersionRest1 = new ProductVersionRest(productVersion1);
        }
    }

    @Test
    public void sanityTest() {
        System.out.println(productVersionRestClient.all());

        System.out.println(productVersionRestClient.get(3, true).getValue().getBuildConfigurationSets().get(0).getName());
    }

    @Test
    public void shouldUpdateBuildConfigurationSets() {
        //given
        BuildConfigurationSetRest bcset3 = new BuildConfigurationSetRest(buildConfigurationSetRepository.save(BuildConfigurationSet.Builder.newBuilder()
                .name("product-version-test-bcset-3")
                .build()));

        BuildConfigurationSetRest bcset4 = new BuildConfigurationSetRest(buildConfigurationSetRepository.save(BuildConfigurationSet.Builder.newBuilder()
                .name("product-version-test-bcset-4")
                .build()));

        List<BuildConfigurationSetRest> buildConfigurationSetRests = new LinkedList<>();
        buildConfigurationSetRests.add(bcset3);
        buildConfigurationSetRests.add(bcset4);

        //when
        RestResponse<List<BuildConfigurationSetRest>> response  = productVersionRestClient.updateBuildConfigurationSets(
                productVersionRest1.getId(), buildConfigurationSetRests);


        //then
        assertThat(response.hasValue()).isTrue();

        assertThat(response.getValue().stream().map(BuildConfigurationSetRest::getId).collect(Collectors.toList()))
                .containsOnly(bcset3.getId(), bcset4.getId());
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
