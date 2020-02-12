FROM fabric8/java-alpine-openjdk8-jre:1.6.5

ENV JAVA_APP_JAR=@project.artifactId@-@project.version@.jar \
    TZ=America/Sao_Paulo \
    SPRING_PROFILES_ACTIVE="stack" \
    JAVA_OPTIONS="-Xmx256m" \
    CONTAINER_MAX_MEMORY=256m \
    JAVA_APP_NAME="@project.artifactId@" \
    AB_OFF=true

ADD $JAVA_APP_JAR /deployments/@project.artifactId@-@project.version@.jar