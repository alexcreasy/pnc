package org.jboss.pnc.auth;

import static org.junit.Assert.assertNotNull;

import java.io.InputStream;

import org.jboss.logging.Logger;
import org.jboss.pnc.integration.Utils.AuthResource;
import org.jboss.pnc.test.category.ContainerTest;
import org.junit.Assert;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.experimental.categories.Category;

/**
 * @author pslegr
 * 
 * Test for External REST endpoints AUTH*
 * Special conditions for test to pass:
 * 1. Valid user able to Authenticate for Keycloak
 * 2. User in role authorized for /products endpoint
 * 3. User in role not authorized for /build-configurations endpoint
 * 
 *  Note: for internal development use user "testone/****" which
 *  is defined to fulfill all above conditions 
 *
 */
@Category(ContainerTest.class)
public class ExternalAuthFacadeTest {
    
    protected Logger log = Logger.getLogger(ExternalAuthFacadeTest.class);


    @Test
    public void testProductEndpoint() {
        try {
            if(AuthResource.authEnabled()) {
                log.info(">>> testProductEndpoint()");            
                InputStream is = this.getClass().getResourceAsStream("/keycloak.json");
                log.info("is is: " + is);
                ExternalAuthFacade externalAuthFacade = new ExternalAuthFacade(is);
                assertNotNull(externalAuthFacade);
                InputStream restInput = externalAuthFacade.restEndpoint("/products");
                assertNotNull(restInput);
                ExternalAuthFacade.print(restInput);
                log.info("<<< testProductEndpoint()");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    @Test
    @Ignore //Ignore this test for now, we need to define the roles/users/authorized sets properly
    public void testConfigEndpointUnauthorized() {
        try {
            if(AuthResource.authEnabled()) {
                log.info(">>> testConfigEndpointUnauthorized()");            
                InputStream is = this.getClass().getResourceAsStream("/keycloak.json");
                ExternalAuthFacade externalAuthFacade = new ExternalAuthFacade(is);
                InputStream restInput = externalAuthFacade.restEndpoint("/build-configurations");
                ExternalAuthFacade.print(restInput);
                assertNotNull(externalAuthFacade);
            }
        } catch (Exception e) {
            String errMsg = e.getMessage();
            Assert.assertTrue(errMsg.contains("403 Forbidden"));
        } 
        finally {
            log.info("<<< testConfigEndpointUnauthorized()");            
        }
        
    }
    
    @Test
    public void testProductEndpointWrongCredentials() {
        try {
            if(AuthResource.authEnabled()) {
                InputStream is = this.getClass().getResourceAsStream("/keycloak.json");
                ExternalAuthFacade externalAuthFacade = 
                        new ExternalAuthFacade("mr.wrong","mr.wrong",is,"http://localhost:8080/pnc-rest/rest");
                assertNotNull(externalAuthFacade);
                InputStream restInput = externalAuthFacade.restEndpoint("/products");
                assertNotNull(restInput);
                ExternalAuthFacade.print(restInput);
            }
        } catch (Exception e) {
            e.printStackTrace();
            String errMsg = e.getMessage();
            if(errMsg != null) {
                Assert.assertTrue(errMsg.contains("Invalid authentication"));
            }
        }
    }
    
    

}
