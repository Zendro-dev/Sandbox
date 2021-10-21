/* ENVIRONMENT
- KEYCLOAK_ENDPOINT
- KEYCLOAK_USER
- KEYCLOAK_PASSWORD
- KEYCLOAK_REALM
need some way to configure clients with
  - KEYCLOAK_CLIENT
	- KEYCLOAK_CLIENT_ROOTURL
	- KEYCLOAK_CLIENT_REDIRECTURIS
- think about api token expiration time
- think about default roles in case of external identity provider
*/

const KEYCLOAK_ENDPOINT = "http://localhost:8080";
const KEYCLOAK_REALM = "zendro2";
const KEYCLOAK_CLIENT = "express";
const axios = require("axios");

/**
 * keyCloakPostRequest - helper function for sending POST requests to the keycloak server
 *
 * @param {string} token API access token
 * @param {string} url keycloak restful endpoint url
 * @param {object} data axios request body
 * @returns axios response
 */
async function keycloakPostRequest(token, url, data) {
  try {
    return await axios({
      method: "post",
      url: `${KEYCLOAK_ENDPOINT}/${url}`,
      data: data,
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
  } catch (error) {
    throw new Error(error);
  }
}

/**
 * keycloakGetRequest - helper function for sending GET requests to the keycloak server
 *
 * @param {string} token API access token
 * @param {string} url keycloak restful endpoint url
 * @returns axios response
 */
async function keycloakGetRequest(token, url) {
  try {
    return await axios({
      method: "get",
      url: `${KEYCLOAK_ENDPOINT}/${url}`,
      headers: {
        Authorization: "Bearer " + token,
      },
    });
  } catch (error) {
    throw new Error(error);
  }
}

/**
 * getMasterToken - get Accesstoken for keycloak rest API
 */
async function getMasterToken() {
  try {
    const res = await axios({
      method: "post",
      url: `${KEYCLOAK_ENDPOINT}/auth/realms/master/protocol/openid-connect/token`,
      data: "username=admin&password=admin&grant_type=password&client_id=admin-cli",
      headers: {
        "content-type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    });
    if (res && res.data) {
      return res.data.access_token;
    } else {
      throw new Error("No api token found");
    }
  } catch (error) {
    throw new Error(error);
  }
}

/**
 * createDefaultRealm - create the default zendro realm in the keycloak server
 */
async function createDefaultRealm(token) {
  const res = await keycloakPostRequest(token, `auth/admin/realms`, {
    id: KEYCLOAK_REALM,
    realm: KEYCLOAK_REALM,
    enabled: true,
  });
  if (res && res.status === 201) {
    console.log(`Keycloak realm ${KEYCLOAK_REALM} created`);
  }
}

/**
 * registerDefaultClient - create a client in the zendro realm
 */
async function registerClient(token, client) {
  const res = await keycloakPostRequest(
    token,
    `auth/admin/realms/${KEYCLOAK_REALM}/clients`,
    client
  );
  if (res && res.status === 201) {
    console.log(`Keycloak client ${JSON.stringify(client)} created`);
  }
}

/**
 * createDefaultRoles - create default zendro roles "administrator", "editor", and "reader" for the realm and the registered clients
 */
async function createDefaultRealmRoles(token) {
  await keycloakPostRequest(
    token,
    `auth/admin/realms/${KEYCLOAK_REALM}/roles`,
    {
      name: "realm-administrator",
    }
  );

  await keycloakPostRequest(
    token,
    `auth/admin/realms/${KEYCLOAK_REALM}/roles`,
    {
      name: "realm-editor",
    }
  );

  await keycloakPostRequest(
    token,
    `auth/admin/realms/${KEYCLOAK_REALM}/roles`,
    {
      name: "realm-reader",
    }
  );

  console.log(`Keycloak default realm roles created`);
}

async function getClientUUID(token, clientId) {
  const clients = await keycloakGetRequest(
    token,
    `auth/admin/realms/${KEYCLOAK_REALM}/clients`
  );

  return clients.data.find((client) => client.clientId === clientId).id;
}

async function createDefaultClientRoles(token, clientId) {
  const clientUUID = await getClientUUID(token, clientId);

  await keycloakPostRequest(
    token,
    `auth/admin/realms/${KEYCLOAK_REALM}/clients/${clientUUID}/roles`,
    {
      name: "administrator",
    }
  );

  await keycloakPostRequest(
    token,
    `auth/admin/realms/${KEYCLOAK_REALM}/clients/${clientUUID}/roles`,
    {
      name: "editor",
    }
  );

  await keycloakPostRequest(
    token,
    `auth/admin/realms/${KEYCLOAK_REALM}/clients/${clientUUID}/roles`,
    {
      name: "reader",
    }
  );

  console.log(`Keycloak default client roles for client ${clientId} created`);
}

async function associateCompositeRoles(token, clientId) {
  // get client UUID
  const clientUUID = await getClientUUID(token, clientId);

  for await (role of ["administrator", "editor", "reader"]) {
    // realm-roles
    const realmRoleId = (
      await keycloakGetRequest(
        token,
        `auth/admin/realms/${KEYCLOAK_REALM}/roles/realm-${role}`
      )
    ).data.id;

    // client roles
    const clientRoleId = (
      await keycloakGetRequest(
        token,
        `auth/admin/realms/${KEYCLOAK_REALM}/clients/${clientUUID}/roles/${role}`
      )
    ).data.id;

    // make the role composite by associating the respective client role
    await keycloakPostRequest(
      token,
      `auth/admin/realms/${KEYCLOAK_REALM}/roles-by-id/${realmRoleId}/composites`,
      [
        {
          id: clientRoleId,
        },
      ]
    );
  }
}

/**
 * createDefaultUser - creates a default admin user for the zendro realm
 */
async function createDefaultUser(token) {
  // create the user
  await keycloakPostRequest(
    token,
    `auth/admin/realms/${KEYCLOAK_REALM}/users`,
    {
      username: "zendro-admin",
      credentials: [
        {
          temporary: false,
          value: "admin",
        },
      ],
      enabled: "true",
    }
  );

  // get user
  const userId = (
    await keycloakGetRequest(token, `auth/admin/realms/${KEYCLOAK_REALM}/users`)
  ).data.find((user) => user.username === "zendro-admin").id;

  // associate user to roles
  for await (role of ["administrator", "editor", "reader"]) {
    // get roleId
    const realmRoleId = (
      await keycloakGetRequest(
        token,
        `auth/admin/realms/${KEYCLOAK_REALM}/roles/realm-${role}`
      )
    ).data.id;

    await keycloakPostRequest(
      token,
      `auth/admin/realms/${KEYCLOAK_REALM}/users/${userId}/role-mappings/realm`,
      [{ id: realmRoleId, name: `realm-${role}` }]
    );
  }
}

/**
 * setupKeyCloak - run the keyCloak setup
 */
async function setupKeyCloak() {
  const token = await getMasterToken();
  await createDefaultRealm(token);
  await registerClient(token, {
    clientId: KEYCLOAK_CLIENT,
    rootUrl: "http://localhost:3000",
    redirectUris: ["http://localhost:3000/*"],
    publicClient: true,
  });
  await createDefaultRealmRoles(token);
  await createDefaultClientRoles(token, KEYCLOAK_CLIENT);
  await associateCompositeRoles(token, KEYCLOAK_CLIENT);
  await createDefaultUser(token);
}

module.exports = { setupKeyCloak };
