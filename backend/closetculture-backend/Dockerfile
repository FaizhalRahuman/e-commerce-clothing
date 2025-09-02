# Use official Java 17 + Maven image
FROM maven:3.9.4-eclipse-temurin-17

# Set working directory
WORKDIR /app

# Copy only pom.xml first to leverage Docker cache
COPY pom.xml .
COPY mvnw .
COPY .mvn .mvn

# Copy the rest of the source code
COPY src ./src

# Make mvnw executable
RUN chmod +x mvnw

# Build the jar
RUN ./mvnw clean package -DskipTests

# Expose port
EXPOSE 8080

# Replace the last line in Dockerfile
CMD ["java", "-jar", "target/ClosetCulture-0.0.1-SNAPSHOT.jar"]


