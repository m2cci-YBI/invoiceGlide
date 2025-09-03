FROM eclipse-temurin:17-jdk AS build
WORKDIR /build
COPY . /build
RUN apt-get update && apt-get install -y maven && rm -rf /var/lib/apt/lists/*
RUN mvn -q -f pom.xml -pl invoice-service -am -DskipTests package

FROM eclipse-temurin:17-jre
ENV JAVA_OPTS=""
WORKDIR /app
COPY --from=build /build/invoice-service/target/*.jar /app/app.jar
EXPOSE 8082
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar /app/app.jar"]
