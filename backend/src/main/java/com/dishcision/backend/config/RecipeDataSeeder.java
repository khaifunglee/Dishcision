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

// Seeds 51 recipes after all CommandLineRunner beans (including DataSeeder) have finished.
@Component
@RequiredArgsConstructor
@Slf4j
public class RecipeDataSeeder {

        private final RecipeRepository recipeRepository;
        private final IngredientRepository ingredientRepository;

        @EventListener(ApplicationReadyEvent.class)
        @Transactional
        // @EventListener guarantees this fires after ingredient data seeder finishes
        // seeding
        public void seed() {
                if (recipeRepository.count() > 0) {
                        log.info("Recipes already seeded, skipping.");
                        return;
                }

                log.info("Seeding recipe data...");

                Ingredient chicken = find("Chicken Breast");
                Ingredient eggs = find("Eggs");
                Ingredient milk = find("Full Cream Milk");
                Ingredient cheddar = find("Cheddar Cheese");
                Ingredient parmesan = find("Parmesan Cheese");
                Ingredient butter = find("Butter");
                Ingredient pasta = find("Pasta");
                Ingredient rice = find("White Rice");
                Ingredient oliveOil = find("Oil");
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
                // Additional ingredients for the newer recipe batch
                Ingredient chickenThigh = find("Chicken Thigh");
                Ingredient porkChop = find("Pork Chop");
                Ingredient porkBelly = find("Pork Belly");
                Ingredient bacon = find("Bacon");
                Ingredient steak = find("Steak");
                Ingredient mincedMeat = find("Minced Meat");
                Ingredient sausage = find("Sausage");
                Ingredient mushroom = find("Mushroom");
                Ingredient ginger = find("Ginger");
                Ingredient springOnion = find("Spring Onion");
                Ingredient chilli = find("Chilli");
                Ingredient bellPepper = find("Bell Pepper");
                Ingredient potato = find("Potato");
                Ingredient apple = find("Apple");
                Ingredient banana = find("Banana");
                Ingredient berry = find("Berry");
                Ingredient avocado = find("Avocado");
                Ingredient bread = find("Bread");
                Ingredient flatbread = find("Flatbread");
                Ingredient pestoSauce = find("Pesto Sauce");
                Ingredient cream = find("Cream");
                Ingredient yogurt = find("Yogurt");
                Ingredient honey = find("Honey");
                Ingredient fishSauce = find("Fish Sauce");
                Ingredient shaoxingWine = find("Shaoxing Wine");
                Ingredient chickenStock = find("Chicken Stock");
                Ingredient beans = find("Baked Beans");
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
                                tags(DietaryTag.VEGETARIAN, DietaryTag.VEGAN, DietaryTag.GLUTEN_FREE,
                                                DietaryTag.DAIRY_FREE),
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
                                tags(DietaryTag.VEGETARIAN, DietaryTag.VEGAN, DietaryTag.GLUTEN_FREE,
                                                DietaryTag.DAIRY_FREE),
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

                // ── Italian (batch 2) ───────────────────────────────────────────────────

                seedRecipe("Carbonara", "Italian", 20, 2, bd("4.20"), 650,
                                tags(),
                                steps("Cook pasta in well-salted water. Reserve 1 cup pasta water before draining.",
                                                "Cook diced bacon on low heat in a pan until crisp and golden.",
                                                "Whisk eggs with grated parmesan and a generous crack of black pepper.",
                                                "Off the heat, toss hot pasta with the bacon, then quickly stir through the egg mixture, loosening with pasta water until silky — don't let it scramble."),
                                ris(ri("pasta", pasta, bd("200"), "g"),
                                                ri("eggs", eggs, bd("2"), "pieces"),
                                                ri("bacon", bacon, bd("100"), "g"),
                                                ri("parmesan cheese", parmesan, bd("50"), "g")));

                seedRecipe("Chicken Pesto Pasta", "Italian", 20, 2, bd("4.60"), 600,
                                tags(),
                                steps("Cook pasta in salted water until al dente. Reserve some pasta water before draining.",
                                                "Season and pan-fry diced chicken breast until golden and cooked through.",
                                                "Toss the pasta and chicken through pesto sauce, loosening with pasta water as needed.",
                                                "Finish with halved tomatoes and grated parmesan."),
                                ris(ri("pasta", pasta, bd("200"), "g"),
                                                ri("chicken breast", chicken, bd("250"), "g"),
                                                ri("pesto sauce", pestoSauce, bd("80"), "g"),
                                                riOpt("tomatoes", tomatoes, bd("2"), "pieces"),
                                                riOpt("parmesan cheese", parmesan, bd("30"), "g")));

                seedRecipe("Chicken & Mushroom Ragu", "Italian", 35, 2, bd("4.80"), 560,
                                tags(),
                                steps("Dice chicken thigh and brown well in a hot pan. Remove and set aside.",
                                                "Sauté diced onion and garlic until soft, then add sliced mushroom and cook until golden.",
                                                "Return chicken, add canned tomatoes, and simmer uncovered 20 minutes until thickened.",
                                                "Cook pasta in salted water, then toss through the ragu. Top with parmesan."),
                                ris(ri("pasta", pasta, bd("200"), "g"),
                                                ri("chicken thigh", chickenThigh, bd("300"), "g"),
                                                ri("mushroom", mushroom, bd("200"), "g"),
                                                ri("canned tomatoes", cannedTom, bd("400"), "g"),
                                                ri("onion", onion, bd("1"), "pieces"),
                                                ri("garlic", garlic, bd("2"), "cloves"),
                                                riOpt("parmesan cheese", parmesan, bd("30"), "g")));

                seedRecipe("Sausage Rigatoni", "Italian", 30, 2, bd("4.00"), 620,
                                tags(),
                                steps("Cook pasta in salted water until al dente.",
                                                "Remove sausage casings and crumble into a hot pan. Brown well.",
                                                "Add diced onion and garlic, cook until soft, then stir in canned tomatoes and simmer 15 minutes.",
                                                "Toss drained pasta through the sauce. Finish with grated parmesan."),
                                ris(ri("pasta", pasta, bd("200"), "g"),
                                                ri("sausage", sausage, bd("250"), "g"),
                                                ri("canned tomatoes", cannedTom, bd("400"), "g"),
                                                ri("onion", onion, bd("1"), "pieces"),
                                                ri("garlic", garlic, bd("2"), "cloves"),
                                                riOpt("parmesan cheese", parmesan, bd("30"), "g")));

                // ── Asian (batch 2) ──────────────────────────────────────────────────────

                seedRecipe("Chinese Tomato Egg Rice", "Asian", 15, 2, bd("2.20"), 420,
                                tags(DietaryTag.VEGETARIAN),
                                steps("Whisk eggs and scramble in a hot wok until just set. Remove and set aside.",
                                                "In the same wok, cook chopped tomatoes until they break down and turn juicy.",
                                                "Season with soy sauce and a pinch of sugar. Fold the scrambled egg back through.",
                                                "Serve over rice, scattered with sliced spring onion."),
                                ris(ri("tomatoes", tomatoes, bd("3"), "pieces"),
                                                ri("eggs", eggs, bd("4"), "pieces"),
                                                ri("white rice", rice, bd("250"), "g"),
                                                ri("soy sauce", soy, bd("1"), "tbsp"),
                                                ri("sugar", sugar, bd("5"), "g"),
                                                riOpt("spring onion", springOnion, bd("0.5"), "bunches")));

                seedRecipe("Braised Pork Belly", "Asian", 60, 4, bd("5.50"), 680,
                                tags(),
                                steps("Blanch cubed pork belly in boiling water for 2 minutes, then drain.",
                                                "Caramelise sugar in a hot pot, then add the pork belly and sear until coated.",
                                                "Add soy sauce, shaoxing wine, ginger and enough water to just cover. Simmer covered 45 minutes until tender.",
                                                "Uncover and reduce the sauce until glossy. Garnish with spring onion, serve over rice."),
                                ris(ri("pork belly", porkBelly, bd("600"), "g"),
                                                ri("soy sauce", soy, bd("60"), "ml"),
                                                ri("sugar", sugar, bd("20"), "g"),
                                                ri("shaoxing wine", shaoxingWine, bd("30"), "ml"),
                                                ri("ginger", ginger, bd("2"), "pieces"),
                                                ri("white rice", rice, bd("300"), "g"),
                                                riOpt("spring onion", springOnion, bd("1"), "bunches")));

                seedRecipe("Garlic Soy Chicken", "Asian", 25, 2, bd("3.80"), 480,
                                tags(),
                                steps("Marinate chicken thigh in soy sauce, minced garlic and sugar for 10 minutes.",
                                                "Pan-fry over medium-high heat until golden and cooked through, basting with the marinade.",
                                                "Rest for a few minutes, then slice.",
                                                "Serve sliced chicken over rice, spooning over any pan juices."),
                                ris(ri("chicken thigh", chickenThigh, bd("400"), "g"),
                                                ri("garlic", garlic, bd("4"), "cloves"),
                                                ri("soy sauce", soy, bd("3"), "tbsp"),
                                                ri("sugar", sugar, bd("10"), "g"),
                                                ri("white rice", rice, bd("200"), "g")));

                seedRecipe("Oyakodon", "Asian", 20, 2, bd("3.60"), 520,
                                tags(),
                                steps("Simmer sliced onion in soy sauce, sugar and a splash of water until softened.",
                                                "Add sliced chicken thigh and simmer until just cooked through.",
                                                "Pour beaten eggs evenly over the top. Cover and cook until just set but still soft.",
                                                "Slide the chicken and egg mixture over a bowl of rice. Garnish with spring onion."),
                                ris(ri("chicken thigh", chickenThigh, bd("300"), "g"),
                                                ri("eggs", eggs, bd("3"), "pieces"),
                                                ri("onion", onion, bd("1"), "pieces"),
                                                ri("soy sauce", soy, bd("3"), "tbsp"),
                                                ri("sugar", sugar, bd("15"), "g"),
                                                ri("white rice", rice, bd("300"), "g"),
                                                riOpt("spring onion", springOnion, bd("0.5"), "bunches")));

                seedRecipe("Gyudon", "Asian", 20, 2, bd("4.20"), 560,
                                tags(),
                                steps("Simmer thinly sliced onion in soy sauce, sugar, shaoxing wine and a little water until soft.",
                                                "Add thinly sliced steak and simmer briefly until just cooked through.",
                                                "Taste and adjust seasoning with more soy sauce or sugar as needed.",
                                                "Pile the beef and onion over rice with plenty of the braising liquid."),
                                ris(ri("steak", steak, bd("300"), "g"),
                                                ri("onion", onion, bd("1"), "pieces"),
                                                ri("soy sauce", soy, bd("3"), "tbsp"),
                                                ri("sugar", sugar, bd("15"), "g"),
                                                ri("shaoxing wine", shaoxingWine, bd("2"), "tbsp"),
                                                ri("white rice", rice, bd("300"), "g")));

                seedRecipe("Pad Kra Pao", "Asian", 15, 2, bd("3.40"), 500,
                                tags(),
                                steps("Fry chopped garlic and chilli in a hot pan until fragrant.",
                                                "Add minced meat and cook until browned, breaking it up as it cooks.",
                                                "Season with fish sauce and soy sauce, cook 2 more minutes.",
                                                "Fry eggs separately, sunny side up. Serve the minced meat over rice topped with a fried egg."),
                                ris(ri("minced meat", mincedMeat, bd("300"), "g"),
                                                ri("garlic", garlic, bd("4"), "cloves"),
                                                ri("chilli", chilli, bd("2"), "pieces"),
                                                ri("fish sauce", fishSauce, bd("2"), "tbsp"),
                                                ri("soy sauce", soy, bd("1"), "tbsp"),
                                                ri("eggs", eggs, bd("2"), "pieces"),
                                                ri("white rice", rice, bd("300"), "g")));

                seedRecipe("Rice Pot Hainanese Chicken Rice", "Asian", 45, 4, bd("4.60"), 620,
                                tags(),
                                steps("Gently poach chicken thigh with ginger and spring onion until just cooked through. Rest, reserving the poaching liquid.",
                                                "Sauté garlic and ginger, add rice and toast briefly to coat.",
                                                "Cook the rice in the reserved poaching liquid until fluffy.",
                                                "Slice the chicken and serve over the rice with a drizzle of soy sauce."),
                                ris(ri("chicken thigh", chickenThigh, bd("600"), "g"),
                                                ri("white rice", rice, bd("300"), "g"),
                                                ri("ginger", ginger, bd("2"), "pieces"),
                                                ri("garlic", garlic, bd("4"), "cloves"),
                                                ri("chicken stock", chickenStock, bd("500"), "ml"),
                                                ri("soy sauce", soy, bd("2"), "tbsp"),
                                                riOpt("spring onion", springOnion, bd("1"), "bunches")));

                seedRecipe("Apple Glazed Pork Chop", "Asian", 30, 2, bd("4.40"), 540,
                                tags(DietaryTag.GLUTEN_FREE),
                                steps("Sear pork chops in butter until golden and cooked through. Remove and rest.",
                                                "Add sliced apple and garlic to the same pan, cook until softened.",
                                                "Stir in honey and a splash of water, simmer until it forms a glaze.",
                                                "Spoon the apple glaze over the rested pork chops to serve."),
                                ris(ri("pork chop", porkChop, bd("400"), "g"),
                                                ri("apple", apple, bd("1"), "pieces"),
                                                ri("honey", honey, bd("30"), "g"),
                                                ri("butter", butter, bd("20"), "g"),
                                                ri("garlic", garlic, bd("2"), "cloves")));

                seedRecipe("Corned Beef Silog", "Asian", 20, 2, bd("3.20"), 580,
                                tags(),
                                steps("Sauté garlic and onion until fragrant.",
                                                "Add minced meat and cook until browned and slightly crisp, seasoning to taste.",
                                                "Fry rice with a little of the garlic oil until heated through.",
                                                "Fry eggs sunny side up. Serve the meat, garlic rice and a fried egg together."),
                                ris(ri("corned beef", mincedMeat, bd("300"), "g"),
                                                ri("white rice", rice, bd("300"), "g"),
                                                ri("garlic", garlic, bd("3"), "cloves"),
                                                ri("onion", onion, bd("1"), "pieces"),
                                                ri("eggs", eggs, bd("2"), "pieces")));

                // ── Western (batch 2) ────────────────────────────────────────────────────

                seedRecipe("Steak & Eggs", "Western", 20, 2, bd("6.50"), 620,
                                tags(DietaryTag.GLUTEN_FREE),
                                steps("Season steaks generously and rest at room temperature for 10 minutes.",
                                                "Sear in a hot pan with butter and garlic until done to preference. Rest before slicing.",
                                                "Fry eggs in the same pan.",
                                                "Serve the steak topped with a fried egg and pan juices."),
                                ris(ri("steak", steak, bd("400"), "g"),
                                                ri("eggs", eggs, bd("2"), "pieces"),
                                                ri("butter", butter, bd("20"), "g"),
                                                riOpt("garlic", garlic, bd("2"), "cloves")));

                // ── Comfort (batch 2) ────────────────────────────────────────────────────

                seedRecipe("Shakshuka", "Comfort", 30, 2, bd("3.00"), 380,
                                tags(DietaryTag.VEGETARIAN, DietaryTag.GLUTEN_FREE),
                                steps("Sauté diced onion, garlic and bell pepper until soft.",
                                                "Add canned tomatoes, season generously, and simmer 10 minutes until thickened.",
                                                "Make wells in the sauce and crack in the eggs.",
                                                "Cover and cook until the whites are set but yolks are still soft."),
                                ris(ri("canned tomatoes", cannedTom, bd("400"), "g"),
                                                ri("eggs", eggs, bd("4"), "pieces"),
                                                ri("onion", onion, bd("1"), "pieces"),
                                                ri("garlic", garlic, bd("2"), "cloves"),
                                                ri("bell pepper", bellPepper, bd("1"), "pieces")));

                seedRecipe("Butter Chicken Burritos", "Comfort", 35, 2, bd("4.80"), 640,
                                tags(),
                                steps("Marinate diced chicken thigh in yogurt, garlic and ginger if time allows.",
                                                "Cook the chicken in butter until browned.",
                                                "Add canned tomatoes and simmer 15 minutes, then stir through cream until rich and glossy.",
                                                "Warm the flatbreads, fill with butter chicken, and roll into burritos."),
                                ris(ri("chicken thigh", chickenThigh, bd("400"), "g"),
                                                ri("canned tomatoes", cannedTom, bd("400"), "g"),
                                                ri("cream", cream, bd("100"), "ml"),
                                                ri("butter", butter, bd("30"), "g"),
                                                ri("garlic", garlic, bd("3"), "cloves"),
                                                ri("ginger", ginger, bd("1"), "pieces"),
                                                ri("flatbread", flatbread, bd("2"), "pieces"),
                                                riOpt("yogurt", yogurt, bd("50"), "g")));

                seedRecipe("French Onion Soup", "Comfort", 50, 4, bd("2.80"), 340,
                                tags(),
                                steps("Slowly caramelise thinly sliced onions in butter over low heat, about 30 minutes.",
                                                "Add chicken stock and simmer 15 minutes.",
                                                "Ladle into bowls and top with a slice of bread and grated cheddar.",
                                                "Grill until the cheese is melted and bubbling."),
                                ris(ri("onion", onion, bd("4"), "pieces"),
                                                ri("butter", butter, bd("30"), "g"),
                                                ri("chicken stock", chickenStock, bd("800"), "ml"),
                                                ri("bread", bread, bd("4"), "pieces"),
                                                ri("cheddar cheese", cheddar, bd("100"), "g")));

                // ── Breakfast (batch 2) ──────────────────────────────────────────────────

                seedRecipe("Country Breakfast Skillet", "Breakfast", 30, 2, bd("3.60"), 560,
                                tags(DietaryTag.GLUTEN_FREE),
                                steps("Dice potatoes and parboil until just tender.",
                                                "Cook bacon in a skillet until crisp, then remove.",
                                                "Add butter and potatoes to the skillet, cook until golden, then add onion and cook until soft.",
                                                "Return the bacon, make wells in the mixture, crack in the eggs, cover and cook until set."),
                                ris(ri("bacon", bacon, bd("150"), "g"),
                                                ri("potato", potato, bd("3"), "pieces"),
                                                ri("eggs", eggs, bd("3"), "pieces"),
                                                ri("onion", onion, bd("1"), "pieces"),
                                                ri("butter", butter, bd("20"), "g")));

                seedRecipe("Avo on Toast", "Breakfast", 10, 2, bd("2.00"), 320,
                                tags(DietaryTag.VEGETARIAN, DietaryTag.VEGAN),
                                steps("Toast the bread until golden.",
                                                "Mash avocado with a squeeze of lemon juice, season with salt and pepper.",
                                                "Spread the mashed avocado over the toast.",
                                                "Finish with chilli flakes if desired."),
                                ris(ri("bread", bread, bd("2"), "pieces"),
                                                ri("avocado", avocado, bd("1"), "pieces"),
                                                riOpt("lemon", lemon, bd("1"), "pieces")));

                seedRecipe("Big Breakfast", "Breakfast", 30, 2, bd("5.20"), 780,
                                tags(),
                                steps("Grill or pan-fry sausages until cooked through, then cook bacon until crisp.",
                                                "Sauté halved tomatoes and sliced mushroom until softened.",
                                                "Gently heat beans on a pot and season to your liking.",
                                                "Fry eggs to your liking.",
                                                "Toast bread with butter and plate everything together."),
                                ris(ri("sausage", sausage, bd("200"), "g"),
                                                ri("bacon", bacon, bd("150"), "g"),
                                                ri("eggs", eggs, bd("4"), "pieces"),
                                                ri("beans", beans, bd("20"), "g"),
                                                ri("tomatoes", tomatoes, bd("2"), "pieces"),
                                                ri("mushroom", mushroom, bd("150"), "g"),
                                                ri("bread", bread, bd("2"), "pieces"),
                                                riOpt("butter", butter, bd("20"), "g")));

                seedRecipe("Blended High Protein Fruit Juice", "Breakfast", 5, 1, bd("1.80"), 260,
                                tags(DietaryTag.VEGETARIAN, DietaryTag.GLUTEN_FREE, DietaryTag.HIGH_PROTEIN),
                                steps("Add banana, berries, milk, yogurt and honey to a blender.",
                                                "Blend until smooth and creamy.",
                                                "Pour into a glass and serve immediately."),
                                ris(ri("banana", banana, bd("1"), "pieces"),
                                                ri("berry", berry, bd("1"), "pieces"),
                                                ri("full cream milk", milk, bd("250"), "ml"),
                                                ri("yogurt", yogurt, bd("100"), "g"),
                                                riOpt("honey", honey, bd("15"), "g")));

                log.info("Seeding complete — {} recipes loaded.", recipeRepository.count());
        }

        // ── Helpers ──────────────────────────────────────────────────────────────────

        private Ingredient find(String canonicalName) {
                return ingredientRepository.findByCanonicalNameIgnoreCase(canonicalName)
                                .orElseThrow(() -> new IllegalStateException(
                                                "Ingredient '" + canonicalName
                                                                + "' not found — ensure DataSeeder has run first."));
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
