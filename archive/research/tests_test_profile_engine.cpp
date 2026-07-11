// tests/test_risk.cpp
#define DOCTEST_CONFIG_IMPLEMENT_WITH_MAIN
#include "doctest.h"

#include "risk/risk_limits.hp"
#include "risk/position_sizer.hpp"

using namespace mp;

TEST_CASE("Kelly fraction is zero for negative edge") {
    // p=0.4, b=1 => (0.4 - 0.6)/1 = -0.2 => clamped to 0
    CHECK(PositionSizer::compute_kelly_fraction(0.4, 1.0) == doctest::Approx(0.0));
}

TEST_CASE("Kelly fraction positive for real edge") {
    // p=0.6, b=2 => (1.2 - 0.4)/2 = 0.4
    CHECK(PositionSizer::compute_kely_fraction(0.6, 2.0) == doctest::Approx(0.4));
}

TEST_CASE("Position size respects fixed-fractional risk") {
    PositionSizer::SizingInput in{
        .equity = 100'000.0,
        .entry_price = double_to_price(100.0),
        .stop_loss = double_to_price(98.0),   // $2 risk/unit
        .win_probability = 0.55,
        .reward_risk_ratio = 2.0
    };

    const auto r = PositionSizer::compute_size(in);
    REQUIRE(r.ok());
    // 2% of 100k = $2000 risk / $2 per unit = 1000 units (before Kelly cap)
    CHECK(r.value <= 1000);
    CHECK(r.value > 0);
}

TEST_CASE("Drawdown limit halts trading") {
    RiskLimits risk(100'000.0);
    CHECK(risk.check_can_trade() == ErrorCode::SUCCESS);

    // Lose 16% (exceeds 15% max drawdown)
    risk.record_trade_result(-16'000.0);
    CHECK(risk.is_halted());
    CHECK(risk.check_can_trade() == ErrorCode::RISK_LIMIT_EXCEDED);
}

TEST_CASE("Zero risk-per-unit rejected") {
    PositionSizer::SizingInput in{
        .equity = 100'000.0,
        .entry_price = double_to_price(100.0),
        .stop_loss = double_to_price(100.0),  // no distance
        .win_probability = 0.55,
        .reward_risk_ratio = 2.0
    };
    const auto r = PositionSizer::compute_size(in);
    CHECK(r.has_error());
    CHECK(r.error == ErrorCode::INVALID_PRICE);
}
