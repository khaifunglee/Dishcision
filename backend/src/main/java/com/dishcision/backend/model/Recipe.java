// This file creates a Recipe model for curated recipes in the app
package com.dishcision.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "recipes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Recipe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String cuisine;

    @Column(name = "cook_time_mins")
    private Integer cookTimeMins;

    private Integer servings;

    @Column(name = "cost_per_serve", precision = 10, scale = 2)
    private BigDecimal costPerServe;

    private Integer calories;

    @Column(name = "image_url")
    private String imageUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RecipeSource source;

    @Column(name = "created_by_user_id")
    private Long createdByUserId;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // Maps to recipe_dietary_tags(recipe_id, tag) — no separate entity needed
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "recipe_dietary_tags", joinColumns = @JoinColumn(name = "recipe_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "tag")
    @Builder.Default
    private Set<DietaryTag> dietaryTags = new HashSet<>();

    // Maps to recipe_steps(recipe_id, step_order, step_text) — preserves insertion
    // order
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "recipe_steps", joinColumns = @JoinColumn(name = "recipe_id"))
    @Column(name = "step_text", length = 1000)
    @OrderColumn(name = "step_order")
    @Builder.Default
    private List<String> steps = new ArrayList<>();

    @OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @ToString.Exclude
    @Builder.Default
    private List<RecipeIngredient> ingredients = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
