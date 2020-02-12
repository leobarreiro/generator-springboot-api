#!/bin/sh
#docker build -t @project.artifactId@:@project.version@ .
#docker run --name @project.artifactId@ -m 256m -d -p 8080:8080 -p 9090:9090 @project.artifactId@:@project.version@
<% if (mongodb) { %>docker run --name <%=artifact%>-mongo -d -p 27017:27017 -m 128m -e MONGODB_ROOT_PASSWORD=root123 -e MONGODB_USERNAME=<%=artifact%> -e MONGODB_PASSWORD=<%=randomPasswd%> -e MONGODB_DATABASE=<%=artifact%> -v /usr/local/docker/volumes/mongo:/bitnami bitnami/mongodb:4.2.2<% } %>
<% if (kafka) { %>docker run -p 2181:2181 -p 9092:9092 -m 256m --name <%=artifact%>-kafka -d -e ADVERTISED_HOST=localhost -e ADVERTISED_PORT=9092 spotify/kafka<% } %>
<% if (rabbit) { %>docker run --name <%=artifact%>-rabbit -d -p 5672:5672 -p 15672:15672 -m 128m -e RABBITMQ_DEFAULT_USER=<%=artifact%> -e RABBITMQ_DEFAULT_PASS=<%=randomPasswd%> rabbitmq:3.7.14-management-alpine<% } %>
<% if (mqtt) { %>docker run --name mosquitto -d -p 1883:1883 -p 9001:9001 -m 64m eclipse-mosquitto:1.6.8<% } %>
