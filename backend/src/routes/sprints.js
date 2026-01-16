const express = require('express');
const db = require('../db/database');

const router = express.Router();

// GET /api/sprints - List all sprints
router.get('/', (req, res) => {
    const sprints = db.prepare(`
        SELECT s.*,
            (SELECT COUNT(*) FROM goals WHERE sprint_id = s.id) as total_goals,
            (SELECT COUNT(*) FROM goals WHERE sprint_id = s.id AND completed = 1) as completed_goals
        FROM sprints s
        ORDER BY created_at DESC
    `).all();
    res.json(sprints);
});

// POST /api/sprints - Create new sprint
router.post('/', (req, res) => {
    const { title, description, deadline } = req.body;

    if (!title) {
        return res.status(400).json({ error: 'Title is required' });
    }

    const result = db.prepare(`
        INSERT INTO sprints (title, description, deadline)
        VALUES (?, ?, ?)
    `).run(title, description || null, deadline || null);

    const sprint = db.prepare('SELECT * FROM sprints WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(sprint);
});

// GET /api/sprints/:id - Get single sprint
router.get('/:id', (req, res) => {
    const sprint = db.prepare(`
        SELECT s.*,
            (SELECT COUNT(*) FROM goals WHERE sprint_id = s.id) as total_goals,
            (SELECT COUNT(*) FROM goals WHERE sprint_id = s.id AND completed = 1) as completed_goals
        FROM sprints s
        WHERE s.id = ?
    `).get(req.params.id);

    if (!sprint) {
        return res.status(404).json({ error: 'Sprint not found' });
    }

    res.json(sprint);
});

// PUT /api/sprints/:id - Update sprint
router.put('/:id', (req, res) => {
    const { title, description, deadline, completed } = req.body;

    const existing = db.prepare('SELECT * FROM sprints WHERE id = ?').get(req.params.id);
    if (!existing) {
        return res.status(404).json({ error: 'Sprint not found' });
    }

    db.prepare(`
        UPDATE sprints
        SET title = ?, description = ?, deadline = ?, completed = ?
        WHERE id = ?
    `).run(
        title ?? existing.title,
        description ?? existing.description,
        deadline ?? existing.deadline,
        completed ?? existing.completed,
        req.params.id
    );

    const sprint = db.prepare('SELECT * FROM sprints WHERE id = ?').get(req.params.id);
    res.json(sprint);
});

// DELETE /api/sprints/:id - Delete sprint
router.delete('/:id', (req, res) => {
    const result = db.prepare('DELETE FROM sprints WHERE id = ?').run(req.params.id);

    if (result.changes === 0) {
        return res.status(404).json({ error: 'Sprint not found' });
    }

    res.status(204).send();
});

module.exports = router;
