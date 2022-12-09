# Local MIAPPE zendro data-warehouse

This document is intended to give step-by-step instructions on how to setup and use the local MIAPPE zendro instance. 

## Setup the local MIAPPE instance from the Sandbox

### Project requirements
 * [NodeJS](https://nodejs.org/en/) version 16+ is required.
 * [docker](https://docs.docker.com/get-docker/)
 * [docker-compose](https://docs.docker.com/compose/install/#install-compose)
 * [yarn](https://classic.yarnpkg.com/lang/en/docs/install/#debian-stable)

### Get the code

```sh
git clone https://github.com/Zendro-dev/Sandbox.git european_biohackathon-local
cd european_biohackathon-local
git checkout european_biohackathon-local
```
### Install packages

In folder `graphql-server`, please execute:
```
npm install
```
Note, Node 16+ is necessary for the project.

### Configure files for environment variables

Please add the following configuration files. `.env` file is mandatory for the project. And there are two modes in Zendro, namely production and development. We suggest to add `.env.production` files for the production mode. If you prefer to use development mode, you can also add them.

1. in `graphql-server` folder, add `.env` file as the following:
```
ALLOW_ORIGIN="*"
OAUTH2_TOKEN_URI="http://zendro-keycloak:8080/auth/realms/zendro/protocol/openid-connect/token"
GRAPHIQL_REDIRECT_URI=""
SPA_REDIRECT_URI=""
MAIL_SERVICE=""
MAIL_HOST=""
MAIL_ACCOUNT=""
MAIL_PASSWORD=""
ERROR_LOG="compact"
EXPORT_TIME_OUT="3600"
LIMIT_RECORDS="10000"
PORT="3000"
POST_REQUEST_MAX_BODY_SIZE="1mb"
MAX_TIME_OUT="2000"
REQUIRE_SIGN_IN="true"
SALT_ROUNDS="10"
WHITELIST_ROLES=""
DOWN_MIGRATION="false"
RECORD_DELIMITER=""
FIELD_DELIMITER=""
ARRAY_DELIMITER=""
SHEET_NAME=""
MIGRATION_USERNAME=""
MIGRATION_PASSWORD=""
```
2. in `graphiql-auth` folder, add the following files:
the `.env.development` file:
```
NEXT_PUBLIC_ZENDRO_GRAPHQL_URL="http://localhost:3000/graphql"
NEXT_PUBLIC_ZENDRO_METAQUERY_URL="http://localhost:3000/meta_query"
ZENDRO_DATA_MODELS="../data_model_definitions"
OAUTH2_ISSUER="http://zendro-keycloak:8080/auth/realms/zendro"
OAUTH2_TOKEN_URI="http://zendro-keycloak:8080/auth/realms/zendro/protocol/openid-connect/token"
OAUTH2_AUTH_URI="http://localhost:8081/auth/realms/zendro/protocol/openid-connect/auth"
OAUTH2_LOGOUT_URL="http://localhost:8081/auth/realms/zendro/protocol/openid-connect/logout"
NEXTAUTH_URL="http://localhost:7000/api/auth"
NEXTAUTH_SECRET="abc"
```

the `.env.development` file:
```
NEXT_PUBLIC_ZENDRO_GRAPHQL_URL="http://localhost:3000/graphql"
NEXT_PUBLIC_ZENDRO_METAQUERY_URL="http://localhost:3000/meta_query"
ZENDRO_DATA_MODELS="../data_model_definitions"
OAUTH2_ISSUER="http://zendro-keycloak:8080/auth/realms/zendro"
OAUTH2_TOKEN_URI="http://zendro-keycloak:8080/auth/realms/zendro/protocol/openid-connect/token"
OAUTH2_LOGOUT_URL="http://localhost:8081/auth/realms/zendro/protocol/openid-connect/logout"
NEXTAUTH_URL="http://localhost:7000/api/auth"
NEXTAUTH_SECRET="abc"
```
Note: `NEXTAUTH_SECRET` could be customized as any string.

3. in `single-page-app` folder, add the following files:
the `.env.development` file:
```
NEXT_PUBLIC_ZENDRO_GRAPHQL_URL="http://localhost:3000/graphql"
NEXT_PUBLIC_ZENDRO_METAQUERY_URL="http://localhost:3000/meta_query"
NEXT_PUBLIC_ZENDRO_ROLES_URL="http://zendro-graphql-server:3000/getRolesForOAuth2Token"
NEXT_PUBLIC_ZENDRO_MAX_UPLOAD_SIZE="500"
NEXT_PUBLIC_ZENDRO_MAX_RECORD_LIMIT="10000"
NEXT_PUBLIC_REDUX_LOGGER="false"
ZENDRO_DATA_MODELS="../data_model_definitions"
RECORD_DELIMITER=""
FIELD_DELIMITER=""
ARRAY_DELIMITER=""
SHEET_NAME=""
OAUTH2_ISSUER="http://zendro-keycloak:8080/auth/realms/zendro"
OAUTH2_TOKEN_URI="http://zendro-keycloak:8080/auth/realms/zendro/protocol/openid-connect/token"
OAUTH2_LOGOUT_URL="http://localhost:8081/auth/realms/zendro/protocol/openid-connect/logout"
NEXTAUTH_URL="http://localhost:8080/api/auth"
NEXTAUTH_SECRET="abc"
```

the `.env.development` file:
```
NEXT_PUBLIC_ZENDRO_GRAPHQL_URL="http://localhost:3000/graphql"
NEXT_PUBLIC_ZENDRO_METAQUERY_URL="http://localhost:3000/meta_query"
NEXT_PUBLIC_ZENDRO_ROLES_URL="http://zendro-graphql-server:3000/getRolesForOAuth2Token"
NEXT_PUBLIC_ZENDRO_MAX_UPLOAD_SIZE="500"
NEXT_PUBLIC_ZENDRO_MAX_RECORD_LIMIT="10000"
NEXT_PUBLIC_REDUX_LOGGER="false"
ZENDRO_DATA_MODELS="../data_model_definitions"
RECORD_DELIMITER=""
FIELD_DELIMITER=""
ARRAY_DELIMITER=""
SHEET_NAME=""
OAUTH2_ISSUER="http://zendro-keycloak:8080/auth/realms/zendro"
OAUTH2_TOKEN_URI="http://zendro-keycloak:8080/auth/realms/zendro/protocol/openid-connect/token"
OAUTH2_LOGOUT_URL="http://localhost:8081/auth/realms/zendro/protocol/openid-connect/logout"
NEXTAUTH_URL="http://localhost:8080/api/auth"
NEXTAUTH_SECRET="abc"
```
Note: `NEXTAUTH_SECRET` could be customized as any string.

### Run the docker containers

`Suggested`: To start the docker containers in the production mode run

```bash
docker-compose -f docker-compose-prod.yml up -d --force-recreate --remove-orphans
```
To start the docker containers in the development mode run

```bash
docker-compose -f docker-compose-dev.yml up -d --force-recreate --remove-orphans
```

### Populate the MIAPPE Meta-data

Go to `localhost:3000/graphql` and run the following GraphQL mutation

```graphql
mutation {
  addInvestigation(
    id: "zendro_local/MIAPPE/v1.1/investigation/1"
    title: "MY OWN EXTENSION to Araport 11 - RNA-seq of Arabidopsis thaliana Col-0 plants under different growth conditions from multiple studies"
    description: "Using the public Araport 11 data, we study gene expression in our own growing conditions and compare it to the public data"
  ) {
    id
    title
    description
  }
  addStudy(
    id: "zendro_local/MIAPPE/v1.1/study/1"
    title: "Assessment of Gene Expression in Etiolation conditions"
    description: "Arabidopsis thaliana Col-0 plants will be grown in complete absence of light. Gene Expression will be measured with RNA-Seq"
    institution: "At Home, where else? Or maybe on this alien's UFO? Should be possible, too"
    location_country: "Mars, the planet"
    addInvestigation: "zendro_local/MIAPPE/v1.1/investigation/1"
  ) {
    id
    title
    description
    institution
    location_country
    investigation {
      id
      title
    }
  }
  addData_file(
    id: "zendro_local/MIAPPE/v1.1/data_file/1"
    description: "Table of gene expression data, one gene per row. Columns indicate combinations of genotype * sampled tissue * growing conditions (treatment). Cells hold Transcripts Per Million [TPM] values."
    url: "http://localhost:9000/data/E-CURD-1-query-results.tpms.csv"
    addStudy: "zendro_local/MIAPPE/v1.1/study/1"
  ) {
    id
    description
    url
    study {
      id
      title
    }
  }
}
```

The warehouse is now populated with some example MIAPPE metadata. There is also some distributed data available on the 'public' MIAPPE server, that you should be able to request.

In the GraphiQL interface try running a query like

```graphql
{
  investigationsConnection(pagination: { first: 10 }) {
    investigations {
      id
      title
      description
    }
  }
}
```

You should be able to see both the investigation created on your local instance (`zendro_local/MIAPPE/v1.1/investigation/1`) as well as another investigation on the public instance (`zendro_public/MIAPPE/v1.1/investigation/1`)

### Access the browser interface.

After starting the docker services the browser single-page-application (SPA) should be available at `localhost:8080`. The SPA needs to compile, which might take a minute or two.

You can log into the SPA via the default user credentials

```
Username: zendro-admin
Password: admin
```

You should be able to browse your data, as well as the distibuted data from the public MIAPPE endpoint.

### Plot the data



### Stop the containers
`Suggested`: To stop the docker containers in the production mode run

```bash
docker-compose -f docker-compose-prod.yml down --remove-orphans
```
To stop the docker containers in the development mode run

```bash
docker-compose -f docker-compose-dev.yml down --remove-orphans
```