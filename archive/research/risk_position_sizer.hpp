// include/strategy/signal_generator.hpp
#pragma once

#include "foundation/types.hpp"
#include "analytics/profile_engine.hpp"
#include "data_structures/price_ladder.hpp"
#include <algorithm>

namespace mp {

// ════════════════════════════════
// Market Profile Signal Generator
// ════════════════════════════════

class SignalGenerator {
public:
    struct Config {
        double va_penetration_threshold = 0.0002; // 2 bps beyond VA
        double stop_atr_multiple = 1.5;
        double target_r_ratio = 2.0;
        double min_confidence = 0.55;
    };

private:
    Config cfg_;

public:
    explicit SignalGenerator(Config cfg = {}) noexcept : cfg_{cfg} {}

    // Core mean-reversion logic:
    //   Price rejecting VAH => fade short back toward POC.
    //   Price rejecting VAL => fade long back toward POC.
    //   Shape gates confidence.
    [[nodiscard]] Signal generate(
        Price current_price,
        const ProfileEngine::ProfileResult& profile,
        const Position& position
    ) const noexcept {
        Signal sig{};
        sig.shape = profile.shape;

        const auto& va = profile.value_area;
        if (va.vah == 0 || va.val == 0) return sig;

        const double px = price_to_double(current_price);
        const double vah = price_to_double(va.vah);
        const double val = price_to_double(va.val);
        const double poc = price_to_double(va.poc);

        const double band = px * cfg_.va_penetration_threshold;

        // --- LONG setup: rejection at value area low ---
        if (px <= val - band && position.net_position() <= 0) {
            sig.type = SignalType::LONG;
            sig.entry_price = current_price;
            sig.stop_loss = double_to_price(px - (poc - val) * cfg_.stop_atr_multiple);
            sig.take_profit = va.poc;
            sig.confidence = confidence_for_long(profile);
        }
        // --- SHORT setup: rejection at value area high ---
        else if (px >= vah + band && position.net_position() >= 0) {
            sig.type = SignalType::SHORT;
            sig.entry_price = current_price;
            sig.stop_loss = double_to_price(px + (vah - poc) * cfg_.stop_atr_multiple);
            sig.take_profit = va.poc;
            sig.confidence = confidence_for_short(profile);
        }
        // --- Exit: price returned to POC ---
        else if (position.net_position() > 0 && px >= poc) {
            sig.type = SignalType::CLOSE_LONG;
            sig.confidence = 1.0;
        }
        else if (position.net_position() < 0 && px <= poc) {
            sig.type = SignalType::CLOSE_SHORT;
            sig.confidence = 1.0;
        }

        // Confidence gate
        if (sig.type == SignalType::LONG || sig.type == SignalType::SHORT) {
            if (sig.confidence < cfg_.min_confidence) {
                sig.type = SignalType::NONE;
            }
        }

        return sig;
    }

private:
    // b-shape (POC low, tail up) favors longs from the base.
    [[nodiscard]] double confidence_for_long(
        const ProfileEngine::ProfileResult& p
    ) const noexcept {
        double c = 0.55;
        if (p.shape == ProfileShape::B_SHAPE) c += 0.15;
        if (p.shape == ProfileShape::D_SHAPE) c += 0.05;
        if (p.shape == ProfileShape::DOUBLE_DISTRIBUTION) c -= 0.10;
        return std::clamp(c, 0.0, 1.0);
    }

    // P-shape (POC high, tail down) favors shorts from the top.
    [[nodiscard]] double confidence_for_short(
        const ProfileEngine::ProfileResult& p
    ) const noexcept {
        double c = 0.55;
        if (p.shape == ProfileShape::P_SHAPE) c += 0.15;
        if (p.shape == ProfileShape::D_SHAPE) c += 0.05;
        if (p.shape == ProfileShape::DOUBLE_DISTRIBUTION) c -= 0.10;
        return std::clamp(c, 0.0, 1.0);
    }
};

} // namespace mp
