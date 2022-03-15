"use strict";
const { DOWN_MIGRATION } = require("../config/globals");
const waitOn = require("wait-on");
const path = require("path");

const GQL_ENV = require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});
const SPA_PRD_ENV = require("dotenv").config({
  path: path.resolve(__dirname, "../../single-page-app/.env.production"),
});
const GIQL_PRD_ENV = require("dotenv").config({
  path: path.resolve(__dirname, "../../graphiql-auth/.env.production"),
});

const {
  setupKeyCloak,
  cleanupKeyCloak,
  KEYCLOAK_BASEURL,
  KEYCLOAK_GIQL_CLIENT,
  KEYCLOAK_SPA_CLIENT,
  KEYCLOAK_GQL_CLIENT,
} = require("../utils/setup-keycloak");
const axios = require("axios");
/**
 * @module - Migrations to create or to drop a table correpondant to a sequelize model.
 */
module.exports = {
  /**
   * up - configure the keycloak instance with zendro defaults
   *
   * @param  {object} zendro initialized zendro object
   */
  up: async (zendro) => {
    function writeEnvFile(file, env) {
      const parsedEnvString = Object.entries(env)
        .map((entry) => `${entry[0]}='${entry[1]}'`)
        .reduce((a, c) => {
          a += c + "\n";
          return a;
        }, "");
      fs.writeFileSync(file, parsedEnvString);
    }
    // wait for keycloak service to be available
    // setup default keycloak instance
    try {
      await waitOn({ resources: [KEYCLOAK_BASEURL], timeout: 60000 });
      const {
        KEYCLOAK_PUBLIC_KEY,
        KEYCLOAK_GIQL_CLIENT_SECRET,
        KEYCLOAK_SPA_CLIENT_SECRET,
      } = await setupKeyCloak();

      console.log(`Successfully created default keycloak zendro realm, client, roles.
          A default user "zendro-admin" with password "admin" was created to login to the
          zendro services. Please delete that user before publically deploying zendro.
          To login to the keycloak admin console use credentials user: "admin"
          pw: "admin" at "${KEYCLOAK_BASEURL}/auth". Change that user / password to your liking.
          `);

      // write ENV variables
      // graphql-server
      // fs.appendFileSync(
      //   path.resolve(__dirname, "../.env"),
      //   `\nOAUTH2_PUBLIC_KEY="${KEYCLOAK_PUBLIC_KEY}"\nOAUTH2_CLIENT_ID=${KEYCLOAK_GQL_CLIENT}`
      // );

      if (GQL_ENV.error || GIQL_PRD_ENV.error || SPA_PRD_ENV.error) {
        console.warn(
          `Error when reading .env files ${JSON.stringify(
            {
              "graphql-server .env": GQL_ENV.error,
              "graphiql-auth .env.production": GIQL_PRD_ENV.error,
              "spa .env.production": SPA_PRD_ENV.error,
            },
            null,
            2
          )}`
        );
      }
      // graphql-server
      let envPath = path.resolve(__dirname, "../.env");
      let parsedEnv = GQL_ENV.parsed;
      parsedEnv.OAUTH2_PUBLIC_KEY === undefined
        ? (parsedEnv.OAUTH2_PUBLIC_KEY = KEYCLOAK_PUBLIC_KEY)
        : console.warn(`OAUTH2_PUBLIC_KEY was already defined in ${envPath}`);
      parsedEnv.KEYCLOAK_GQL_CLIENT === undefined
        ? (parsedEnv.OAUTH2_CLIENT_ID = KEYCLOAK_GQL_CLIENT)
        : console.warn(`OAUTH2_CLIENT_ID was already defined in ${envPath}`);
      writeEnvFile(envPath, parsedEnv);

      // graphiql-auth
      if (GIQL_PRD_ENV.parsed) {
        envPath = path.resolve(
          __dirname,
          "../../graphiql-auth/.env.production"
        );
        parsedEnv = GIQL_PRD_ENV.parsed;
        parsedEnv.OAUTH2_CLIENT_ID === undefined
          ? (parsedEnv.OAUTH2_CLIENT_ID = KEYCLOAK_GIQL_CLIENT)
          : console.warn(`OAUTH2_CLIENT_ID was already defined in ${envPath}`);
        parsedEnv.OAUTH2_CLIENT_SECRET === undefined
          ? (parsedEnv.OAUTH2_CLIENT_SECRET = KEYCLOAK_GIQL_CLIENT_SECRET)
          : console.warn(
              `OAUTH2_CLIENT_SECRET was already defined in ${envPath}`
            );
        writeEnvFile(envPath, parsedEnv);
      }

      // single-page-app
      if (SPA_PRD_ENV.parsed) {
        envPath = path.resolve(
          __dirname,
          "../../single-page-app/.env.production"
        );
        parsedEnv = SPA_PRD_ENV.parsed;
        parsedEnv.OAUTH2_CLIENT_ID === undefined
          ? (parsedEnv.OAUTH2_CLIENT_ID = KEYCLOAK_SPA_CLIENT)
          : console.warn(`OAUTH2_CLIENT_ID was already defined in ${envPath}`);
        parsedEnv.OAUTH2_CLIENT_SECRET === undefined
          ? (parsedEnv.OAUTH2_CLIENT_SECRET = KEYCLOAK_SPA_CLIENT_SECRET)
          : console.warn(
              `OAUTH2_CLIENT_SECRET was already defined in ${envPath}`
            );
        writeEnvFile(envPath, parsedEnv);
      }

      // // graphiql-auth
      // fs.appendFileSync(
      //   path.resolve(__dirname, "../../graphiql-auth/.env.development"),
      //   `\nOAUTH2_CLIENT_SECRET=${KEYCLOAK_GIQL_CLIENT_SECRET}\nOAUTH2_CLIENT_ID=${KEYCLOAK_GIQL_CLIENT}`
      // );

      // fs.appendFileSync(
      //   path.resolve(__dirname, "../../graphiql-auth/.env.production"),
      //   `\nOAUTH2_CLIENT_SECRET=${KEYCLOAK_GIQL_CLIENT_SECRET}\nOAUTH2_CLIENT_ID=${KEYCLOAK_GIQL_CLIENT}`
      // );

      // // single-page-app
      // fs.appendFileSync(
      //   path.resolve(__dirname, "../../single-page-app/.env.development"),
      //   `\nOAUTH2_CLIENT_SECRET=${KEYCLOAK_SPA_CLIENT_SECRET}\nOAUTH2_CLIENT_ID=${KEYCLOAK_SPA_CLIENT}`
      // );

      // fs.appendFileSync(
      //   path.resolve(__dirname, "../../single-page-app/.env.production"),
      //   `\nOAUTH2_CLIENT_SECRET=${KEYCLOAK_SPA_CLIENT_SECRET}\nOAUTH2_CLIENT_ID=${KEYCLOAK_SPA_CLIENT}`
      // );

      console.log(
        "Successfully added OAuth2 keycloak PUBLIC_KEY, CLIENT_ID and CLIENT_SECRET environment variables."
      );
    } catch (error) {
      console.error(error);
    }
  },

  /**
   * down - Drop a table.
   *
   * @param  {object} zendro initialized zendro object
   */
  down: async (zendro) => {
    try {
      await cleanupKeyCloak();
    } catch (error) {
      throw new Error(error);
    }
  },
};
