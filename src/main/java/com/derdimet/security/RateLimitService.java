package com.derdimet.security;

import java.time.Duration;
import java.util.Deque;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedDeque;
import org.springframework.stereotype.Service;

@Service
public class RateLimitService {

    private final ConcurrentHashMap<String, Deque<Long>> buckets = new ConcurrentHashMap<>();

    public boolean tryConsume(String key, int maxRequests, Duration window) {
        long now = System.currentTimeMillis();
        long windowStart = now - window.toMillis();
        Deque<Long> times = buckets.computeIfAbsent(key, ignored -> new ConcurrentLinkedDeque<>());
        synchronized (times) {
            while (!times.isEmpty() && times.peekFirst() < windowStart) {
                times.pollFirst();
            }
            if (times.size() >= maxRequests) {
                return false;
            }
            times.addLast(now);
            return true;
        }
    }
}
