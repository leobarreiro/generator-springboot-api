#!/bin/sh
docker build -t @project.artifactId@:@project.version@ .
docker run --name @project.artifactId@ -m 256m -d -p 8080:8080 -p 9090:9090 @project.artifactId@:@project.version@

docker run --name mongodb -dt -m 256m -p 27017:27017 -v /var/local/docker/volumes/mongo:/bitnami bitnami/mongodb:4.1