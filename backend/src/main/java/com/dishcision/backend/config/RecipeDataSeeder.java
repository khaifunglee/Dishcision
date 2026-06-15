// This file loads a manual seed database for recipes
package com.dishcision.backend.config;

import com.dishcision.backend.model.*;
import com.dishcision.backend.repository.IngredientRepository;
import com.dishcision.backend.repository.RecipeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;

// Seeds 30 recipes after all CommandLineRunner beans (including DataSeeder) have finished.
// Uses @EventListener(ApplicationReadyEvent.class) to guarantee ingredient data exists first.
@Component
@RequiredArgsConstructor
@Slf4j
public class RecipeDataSeeder {

    private final RecipeRepository recipeRepository;
    private final IngredientRepository ingredientRepository;

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    // Fires after ingredient data seeder finishes seeding
    public void seed() {
        if (recipeRepository.count() > 0) {
            log.info("Recipes already seeded, skipping.");
            return;
        }

        log.info("Seeding recipe data...");

        Ingredient chicken = find("Chicken Breast");
        Ingredient eggs = find("Eggs");
        Ingredient milk = find("Whole Milk");
        Ingredient cheddar = find("Cheddar Cheese");
        Ingredient parmesan = find("Parmesan");
        Ingredient butter = find("Butter");
        Ingredient pasta = find("Pasta (Penne)");
        Ingredient rice = find("White Rice");
        Ingredient oliveOil = find("Olive Oil");
        Ingredient cannedTom = find("Canned Tomatoes");
        Ingredient soy = find("Soy Sauce");
        Ingredient flour = find("Plain Flour");
        Ingredient sugar = find("Sugar");
        Ingredient tomatoes = find("Tomatoes");
        Ingredient onion = find("Onion");
        Ingredient garlic = find("Garlic");
        Ingredient spinach = find("Spinach");
        Ingredient carrot = find("Carrot");
        Ingredient broccoli = find("Broccoli");
        Ingredient lemon = find("Lemon");
        // 30 recipes for now, can add more later on...
        // ── Italian ─────────────────────────────────────────────────────────────

        seedRecipe("Pasta Arrabiata", "Italian", 25, 2, bd("3.20"), 480,
                tags(DietaryTag.VEGETARIAN, DietaryTag.VEGAN),
                steps("Boil salted water and cook penne until al dente. Reserve ½ cup pasta water before draining.",
                        "Heat olive oil and sauté diced onion until soft. Add minced garlic and cook 1 minute.",
                        "Add canned tomatoes, season generously, and simmer 10 minutes.",
                        "Toss drained pasta through the sauce, loosening with pasta water as needed."),
                ris(ri("penne pasta", pasta, bd("200"), "g"),
                        ri("canned tomatoes", cannedTom, bd("400"), "g"),
                        ri("garlic", garlic, bd("3"), "cloves"),
                        ri("olive oil", oliveOil, bd("2"), "tbsp"),
                        ri("onion", onion, bd("1"), "pieces")));

        seedRecipe("Pasta Pomodoro", "Italian", 20, 2, bd("3.50"), 460,
                tags(DietaryTag.VEGETARIAN),
                steps("Cook penne in salted boiling water. Drain, reserving some pasta water.",
                        "Heat olive oil, sauté garlic 1 minute. Add fresh tomatoes and cook until they break down, ~8 min.",
                        "Season with salt and pepper. Toss pasta through the sauce.",
                        "Plate up and finish with grated parmesan."),
                ris(ri("penne pasta", pasta, bd("200"), "g"),
                        ri("fresh tomatoes", tomatoes, bd("3"), "pieces"),
                        ri("garlic", garlic, bd("2"), "cloves"),
                        ri("olive oil", oliveOil, bd("3"), "tbsp"),
                        ri("parmesan", parmesan, bd("30"), "g")));

        seedRecipe("Cacio e Pepe", "Italian", 15, 2, bd("2.80"), 540,
                tags(DietaryTag.VEGETARIAN),
                steps("Cook penne in well-salted water until al dente. Reserve 1 cup pasta water.",
                        "Melt butter in a pan over low heat. Add a generous grind of black pepper and toast briefly.",
                        "Add drained pasta and a splash of pasta water. Toss vigorously.",
                        "Off heat, fold in grated parmesan until silky, adding pasta water as needed."),
                ris(ri("penne pasta", pasta, bd("200"), "g"),
                        ri("parmesan", parmesan, bd("80"), "g"),
                        ri("butter", butter, bd("30"), "g")));

        seedRecipe("Chicken Parmigiana", "Italian", 40, 2, bd("5.50"), 620,
                tags(),
                steps("Pound chicken breasts flat. Coat each in flour then beaten egg.",
                        "Pan-fry in olive oil until golden on both sides. Transfer to a baking dish.",
                        "Spoon canned tomatoes over each breast. Top with grated parmesan.",
                        "Bake at 200°C for 15 minutes until cheese is golden and chicken is cooked through."),
                ris(ri("chicken breast", chicken, bd("400"), "g"),
                        ri("canned tomatoes", cannedTom, bd("400"), "g"),
                        ri("parmesan", parmesan, bd("60"), "g"),
                        ri("plain flour", flour, bd("60"), "g"),
                        ri("eggs", eggs, bd("2"), "pieces"),
                        ri("olive oil", oliveOil, bd("3"), "tbsp")));

        seedRecipe("Chicken & Spinach Pasta", "Italian", 30, 2, bd("4.80"), 520,
                tags(),
                steps("Cook penne in salted water until al dente.",
                        "Slice chicken, season, and pan-fry in olive oil until cooked through, ~7 minutes.",
                        "Add garlic to the pan and cook 1 minute. Add spinach and toss until wilted.",
                        "Toss drained pasta through the chicken and spinach. Finish with parmesan."),
                ris(ri("penne pasta", pasta, bd("200"), "g"),
                        ri("chicken breast", chicken, bd("250"), "g"),
                        ri("spinach", spinach, bd("100"), "g"),
                        ri("garlic", garlic, bd("2"), "cloves"),
                        ri("olive oil", oliveOil, bd("2"), "tbsp"),
                        riOpt("parmesan", parmesan, bd("30"), "g")));

        seedRecipe("Aglio e Olio", "Italian", 20, 2, bd("2.40"), 490,
                tags(DietaryTag.VEGETARIAN),
                steps("Cook penne in well-salted water. Reserve 1 cup pasta water before draining.",
                        "Thinly slice garlic. Heat olive oil in a pan and cook garlic over medium-low until golden.",
                        "Add pasta with a generous splash of pasta water. Toss to coat.",
                        "Squeeze lemon juice over, toss again, and serve with grated parmesan."),
                ris(ri("penne pasta", pasta, bd("200"), "g"),
                        ri("garlic", garlic, bd("4"), "cloves"),
                        ri("olive oil", oliveOil, bd("4"), "tbsp"),
                        ri("lemon", lemon, bd("1"), "pieces"),
                        riOpt("parmesan", parmesan, bd("40"), "g")));

        // ── Asian ────────────────────────────────────────────────────────────────

        seedRecipe("Chicken Stir Fry", "Asian", 20, 2, bd("4.50"), 480,
                tags(),
                steps("Cook white rice according to packet directions.",
                        "Slice chicken into thin strips. Season with salt.",
                        "Stir-fry chicken in a hot wok until golden. Add broccoli, onion and garlic.",
                        "Pour in soy sauce, toss everything together, cook 2 more minutes. Serve over rice."),
                ris(ri("chicken breast", chicken, bd("300"), "g"),
                        ri("broccoli", broccoli, bd("250"), "g"),
                        ri("soy sauce", soy, bd("3"), "tbsp"),
                        ri("garlic", garlic, bd("3"), "cloves"),
                        ri("onion", onion, bd("1"), "pieces"),
                        ri("white rice", rice, bd("200"), "g")));

        seedRecipe("Egg Fried Rice", "Asian", 15, 2, bd("2.00"), 420,
                tags(DietaryTag.VEGETARIAN),
                steps("Cook rice and let it cool (day-old rice works best).",
                        "Scramble eggs in a hot wok and push to the side.",
                        "Add onion and garlic, stir-fry until fragrant.",
                        "Add cooled rice and soy sauce. Toss over high heat until well combined."),
                ris(ri("eggs", eggs, bd("3"), "pieces"),
                        ri("white rice", rice, bd("300"), "g"),
                        ri("soy sauce", soy, bd("2"), "tbsp"),
                        ri("garlic", garlic, bd("2"), "cloves"),
                        ri("onion", onion, bd("1"), "pieces")));

        seedRecipe("Chicken Fried Rice", "Asian", 20, 2, bd("3.80"), 500,
                tags(),
                steps("Cook rice and let it cool. Dice chicken into small pieces.",
                        "Cook chicken in a hot wok until golden. Remove and set aside.",
                        "Scramble eggs in the same wok. Add onion and garlic, stir-fry until soft.",
                        "Return chicken, add rice and soy sauce. Toss over high heat."),
                ris(ri("chicken breast", chicken, bd("200"), "g"),
                        ri("white rice", rice, bd("300"), "g"),
                        ri("eggs", eggs, bd("2"), "pieces"),
                        ri("soy sauce", soy, bd("2"), "tbsp"),
                        ri("garlic", garlic, bd("2"), "cloves"),
                        ri("onion", onion, bd("1"), "pieces")));

        seedRecipe("Teriyaki Chicken", "Asian", 25, 2, bd("4.20"), 450,
                tags(),
                steps("Cook white rice according to packet directions.",
                        "Score chicken breasts and marinate in soy sauce and garlic for 10 minutes.",
                        "Pan-fry chicken over medium-high heat, 5–6 minutes each side, basting with marinade.",
                        "Squeeze lemon over rested chicken. Slice and serve over rice."),
                ris(ri("chicken breast", chicken, bd("350"), "g"),
                        ri("soy sauce", soy, bd("4"), "tbsp"),
                        ri("garlic", garlic, bd("3"), "cloves"),
                        ri("white rice", rice, bd("200"), "g"),
                        ri("lemon", lemon, bd("1"), "pieces")));

        seedRecipe("Broccoli & Garlic Stir Fry", "Asian", 15, 2, bd("2.50"), 320,
                tags(DietaryTag.VEGETARIAN, DietaryTag.VEGAN),
                steps("Cook white rice according to packet directions.",
                        "Heat oil in a wok. Add garlic and sliced onion, stir-fry 1 minute.",
                        "Add broccoli florets and stir-fry until bright green and tender-crisp, ~4 minutes.",
                        "Splash in soy sauce, toss to coat, and serve over rice."),
                ris(ri("broccoli", broccoli, bd("300"), "g"),
                        ri("garlic", garlic, bd("3"), "cloves"),
                        ri("soy sauce", soy, bd("2"), "tbsp"),
                        ri("white rice", rice, bd("200"), "g"),
                        ri("onion", onion, bd("1"), "pieces")));

        seedRecipe("Garlic Butter Rice Bowl", "Asian", 15, 2, bd("2.20"), 380,
                tags(DietaryTag.VEGETARIAN),
                steps("Cook white rice until fluffy.",
                        "Melt butter in a pan, add minced garlic, cook until golden.",
                        "Fry eggs to your liking in a separate pan.",
                        "Spoon rice into bowls, drizzle with garlic butter, top with egg and a splash of soy sauce."),
                ris(ri("white rice", rice, bd("300"), "g"),
                        ri("eggs", eggs, bd("2"), "pieces"),
                        ri("butter", butter, bd("30"), "g"),
                        ri("garlic", garlic, bd("3"), "cloves"),
                        ri("soy sauce", soy, bd("1"), "tbsp")));

        // ── Western ──────────────────────────────────────────────────────────────

        seedRecipe("Garlic Butter Chicken", "Western", 30, 2, bd("4.80"), 520,
                tags(),
                steps("Pound chicken breasts to even thickness. Season with salt and pepper.",
                        "Melt butter in a pan over medium-high heat. Cook chicken 5–6 minutes each side until golden.",
                        "Add sliced garlic in the last 2 minutes, basting the chicken as it cooks.",
                        "Squeeze lemon juice over and serve immediately."),
                ris(ri("chicken breast", chicken, bd("400"), "g"),
                        ri("butter", butter, bd("50"), "g"),
                        ri("garlic", garlic, bd("4"), "cloves"),
                        ri("lemon", lemon, bd("1"), "pieces")));

        seedRecipe("Lemon Herb Chicken", "Western", 35, 2, bd("4.50"), 480,
                tags(),
                steps("Mix olive oil, garlic and lemon juice. Marinate chicken for 15 minutes.",
                        "Heat a pan over medium-high. Sear chicken 5 minutes each side.",
                        "Add sliced onion and cook until softened.",
                        "Squeeze remaining lemon over. Rest 5 minutes before serving."),
                ris(ri("chicken breast", chicken, bd("400"), "g"),
                        ri("lemon", lemon, bd("2"), "pieces"),
                        ri("garlic", garlic, bd("4"), "cloves"),
                        ri("olive oil", oliveOil, bd("3"), "tbsp"),
                        ri("onion", onion, bd("1"), "pieces")));

        seedRecipe("Chicken & Carrot Casserole", "Western", 45, 4, bd("3.20"), 380,
                tags(),
                steps("Preheat oven to 180°C. Dice chicken and season well.",
                        "Brown chicken in a casserole dish on the stovetop. Remove and set aside.",
                        "Cook diced onion, sliced carrot, and garlic in the same dish until softened.",
                        "Return chicken, pour over canned tomatoes, cover and bake 30 minutes."),
                ris(ri("chicken breast", chicken, bd("400"), "g"),
                        ri("carrot", carrot, bd("3"), "pieces"),
                        ri("onion", onion, bd("1"), "pieces"),
                        ri("garlic", garlic, bd("2"), "cloves"),
                        ri("canned tomatoes", cannedTom, bd("400"), "g")));

        seedRecipe("Cheesy Scrambled Eggs", "Western", 10, 2, bd("2.80"), 420,
                tags(DietaryTag.VEGETARIAN, DietaryTag.GLUTEN_FREE),
                steps("Whisk eggs with milk, salt and pepper until combined.",
                        "Melt butter in a non-stick pan over medium-low heat.",
                        "Pour in egg mixture. Gently fold with a spatula as it sets.",
                        "When almost set, fold in grated cheddar. Remove from heat and serve immediately."),
                ris(ri("eggs", eggs, bd("4"), "pieces"),
                        ri("cheddar cheese", cheddar, bd("80"), "g"),
                        ri("butter", butter, bd("20"), "g"),
                        ri("whole milk", milk, bd("3"), "tbsp")));

        seedRecipe("Spinach Omelette", "Western", 10, 1, bd("2.20"), 350,
                tags(DietaryTag.VEGETARIAN, DietaryTag.GLUTEN_FREE),
                steps("Whisk eggs with a splash of milk, salt and pepper.",
                        "Melt butter in a non-stick pan over medium heat. Pour in the egg mixture.",
                        "As edges begin to set, scatter spinach and cheddar over one half.",
                        "Fold the omelette over the filling. Cook 1 more minute and slide onto a plate."),
                ris(ri("eggs", eggs, bd("3"), "pieces"),
                        ri("spinach", spinach, bd("60"), "g"),
                        ri("cheddar cheese", cheddar, bd("50"), "g"),
                        ri("butter", butter, bd("15"), "g")));

        seedRecipe("Tomato & Egg Scramble", "Western", 10, 2, bd("1.80"), 280,
                tags(DietaryTag.VEGETARIAN, DietaryTag.GLUTEN_FREE, DietaryTag.DAIRY_FREE),
                steps("Dice tomatoes and onion. Whisk eggs with salt and pepper.",
                        "Heat olive oil in a pan over medium heat. Sauté onion until softened.",
                        "Add tomatoes and cook until they begin to break down, ~3 minutes.",
                        "Pour eggs over the tomato mixture and scramble gently until just set."),
                ris(ri("eggs", eggs, bd("3"), "pieces"),
                        ri("tomatoes", tomatoes, bd("2"), "pieces"),
                        ri("olive oil", oliveOil, bd("1"), "tbsp"),
                        ri("onion", onion, bd("1"), "pieces")));

        // ── Comfort ──────────────────────────────────────────────────────────────

        seedRecipe("Tomato Soup", "Comfort", 25, 4, bd("1.50"), 180,
                tags(DietaryTag.VEGETARIAN, DietaryTag.VEGAN, DietaryTag.GLUTEN_FREE, DietaryTag.DAIRY_FREE),
                steps("Dice onion and garlic. Heat olive oil in a large pot.",
                        "Sauté onion until soft, then add garlic and cook 1 minute.",
                        "Add canned tomatoes and 1 cup water. Simmer 15 minutes.",
                        "Blend until smooth. Season generously and serve."),
                ris(ri("canned tomatoes", cannedTom, bd("800"), "g"),
                        ri("onion", onion, bd("1"), "pieces"),
                        ri("garlic", garlic, bd("3"), "cloves"),
                        ri("olive oil", oliveOil, bd("2"), "tbsp")));

        seedRecipe("Creamy Tomato Soup", "Comfort", 30, 4, bd("2.00"), 240,
                tags(DietaryTag.VEGETARIAN, DietaryTag.GLUTEN_FREE),
                steps("Sauté diced onion and garlic in butter until soft.",
                        "Add canned tomatoes, season, and simmer 15 minutes. Blend until smooth.",
                        "Return to pot, stir in milk over low heat. Do not boil.",
                        "Adjust seasoning. Serve with crusty bread."),
                ris(ri("canned tomatoes", cannedTom, bd("800"), "g"),
                        ri("onion", onion, bd("1"), "pieces"),
                        ri("garlic", garlic, bd("3"), "cloves"),
                        ri("whole milk", milk, bd("200"), "ml"),
                        ri("butter", butter, bd("30"), "g")));

        seedRecipe("Carrot Soup", "Comfort", 30, 4, bd("1.80"), 160,
                tags(DietaryTag.VEGETARIAN, DietaryTag.VEGAN, DietaryTag.GLUTEN_FREE, DietaryTag.DAIRY_FREE),
                steps("Peel and roughly chop carrots and onion.",
                        "Heat olive oil in a pot. Sauté onion until soft, add garlic and cook 1 minute.",
                        "Add carrots and enough water to just cover. Simmer 20 minutes until tender.",
                        "Blend until smooth. Season with salt, pepper, and lemon juice if desired."),
                ris(ri("carrot", carrot, bd("4"), "pieces"),
                        ri("onion", onion, bd("1"), "pieces"),
                        ri("garlic", garlic, bd("2"), "cloves"),
                        ri("olive oil", oliveOil, bd("2"), "tbsp")));

        seedRecipe("Spinach Rice Bowl", "Comfort", 20, 2, bd("2.20"), 340,
                tags(DietaryTag.VEGETARIAN, DietaryTag.VEGAN, DietaryTag.GLUTEN_FREE),
                steps("Cook white rice until fluffy.",
                        "Heat olive oil, add garlic, and cook until golden.",
                        "Add spinach and wilt for 2 minutes. Season with salt.",
                        "Spoon rice into bowls, top with garlic spinach, and squeeze lemon over to finish."),
                ris(ri("white rice", rice, bd("300"), "g"),
                        ri("spinach", spinach, bd("150"), "g"),
                        ri("garlic", garlic, bd("3"), "cloves"),
                        ri("olive oil", oliveOil, bd("2"), "tbsp"),
                        ri("lemon", lemon, bd("1"), "pieces")));

        seedRecipe("Broccoli Cheddar Soup", "Comfort", 30, 4, bd("2.50"), 320,
                tags(DietaryTag.VEGETARIAN, DietaryTag.GLUTEN_FREE),
                steps("Chop broccoli into florets. Dice onion.",
                        "Melt butter in a pot. Sauté onion until soft.",
                        "Add broccoli and milk. Simmer over low heat 15 minutes until broccoli is tender.",
                        "Blend half the soup for a creamy texture. Stir in grated cheddar until melted."),
                ris(ri("broccoli", broccoli, bd("400"), "g"),
                        ri("cheddar cheese", cheddar, bd("150"), "g"),
                        ri("whole milk", milk, bd("400"), "ml"),
                        ri("butter", butter, bd("30"), "g"),
                        ri("onion", onion, bd("1"), "pieces")));

        seedRecipe("Cheesy Rice", "Comfort", 25, 2, bd("2.80"), 460,
                tags(DietaryTag.VEGETARIAN, DietaryTag.GLUTEN_FREE),
                steps("Cook white rice until fully tender.",
                        "Melt butter in a pot. Add milk and heat gently — do not boil.",
                        "Stir cooked rice into the butter-milk mixture over low heat.",
                        "Remove from heat and fold in grated cheddar. Season with salt and pepper."),
                ris(ri("white rice", rice, bd("300"), "g"),
                        ri("cheddar cheese", cheddar, bd("100"), "g"),
                        ri("butter", butter, bd("30"), "g"),
                        ri("whole milk", milk, bd("100"), "ml")));

        // ── Breakfast ────────────────────────────────────────────────────────────

        seedRecipe("Pancakes", "Breakfast", 20, 4, bd("1.20"), 320,
                tags(DietaryTag.VEGETARIAN),
                steps("Whisk flour, sugar and a pinch of salt. Make a well in the centre.",
                        "Add eggs and milk; whisk until a smooth batter forms.",
                        "Melt a little butter in a non-stick pan over medium heat.",
                        "Pour ¼ cup batter per pancake. Cook until bubbles form, flip, cook 1 more minute."),
                ris(ri("plain flour", flour, bd("200"), "g"),
                        ri("eggs", eggs, bd("2"), "pieces"),
                        ri("whole milk", milk, bd("300"), "ml"),
                        ri("sugar", sugar, bd("30"), "g"),
                        ri("butter", butter, bd("30"), "g")));

        seedRecipe("French Toast", "Breakfast", 15, 2, bd("1.80"), 380,
                tags(DietaryTag.VEGETARIAN),
                steps("Whisk eggs, milk and sugar together.",
                        "Dip bread slices in the egg mixture, coating both sides.",
                        "Melt butter in a non-stick pan over medium heat.",
                        "Fry coated bread 2–3 minutes each side until golden. Serve with a dusting of sugar."),
                ris(ri("eggs", eggs, bd("2"), "pieces"),
                        ri("whole milk", milk, bd("100"), "ml"),
                        ri("butter", butter, bd("20"), "g"),
                        ri("sugar", sugar, bd("15"), "g")));

        seedRecipe("Veggie Egg Scramble", "Breakfast", 10, 2, bd("1.60"), 260,
                tags(DietaryTag.VEGETARIAN, DietaryTag.GLUTEN_FREE, DietaryTag.DAIRY_FREE),
                steps("Whisk eggs with salt and pepper.",
                        "Heat olive oil in a pan. Add diced tomatoes and cook 2 minutes.",
                        "Add spinach and cook until just wilted.",
                        "Pour in eggs and scramble gently until just set."),
                ris(ri("eggs", eggs, bd("3"), "pieces"),
                        ri("tomatoes", tomatoes, bd("2"), "pieces"),
                        ri("spinach", spinach, bd("60"), "g"),
                        ri("olive oil", oliveOil, bd("1"), "tbsp")));

        seedRecipe("Cheddar Omelette", "Breakfast", 10, 1, bd("2.40"), 380,
                tags(DietaryTag.VEGETARIAN, DietaryTag.GLUTEN_FREE),
                steps("Whisk eggs with a splash of milk, salt and pepper.",
                        "Melt butter in a non-stick pan over medium heat.",
                        "Pour in the egg mixture and tilt the pan to spread evenly.",
                        "When edges begin to set, scatter grated cheddar on one half. Fold and serve."),
                ris(ri("eggs", eggs, bd("3"), "pieces"),
                        ri("cheddar cheese", cheddar, bd("60"), "g"),
                        ri("butter", butter, bd("15"), "g"),
                        ri("whole milk", milk, bd("2"), "tbsp")));

        seedRecipe("Egg & Carrot Hash", "Breakfast", 20, 2, bd("2.00"), 320,
                tags(DietaryTag.VEGETARIAN, DietaryTag.GLUTEN_FREE),
                steps("Grate or dice carrots. Finely slice onion.",
                        "Heat olive oil in a pan. Cook onion and carrot over medium heat for 8 minutes until soft.",
                        "Make 2 wells in the mixture. Crack an egg into each well.",
                        "Cover and cook 3–4 minutes until eggs are set. Season and serve."),
                ris(ri("eggs", eggs, bd("3"), "pieces"),
                        ri("carrot", carrot, bd("2"), "pieces"),
                        ri("onion", onion, bd("1"), "pieces"),
                        ri("olive oil", oliveOil, bd("2"), "tbsp"),
                        riOpt("butter", butter, bd("20"), "g")));

        seedRecipe("Garlic Spinach Rice", "Breakfast", 20, 2, bd("2.60"), 380,
                tags(DietaryTag.VEGETARIAN, DietaryTag.GLUTEN_FREE),
                steps("Cook white rice until fluffy.",
                        "Melt butter in a pan over medium heat. Add garlic and cook until golden.",
                        "Add spinach and toss until wilted, about 2 minutes. Season with salt.",
                        "Fold spinach through the rice. Top with grated parmesan to serve."),
                ris(ri("white rice", rice, bd("300"), "g"),
                        ri("spinach", spinach, bd("100"), "g"),
                        ri("garlic", garlic, bd("3"), "cloves"),
                        ri("butter", butter, bd("20"), "g"),
                        riOpt("parmesan", parmesan, bd("30"), "g")));

        log.info("Seeding complete — {} recipes loaded.", recipeRepository.count());
    }

