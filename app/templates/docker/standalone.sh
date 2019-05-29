#!/bin/sh
docker build -t @project.artifactId@:@project.version@ .
docker run --name @project.artifactId@ -m 256m -d -p 8080:8080 -p 9090:9090 @project.artifactId@:@project.version@

docker run --name mongodb -dt -m 256m -p 27017:27017 -v /var/local/docker/volumes/mongo:/bitnami bitnami/mongodb:4.1

docker run -d -m 256m --name zookeeper -p 2181:2181 -p 2888:2888 -p 3888:3888 --network kafka-tier debezium/zookeeper:0.9.5.Final
docker run --name kafka -d -m 256m --network kafka-tier -p 9092:9092 -e 'ZOOKEEPER_CONNECT=zookeeper:2181' --link zookeeper:zookeeper debezium/kafka:0.9.5.Final