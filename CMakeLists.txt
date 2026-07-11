# CMakeLists.txt
cmake_minimum_required(VERSION 3.20)
project(market_profile_bot VERSION 1.0.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OF)

if(NOT CMAKE_BUILD_TYPE)
    set(CMAKE_BUILD_TYPE Release)
endif()

# ── Compiler flags ────────────────────────────────
set(CMAKE_CXX_FLAGS_RELEASE
    "-O3 -march=native -mtune=native -funroll-loops -DNDEBUG")

set(CMAKE_CXX_FLAGS_DEBUG
    "-O0 -g3 -fsanitize=address,undefined -fno-omit-frame-pointer")

add_compile_options(-Wall -Wextra -Wpedantic -Wconversion -Wshadow)

# ─── Includes ────────────────────────────────
include_directories(${CMAKE_SOURCE_DIR}/include)

# ─── Main binary ────────────────────────────────
add_executable(mp_bot src/main.cpp)
target_link_libraries(mp_bot PRIVATE pthread)

# ─── Tests ────────────────────────────────
enable_testing()
find_path(DOCTEST_INCLUDE_DIR doctest.h PATHS ${CMAKE_SOURCE_DIR}/third_party)

add_executable(test_profile tests/test_profile_engine.cpp)
target_include_directories(test_profile PRIVATE ${DOCTEST_INCLUDE_DIR})

add_executable(test_risk tests/test_risk.cp)
target_include_directories(test_risk PRIVATE ${DOCTEST_INCLUDE_DIR})

add_test(NAME ProfileEngine COMAND test_profile)
add_test(NAME Risk COMMAND test_risk)

# ── Build helper messages ────────────────────────────────
message(STATUS "Build type: ${CMAKE_BUILD_TYPE}")
message(STATUS "C++ standard: ${CMAKE_CXX_STANDARD}")
