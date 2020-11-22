# How this springboot-api generator works

The generator-springboot-api is a yeoman generator that builds a springboot microservices from scratch. Its goal is to assemble a pre-configured, compilable and ready-to-code spring-boot project.

# Installation

## Prerequisites
1. Java JDK 11 or newer (can be an open-jdk distro)
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
* Java 11
* Maven 3+
* Spring-boot 2.2 REST API

## Integrations
This generator allows to integrate the springboot REST API with:
* PostgreSQL
* Oracle
* RabbitMQ
* Apache Kafka
* Redis for cache
* MQTT (for IoT)
* InfluxDB for metrics

## Additionally, this generator creates:
* Two docker-compose yaml files, describing the complete stack to running on localhost and server;
* A complete docker stack with all depedencies (including all the integrations above listed)
* A set of curl requests serving as a basis for implementing new features
* A Postman collection with functional requests 

# Get started
Remember you must install npm, yeoman and generator-springboot-api before use them. See the Prerequisites above.

Open your shell (or powershell) and type these follow commands:

* Invoke the springboot generator with yeoman

```
$ yo springboot-api
```

* Type a groupId using maven patterns (e.g. com.quasarbot.api)


* Type an artifactId using maven patterns (e.g. myApplication)


* Choose once embed server (mandatory)
```
undertow
tomcat
jetty
netty (webflux)
```

* Select the aditional options as below
```
Devtools
Mongo DB
Redis for Cache
Spring Actuator
InfluxDB for Metrics
Swagger Docs
```

* Select a message-queue system, if you want
```
None
RabbitMQ
Apache Kafka
MQTT
```

After this simple options, the generator will assembly your springboot api, using all the choosen resources.


* Compile with Maven
Once your application is assembled, compile it using maven:

```
$ cd path_to_your_app
$ mvn package -U
```

* After this maven command, all the resources compiled can be found in the *target* directory

	1. JAR file compiled;
	2. Scripts shell to setting up a complete docker stack (and a docker-compose file) for two environments: local machine and server;
	3. Script shell to use your API with standalone docker container dependencies;
	4. A complete set of curl requests, corresponding to the integrations you have chosen;
	5. A postman collection to test your API.

```
$ cd target
```

## Setting up the complete stack on local machine
If you want to set up the complete docker stack, use the shell script *stack.sh*. This script will start all the docker services to support the integrations of your microservice to run it in you local machine.

* First, make the script executable:
```
$ chmod +x dev-stack.sh
```

* And finnaly execute the script:
```
$ ./dev-stack.sh
```

The script above will create all the *docker services* necessary to start up your microservice. So you can import the maven project in your favourite IDE and start to code and debug. 


Note: In order to use *docker stack* and *docker service* you must initialize the swarm-mode before:
```
$ docker swarm init
```
