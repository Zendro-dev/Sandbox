<h1 align=center>Async Connections</h1>

An experimental repository to test the performance and behaviour of `pg-native`, `pg-promise`, and `sqlite` packages when querying multiple databases asynchronously.

## Usage

### Setup

This repository is configured to used `yarn workspaces`. Make sure to run `yarn install` after cloning it.

To generate the data use to populate the databases, run the following command.

```bash
yarn setup
```

_This command will create a `table.txt` file within the `data` folder, consisting of two columns, `id` and `payload`, and `1M` rows._

The number of rows can be modified by passing a number argument to the above command.

```bash
yarn setup 10000  # create 100k rows
```

### Postgres

#### Initialize

To contain the databases, a `docker-compose-postgres.yml` file is provided. To build the images, initialize the databases, and import the data, run the following command.

```bash
yarn init:pg
```

#### Execute Queries

Two libraries, [`pg-native`](https://github.com/brianc/node-pg-native) and [`pg-promise`](https://github.com/vitaly-t/pg-promise), are used to query up to five postgres containers. To execute the queries using either of the two, run one of the following commands.

```bash
yarn start:pgn  # pg-native
# or
yarn start:pgp  # pg-promise
```

### SQLite

#### Initialize

SQLite databases are stored in files within the `experiments/async-sqlite` folder. To initialize the databases and import the data, run the following command.

```bash
yarn init:sql
```

#### Execute Queries

To execute queries using `sqlite`, run the following command.

```bash
yarn start:sql
```

### Clean

To clean up generated data, containers, and other temporary project files, run one of the following commands.

```bash
yarn clean --all    # remove data, postgres images/containers/volumes, and sqlite databases
yarn clean --data   # remove generated data
yarn clean --pg     # remove postgres images, containers, and volumes
yarn clean --sqlite # remove sqlite databases
```

### Other Options

To manage the `docker-compose` files, use any of the following commands.

```bash
yarn compose --pg up   # build postgres images (if not build) and up containers
yarn compose --pg down # remove postgres containers and volumes (i.e. a soft cleanup)
```

To log into a running postgres database container, run the following command.

```bash
yarn logdb "<DB>:<PORT>"  # e.g. yarn logdb pg:5001
```

_Currently, only `pg` (postgres) is supported for `<DB>`. Ports can be any of the exposed values in `docker-compose-postgres.yml` (5000-5004)._
