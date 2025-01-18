// src/models/types/utils.types.ts

// Pagination types
export interface PaginationParams {
    page: number;
    limit: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

// Response wrapper type
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: {
        code: string;
        message: string;
        details?: unknown;
    };
    meta?: {
        timestamp: Date;
        pagination?: {
            total: number;
            page: number;
            limit: number;
            pages: number;
        };
    };
}

// Cache options type
export interface CacheOptions {
    ttl: number;
    key?: string;
    namespace?: string;
}

// Retry configuration
export interface RetryConfig {
    attempts: number;
    delay: number;
    maxDelay?: number;
    backoff?: boolean;
    timeout?: number;
}

// Rate limiting configuration
export interface RateLimitConfig {
    windowMs: number;
    maxRequests: number;
    message?: string;
}

// Type guard helper types
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

// Utility types for validation
export type ValidationResult = {
    valid: boolean;
    errors?: string[];
};

export type Validator<T> = {
    validate(data: unknown): data is T;
    errors(): string[];
};