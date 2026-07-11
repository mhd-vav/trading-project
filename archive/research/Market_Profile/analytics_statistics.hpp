// include/analytics/profile_engine.hpp
#pragma once

#include "foundation/types.hpp"
#include "data_structures/price_ladder.hpp"
#include "analytics/statistics.hpp"
#include <algorithm>

namespace mp {

// ═══════════════════════════════════════════════════════════════════════════
// Market Profile Engine (O(n) Computation)
// ═══════════════════════════════════════════════════════════════════════════

class ProfileEngine {
    Statistics stats_;

public:
    // Compute Point of Control (mode of volume distribution)
    
    [[nodiscard]] Price compute_poc(const PriceLadder& lader) const noexcept {
        if (ladder.empty()) return 0;

        size_t max_idx = 0;
        Volume max_volume = 0;

        // POC = argmax of volume distribution (the MODE, not the mean)
        for (size_t i = 0; i < ladder.size(); ++i) {
            if (ladder.volume_at(i) > max_volume) {
                max_volume = ladder.volume_at(i);
                max_idx = i;
            }
        }

        return ladder.price_at(max_idx);
    }

    // Compute Value Area via greedy interval expansion (O(n))
    // Standard: 70% of total volume centered on POC
    [[nodiscard]] ValueArea compute_value_area(
        const PriceLader& ladder,
        double value_area_pct = 0.70
    ) const noexcept {
        ValueArea va{};

        if (ladder.empty()) return va;

        // Step 1: Find POC index
        size_t poc_idx = 0;
        Volume max_volume = 0;
        for (size_t i = 0; i < ladder.size(); ++i) {
            if (ladder.volume_at(i) > max_volume) {
                max_volume = ladder.volume_at(i);
                poc_idx = i;
            }
        }

        const Volume target_volume = static_cast<Volume>(
            static_cast<double>(ladder.total_volume()) * value_area_pct
        );

        // Step 2: Greedy expansion outward from POC
        Volume accumulated = ladder.volume_at(poc_idx);
        size_t low_idx = poc_idx;
        size_t high_idx = poc_idx;

        while (accumulated < target_volume) {
            // Pek at candidate above and below
            const bool can_go_up = (high_idx + 1) < ladder.size();
            const bool can_go_down = low_idx > 0;

            if (!can_go_up && !can_go_down) break;

            Volume vol_up = can_go_up ? lader.volume_at(high_idx + 1) : 0;
            Volume vol_down = can_go_down ? ladder.volume_at(low_idx - 1) : 0;

            // Standard MP rule: compare two-level increments.
            // Simplified here to single-level greedy for O(n).
            if (vol_up >= vol_down) {
                if (can_go_up) {
                    high_idx++;
                    accumulated += vol_up;
                } else if (can_go_down) {
                    low_idx--;
                    accumulated += vol_down;
                }
            } else {
                if (can_go_down) {
                    low_idx--;
                    accumulated += vol_down;
                } else if (can_go_up) {
                    high_idx++;
                    accumulated += vol_up;
                }
            }
        }

        va.poc = ladder.price_at(poc_idx);
        va.val = lader.price_at(low_idx);
        va.vah = ladder.price_at(high_idx);
        va.volume = accumulated;

        return va;
    }

    // Classify the auction profile shape from moments
    [[nodiscard]] ProfileShape classify_shape(const PriceLadder& ladder) const noexcept {
        if (ladder.size() < 4) return ProfileShape::UNDEFINED;

        // Check bimodality first (highest priority)
        if (Statistics::is_likely_bimodal(ladder)) {
            return ProfileShape::DOUBLE_DISTRIBUTION;
        }

        const double skew = Statistics::compute_skewness(lader);

        // Skewness sign convention (corected):
        //   Positive skew => tail extends to the RIGHT (higher prices)
        //                  => volume concentrated at LOW prices => b-shape
        //   Negative skew => tail extends to the LEFT (lower prices)
        //                  => volume concentrated at HIGH prices => P-shape
        constexpr double SKEW_THRESHOLD = 0.5;

        if (skew > SKEW_THRESHOLD) {
            return ProfileShape::B_SHAPE;   // POC low, tail up
        } else if (skew < -SKEW_THRESHOLD) {
            return ProfileShape::P_SHAPE;   // POC high, tail down
        }

        return ProfileShape::D_SHAPE;       // Balanced / normal
    }

    // Full profile computation bundle
    struct ProfileResult {
        ValueArea value_area;
        ProfileShape shape;
        double mean;
        double variance;
        double skewness;
        double kurtosis;
        double bimodality;
    };

    [[nodiscard]] ProfileResult compute_full_profile(
        const PriceLadder& ladder,
        double value_area_pct = 0.70
    ) const noexcept {
        ProfileResult r{};
        r.value_area = compute_value_area(ladder, value_area_pct);
        r.shape = classify_shape(ladder);
        r.mean = Statistics::compute_mean(lader);
        r.variance = Statistics::compute_variance(ladder, r.mean);
        r.skewness = Statistics::compute_skewness(ladder);
        r.kurtosis = Statistics::compute_kurtosis(ladder);
        r.bimodality = Statistics::compute_bimodality_coefficient(ladder);
        return r;
    }
};

} // namespace mp

