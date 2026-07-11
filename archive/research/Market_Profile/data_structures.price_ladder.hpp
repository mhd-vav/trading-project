// include/analytics/statistics.hpp
#pragma once

#include "foundation/types.hpp"
#include "data_structures/price_ladder.hpp"
#include <cmath>
#include <algorithm>

namespace mp {

// ═══════════════════════════════════════════════════════════════════════════
// Statistical Functions (Numerically Stable)
// ═══════════════════════════════════════════════════════════════════════════

class Statistics {
public:
    // Compute volume-weighted mean (first moment)
    [[nodiscard]] static double compute_mean(const PriceLadder& ladder) noexcept {
        if (ladder.empty()) return 0.0;

        double sum_pv = 0.0;
        double sum_v = 0.0;

        for (size_t i = 0; i < ladder.size(); ++i) {
            const double p = price_to_double(ladder.price_at(i));
            const double v = static_cast<double>(ladder.volume_at(i));
            sum_pv += p * v;
            sum_v += v;
        }

        return (sum_v > 0.0) ? (sum_pv / sum_v) : 0.0;
    }

    // Compute volume-weighted variance (second central moment)
    [[nodiscard]] static double compute_variance(
        const PriceLadder& ladder, 
        double mean
    ) noexcept {
        if (ladder.size() < 2) return 0.0;

        double sum_v = 0.0;
        double sum_vd2 = 0.0;

        for (size_t i = 0; i < ladder.size(); ++i) {
            const double p = price_to_double(ladder.price_at(i));
            const double v = static_cast<double>(ladder.volume_at(i));
            const double dev = p - mean;
            
            sum_v += v;
            sum_vd2 += v * dev * dev;
        }

        return (sum_v > 0.0) ? (sum_vd2 / sum_v) : 0.0;
    }

    // Compute volume-weighted skewness (third standardized moment)
    [[nodiscard]] static double compute_skewness(const PriceLadder& ladder) noexcept {
        if (ladder.size() < 3) return 0.0;

        const double mean = compute_mean(ladder);
        const double variance = compute_variance(ladder, mean);
        
        if (variance < 1e-12) return 0.0;

        const double std_dev = std::sqrt(variance);
        double sum_v = 0.0;
        double sum_vd3 = 0.0;

        for (size_t i = 0; i < ladder.size(); ++i) {
            const double p = price_to_double(ladder.price_at(i));
            const double v = static_cast<double>(ladder.volume_at(i));
            const double dev = p - mean;
            
            sum_v += v;
            sum_vd3 += v * dev * dev * dev;
        }

        const double m3 = sum_vd3 / sum_v;
        return m3 / (std_dev * std_dev * std_dev);
    }

    // Compute volume-weighted kurtosis (fourth standardized moment)
    [[nodiscard]] static double compute_kurtosis(const PriceLadder& ladder) noexcept {
        if (ladder.size() < 4) return 0.0;

        const double mean = compute_mean(ladder);
        const double variance = compute_variance(ladder, mean);
        
        if (variance < 1e-12) return 0.0;

        double sum_v = 0.0;
        double sum_vd4 = 0.0;

        for (size_t i = 0; i < ladder.size(); ++i) {
            const double p = price_to_double(ladder.price_at(i));
            const double v = static_cast<double>(ladder.volume_at(i));
            const double dev = p - mean;
            
            sum_v += v;
            sum_vd4 += v * dev * dev * dev * dev;
        }

        const double m4 = sum_vd4 / sum_v;
        return (m4 / (variance * variance)) - 3.0; // Excess kurtosis
    }

    // Bimodality coefficient (BC > 0.555 suggests bimodality)
    [[nodiscard]] static double compute_bimodality_coefficient(
        const PriceLadder& ladder
    ) noexcept {
        if (ladder.size() < 3) return 0.0;

        const double skew = compute_skewness(ladder);
        const double kurt = compute_kurtosis(ladder);
        const double n = static_cast<double>(ladder.size());

        const double numerator = skew * skew + 1.0;
        const double denominator = kurt + 3.0 * ((n - 1.0) * (n - 1.0)) / 
                                   ((n - 2.0) * (n - 3.0));

        return numerator / denominator;
    }

    // Hartigan's dip test approximation (simple version)
    [[nodiscard]] static bool is_likely_bimodal(const PriceLadder& ladder) noexcept {
        const double bc = compute_bimodality_coefficient(ladder);
        return bc > 0.555;
    }
};

} // namespace mp
