# Dishcision — Claude Code Reference

## Project Overview

Pantry-aware recipe suggestion mobile app. Users log ingredients, get recipe suggestions ranked by pantry match, and track expiry dates to reduce food waste. iOS-first, built for budget-conscious users.

**Sprint status:**

- Sprint 1 (Pantry CRUD) ✅ complete
- Sprint 2 (Recipes + suggestions) ✅ complete
- Sprint 3 (SavedRecipes + UserPreferences) — next
- Sprint 4 (CookingHistory + matching engine)

---

## Repository Structure

```
Dishcision/
├── App Concept/                    # Documents detailing app concept, feature ideas, visual prototype, etc.
    └──
├── src/
│   └── backend/                        # Spring Boot (Maven)
│   │   └── src/main/java/com/dishcision/backend/
│   │       ├── config/
│   │       │   └── DataSeeder.java     # Seeds ingredients + aliases on startup
│   │       ├── controller/             # HTTP layer only — no business logic here
│   │       │   ├── AuthController.java
│   │       │   ├── IngredientController.java
│   │       │   └── PantryController.java
│   │       ├── dto/                    # Request/response shapes — never expose entities directly
│   │       │   ├── PantryItemRequest.java
│   │       │   ├── PantryItemResponse.java
│   │       │   └── IngredientSearchResult.java
│   │       ├── model/                  # JPA entities (map to DB tables)
│   │       │   ├── User.java
│   │       │   ├── Ingredient.java
│   │       │   ├── IngredientAlias.java
│   │       │   ├── PantryItem.java
│   │       │   └── UnitType.java       # Enum: WEIGHT / VOLUME / COUNT
│   │       ├── repository/             # Spring Data JPA interfaces — no implementation needed
│   │       │   ├── UserRepository.java
│   │       │   ├── IngredientRepository.java
│   │       │   ├── IngredientAliasRepository.java
│   │       │   ├── PantryItemRepository.java
│   │       ├── security/
│   │       │   ├── JwtFilter.java      # Validates Bearer token, sets UserDetailsImpl as principal
│   │       │   ├── JwtUtil.java        # Token generation + validation
│   │       │   ├── SecurityConfig.java        # Configures Spring Security
│   │       │   ├── UserDetailsImpl.java       # Wraps User for Spring Security
│   │       │   └── UserDetailsServiceImpl.java
│   │       ├── service/                # Business logic layer
│   │       │   ├── AuthService.java
│   │       │   ├── IngredientService.java
│   │       │   └── PantryService.java
│   │       └── resources/
│   │           └── application.properties
│   └──frontend/                       # React Native + Expo (Expo Router)
│       └── app/
│       │   ├── _layout.jsx             # Root layout — GestureHandlerRootView lives here
│       │   ├── index.jsx               # Start screen
│       │   ├── recipe-detail.jsx       # Recipe details screen
│       │   ├── suggestions.jsx         # Recipe suggestions screen
│       │   ├── (auth)/                 # Login + register screens (no tab bar)
│       │   └── (dashboard)/            # Main app screens
│       │       ├── _layout.jsx         # Dashboard page layout - Tabs live here
│       │       ├── home.jsx            # Home tab
│       │       ├── pantry.jsx          # Pantry tab
│       │       ├── recipes.jsx         # Recipes tab
│       │       └── profile.jsx         # Profile tab
│       ├── components/
│       │   ├── AddIngredientSheet.jsx   # Bottom sheet modal for add/edit
│       │   ├── OnboardingOverlay.jsx    # Onboarding overlay display for new users
│       │   ├── PickerField.jsx          # Tap-to-reveal picker (iOS safe)
│       │   ├── Spacer.jsx               # Blank spacer
│       │   ├── SwipeableRecipeItem.jsx  # Recipe item template (swipe to save)
│       │   ├── ThemedLogo.jsx           # Logo template
│       │   ├── ThemedText.jsx           # Text template
│       │   ├── ThemedView.jsx           # View template for SafeAreaInsets
│       │   ├── PickerField.jsx          # Tap-to-reveal picker (iOS safe)
│       │   └── Toast.jsx                # Toast message display
│       ├── services/
│       │   ├── client.js               # Axios instance with JWT interceptor
│       │   └── pantryApi.js            # Pantry + ingredient API wrappers
│       ├── context/
│       │   ├── AuthContext.js          # Global auth state (token, user, login/logout)
│       │   ├── OnboardingContext.js    # Global onboarding state
│       │   └── ThemeContext.js         # Global theme/colour tokens
│       ├── hooks/
│       │   └── useToast.js             # Used to display toast message
│       ├── constants/
│       │   └── colors.js               # Stores theme colour palettes for light/dark mode
│       └── assets/
```

