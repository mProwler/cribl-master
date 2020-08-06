# cribl-master

### Docker
Start docker container instance, listening on port 8181
```shell script
cd ./cribl-master
docker build -t mprowler/cribl-master .
docker run -p 8181:8181 --rm -d --name cribl-master-demo mprowler/cribl-master
```

Shutdown instances and remove image
```shell script
cd ./cribl-master
docker stop cribl-master-demo
docker image rm mprowler/cribl-master
```

### Postman
[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/923a0b898e27b486afd8)
