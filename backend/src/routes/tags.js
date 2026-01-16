const express = require('express');
const db = require('../db/database');

const router = express.Router();

// GET /api/tags - List all tags
router.get('/', (req, res) => {
    const tags = db.prepare(`
        SELECT t.*, COUNT(st.session_id) as usage_count
        FROM tags t
        LEFT JOIN session_tags st ON t.id = st.tag_id
        GROUP BY t.id
        ORDER BY usage_count DESC, t.name ASC
    `).all();
    res.json(tags);
});

// POST /api/tags - Create new tag
router.post('/', (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }

    try {
        const result = db.prepare('INSERT INTO tags (name) VALUES (?)').run(name);
        const tag = db.prepare('SELECT * FROM tags WHERE id = ?').get(result.lastInsertRowid);
        res.status(201).json(tag);
    } catch (err) {
        if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            return res.status(409).json({ error: 'Tag already exists' });
        }
        throw err;
    }
});

// DELETE /api/tags/:id - Delete tag
router.delete('/:id', (req, res) => {
    const result = db.prepare('DELETE FROM tags WHERE id = ?').run(req.params.id);

    if (result.changes === 0) {
        return res.status(404).json({ error: 'Tag not found' });
    }

    res.status(204).send();
});

module.exports = router;
