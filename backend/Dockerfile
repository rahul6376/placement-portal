# ===== Stage 1: Build the application =====
FROM maven:3.9.9-eclipse-temurin-21 AS build

WORKDIR /app

# Copy Maven descriptor first (better caching)
COPY pom.xml .
RUN mvn -q -DskipTests dependency:go-offline

# Copy source code
COPY src ./src

# Build the jar
RUN mvn -q -DskipTests clean package


# ===== Stage 2: Run the application =====
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Copy jar from build stage
COPY --from=build /app/target/backend-0.0.1-SNAPSHOT.jar app.jar

# Render provides PORT automatically
ENV PORT=8081

EXPOSE 8081

ENTRYPOINT ["java","-jar","app.jar"]