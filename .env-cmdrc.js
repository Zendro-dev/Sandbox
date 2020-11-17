module.exports = {
  development: {
    APP_NAME: "BrapiReact",
    BASE_URL: "/",
    GRAPHQL_SERVER: "http://localhost:3000/graphql",
    LOGIN_URL: "http://localhost:8000/login",
    PORT: 8000
  },
  production: {
    APP_NAME: "BrapiReact",
    BASE_URL: "/BrapiReact",
    GRAPHQL_SERVER: "http://graphql.zendro-dev.org",
    LOGIN_URL: "http://graphql.zendro-dev.org/login",
    NODE_ENV: "production",
    PORT: 8000
  }
}
