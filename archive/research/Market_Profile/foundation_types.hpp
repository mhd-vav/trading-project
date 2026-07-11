// include/foundation/types.hpp
#pragma once

#include <cstdint>
#include <chrono>
#include <ratio>
#include <string_view>

namespace mp {

// ═══════════════════════════════════════════════════════════════════════════
// Compile-time Configuration
// ═══════════════════════════════════════════════════════════════════════════

inline constexpr size_t CACHE_LINE_SIZE = 64;
inline constexpr size_t L1_CACHE_SIZE = 32 * 1024;
inline constexpr size_t MAX_PRICE_LEVELS = 10'000;
inline constexpr size_t TICK_QUEUE_SIZE = 65'536;      // 2^16
inline constexpr size_t ORDER_QUEUE_SIZE = 4'096;      // 2^12
inline constexpr size_t MAX_OPEN_ORDERS = 128;

// Fixed-point precision for price (8 decimal places)
inline constexpr int64_t PRICE_SCALE = 100'000'000;

// Risk parameters (compile-time fractions)
using RiskPerTrade = std::ratio<2, 100>;       // 2%
using MaxDrawdown = std::ratio<15, 100>;       // 15%
using MaxLeverage = std::ratio<3, 1>;          // 3x
using KellyFraction = std::ratio<1, 4>;        // Quarter-Kelly

// ═══════════════════════════════════════════════════════════════════════════
// Core Types
// ═══════════════════════════════════════════════════════════════════════════

using Price = int64_t;       // Fixed-point: actual_price * PRICE_SCALE
using Volume = uint64_t;
using Quantity = uint32_t;
using OrderId = uint64_t;
using Timestamp = std::chrono::nanoseconds;

// String view for zero-copy symbol handling
using Symbol = std::string_view;

// ═══════════════════════════════════════════════════════════════════════════
// Enumerations
// ═══════════════════════════════════════════════════════════════════════════

enum class Side : uint8_t {
    BID = 0,
    ASK = 1,
    UNKNOWN = 255
};

enum class OrderType : uint8_t {
    MARKET = 0,
    LIMIT = 1,
    STOP = 2,
    STOP_LIMIT = 3
};

enum class OrderStatus : uint8_t {
    PENDING = 0,
    OPEN = 1,
    PARTIAL_FILL = 2,
    FILLED = 3,
    CANCELLED = 4,
    REJECTED = 5
};

enum class TimeInForce : uint8_t {
    GTC = 0,    // Good-Till-Cancel
    IOC = 1,    // Immediate-Or-Cancel
    FOK = 2,    // Fill-Or-Kill
    DAY = 3     // Day order
};

enum class SignalType : uint8_t {
    NONE = 0,
    LONG = 1,
    SHORT = 2,
    CLOSE_LONG = 3,
    CLOSE_SHORT = 4
};

enum class ProfileShape : uint8_t {
    D_SHAPE = 0,                // Normal distribution
    P_SHAPE = 1,                // Negative skew (tail left)
    B_SHAPE = 2,                // Positive skew (tail right)
    DOUBLE_DISTRIBUTION = 3,    // Bimodal
    UNDEFINED = 255
};

// ═══════════════════════════════════════════════════════════════════════════
// Domain Structures (Cache-Aligned)
// ═══════════════════════════════════════════════════════════════════════════

struct alignas(CACHE_LINE_SIZE) Tick {
    Timestamp timestamp;
    Price price;
    Volume volume;
    Side side;
    uint8_t exchange_id;
    uint8_t _pad[CACHE_LINE_SIZE - sizeof(Timestamp) - sizeof(Price) 
                 - sizeof(Volume) - sizeof(Side) - sizeof(uint8_t)];
    
    constexpr Tick() noexcept 
        : timestamp{0}, price{0}, volume{0}, side{Side::UNKNOWN}, 
          exchange_id{0}, _pad{} {}
};

static_assert(sizeof(Tick) == CACHE_LINE_SIZE, "Tick must be cache-line sized");

struct ValueArea {
    Price vah;      // Value Area High
    Price val;      // Value Area Low
    Price poc;      // Point of Control
    Volume volume;  // Total volume in VA
    
    constexpr ValueArea() noexcept 
        : vah{0}, val{0}, poc{0}, volume{0} {}
};

struct Signal {
    SignalType type;
    Price entry_price;
    Price stop_loss;
    Price take_profit;
    Quantity position_size;
    Timestamp timestamp;
    double confidence;      // [0.0, 1.0]
    ProfileShape shape;
    
    constexpr Signal() noexcept
        : type{SignalType::NONE}, entry_price{0}, stop_loss{0}, 
          take_profit{0}, position_size{0}, timestamp{0}, 
          confidence{0.0}, shape{ProfileShape::UNDEFINED} {}
};

struct Position {
    Quantity long_qty;
    Quantity short_qty;
    Price avg_long_price;
    Price avg_short_price;
    double realized_pnl;
    double unrealized_pnl;
    
    constexpr Position() noexcept
        : long_qty{0}, short_qty{0}, avg_long_price{0}, 
          avg_short_price{0}, realized_pnl{0.0}, unrealized_pnl{0.0} {}
    
    [[nodiscard]] constexpr int32_t net_position() const noexcept {
        return static_cast<int32_t>(long_qty) - static_cast<int32_t>(short_qty);
    }
};

// ═══════════════════════════════════════════════════════════════════════════
// Utility Functions
// ═══════════════════════════════════════════════════════════════════════════

[[nodiscard]] constexpr double price_to_double(Price p) noexcept {
    return static_cast<double>(p) / PRICE_SCALE;
}

[[nodiscard]] constexpr Price double_to_price(double d) noexcept {
    return static_cast<Price>(d * PRICE_SCALE);
}

[[nodiscard]] constexpr const char* side_to_string(Side s) noexcept {
    switch (s) {
        case Side::BID: return "BID";
        case Side::ASK: return "ASK";
        default: return "UNKNOWN";
    }
}

[[nodiscard]] constexpr const char* signal_to_string(SignalType s) noexcept {
    switch (s) {
        case SignalType::NONE: return "NONE";
        case SignalType::LONG: return "LONG";
        case SignalType::SHORT: return "SHORT";
        case SignalType::CLOSE_LONG: return "CLOSE_LONG";
        case SignalType::CLOSE_SHORT: return "CLOSE_SHORT";
        default: return "UNKNOWN";
    }
}

[[nodiscard]] constexpr const char* shape_to_string(ProfileShape s) noexcept {
    switch (s) {
        case ProfileShape::D_SHAPE: return "D";
        case ProfileShape::P_SHAPE: return "P";
        case ProfileShape::B_SHAPE: return "b";
        case ProfileShape::DOUBLE_DISTRIBUTION: return "DD";
        default: return "UNDEFINED";
    }
}

} // namespace mp
