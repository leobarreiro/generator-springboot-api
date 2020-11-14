#!/bin/sh
docker build -t @project.artifactId@:@project.version@ .
docker stack deploy --compose-file server-compose.yml @project.artifactId@