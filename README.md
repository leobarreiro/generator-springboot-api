# What it does

generator-springboot-api is a yeoman generator to build springboot microservices from scratch. 

# Installation

## Prerequisites
1. [NPM](http://npmjs.org)
2. [Yeoman](http://yeoman.io)
```
$ npm install -g yo@latest
```

```
$ npm install -g generator-springboot-api
```

# Features
Generation of full-functional springboot application using
* Maven
* Spring-boot
* DevTools


# Options
Start from this command:
```
$ yo springboot-api
```
Type a groupId and artifactId to your application.

## Embed servers
You can chose between one of this options:
* undertow
* tomcat
* jetty

## Other options
* AMQP: RabbitMQ
* Cache: Redis
* Database: Postgres
