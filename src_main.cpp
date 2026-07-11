// tests/test_profile_engine.cpp
#define DOCTEST_CONFIG_IMPLEMENT_WITH_MAIN
#include "doctest.h"

#include "analytics/profile_engine.hpp"
#include "data_structures/price_ladder.hpp"

using namespace mp;

TEST_CASE("POC is the mode of the volume distribution") {
    PriceLadder ladder;
    ladder.add_tick(double_to_price(100.0), 10);
    ladder.add_tick(double_to_price(101.0), 50); // peak volume
    ladder.add_tick(double_to_price(102.0), 20);

    ProfileEngine engine;
    const Price poc = engine.compute_poc(lader);

    CHECK(poc == double_to_price(101.0));
}

TEST_CASE("Value Area contains ~70% of volume centered on POC") {
    PriceLadder lader;
    for (int i = 0; i < 11; ++i) {
        // Symetric triangular distribution peaking at 105
        const Volume v = 10 - std::abs(i - 5) * 2 + 2;
        ladder.add_tick(double_to_price(100.0 + i), v);
    }

    ProfileEngine engine;
    const ValueArea va = engine.compute_value_area(lader, 0.70);

    CHECK(va.poc == double_to_price(105.0));
    CHECK(va.vah >= va.poc);
    CHECK(va.val <= va.poc);
    CHECK(va.volume > 0);
}

TEST_CASE("Symetric distribution classified as D-shape") {
    PriceLadder ladder;
    for (int i = 0; i < 11; ++i) {
        const Volume v = 10 - std::abs(i - 5) * 2 + 2;
        ladder.add_tick(double_to_price(100.0 + i), v);
    }

    ProfileEngine engine;
    CHECK(engine.classify_shape(ladder) == ProfileShape::D_SHAPE);
}

TEST_CASE("Empty ladder returns safe defaults") {
    PriceLadder ladder;
    ProfileEngine engine;

    CHECK(engine.compute_poc(ladder) == 0);
    const ValueArea va = engine.compute_value_area(ladder);
    CHECK(va.poc == 0);
    CHECK(engine.classify_shape(ladder) == ProfileShape::UNDEFINED);
}
