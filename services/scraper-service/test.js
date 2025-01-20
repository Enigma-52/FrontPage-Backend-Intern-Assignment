// test-db.js
const mysql = require('mysql2/promise');

// Sample story from our test
const sampleStory = {
    id: 42746088,
    title: 'Show HN: My New ASCII Editor',
    url: 'https://github.com/mikedesu/asciishade2',
    author: 'mikedesu',
    score: 1,
    published_at: new Date('2025-01-18T05:24:22.000Z'),
    type: 'story'
};

async function testDatabase() {
    console.log('Testing database connection and operations...');

    const pool = mysql.createPool({
        host: 'localhost',  // or your MySQL host
        user: 'app_user',
        password: 'app_pass',
        database: 'scraper_db',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });

    try {
        // Test connection
        console.log('Connecting to database...');
        await pool.getConnection();
        console.log('Successfully connected to database');

        // Test table existence
        console.log('\nChecking stories table...');
        const [tables] = await pool.query('SHOW TABLES');
        console.log('Tables in database:', tables);

        // Test table structure
        console.log('\nChecking table structure...');
        const [columns] = await pool.query('DESCRIBE stories');
        console.log('Table structure:', columns);

        // Insert test story
        console.log('\nInserting test story...');
        const query = `
            INSERT INTO stories (id, title, url, score, author, published_at, type)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
            score = VALUES(score),
            title = VALUES(title),
            url = VALUES(url)
        `;

        await pool.execute(query, [
            sampleStory.id,
            sampleStory.title,
            sampleStory.url,
            sampleStory.score,
            sampleStory.author,
            sampleStory.published_at,
            sampleStory.type
        ]);

        // Verify insertion
        console.log('\nVerifying insertion...');
        const [stories] = await pool.query('SELECT * FROM stories ORDER BY published_at DESC LIMIT 1');
        console.log('Last inserted story:', stories[0]);

        // Count total stories
        const [count] = await pool.query('SELECT COUNT(*) as count FROM stories');
        console.log('\nTotal stories in database:', count[0].count);

    } catch (error) {
        console.error('Database test failed:', error);
    } finally {
        await pool.end();
    }
}

// Run the test
testDatabase().catch(console.error);