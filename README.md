# What it does

The generator-springboot-api is a yeoman generator that builds a springboot microservices from scratch. 

# Installation

## Prerequisites
1. Java JDK 8 (can be an open-jdk distro)
2. Maven 3+
3. [NPM](http://npmjs.org)
4. [Yeoman](http://yeoman.io)

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
* Redis-cache
* InfluxDB for metrics

## Additionally, this generator creates:
* Postman collection
* Curl requests

# How to use

1. Start from this command
```
$ yo springboot-api
```

2. Type a groupId using maven patterns (e.g. org.javaleo.api)

3. Type an artifactId using maven patterns (e.g. springfield)

3. Choose a embed servers (mandatory)
* undertow
* tomcat
* jetty

4. Pick other options
* Mongo DB
* RabbitMQ AMQP
* Redis Cache
* Postgres Database
* Spring Actuator
* InfluxDB Metrics

After this, the generator will assembly your springboot api, using all the resources choosen.

5. Compile with Maven
```
$ cd path_to_your_app
$ mvn clean package -U
```

6. After maven compilation, all the resources can be found in the *target* directory
* JAR file compiled
* Script shell to set up a complete docker stack
* Curl requests
* Postman collection to test your api

```
$ cd target
```

7. In the case you want to set up the complete docker stack, use the shell script *stack.sh*.
This script will build the docker image using the jar file and set up the stack, including all the services defined.

First turn the script executable:
```
$ chmod +x stack.sh
```
Execute the script:
```
$ ./stack.sh
```

Note: In order to use *docker stack* and *docker service* you must initialize the swarm before:
```
$ docker swarm init
```