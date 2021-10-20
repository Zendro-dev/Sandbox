const express = require('express')
const app = express()
const port = 3000

var session = require('express-session');
var Keycloak = require('keycloak-connect');

var memoryStore = new session.MemoryStore();

let kcConfig = {
  clientId: "express",
	bearerOnly: false,
  serverUrl: 'http://localhost:8080/auth',
  realm: 'test'
};

var keycloak = new Keycloak({ store: memoryStore }, kcConfig);

app.use(session({
  secret: 'some secret',
  resave: false,
  saveUninitialized: true,
  store: memoryStore
}));

app.use(keycloak.middleware());


app.get('/login', (req, res) => {
  res.send('login')
})

app.get('/', keycloak.protect(), (req, res) => {
	// console.log(req);
	console.log(req.kauth);
	res.send('Hello World!');
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})