    // ── Helpers ──────────────────────────────────────────────────────────────────

    private Ingredient find(String canonicalName) {
        return ingredientRepository.findByCanonicalNameIgnoreCase(canonicalName)
                .orElseThrow(() -> new IllegalStateException(
                        "Ingredient '" + canonicalName + "' not found — ensure DataSeeder has run first."));
    }

    // Create recipe item helper (recipe source for all = SEEDED)
    private void seedRecipe(String name, String cuisine, int cookTime, int servings,
            BigDecimal cost, int calories, Set<DietaryTag> tags,
            List<String> steps, List<RecipeIngredient> ris) {
        Recipe recipe = Recipe.builder()
                .name(name)
                .cuisine(cuisine)
                .cookTimeMins(cookTime)
                .servings(servings)
                .costPerServe(cost)
                .calories(calories)
                .source(RecipeSource.SEEDED)
                .dietaryTags(tags)
                .steps(steps)
                .build();
        ris.forEach(ri -> ri.setRecipe(recipe));
        recipe.getIngredients().addAll(ris);
        recipeRepository.save(recipe);
    }

    // Create recipe ingredient helper
    private RecipeIngredient ri(String name, Ingredient canonical, BigDecimal qty, String unit) {
        return RecipeIngredient.builder()
                .ingredientName(name)
                .canonicalIngredient(canonical)
                .quantity(qty)
                .unit(unit)
                .build();
    }

    // Create optional recipe ingredients
    private RecipeIngredient riOpt(String name, Ingredient canonical, BigDecimal qty, String unit) {
        return RecipeIngredient.builder()
                .ingredientName(name)
                .canonicalIngredient(canonical)
                .quantity(qty)
                .unit(unit)
                .optional(true)
                .build();
    }

    private List<RecipeIngredient> ris(RecipeIngredient... ingredients) {
        return Arrays.asList(ingredients);
    }

    private Set<DietaryTag> tags(DietaryTag... tagArray) {
        return new HashSet<>(Arrays.asList(tagArray));
    }

    private List<String> steps(String... stepArray) {
        return Arrays.asList(stepArray);
    }

    private BigDecimal bd(String val) {
        return new BigDecimal(val);
    }
}
