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

                // Protein
                // ---------------------------------------------------------------------------------------------
                seed("Chicken Breast", "g", UnitType.WEIGHT, "Protein",
                                List.of("chicken", "chicken breasts", "breast of chicken", "chicken fillet",
                                                "chicken fillets"));

                seed("Chicken Thigh", "g", UnitType.WEIGHT, "Protein",
                                List.of("chicken", "chicken thighs", "thigh of chicken", "boneless chicken thigh",
                                                "boneless chicken thighs"));

                seed("Pork Chop", "g", UnitType.WEIGHT, "Protein",
                                List.of("pork", "pork chops", "pork loin", "pork chop steak"));

                seed("Pork Belly", "g", UnitType.WEIGHT, "Protein",
                                List.of("pork", "sliced pork belly", "pork belly sliced"));

                seed("Bacon", "g", UnitType.WEIGHT, "Protein",
                                List.of("sliced bacon", "middle bacon", "streaky bacon", "diced bacon",
                                                "maple streaky bacon"));

                seed("Steak", "g", UnitType.WEIGHT, "Protein",
                                List.of("beef", "t-bone steak", "scotch eye fillet", "porterhouse steak",
                                                "scotch fillet", "beef rump", "rump steak", "beef rib eye",
                                                "beef chuck"));

                seed("Minced Meat", "g", UnitType.WEIGHT, "Protein",
                                List.of("minced chicken", "minced beef", "minced pork", "lean beef mince",
                                                "ground chicken", "ground beef", "ground pork"));

                seed("Tofu", "g", UnitType.WEIGHT, "Protein",
                                List.of("firm tofu", "soy tofu", "silken tofu", "hard tofu"));

                seed("Sliced Ham", "g", UnitType.WEIGHT, "Protein",
                                List.of("ham", "ham slices", "smoked ham"));

                seed("Sausage", "g", UnitType.WEIGHT, "Protein",
                                List.of("sausages", "chicken sausage", "beef sausage", "pork sausage", "bbq sausage"));

                seed("Luncheon Meat", "g", UnitType.WEIGHT, "Protein",
                                List.of("spam", "spam ham"));

                seed("Salmon", "g", UnitType.WEIGHT, "Protein",
                                List.of("fish", "salmon fillet", "skin on salmon", "skin off salmon",
                                                "smoked salmon", "salmon slices", "tasmanian salmon"));

                seed("Prawn", "g", UnitType.WEIGHT, "Protein",
                                List.of("seafood", "shrimp", "prawns", "tiger prawns", "raw prawns",
                                                "peeled prawns", "garlic prawns"));

                seed("Tuna", "g", UnitType.WEIGHT, "Protein",
                                List.of("fish", "canned tuna", "tuna chunks"));

                // Dairy
                // ---------------------------------------------------------------------------------------------
                seed("Eggs", null, UnitType.COUNT, "Dairy & Eggs",
                                List.of("egg", "large eggs", "free range eggs", "free-range eggs", "caged eggs"));

                seed("Full Cream Milk", "ml", UnitType.VOLUME, "Dairy & Eggs",
                                List.of("milk", "whole milk", "full fat milk", "dairy milk"));

                seed("Oat Milk", "g", UnitType.VOLUME, "Dairy & Eggs",
                                List.of("milk", "oat-based milk"));

                seed("Soy Milk", "g", UnitType.VOLUME, "Dairy & Eggs",
                                List.of("milk", "soybean milk"));

                seed("Cheddar Cheese", "g", UnitType.WEIGHT, "Dairy & Eggs",
                                List.of("cheddar", "cheese", "tasty cheese", "shredded cheese"));

                seed("Parmesan Cheese", "g", UnitType.WEIGHT, "Dairy & Eggs",
                                List.of("parmesan", "parmigiano", "parm", "grana padano", "cheese", "grated cheese"));

                seed("Mozzarella Cheese", "g", UnitType.WEIGHT, "Dairy & Eggs",
                                List.of("cheese", "mozzarella", "shredded cheese"));

                seed("Pecorino Romano", "g", UnitType.WEIGHT, "Dairy & Eggs",
                                List.of("cheese", "italian cheese", "sheep's milk cheese", "pecorino"));

                seed("Sliced Cheese", "g", UnitType.COUNT, "Dairy & Eggs",
                                List.of("cheese", "cheese slices", "american cheese"));

                seed("Cream Cheese", "g", UnitType.WEIGHT, "Dairy & Eggs",
                                List.of("cheese", "cottage cheese", "brie cheese", "goat cheese", "ricotta cheese"));

                // Gluten
                // ---------------------------------------------------------------------------------------------
                seed("Bread", "g", UnitType.COUNT, "Gluten",
                                List.of("loaf of bread", "sliced bread", "white bread", "wholegrain bread",
                                                "sourdough bread", "garlic bread", "wholemeal bread"));

                seed("Flatbread", "g", UnitType.COUNT, "Gluten",
                                List.of("tortilla wrap", "wrap bread", "tortilla", "pita bread", "pitas", "naan",
                                                "naan bread"));

                // Fruits
                // ---------------------------------------------------------------------------------------------
                seed("Apple", null, UnitType.COUNT, "Fruits",
                                List.of("apples", "apple juice", "fresh apple"));

                seed("Banana", null, UnitType.COUNT, "Fruits",
                                List.of("bananas", "ripe bananas", "fresh bananas"));

                seed("Grapes", null, UnitType.WEIGHT, "Fruits",
                                List.of("grape", "grape juice", "fresh grapes"));

                seed("Avocado", null, UnitType.COUNT, "Fruits",
                                List.of("avocadoes", "apple juice", "fresh avocado"));

                seed("Berry", null, UnitType.COUNT, "Fruits",
                                List.of("berries", "berry juice", "fresh berries"));

                seed("Strawberry", null, UnitType.COUNT, "Fruits",
                                List.of("strawberries", "fresh strawberry"));

                seed("Pear", null, UnitType.COUNT, "Fruits",
                                List.of("pears", "pear juice", "fresh pear"));

                seed("Cherry", null, UnitType.COUNT, "Fruits",
                                List.of("cherries", "fresh cherry"));

                seed("Orange", null, UnitType.COUNT, "Fruits",
                                List.of("oranges", "orange juice", "fresh orange"));

                seed("Lemon", null, UnitType.COUNT, "Fruits",
                                List.of("lemons", "lemon juice", "fresh lemon"));

                // Vegetables
                // ---------------------------------------------------------------------------------------------
                seed("Lettuce", null, UnitType.COUNT, "Vegetables",
                                List.of("romaine lettuce", "iceberg lettuce", "baby lettuce"));

                seed("Tomatoes", null, UnitType.COUNT, "Vegetables",
                                List.of("tomato", "ripe tomatoes", "vine tomatoes", "roma tomatoes", "fresh tomatoes",
                                                "cherry tomatoes"));

                seed("Onion", null, UnitType.COUNT, "Vegetables",
                                List.of("onions", "brown onion", "brown onions", "white onion", "red onion"));

                seed("Garlic", null, UnitType.COUNT, "Vegetables",
                                List.of("garlic clove", "garlic cloves", "garlic head", "minced garlic",
                                                "peeled garlic"));

                seed("Spinach", "g", UnitType.WEIGHT, "Vegetables",
                                List.of("baby spinach", "spinach leaves", "english spinach", "bag of spinach"));

                seed("Carrot", null, UnitType.COUNT, "Vegetables",
                                List.of("carrots", "baby carrots", "carrot sticks"));

                seed("Broccoli", "g", UnitType.WEIGHT, "Vegetables",
                                List.of("broccoli florets", "broccolini", "broccoli head"));

                seed("Cabbage", null, UnitType.COUNT, "Vegetables",
                                List.of("red cabbage", "green cabbage", "coleslaw", "napa cabbage"));

                seed("Spring Onion", null, UnitType.COUNT, "Vegetables",
                                List.of("spring onions", "green onion", "green onions", "scallion", "scallions"));

                seed("Ginger", null, UnitType.COUNT, "Vegetables",
                                List.of("fresh ginger", "minced ginger", "peeled ginger"));

                seed("Potato", null, UnitType.COUNT, "Vegetables",
                                List.of("potatoes", "white potatoes", "washed potatoes", "spud potatoes",
                                                "peeled potatoes", "purple potatoes"));

                seed("Mushroom", null, UnitType.WEIGHT, "Vegetables",
                                List.of("mushrooms", "fresh mushroom", "sliced mushrooms", "button mushrooms",
                                                "flat mushrooms"));

                seed("Chilli", null, UnitType.COUNT, "Vegetables",
                                List.of("chillies", "red chilli", "green chilli", "jalapeno", "cayenne chilli"));

                seed("Corn", null, UnitType.WEIGHT, "Vegetables",
                                List.of("baby corn", "sweet corn", "corn cob"));

                seed("Cucumber", null, UnitType.COUNT, "Vegetables",
                                List.of("cucumbers", "fresh cucumber", "sliced cucumber", "green cucumber",
                                                "continental cucumber"));

                seed("Bell Pepper", null, UnitType.COUNT, "Vegetables",
                                List.of("bell peppers", "green bell peppers", "red bell peppers", "capsicum"));

                seed("Chive", null, UnitType.WEIGHT, "Vegetables",
                                List.of("chives", "green chives", "common chives", "garlic chives"));

                seed("Shallot", null, UnitType.COUNT, "Vegetables",
                                List.of("shallots", "pink shallots", "peeled shallots", "french shallots"));

                // Pantry Staples
                // ---------------------------------------------------------------------------------------------
                seed("Canned Tomatoes", "g", UnitType.WEIGHT, "Pantry Staple",
                                List.of("crushed tomatoes", "diced tomatoes", "tinned tomatoes", "tomato puree",
                                                "passata"),
                                "can", new BigDecimal("400"));

                seed("Butter", "g", UnitType.WEIGHT, "Pantry Staple",
                                List.of("unsalted butter", "salted butter", "margarine"));

                seed("Pasta", "g", UnitType.WEIGHT, "Pantry Staple",
                                List.of("penne", "pasta", "rigatoni", "fusilli", "spaghetti", "fettuccine",
                                                "linguine"));

                seed("White Rice", "kg", UnitType.WEIGHT, "Pantry Staple",
                                List.of("rice", "basmati rice", "jasmine rice", "long grain rice", "steamed rice",
                                                "sushi rice"));

                seed("Oil", "l", UnitType.VOLUME, "Pantry Staple",
                                List.of("extra virgin olive oil", "olive oil", "light olive oil", "peanut oil",
                                                "vegetable oil", "neutral oil", "sunflower oil", "canola oil"));

                seed("Plain Flour", "g", UnitType.WEIGHT, "Pantry Staple",
                                List.of("flour", "all-purpose flour", "all purpose flour", "white flour"));

                seed("Sugar", "g", UnitType.WEIGHT, "Pantry Staple",
                                List.of("white sugar", "caster sugar", "granulated sugar", "raw sugar"));

                seed("Salt", "g", UnitType.WEIGHT, "Pantry Staple",
                                List.of("sea salt", "table salt", "garlic salt", "chicken salt", "pink salt",
                                                "rock salt"));

                seed("Pepper", "g", UnitType.WEIGHT, "Pantry Staple",
                                List.of("white pepper", "black pepper", "cracked pepper", "ground black pepper",
                                                "black peppercorns"));

                seed("Chilli Flakes", "g", UnitType.WEIGHT, "Pantry Staple",
                                List.of("dry chilli", "chilli powder", "hot chilli flakes", "ground chilli"));

                seed("Turmeric", "g", UnitType.WEIGHT, "Pantry Staple",
                                List.of("turmeric powder", "ground turmeric", "turmeric spice"));

                seed("Paprika", "g", UnitType.WEIGHT, "Pantry Staple",
                                List.of("smoked paprika", "paprika powder", "ground paprika"));

                seed("Yogurt", "g", UnitType.WEIGHT, "Pantry Staple",
                                List.of("greek yogurt", "fat free yogurt", "light yogurt"));

                seed("Cream", "ml", UnitType.VOLUME, "Pantry Staple",
                                List.of("thickened cream", "heavy cream", "light thickened cream", "cooking cream"));

                seed("Chicken Stock", "ml", UnitType.VOLUME, "Pantry Staple",
                                List.of("chicken buillion", "chicken cubes", "chicken buillion cubes"));

                seed("Baked Beans", "g", UnitType.WEIGHT, "Pantry Staple",
                                List.of("canned beans", "beans", "red beans", "heinz baked beans"));

                seed("Honey", "g", UnitType.WEIGHT, "Pantry Staple",
                                List.of("raw honey", "pure honey"));

                // Sauces
                // ---------------------------------------------------------------------------------------------
                seed("Soy Sauce", "ml", UnitType.VOLUME, "Sauces",
                                List.of("light soy sauce", "dark soy sauce", "tamari", "kikkoman"));

                seed("Oyster Sauce", "ml", UnitType.VOLUME, "Sauces",
                                List.of("hoisin sauce", "oyster mushroom sauce"));

                seed("Shaoxing Wine", "ml", UnitType.VOLUME, "Sauces",
                                List.of("chinese cooking wine", "rice wine vinegar", "rice wine"));

                seed("Fish Sauce", "ml", UnitType.VOLUME, "Sauces",
                                List.of("thai fish sauce"));

                seed("Mayonnaise", "g", UnitType.WEIGHT, "Sauces",
                                List.of("mayo", "egg mayonnaise", "egg mayo", "mayonnaise sauce"));

                seed("Mustard", "ml", UnitType.VOLUME, "Sauces",
                                List.of("mustard sauce", "dijon mustard"));

                seed("Ketchup", "ml", UnitType.VOLUME, "Sauces",
                                List.of("tomato ketchup", "heinz ketchup"));

                seed("Pesto Sauce", "g", UnitType.WEIGHT, "Sauces",
                                List.of("pesto", "tomato pesto", "pesto jar", "pesto pasta sauce", "pesto basil",
                                                "sundried tomato pesto"));

                seed("Tomato Sauce", "ml", UnitType.WEIGHT, "Sauces",
                                List.of("tomato pasta sauce", "sundried tomato sauce", "bolognese tomato sauce",
                                                "tomato & basil sauce"));

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
