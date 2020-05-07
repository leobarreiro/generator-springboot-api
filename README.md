# How this springboot-api generator works

The generator-springboot-api is a yeoman generator that builds a springboot microservices from scratch. Its goal is to assemble a pre-configured, compilable and ready-to-code spring-boot project.

# Installation

## Prerequisites
1. Java JDK 8 or newer (can be an open-jdk distro)
2. Maven 3+
3. [NPM](http://npmjs.org)
4. [Yeoman](http://yeoman.io)
5. [docker](https://docs.docker.com/install/) 
6. [docker-compose](https://docs.docker.com/compose/install/)


To install yeoman:
```
$ npm install -g yo@latest
```

To install this generator:
```
$ npm install -g generator-springboot-api
```

# Features
Generation of fully-functional springboot REST API, using:
* Java 8
* Maven 3+
* Spring-boot 2.2 REST API

## Integrations
This generator allows to integrate the springboot REST API with:
* PostgreSQL
* RabbitMQ
* Apache Kafka
* Redis for cache
* MQTT
* InfluxDB for metrics

## Additionally, this generator creates:
* A docker-compose yaml file, describing the complete stack
* A complete docker stack with all depedencies (including all the integrations above listed)
* A set of curl requests serving as a basis for implementing new features
* A Postman collection with functional requests 

# How to use
Remember you must install npm, yeoman and generator-springboot-api before use them. See the Prerequisites above.

1. Start from this command
```
$ yo springboot-api
```

2. Type a groupId using maven patterns (e.g. com.quasarbot.api)

3. Type an artifactId using maven patterns (e.g. myApplication)

4. Choose once embed server (mandatory)
* undertow
* tomcat
* jetty

5. Select the aditional options as below
* Devtools
* Mongo DB
* Redis Cache
* Spring Actuator
* Metrics InfluxDB
* Swagger Docs

6. Select a message queue if you want
* None
* RabbitMQ
* Apache Kafka
* MQTT

After this simple options, the generator will assembly your springboot api, using all the resources choosen.

7. Compile with Maven
Once your application is assembled, compile it using maven:

```
$ cd path_to_your_app
$ mvn clean package -U
```

8. After this maven command, all the resources compiled can be found in the *target* directory
* JAR file compiled;
* Script shell to setting up a complete docker stack (and a docker-compose file);
* Script shell to use your API with standalone docker container dependencies;
* A complete set of curl requests, corresponding to the integrations you have chosen;
* A postman collection to test your API.

```
$ cd target
```

9. If you want to set up the complete docker stack, use the shell script *stack.sh*.
This script will build the docker image using the jar file and setting up the stack, including all the defined services.

First, make the script executable:
```
$ chmod +x stack.sh
```
And finnaly execute the script:
```
$ ./stack.sh
```

Note: In order to use *docker stack* and *docker service* you must initialize the swarm-mode before:
```
$ docker swarm init
```