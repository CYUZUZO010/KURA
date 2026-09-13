FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app

# Install dependency tools first
RUN apk add --no-cache maven

# Copy files and run compilation
COPY pom.xml ./
COPY src ./src
RUN mvn -q clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
