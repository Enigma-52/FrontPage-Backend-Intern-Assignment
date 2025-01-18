CREATE TABLE IF NOT EXISTS stories (
    id BIGINT PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    url TEXT,
    score INT,
    author VARCHAR(255),
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    type VARCHAR(50)
);

-- Create indexes for better query performance
CREATE INDEX idx_published_at ON stories(published_at);
CREATE INDEX idx_author ON stories(author);
CREATE INDEX idx_type ON stories(type);

-- Create views for monitoring
CREATE OR REPLACE VIEW story_stats AS
SELECT 
    COUNT(*) as total_stories,
    COUNT(DISTINCT author) as unique_authors,
    AVG(score) as avg_score,
    MAX(published_at) as latest_story,
    MIN(published_at) as oldest_story
FROM stories;

-- Create view for recent stories
CREATE OR REPLACE VIEW recent_stories AS
SELECT *
FROM stories
WHERE published_at >= NOW() - INTERVAL 1 HOUR
ORDER BY published_at DESC;