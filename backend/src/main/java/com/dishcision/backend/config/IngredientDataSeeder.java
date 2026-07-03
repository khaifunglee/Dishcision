// This file loads a manual seed database for ingredients
package com.dishcision.backend.config;

import com.dishcision.backend.model.Ingredient;
import com.dishcision.backend.model.IngredientAlias;
import com.dishcision.backend.model.UnitType;
import com.dishcision.backend.repository.IngredientAliasRepository;
import com.dishcision.backend.repository.IngredientRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j // logging interface for Java

public class IngredientDataSeeder implements CommandLineRunner {

        private final IngredientRepository ingredientRepository;
        private final IngredientAliasRepository aliasRepository;

        @Override
        @Transactional
        // Command line runner runs this after application context starts
        public void run(String... args) {
                // Prevents re-seeds
                if (ingredientRepository.count() > 0) {
                        log.info("Ingredients already seeded, skipping.");
                        return;
                }

                log.info("Seeding ingredient data...");

                seed("Chicken Breast", "g", UnitType.WEIGHT, "Protein",
                                List.of("chicken", "chicken breasts", "breast of chicken", "chicken fillet",
                                                "chicken fillets"));

                seed("Eggs", null, UnitType.COUNT, "Dairy & Eggs",
                                List.of("egg", "large eggs", "free range eggs", "free-range eggs"));

                seed("Whole Milk", "ml", UnitType.VOLUME, "Dairy & Eggs",
                                List.of("milk", "full cream milk", "full fat milk", "dairy milk"));

                seed("Cheddar Cheese", "g", UnitType.WEIGHT, "Dairy & Eggs",
                                List.of("cheddar", "cheese", "tasty cheese", "shredded cheese"));

                seed("Parmesan", "g", UnitType.WEIGHT, "Dairy & Eggs",
                                List.of("parmesan cheese", "parmigiano", "parm", "grana padano"));

                seed("Butter", "g", UnitType.WEIGHT, "Dairy & Eggs",
                                List.of("unsalted butter", "salted butter", "margarine"));

                seed("Pasta (Penne)", "g", UnitType.WEIGHT, "Pantry Staple",
                                List.of("penne", "pasta", "rigatoni", "fusilli", "spaghetti", "fettuccine",
                                                "linguine"));

                seed("White Rice", "g", UnitType.WEIGHT, "Pantry Staple",
                                List.of("rice", "basmati rice", "jasmine rice", "long grain rice", "steamed rice"));

                seed("Olive Oil", "ml", UnitType.VOLUME, "Pantry Staple",
                                List.of("extra virgin olive oil", "EVOO", "light olive oil"));

                seed("Canned Tomatoes", "g", UnitType.WEIGHT, "Pantry Staple",
                                List.of("crushed tomatoes", "diced tomatoes", "tinned tomatoes", "tomato puree",
                                                "passata"),
                                "can", new BigDecimal("400"));

                seed("Soy Sauce", "ml", UnitType.VOLUME, "Pantry Staple",
                                List.of("light soy sauce", "dark soy sauce", "tamari", "kikkoman"));

                seed("Plain Flour", "g", UnitType.WEIGHT, "Pantry Staple",
                                List.of("flour", "all-purpose flour", "all purpose flour", "white flour"));

                seed("Sugar", "g", UnitType.WEIGHT, "Pantry Staple",
                                List.of("white sugar", "caster sugar", "granulated sugar", "raw sugar"));

                seed("Tomatoes", null, UnitType.COUNT, "Produce",
                                List.of("tomato", "ripe tomatoes", "vine tomatoes", "roma tomatoes"));

                seed("Onion", null, UnitType.COUNT, "Produce",
                                List.of("onions", "brown onion", "brown onions", "white onion", "red onion"));

                seed("Garlic", null, UnitType.COUNT, "Produce",
                                List.of("garlic clove", "garlic cloves", "garlic head", "minced garlic"));

                seed("Spinach", "g", UnitType.WEIGHT, "Produce",
                                List.of("baby spinach", "spinach leaves", "english spinach", "bag of spinach"));

                seed("Carrot", null, UnitType.COUNT, "Produce",
                                List.of("carrots", "baby carrots", "carrot sticks"));

                seed("Broccoli", "g", UnitType.WEIGHT, "Produce",
                                List.of("broccoli florets", "broccolini", "broccoli head"));

                seed("Lemon", null, UnitType.COUNT, "Produce",
                                List.of("lemons", "lemon juice", "fresh lemon"));

                /*
                 * Missing ingredients:
                 * 1. Oil types
                 * 2.
                 */

                log.info("Seeding complete — {} ingredients loaded.", ingredientRepository.count());
        }

        // Helper method to create ingredient and ingredient alias names
        private void seed(String canonicalName, String defaultUnit, UnitType unitType,
                        String category, List<String> aliases) {
                seed(canonicalName, defaultUnit, unitType, category, aliases, null, null);
        }

        // Overload for ingredients with a known container packaging (e.g. 1 can = 400g)
        private void seed(String canonicalName, String defaultUnit, UnitType unitType,
                        String category, List<String> aliases,
                        String containerUnit, BigDecimal containerSize) {
                Ingredient ingredient = ingredientRepository.save(
                                Ingredient.builder()
                                                .canonicalName(canonicalName)
                                                .defaultUnit(defaultUnit)
                                                .unitType(unitType)
                                                .category(category)
                                                .containerUnit(containerUnit)
                                                .containerSize(containerSize)
                                                .build());

                aliases.forEach(alias -> aliasRepository.save(
                                IngredientAlias.builder()
                                                .ingredient(ingredient)
                                                .alias(alias)
                                                .build()));
        }
}
