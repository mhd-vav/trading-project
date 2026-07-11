// include/data_structures/price_ladder.hpp
#pragma once

#include "foundation/types.hpp"
#include <array>
#include <algorithm>
#include <cstring>

namespace mp {

// ═══════════════════════════════════════════════════════════════════════════
// Cache-Optimized Price Ladder (SoA Layout)
// ═══════════════════════════════════════════════════════════════════════════

class PriceLadder {
    // Struct-of-Arrays for cache efficiency
    alignas(CACHE_LINE_SIZE) std::array<Price, MAX_PRICE_LEVELS> prices_{};
    alignas(CACHE_LINE_SIZE) std::array<Volume, MAX_PRICE_LEVELS> volumes_{};
    alignas(CACHE_LINE_SIZE) std::array<uint32_t, MAX_PRICE_LEVELS> tpo_counts_{};
    
    size_t size_{0};
    Price min_price_{INT64_MAX};
    Price max_price_{INT64_MIN};
    Volume total_volume_{0};
    uint32_t total_ticks_{0};

public:
    void reset() noexcept {
        size_ = 0;
        min_price_ = INT64_MAX;
        max_price_ = INT64_MIN;
        total_volume_ = 0;
        total_ticks_ = 0;
        
        // Fast memset for bulk reset
        std::memset(volumes_.data(), 0, MAX_PRICE_LEVELS * sizeof(Volume));
        std::memset(tpo_counts_.data(), 0, MAX_PRICE_LEVELS * sizeof(uint32_t));
    }

    // Add tick with binary search + insertion
    void add_tick(Price price, Volume volume) noexcept {
        if (size_ >= MAX_PRICE_LEVELS) [[unlikely]] {
            return; // Silently drop (log in production)
        }

        // Binary search for insertion point
        auto it = std::lower_bound(prices_.begin(), prices_.begin() + size_, price);
        const size_t idx = std::distance(prices_.begin(), it);

        if (idx < size_ && prices_[idx] == price) {
            // Price level exists: accumulate
            volumes_[idx] += volume;
            tpo_counts_[idx]++;
        } else {
            // Insert new price level
            if (idx < size_) {
                // Shift elements right
                std::memmove(&prices_[idx + 1], &prices_[idx], 
                            (size_ - idx) * sizeof(Price));
                std::memmove(&volumes_[idx + 1], &volumes_[idx], 
                            (size_ - idx) * sizeof(Volume));
                std::memmove(&tpo_counts_[idx + 1], &tpo_counts_[idx], 
                            (size_ - idx) * sizeof(uint32_t));
            }
            
            prices_[idx] = price;
            volumes_[idx] = volume;
            tpo_counts_[idx] = 1;
            size_++;
        }

        min_price_ = std::min(min_price_, price);
        max_price_ = std::max(max_price_, price);
        total_volume_ += volume;
        total_ticks_++;
    }

    // Batch add (more efficient for bulk loads)
    void add_ticks(const Tick* ticks, size_t count) noexcept {
        for (size_t i = 0; i < count; ++i) {
            add_tick(ticks[i].price, ticks[i].volume);
        }
    }

    // Accessors
    [[nodiscard]] size_t size() const noexcept { return size_; }
    [[nodiscard]] Price price_at(size_t i) const noexcept { return prices_[i]; }
    [[nodiscard]] Volume volume_at(size_t i) const noexcept { return volumes_[i]; }
    [[nodiscard]] uint32_t tpo_at(size_t i) const noexcept { return tpo_counts_[i]; }
    [[nodiscard]] Price min_price() const noexcept { return min_price_; }
    [[nodiscard]] Price max_price() const noexcept { return max_price_; }
    [[nodiscard]] Volume total_volume() const noexcept { return total_volume_; }
    [[nodiscard]] uint32_t total_ticks() const noexcept { return total_ticks_; }
    [[nodiscard]] bool empty() const noexcept { return size_ == 0; }

    // Direct array access for SIMD operations
    [[nodiscard]] const Price* prices() const noexcept { return prices_.data(); }
    [[nodiscard]] const Volume* volumes() const noexcept { return volumes_.data(); }
    [[nodiscard]] const uint32_t* tpo_counts() const noexcept { return tpo_counts_.data(); }
};

} // namespace mp
