
# Working with docker stack

In order to set up your application, you need to build an docker image, containing your java springboot microservice compiled. To do this, execute these two commands below:

1. build the application image
2. run docker stack build


## Building the application image
Execute this command in your shell (or terminal)
```shell
$ docker build -t @project.artifactId@:@project.version@ .
```

Wait the end of the build image process, then you can see the built image by executing this command:
```
$ docker image ls
```

You should see the image called **@project.artifactId@**, with the version tag **@project.version@**.


## Running the stack on work station
In order to start your application running in Eclipse or other favorite IDE, you need all the integrations running on docker service mode. For example, if your microservice uses postgres and kafka, these services must be running on docker service, before you run the microservice in a IDE. The steps below facilites the set up of these required services on docker.

#### 1. Start the swarm mode in your docker
This step is a prerequisite to running docker services
```
$ docker swarm init
```

#### 2. Compile the application using maven

```
$ mvn clean package
```

#### 3. Go to the target folder, generated after compilation
```
$ cd target
```

#### 4. Turn the script dev-docker.sh executable
```
$ chmod +x dev-stack.sh
```

#### 5. Execute the script and set up all the required services
```
$ ./dev-stack.sh
```
That's all, wait for the complete start up and happy coding / debugging in your IDE.

## Running the docker stack on server
When you have coded your microservice and need to run a version in a server (homologation server, production, for exemple), execute the steps described in the section "Running the stack of tools on work station", replacing the script **dev-stack.sh** by **server-stack.sh**.

The script **server-stack.sh** executes all the commands to start the required service integrations same as the dev-stack script, but also executes a build of a new docker image, containing your microservice source code compiled.

