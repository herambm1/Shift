const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Helper function to read JSON files
function readJSON(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading ${filePath}:`, error.message);
        return null;
    }
}

// API: Get comparison between two languages for any content type
// API: Get comparison between two languages for any content type
app.get('/api/compare', (req, res) => {
    const { from, to, mode, item } = req.query;
    
    if (!from || !to || !mode || !item) {
        return res.status(400).json({ 
            error: 'Missing required parameters: from, to, mode, item' 
        });
    }
    
    // Map mode to content directory
    const contentDirs = {
        'concept': 'concepts',
        'function': 'inbuilt_functions',
        'program': 'programs'
    };
    
    if (!contentDirs[mode]) {
        return res.status(400).json({ 
            error: `Invalid mode. Must be one of: ${Object.keys(contentDirs).join(', ')}` 
        });
    }
    
    const contentDir = contentDirs[mode];
    
    // Read both language implementations
    const fromPath = path.join(__dirname, 'content', contentDir, item, `${from}.json`);
    const toPath = path.join(__dirname, 'content', contentDir, item, `${to}.json`);
    
    const fromData = readJSON(fromPath);
    const toData = readJSON(toPath);
    
    if (!fromData || !toData) {
        return res.status(404).json({ 
            error: `Content not found: ${contentDir}/${item} for ${from} or ${to}` 
        });
    }
    
    // Build comparison response
    const comparison = {
        mode: mode,
        item: item,
        from_language: from,
        to_language: to,
        source: {
            language: fromData.language,
            title: fromData.title,
            description: fromData.description || fromData.explanation?.short || '',
            syntax: fromData.syntax,
            usage_snippet: fromData.usage_snippet,
            code_example: fromData.code_example || fromData.code?.full_code || fromData.usage_snippet,
            key_points: fromData.key_points || fromData.usage_notes || [],
            best_practices: fromData.best_practices || [],
            common_mistakes: fromData.common_mistakes || fromData.gotchas || []
        },
        target: {
            language: toData.language,
            title: toData.title,
            description: toData.description || toData.explanation?.short || '',
            syntax: toData.syntax,
            usage_snippet: toData.usage_snippet,
            code_example: toData.code_example || toData.code?.full_code || toData.usage_snippet,
            key_points: toData.key_points || toData.usage_notes || [],
            best_practices: toData.best_practices || [],
            common_mistakes: toData.common_mistakes || toData.gotchas || []
        }
    };
    
    res.json(comparison);
});


// API: Get all available languages
app.get('/api/languages', (req, res) => {
    const languagesDir = path.join(__dirname, 'content', 'languages');

    try {
        const files = fs.readdirSync(languagesDir);
        const languages = files
            .filter(file => file.endsWith('.json'))
            .map(file => {
                const data = readJSON(path.join(languagesDir, file));
                return {
                    id: data.language_id,
                    name: data.name,
                    difficulty: data.difficulty_level
                };
            });

        res.json(languages);
    } catch (error) {
        res.status(500).json({ error: 'Error reading languages directory' });
    }
});

// API: Get all available concepts
app.get('/api/concepts', (req, res) => {
    const conceptsDir = path.join(__dirname, 'content', 'concepts');

    try {
        const folders = fs.readdirSync(conceptsDir);
        const concepts = folders.filter(folder => {
            const stats = fs.statSync(path.join(conceptsDir, folder));
            return stats.isDirectory();
        });

        res.json(concepts);
    } catch (error) {
        res.status(500).json({ error: 'Error reading concepts directory' });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Shift backend is running!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Shift backend running on http://localhost:${PORT}`);
    console.log(`📚 Test it: http://localhost:${PORT}/api/health`);
    console.log(`📊 Compare API: http://localhost:${PORT}/api/compare?from=java&to=python&concept=variables`);
});
