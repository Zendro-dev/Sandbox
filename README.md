# Zenv-FKA Sandbox Example

## Requirements

This sandbox requires `docker`, `docker-compose`, and `yarn` installed globally.

In addition, clone the `develop` branch of the [`zendro-env`](https://github.com/Zendro-dev/zendro-env.git) repository and use `npm link` to have it available in your `PATH`.

## Usage

Use `zendro-env --help` to see available commands. Use `zendro-env <command> --help` to see individual commands and options.

Use the `-v` option to run tasks synchronously and with extra debug information.

Some examples below.

```sh
# default command
# setup, generate code, apply patches, init docker and keep it running
zendro-env -k

# setup only
zendro-env setup    # --services, --modules, --update

# codegen only
zendro-env codegen  # --code, --patch, --clean

# docker only
zendro-env docker   # --up, --down, --check

# change branch using the CLI
zendro-env branch <service-name> <branch>

# remove everything
zendro-env destroy  # --cache, --modules, --services, --docker
```

## Configuration

By default, all services and models (codegens) are configured to be `remote`. This means they are cloned from the remote and will be destroyed/recreated when running some commands.

If you want changes to be permanent, you can clone a local repository and pass its relative path to the appropriate model or service. Local repositories are considered `source` by the app and have special behavior.

```jsonc
{
  "services": [
    {
      "name": "gql_server",
      "template": "./path/to/local/graphql-server/folder", // do NOT append .git here
      //"branch": "issue-foreign-key-arrays",              // branch is ignored for "source" repos
      "url": "http://localhost:3000/graphql"
    },
    {
      "name": "spa_server",
      "branch": "master",
      "template": "https://github.com/Zendro-dev/single-page-app.git",
      "url": "http://localhost:8080"
    }
  ],
  "models": [
    {
      "codegen": "../path/to/gql-codegen/folder", // do NOT append .git here
      // "branch": "issue-foreign-key-arrays",    // branch is ignored for "source" repos
      "options": [ "--migrations" ],
      "path": "../env_config/data_models",
      "targets": [ "gql_server" ]
    },
    {
      "codegen": "https://github.com/Zendro-dev/single-page-app-codegen.git",
      "branch": "master",
      "options": [ "-P", "-D" ],
      "path": "../env_config/data_models",
      "targets": [ "spa_server" ]
    }
  ]
}
```

Any changes you `stage` in any local git repository will be applied automatically to their child services. That way even re-creating everything preserves your changes.

Be aware, though, that some commands, such as `branch`, won't work on `source` repositories. It is expected that the user manages their local repositories appropriately. The CLI should inform you of this when a command is skipping a `source` repo.


## Troubleshooting

It might happen that after running this sandbox, a `node_modules/.cache/` package in the `spa_server` service requires special permissions to remove, causing the `setup` and `destroy` commands to fail with an `EACCESS` error.

This happens because:

1. docker-compose initializes containers as `root`
2. we mount the `node_modules` folder to the containers

Any dynamically generated files, such as those created by webpack `babel-loader` within `node_modules/.cache/`, will be owned by docker as `root`, and therefore require elevated permissions to be deleted.

Fixing this requires passing the `uid` and `gid` of the current user to `docker`. Working on it.