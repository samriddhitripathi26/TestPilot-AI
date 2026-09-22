export const PRESETS = [
  {
    id: 'jwt-validator',
    name: 'JWT Token Validator & Claims Extractor',
    language: 'typescript',
    framework: 'jest',
    category: 'Security & Auth',
    code: `interface TokenPayload {
  userId: string;
  role: 'admin' | 'user' | 'guest';
  exp: number;
}

export function validateJwtToken(token: string, currentTimestamp?: number): { isValid: boolean; payload?: TokenPayload; error?: string } {
  if (!token || typeof token !== 'string') {
    return { isValid: false, error: 'Token string is required' };
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    return { isValid: false, error: 'Malformed JWT: must contain exactly 3 segments' };
  }

  try {
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    const payload: TokenPayload = JSON.parse(jsonPayload);
    const now = currentTimestamp ?? Math.floor(Date.now() / 1000);

    if (payload.exp && payload.exp < now) {
      return { isValid: false, error: 'Token expired', payload };
    }

    if (!payload.userId || !payload.role) {
      return { isValid: false, error: 'Missing mandatory claims: userId or role' };
    }

    return { isValid: true, payload };
  } catch (err: any) {
    return { isValid: false, error: 'Payload decode error: ' + err.message };
  }
}`
  },
  {
    id: 'cart-total-calc',
    name: 'E-Commerce Cart Total & Coupon Calculator',
    language: 'javascript',
    framework: 'jest',
    category: 'Business Logic',
    code: `/**
 * Calculates cart total including tiered bulk discounts, promo codes, and regional sales tax.
 */
function calculateCartTotal(items, options = {}) {
  if (!Array.isArray(items)) {
    throw new TypeError('Items must be an array');
  }

  const { couponCode = null, taxRate = 0.08, shippingThreshold = 50 } = options;

  let subtotal = 0;
  for (const item of items) {
    if (!item.price || item.price < 0 || !item.quantity || item.quantity <= 0) {
      continue;
    }
    let itemPrice = item.price * item.quantity;
    // Tiered bulk discount: 10% off for 5+ of same item
    if (item.quantity >= 5) {
      itemPrice *= 0.9;
    }
    subtotal += itemPrice;
  }

  let discount = 0;
  if (couponCode === 'SAVE20' && subtotal >= 100) {
    discount = subtotal * 0.20;
  } else if (couponCode === 'FLAT15') {
    discount = Math.min(15, subtotal);
  }

  const discountedSubtotal = Math.max(0, subtotal - discount);
  const shipping = (discountedSubtotal >= shippingThreshold || discountedSubtotal === 0) ? 0 : 7.99;
  const tax = discountedSubtotal * taxRate;
  const finalTotal = Math.round((discountedSubtotal + shipping + tax) * 100) / 100;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    discount: Math.round(discount * 100) / 100,
    shipping,
    tax: Math.round(tax * 100) / 100,
    total: finalTotal
  };
}`
  },
  {
    id: 'lru-cache',
    name: 'LRU Cache (Least Recently Used)',
    language: 'javascript',
    framework: 'jest',
    category: 'Data Structures',
    code: `class LRUCache {
  constructor(capacity) {
    if (!capacity || capacity <= 0) {
      throw new Error('Capacity must be a positive integer');
    }
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) return null;
    const value = this.cache.get(key);
    // Refresh key order by deleting and re-inserting
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  put(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      // Evict oldest item (first key in map iterator)
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
    this.cache.set(key, value);
  }

  size() {
    return this.cache.size;
  }
}`
  },
  {
    id: 'python-binary-search',
    name: 'Binary Search with Edge Conditions',
    language: 'python',
    framework: 'pytest',
    category: 'Algorithms',
    code: `def binary_search(arr, target):
    """
    Performs binary search on a sorted list.
    Returns the index of target if found, else -1.
    Handles duplicate values by returning the leftmost occurrence.
    """
    if arr is None or not isinstance(arr, list):
        raise TypeError("Input array must be a valid list")
    
    if len(arr) == 0:
        return -1

    left, right = 0, len(arr) - 1
    result = -1

    while left <= right:
        mid = left + (right - left) // 2
        if arr[mid] == target:
            result = mid
            right = mid - 1  # Continue searching left for leftmost index
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1

    return result`
  },
  {
    id: 'python-rate-limiter',
    name: 'Sliding Window Rate Limiter',
    language: 'python',
    framework: 'pytest',
    category: 'System Design',
    code: `import time
from collections import deque

class SlidingWindowRateLimiter:
    def __init__(self, max_requests: int, window_seconds: float):
        if max_requests <= 0 or window_seconds <= 0:
            raise ValueError("Rate limits must be positive")
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.user_timestamps = {}

    def is_allowed(self, user_id: str, current_time: float = None) -> bool:
        if not user_id:
            return False
        
        now = current_time if current_time is not None else time.time()
        
        if user_id not in self.user_timestamps:
            self.user_timestamps[user_id] = deque()
            
        timestamps = self.user_timestamps[user_id]
        
        # Evict timestamps outside the sliding window
        threshold = now - self.window_seconds
        while timestamps and timestamps[0] <= threshold:
            timestamps.popleft()
            
        if len(timestamps) < self.max_requests:
            timestamps.append(now)
            return True
            
        return False`
  },
  {
    id: 'java-bank-transfer',
    name: 'Bank Account Transfer Transaction',
    language: 'java',
    framework: 'junit',
    category: 'Enterprise',
    code: `public class BankTransferService {

    public static class TransferResult {
        public final boolean success;
        public final String message;
        public final double sourceBalanceAfter;

        public TransferResult(boolean success, String message, double balance) {
            this.success = success;
            this.message = message;
            this.sourceBalanceAfter = balance;
        }
    }

    public TransferResult transferFunds(double sourceBalance, double amount, double dailyLimitSpent, double dailyLimit) {
        if (amount <= 0) {
            throw new IllegalArgumentException("Transfer amount must be strictly greater than 0");
        }
        if (amount > sourceBalance) {
            return new TransferResult(false, "Insufficient funds", sourceBalance);
        }
        if (dailyLimitSpent + amount > dailyLimit) {
            return new TransferResult(false, "Daily transfer limit exceeded", sourceBalance);
        }

        double remaining = sourceBalance - amount;
        return new TransferResult(true, "Transfer completed successfully", remaining);
    }
}`
  }
];
