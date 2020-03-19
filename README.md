# Sandbox
A playground used for development, experiments, and alien abductions.

## Branches

Branches are used for different experimental setups. 

### Master

The master branch is setup with distributed data models.

#### Setup

##### Submodules

To checkout the respective submodules used in this project, execute
```
git submodule update --init --recursive
```

##### Data model definitions

Make sure, that the directories `data_model_definitions` in the two submodules 
* LocalCenzontleInstance
* RemoteCenzontleInstance
are symbolic links to `./data_model_definitions`. If they are not, delete the respective dirs and execute

```
cd ./LocalCenzontleInstance && ln -s ../data_model_definitions
```

and

```
cd ./RemoteCenzontleInstance && ln -s ../data_model_definitions
```

##### Create the docker image of the Cenzontle code generators

Use any of the Dockerfile.code-generators either in RemoteCenzontleInstance or LocalCenzontleInstance and execute
```
docker build -f Dockerfile.code-generators -t sciencedb-code-generators:latest .
```

##### Generate the Cenzontle interfaces (graphql-server and single-page-app)

The following has to be done in each of the submodule StarterPacks
* LocalCenzontleInstance
* RemoteCenzontleInstance

```
# Execute from this project's root dir "Sandbox"
docker run -it --rm -v `pwd`:/opt --user <user_id>:<group_id> sciencedb-code-generators:latest
# Create the graphql-server
# - in the "local" Cenzontle instance
graphql-server-model-codegen --jsonFiles /opt/data_model_definitions/ -o /opt/LocalCenzontleInstance/graphql-server
# - in the "remote" Cenzontle instance
graphql-server-model-codegen --jsonFiles /opt/data_model_definitions/ -o /opt/RemoteCenzontleInstance/graphql-server
# Create the single-page-applications
# - in the "local" Cenzontle instance
single-page-app-codegen --jsonFiles /opt/data_model_definitions/ -o /opt/LocalCenzontleInstance/single-page-app
# - in the "remote" Cenzontle instance
single-page-app-codegen --jsonFiles /opt/data_model_definitions/ -o /opt/RemoteCenzontleInstance/single-page-app
```

Note, that the above `<user_id>` and `<group_id>` can be obtained from the `id` Shell command.
