-- init/01-databases.sql

-- Create databases
CREATE DATABASE IF NOT EXISTS scraper_db;

-- Create tables in scraper_db
USE scraper_db;

CREATE TABLE IF NOT EXISTS stories (
    id BIGINT PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    url TEXT,
    score INT,
    author VARCHAR(255),
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    type VARCHAR(50),
    INDEX idx_published_at (published_at),
    INDEX idx_author (author),
    INDEX idx_type (type)
);

-- Grant permissions for app_user
GRANT ALL PRIVILEGES ON scraper_db.* TO 'app_user'@'%';
GRANT ALL PRIVILEGES ON api_db.* TO 'app_user'@'%';
GRANT ALL PRIVILEGES ON analytics_db.* TO 'app_user'@'%';

FLUSH PRIVILEGES;
