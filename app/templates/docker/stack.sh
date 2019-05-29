#!/bin/sh
docker build -t @project.artifactId@:@project.version@ .
docker stack deploy --compose-file docker-compose.yml @project.artifactId@