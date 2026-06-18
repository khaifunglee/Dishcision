// This file creates a user preferences model to describe a user's dietary preferences
package com.dishcision.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "user_preferences", uniqueConstraints = @UniqueConstraint(columnNames = "user_id"))
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserPreferences {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    // Uses DietaryTag to describe
    // e.g: VEGETARIAN, VEGAN — filters applied to suggestions
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_diet_tags", joinColumns = @JoinColumn(name = "user_preferences_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "tag")
    @Builder.Default
    private Set<DietaryTag> dietTags = new HashSet<>();

    // Uses AllergyTag to describe
    // e.g. NUTS, SHELLFISH — informational, not yet used for filtering
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_allergy_tags", joinColumns = @JoinColumn(name = "user_preferences_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "tag")
    @Builder.Default
    private Set<AllergyTag> allergyTags = new HashSet<>();

    // 3 by default, 0 = alerts off, >0 means days before expiry to alert
    @Column(name = "expiry_alert_days", nullable = false)
    @Builder.Default
    private int expiryAlertDays = 3;

    @Column(name = "daily_suggestion_on", nullable = false)
    @Builder.Default
    private boolean dailySuggestionOn = true;

    // Medium text size by default
    @Enumerated(EnumType.STRING)
    @Column(name = "text_size", nullable = false)
    @Builder.Default
    private TextSize textSize = TextSize.MEDIUM;

    @Column(name = "budget_per_serve", precision = 10, scale = 2)
    private BigDecimal budgetPerServe;
}
