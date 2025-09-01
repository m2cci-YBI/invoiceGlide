FROM eclipse-temurin:17-jdk AS build
WORKDIR /build
COPY . /build
RUN apt-get update && apt-get install -y maven && rm -rf /var/lib/apt/lists/*
RUN mvn -q -f pom.xml -pl mailing-service -am -DskipTests package

FROM eclipse-temurin:17-jre
ENV JAVA_OPTS="-Xms256m -Xmx512m"
WORKDIR /app
COPY --from=build /build/mailing-service/target/*.jar /app/app.jar
EXPOSE 8083
ENTRYPOINT ["sh","-c","java $JAVA_OPTS -jar /app/app.jar"]