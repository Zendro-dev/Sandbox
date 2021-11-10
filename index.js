const express = require("express");
const app = express();
const port = 3000;
const { v4: uuidv4 } = require("uuid");
const axios = require("axios");
var jwt = require("jsonwebtoken");

// env
const OAUTH2_SERVICE =
  "http://localhost:8080/auth/realms/test/protocol/openid-connect/auth";
const OAUTH2_CLIENT_ID = "express";
const OAUTH2_REDIRECT_URI = "http://localhost:3000/redirect_after_auth";
const OAUTH2_TOKEN_URI =
  "http://localhost:8080/auth/realms/test/protocol/openid-connect/token";

const JWT_SECRET = "shhh";
const state = uuidv4();
// const OAUTH2_CLIENT_SECRET = "" ; HTML5/Javascript clients have to be public: no secret

// var session = require("express-session");
// var Keycloak = require("keycloak-connect");

// var memoryStore = new session.MemoryStore();

// let kcConfig = {
//   clientId: "express",
//   bearerOnly: false,
//   serverUrl: "http://localhost:8080/auth",
//   realm: "test",
// };

// var keycloak = new Keycloak({ store: memoryStore }, kcConfig);

// app.use(
//   session({
//     secret: "some secret",
//     resave: false,
//     saveUninitialized: true,
//     store: memoryStore,
//   })
// );

// app.use(keycloak.middleware());

// app.get("/", keycloak.protect(), (req, res) => {
//   // console.log(req);
//   const token = req.kauth.grant.access_token;
//   console.log({ token });
//   res.send("Hello World!");
// });

const getRoles = (token) => {
  // ? we cannot use jwt.verify because we don't have any secret to verify with
  const decoded_token = jwt.decode(token);
  // ? dear zendro programmer, if you don't want to use keycloak, please match
  // ? the incoming token to your user-roles HERE
  const { roles } = decoded_token.resource_access[OAUTH2_CLIENT_ID];
  return roles;
};

app.get("/login", (req, res) => {
  const oauth2Endpoint = `${OAUTH2_SERVICE}?response_type=code&client_id=${OAUTH2_CLIENT_ID}&redirect_uri=${OAUTH2_REDIRECT_URI}&state=${state}`;
  res.redirect(oauth2Endpoint);
});

app.get("/redirect_after_auth", async (req, res) => {
  // res.send("login");
  console.log(res.req.query);
  const { code, state } = res.req.query;
  try {
    const response = await axios({
      method: "post",
      url: `${OAUTH2_TOKEN_URI}`,
      data: `grant_type=authorization_code&code=${code}&client_id=${OAUTH2_CLIENT_ID}&redirect_uri=${OAUTH2_REDIRECT_URI}`,
      headers: {
        "content-type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    });
    // TODO check if the state matches
    const { access_token } = response.data;
    console.log(access_token);
    const roles = getRoles(access_token);
    const roles_encode_and_signed = jwt.sign({ roles }, JWT_SECRET);
    res.json({ token: access_token, roles: roles_encode_and_signed });
  } catch (error) {
    throw new Error(error);
  }

  // res.send("<HTML><BODY><H1>LOGIN SUCCESS</H1></BODY></HTML>");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
