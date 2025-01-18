// src/models/types/error.types.ts

// Base error interface
export interface BaseErrorType extends Error {
    code: string;
    timestamp: Date;
    details?: unknown;
}

// Error codes enum
export enum ErrorCode {
    SCRAPER_ERROR = 'SCRAPER_ERROR',
    QUEUE_ERROR = 'QUEUE_ERROR',
    API_ERROR = 'API_ERROR',
    VALIDATION_ERROR = 'VALIDATION_ERROR',
    DB_ERROR = 'DB_ERROR',
    CONFIG_ERROR = 'CONFIG_ERROR'
}

// Error metadata
export interface ErrorMeta {
    component?: string;
    action?: string;
    params?: Record<string, unknown>;
    stack?: string;
}

// Logger types
export interface LogMeta {
    [key: string]: unknown;
    timestamp?: Date;
    correlationId?: string;
    component?: string;
}

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
    level: LogLevel;
    message: string;
    meta?: LogMeta;
    timestamp: Date;
}