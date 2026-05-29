This mobile application serves as a pantry tracker and recipe suggestion for users.

Framework: React Native + Expo (Frontend), Spring Boot (Backend)

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
