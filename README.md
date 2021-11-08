# Setup the local MIAPPE instance

### Run the docker containers

To start the docker containers run

```
docker-compose -f docker-compose-prod.yml up -d --force-recreate --remove-orphans
```

### Add a amazonS3 bucket

To add a bucket to the minio container go to `http://localhost:9001/login`. You can login with

```
Username: minio
Password: miniominio
```

After login, create a bucket via the GUI. Name the bucket `data`.
![alt text](./images/create-bucket.png)

### Upload the Table

Unzip the csv file located in the root directory of the Sandbox repository

```
bunzip2 E-CURD-1-query-results.tpms.csv.bz2
```

Go to the bucket you just created and upload the table.
![alt text](./images/upload-table.png)

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

```
{
  investigationsConnection(pagination:{first:10}) {
    investigations{
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
Username: admin@zen.dro
Password: admin
```

You should be able to browse your data, as well as the distibuted data from the public MIAPPE endpoint.