---

## Tech Stack

### Backend

- **Java 21** + **Spring Boot 4** (4.0.5 — uses **Jackson 3**, package `tools.jackson.*`)
- **Spring Security** with stateless JWT auth (BCrypt password hashing)
- **PostgreSQL** via Spring Data JPA / Hibernate
- **Maven** for dependency management
- **Lombok** (`@Data`, `@Builder`, `@RequiredArgsConstructor`) — always use it, never write manual getters/setters

### Frontend

- **React Native** + **Expo SDK** (Expo Router for file-based navigation)
- **axios** for HTTP (via `services/client.js` which auto-attaches JWT)
- **expo-secure-store** for token persistence
- **React Context** for global state (auth, theme)
- **react-native-gesture-handler** for swipe interactions
- **@react-native-picker/picker** + **@react-native-community/datetimepicker**

---

## Conventions

### Backend

- **Strict layered architecture**: Controller → Service → Repository. No repository calls in controllers. No HTTP knowledge in services.
- **Always use DTOs**: Never return `@Entity` objects from controllers. Map in the service layer.
- **User identity in controllers**: Always resolve the current user via `SecurityContextHolder`, never accept `userId` as a request parameter.
  ```java
  private Long getCurrentUserId() {
      UserDetailsImpl principal = (UserDetailsImpl)
          SecurityContextHolder.getContext().getAuthentication().getPrincipal();
      return principal.getId();
  }
  ```
- **Ownership checks**: Always use compound repository queries like `findByIdAndUserId(id, userId)` — never fetch then check owner separately.
- **`@Transactional`**: Use `readOnly = true` on GET service methods. All writes need a plain `@Transactional`.
- **`@ToString.Exclude`** on all bidirectional JPA relationships to prevent Lombok `StackOverflowError`.
- **REST status codes**: `POST` → 201, `DELETE` → 204, everything else → 200.
- **`BigDecimal`** for all quantities — never `float` or `double`.
- **Date serialisation**: Always include in `application.properties`:
  ```properties
  spring.jackson.datatype.datetime.write-dates-as-timestamps=false
  ```
  ⚠️ Jackson 3 moved `WRITE_DATES_AS_TIMESTAMPS` from `SerializationFeature` to `DateTimeFeature`. The old Jackson 2 form `spring.jackson.serialization.write-dates-as-timestamps` **fails startup** on Spring Boot 4. For any Jackson property, the authority is the jar, not this doc:
  ```bash
  unzip -p ~/.m2/repository/org/springframework/boot/spring-boot-jackson/4.0.5/spring-boot-jackson-4.0.5.jar \
    META-INF/spring-configuration-metadata.json | grep -i datetime
  ```

### Frontend

- **Named exports** for all API wrapper functions in `services/`:
  ```js
  export const getPantry = async () => { ... }  // ✅
  export default getPantry                        // ❌ don't do this
  ```
- **Always return `response.data`** from API wrappers, not the raw `response`.
- **Query params** on GET requests use `{ params: { q } }`, not a second positional argument:
  ```js
  client.get("/ingredients/search", { params: { q } }); // ✅
  client.get("/ingredients/search", q); // ❌
  ```
- **Template literals** for URL interpolation — always backticks:
  ```js
  client.delete(`/pantry/${id}`); // ✅
  client.delete("/pantry/${id}"); // ❌ sends literal "${id}"
  ```
- **`StyleSheet.create()` is static** — dynamic theming requires the `useAppColors` hook with `useMemo`.
- **`useFocusEffect`** for data fetching in tab screens, not `useEffect` — ensures refresh on re-navigation.
- **`useMemo`** for all derived/filtered/sorted data (filtered lists, sections, etc.).
- **Never nest `ScrollView` inside `SectionList`** with the same orientation — use horizontal `FlatList` inside `ListHeaderComponent` for filter chips.
- **`PickerField` component** for all pickers — never use `@react-native-picker/picker` directly inside a `View` with `overflow: hidden` (invisible on iOS).
- **Fonts**: Fraunces (headings/display) + DM Sans (body). Font family strings: `Fraunces_600SemiBold`, `DMSans_400Regular`, `DMSans_600SemiBold`.
- **`GestureHandlerRootView`** must wrap the root layout in `app/_layout.jsx` or `Swipeable` won't work.

### Design System

