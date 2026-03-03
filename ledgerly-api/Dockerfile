# Use OpenJDK 21 slim image
# Resource: https://docs.docker.com/get-started/docker-concepts/building-images/writing-a-dockerfile/
# Build stage
FROM openjdk:21-rc-jdk AS builder

WORKDIR /app

COPY mvnw .
COPY .mvn/ .mvn/
COPY pom.xml .

# Download dependencies
RUN ./mvnw dependency:go-offline -B

COPY src/ ./src/

# Package the app
RUN ./mvnw clean package -DskipTests

# Runtime stage
FROM openjdk:21-rc-jdk

WORKDIR /app

# Copy only the jar from builder stage
COPY --from=builder /app/target/ledgerly-api-0.0.1-SNAPSHOT.jar .

CMD ["java", "-jar", "ledgerly-api-0.0.1-SNAPSHOT.jar"]