
# Working with docker stack

In order to set up your application, you can use the docker stack suite. To do this, execute this two commands below:

1. build the application image
2. run docker stack build


# Build the application image #
```
docker build -t @project.artifactId@:@project.version@ .
```
After this build finishes, you can see the image built using this command:
```
docker image ls
```
You should see the image called @project.artifactId@, with the version tag @project.version@.


# Run the docker stack
This command is used to setting up your complete stack: since the frontend app to the database backend and metrics support.

```
docker stack deploy --compose-file docker-compose.yml @project.artifactId@
```
Note: *docker stack* runs only on swarm mode. Please execute _docker swarm init_ before docker stack commands.
