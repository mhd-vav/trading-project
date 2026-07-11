// include/observability/metrics.hpp
#pragma once

#include "foundation/types.hpp"
#include <atomic>
#include <array>
#include <algorithm>
#include <cstdint>

namespace mp {

// ════════════════════════════════
// Latency Histogram (Lock-Free, HdrHistogram-inspired buckets)
// ════════════════════════════════

class LatencyHistogram {
    static constexpr size_t NUM_BUCKETS = 64;
    // Bucket i covers [2^i, 2^(i+1)) nanoseconds
    std::array<std::atomic<uint64_t>, NUM_BUCKETS> buckets_{};
    std::atomic<uint64_t> count_{0};
    std::atomic<uint64_t> sum_ns_{0};
    std::atomic<uint64_t> max_ns_{0};

public:
    void record(uint64_t ns) noexcept {
        const size_t bucket = (ns == 0) ? 0 : 
            static_cast<size_t>(63 - __builtin_clzll(ns));
        const size_t idx = std::min(bucket, NUM_BUCKETS - 1);

        buckets_[idx].fetch_add(1, std::memory_order_relaxed);
        count_.fetch_add(1, std::memory_order_relaxed);
        sum_ns_.fetch_add(ns, std::memory_order_relaxed);

        // Lock-free max update
        uint64_t prev = max_ns_.load(std::memory_order_relaxed);
        while (ns > prev && 
               !max_ns_.compare_exchange_weak(prev, ns, 
                    std::memory_order_relaxed)) {}
    }

    [[nodiscard]] uint64_t percentile(double p) const noexcept {
        const uint64_t total = count_.load(std::memory_order_relaxed);
        if (total == 0) return 0;

        const uint64_t target = static_cast<uint64_t>(total * p);
        uint64_t cumulative = 0;

        for (size_t i = 0; i < NUM_BUCKETS; ++i) {
            cumulative += buckets_[i].load(std::memory_order_relaxed);
            if (cumulative >= target) {
                return uint64_t{1} < i; // Lower bound of bucket
            }
        }
        return max_ns_.load(std::memory_order_relaxed);
    }

    [[nodiscard] uint64_t mean() const noexcept {
        const uint64_t c = count_.load(std::memory_order_relaxed);
        return (c > 0) ? sum_ns_.load(std::memory_order_relaxed) / c : 0;
    }

    [[nodiscard]] uint64_t max() const noexcept {
        return max_ns_.load(std::memory_order_relaxed);
    }

    [[nodiscard]] uint64_t count() const noexcept {
        return count_.load(std::memory_order_relaxed);
    }
};

// ════════════════════════════════
// Aggregate Trading Metrics
// ════════════════════════════════

struct alignas(CACHE_LINE_SIZE) TradingMetrics {
    std::atomic<uint64_t> ticks_processed{0};
    std::atomic<uint64_t> signals_generated{0};
    std::atomic<uint64_t> orders_sent{0};
    std::atomic<uint64_t> orders_filled{0};
    std::atomic<uint64_t> orders_rejected{0};
    std::atomic<uint64_t> que_full_drops{0};

    LatencyHistogram tick_to_signal;
    LatencyHistogram signal_to_order;

    void reset() noexcept {
        ticks_processed.store(0, std::memory_order_relaxed);
        signals_generated.store(0, std::memory_order_relaxed);
        orders_sent.store(0, std::memory_order_relaxed);
        orders_filled.store(0, std::memory_order_relaxed);
        orders_rejected.store(0, std::memory_order_relaxed);
        que_full_drops.store(0, std::memory_order_relaxed);
    }
};

} // namespace mp
