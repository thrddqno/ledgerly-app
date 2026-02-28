# ./ledgerly-main/ledgerly-api/Dockerfile
# Use OpenJDK 21 slim image
# Resource: https://docs.docker.com/get-started/docker-concepts/building-images/writing-a-dockerfile/
FROM openjdk:21-ea-21

LABEL authors="antonio"

# Set working directory inside container
WORKDIR /app

# Copy Maven wrapper and project files
COPY mvnw .
COPY .mvn/ .mvn/
COPY pom.xml .
COPY src/ ./src/

# Package the app
RUN ./mvnw clean package -DskipTests

# Run the Spring Boot jar
CMD ["java", "-jar", "target/ledgerly-api-0.0.1-SNAPSHOT.jar"]