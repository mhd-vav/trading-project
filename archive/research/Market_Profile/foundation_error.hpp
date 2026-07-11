// include/data_structures/spsc_queue.hpp
#pragma once

#include "foundation/types.hpp"
#include "foundation/error.hpp"
#include <atomic>
#include <array>
#include <optional>

namespace mp {

// ═══════════════════════════════════════════════════════════════════════════
// Lock-Free SPSC Queue (Lamport's Algorithm)
// ═══════════════════════════════════════════════════════════════════════════

template<typename T, size_t Capacity>
class alignas(CACHE_LINE_SIZE) SPSCQueue {
    static_assert((Capacity & (Capacity - 1)) == 0, "Capacity must be power of 2");
    static_assert(Capacity >= 2, "Capacity must be at least 2");

    std::array<T, Capacity> buffer_;
    alignas(CACHE_LINE_SIZE) std::atomic<size_t> write_pos_{0};
    alignas(CACHE_LINE_SIZE) std::atomic<size_t> read_pos_{0};
    
    static constexpr size_t MASK = Capacity - 1;

public:
    SPSCQueue() noexcept = default;
    
    // Disable copy/move
    SPSCQueue(const SPSCQueue&) = delete;
    SPSCQueue& operator=(const SPSCQueue&) = delete;

    // Producer: try to push one element
    [[nodiscard]] ErrorCode try_push(const T& item) noexcept {
        const size_t current_write = write_pos_.load(std::memory_order_relaxed);
        const size_t next_write = (current_write + 1) & MASK;
        
        if (next_write == read_pos_.load(std::memory_order_acquire)) {
            return ErrorCode::QUEUE_FULL;
        }
        
        buffer_[current_write] = item;
        write_pos_.store(next_write, std::memory_order_release);
        return ErrorCode::SUCCESS;
    }

    // Producer: emplace construct
    template<typename... Args>
    [[nodiscard]] ErrorCode try_emplace(Args&&... args) noexcept {
        const size_t current_write = write_pos_.load(std::memory_order_relaxed);
        const size_t next_write = (current_write + 1) & MASK;
        
        if (next_write == read_pos_.load(std::memory_order_acquire)) {
            return ErrorCode::QUEUE_FULL;
        }
        
        new (&buffer_[current_write]) T(std::forward<Args>(args)...);
        write_pos_.store(next_write, std::memory_order_release);
        return ErrorCode::SUCCESS;
    }

    // Consumer: try to pop one element
    [[nodiscard]] std::optional<T> try_pop() noexcept {
        const size_t current_read = read_pos_.load(std::memory_order_relaxed);
        
        if (current_read == write_pos_.load(std::memory_order_acquire)) {
            return std::nullopt; // empty
        }
        
        T item = buffer_[current_read];
        read_pos_.store((current_read + 1) & MASK, std::memory_order_release);
        return item;
    }

    // Non-owning peek (consumer only)
    [[nodiscard]] const T* peek() const noexcept {
        const size_t current_read = read_pos_.load(std::memory_order_relaxed);
        
        if (current_read == write_pos_.load(std::memory_order_acquire)) {
            return nullptr;
        }
        
        return &buffer_[current_read];
    }

    [[nodiscard]] size_t size() const noexcept {
        const size_t w = write_pos_.load(std::memory_order_acquire);
        const size_t r = read_pos_.load(std::memory_order_acquire);
        return (w - r) & MASK;
    }

    [[nodiscard]] bool empty() const noexcept {
        return read_pos_.load(std::memory_order_acquire) == 
               write_pos_.load(std::memory_order_acquire);
    }

    [[nodiscard]] bool full() const noexcept {
        const size_t w = write_pos_.load(std::memory_order_acquire);
        const size_t r = read_pos_.load(std::memory_order_acquire);
        return ((w + 1) & MASK) == r;
    }

    [[nodiscard]] constexpr size_t capacity() const noexcept {
        return Capacity - 1; // One slot reserved
    }
};

} // namespace mp
