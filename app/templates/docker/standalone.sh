#!/bin/sh
docker build -t @project.artifactId@:@project.version@ .
docker run --name @project.artifactId -m 256m -d -p 8080:8080 -p 9090:9090 @project.artifactId@:@project.version@