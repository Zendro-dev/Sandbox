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

To run individual commands:

## Troubleshooting

It might happen that after running this sandbox, a `node_modules/.cache/` package in the `spa_server` service requires special permissions to remove, causing the `setup` and `destroy` commands to fail with an `EACCESS` error.

This happens because:

1. docker-compose initializes containers as `root`
2. we mount the `node_modules` folder to the containers

Any dynamically generated files, such as those created by webpack `babel-loader` within `node_modules/.cache/`, will be owned by docker as `root`, and therefore require elevated permissions to be deleted.

Fixing this requires passing the `uid` and `gid` of the current user to `docker`. Working on it.