- **Colours**: `#243D1A` forest green, `#C05C2A` terracotta, `#FBF7F2` cream
- **Expiry status**: urgent = today/tomorrow (`#C94040`), warn = ≤3 days (`#D97E20`), fresh = beyond (`#4A8A2E`)
- **Border radius**: cards `20px`, inputs `14px`, chips `100px` (pill)

---

## Database Schema (Current)

```
users                  — id, email, password, name
ingredients            — id, canonical_name, default_unit, unit_type, category
ingredient_aliases     — id, ingredient_id (FK), alias
pantry_items           — id, user_id (FK), ingredient_name, canonical_ingredient_id (FK nullable),
                         quantity, unit, expiry_date, category, created_at, updated_at
```

**Upcoming (Sprint 2+):**

```
recipes                — id, name, cuisine, cook_time_minutes, servings, cost_per_serve, calories
recipe_ingredients     — id, recipe_id (FK), canonical_ingredient_id (FK), quantity, unit
recipe_dietary_tags    — id, recipe_id (FK), tag
user_saved_recipes     — id, user_id (FK), recipe_id (FK)
cooking_history        — id, user_id (FK), recipe_id (FK), cooked_at
user_preferences       — id, user_id (FK), diet_type, allergies, budget
```

---

## Unit Type Rules

- Units only auto-select within the same type group — never cross types
- WEIGHT: `g`, `kg`, `oz`, `lb`
- VOLUME: `ml`, `l`, `cups`, `tbsp`, `tsp`
- COUNT: `pieces`, `cloves`, `heads`, `bunches`, `cans`
- Static lookup: 1 garlic head = 10 cloves (handled at service layer, not DB)
- Cross-type mismatches (e.g. "200ml of chicken") → prompt user, never auto-deduct

---

## Common Commands

### Backend

```bash
# Run Spring Boot dev server
./mvnw spring-boot:run

# Run from project root if mvnw not in PATH
cd backend && ./mvnw spring-boot:run

# Build JAR
./mvnw clean package -DskipTests

# Run tests
./mvnw test
```

### Frontend

```bash
# Start Expo dev server
npx expo start

# Start with cleared cache (use after adding packages or on weird errors)
npx expo start --clear

# Install a new Expo-compatible package
npx expo install <package-name>

# Run on iOS simulator
npx expo start --ios

# Run on Android
npx expo start --android
```

### Database (PostgreSQL)

```bash
# Connect to local DB
psql -U dishcision_user -d dishcision

# If app user can't create tables (newer Postgres versions)
GRANT CREATE ON SCHEMA public TO dishcision_user;
```

---

## Do Not Touch

```
backend/target/                  # Maven build output
frontend/.expo/                  # Expo cache
frontend/node_modules/           # JS dependencies
frontend/android/                # Generated native Android project
frontend/ios/                    # Generated native iOS project
frontend/dist/                   # Expo build output
```

Do not modify these files without explicit instruction:

- `frontend/app/_layout.jsx` — root layout, font loading, auth redirect logic
- `frontend/services/client.js` — JWT interceptor, base URL config
- `backend/src/main/resources/application.properties` — DB credentials, JWT secret

---

## Constraints

- **Never expose entity objects in API responses** — always map to a DTO first
- **Never accept `userId` from the request body or path** — always read from `SecurityContextHolder`
- **Never use `float`/`double` for ingredient quantities** — use `BigDecimal`
- **Never modify `DataSeeder.java` seed data** mid-sprint — if changes are needed, drop and recreate the ingredients table
- **Never use `StyleSheet.create()` for colour values** that depend on theme — use the `useAppColors` hook
- **Recipe data licensing**: do not scrape or hardcode recipes from external sites without confirming the licensing approach (Spoonacular API vs manual seed is still TBD for Sprint 2)
- **Keep project path clean**: Metro bundler hangs when the project path contains spaces — keep codebase in `~/Developer/Dishcision` or equivalent

---

## Known Gotchas

- `SplashScreen.preventAutoHideAsync()` must be called at **module level**, not inside a component
- Tab `animation: 'none'` prevents blank screen flashes on navigation
- `@react-native-picker/picker` is invisible on iOS when clipped by `overflow: 'hidden'` — always use the `PickerField` component which uses tap-to-reveal
- `ReanimatedSwipeable` requires `useAnimatedStyle`/`interpolate` from `react-native-reanimated` — do not mix with the old `Animated` API
- PostgreSQL newer versions require `GRANT CREATE ON SCHEMA public` for the app user before Hibernate can create tables
- `DataSeeder` guard is `ingredientRepository.count() > 0` — if seeding silently skips on a fresh DB, check that the `ingredients` table actually exists and is empty
