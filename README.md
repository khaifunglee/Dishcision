This mobile application serves as a pantry tracker and recipe suggestion for users.

Framework: React Native + Expo (Frontend), Spring Boot (Backend)

## Setup Instructions

### PostgreSQL

1. Install PostgreSQL per your operating system instructions, then start with `brew services start postgresql@18`.
2. Create your DB:

```
psql postgres
CREATE DATABASE dishcision_db;
CREATE USER dishcision_user WITH PASSWORD 'yourpassword';
GRANT ALL PRIVILEGES ON DATABASE dishcision_db TO dishcision_user;
\q
```

3. Grant user schema creation rights:

```
GRANT ALL PRIVILEGES ON DATABASE dishcision_db TO dishcision_user;
\c dishcision_db
GRANT ALL ON SCHEMA public TO dishcision_user;
GRANT CREATE ON SCHEMA public TO dishcision_user;
\q
```

### Backend

1. Generate Spring Boot project on 'start.spring.io' with the following configurations:

- Project: Maven
- Language: Java
- Spring Boot: 3.x
- Group: `com.dishcision`
- Artifact: `backend`
- Packaging: Jar
- Java: 21

2. Add these dependencies:

- `Spring Web`
- `Spring Security`
- `Spring Data JPA`
- `PostgreSQL Driver`
- `Lombok`
- `Validation`

3. Configure `application.properties`:

```
# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/dishcision_db
spring.datasource.username=dishcision_user
spring.datasource.password=yourpassword

# JPA / Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

# App port
server.port=8080

# JWT Secret
jwt.secret=secret-key-at-least-32-characters-long
jwt.expiration=86400000
```

4. Configure `pom.xml`:

```
<!-- JWT -->
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.12.3</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.12.3</version>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.12.3</version>
    <scope>runtime</scope>
</dependency>
<!-- PostgreSQL dependency -->
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>org.postgresql</artifactId>
</dependency>
```

5. Start backend with `./mvnw spring-boot:run`

### Frontend

1. Start frontend with `npx expo start --clear`

## Changelog

### 13-04-2026

**Created blank React Native template**:

- Added a few introductory pages
- Installed Expo Router to enable easy navigation between pages
- Created colour scheme for light/dark themed colours
- Created themed components to allow for easier templating for the app's text, cards, images, etc.
- Added route groups & nested layouts by creating Login & Register page

### 14-04-2026

**Added simple React Native features**:

- Added themed pressable components for easier templating for buttons
- Added bottom tab bar for home dashboard pages
- Added safe area view into themed view component

### 15-04-2026

**Setting up Backend and Database**:

- Created PostgreSQL database and setup Spring Boot backend
- Added essential dependencies for user authentication
- Configured database connection to connect to backend server

### 16-04-2026

**Completed Backend Setup**:

- Created business logic for user authentication and handle incoming auth requests
- Configured Spring Security to filter and clean incoming HTTP requests for security practices
- Resolved minor startup issues for Spring Boot

### 17-04-2026

**Integrated React Native with Spring Boot**:

- Created API client and REST APIs to call for frontend to communicate with backend
- Implemented React Context to determine global user auth state
- Added automatic navigation handling based on user auth state
- Added register, login, and logout functions on the respective pages

### 03-05-2026

**Added and Designed Key App Screens**:

- Added core screens of Dishcision such as welcome screen, home dashboard, pantry, recipe, suggestions pages
- Designed screens with main theme colours of forest green and terracotta and Fraunces font

### 26-05-2026

**Completed Visual Prototype**:

- Added features such as dark mode, remember me for logins, and onboarding overlay messages for newly registered users
- Added more complex frontend features such as bottom sheet add/edit ingredient sheet modal and swipeable recipe item components
- Fixed numerous minor visual bugs, polished UI/UX of the application

### 11/6/2026

**Implemented Pantry-related functions**:

- Created ingredient seed database
- Wired live pantry data to pantry and home page
- Added functions such as add/edit pantry items with autofill, search & filter, expiry status tracker

### 16/6/2026

**Implemented Recipe-related functions**:

- Created recipe seed database and wired live recipe data to recipes and home page
- Redesigned recipe details page to take dynamic recipe details
- Added functions such as search & filter, recipe suggestions for suggestions page

### 25/6/2026

**Implemented user preferences & save recipe functions**:

- Created user preferences such as dietary preferences, allergy tags, text size to allow user customization
- Users can now add dietary preferences upon registration
- Added functions such as save recipe, automatic filtering for suggestions based on user's diet tags
- Design choice: cook recipe deducts soonest expiring recipe ingredients, (also deduct ingredients with insufficient quantity with warning)

# 9/7/2026

**Last update before deploying to production**:

- Added simple email authentication via Gmail SMTP
- Improved UX across multiple features, e.g expiry alert days, colour changes
- Added partial match case to deduct insufficient quantity ingredients with warning after cook recipe
- Restructured cross-unit conversion to now resolve through ingredient-specific known conversions
- Increased ingredient & recipe database in seeders
