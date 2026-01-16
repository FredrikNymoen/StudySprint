const express = require('express');
const db = require('../db/database');

const router = express.Router();

// GET /api/goals - List all goals (optional sprint_id filter)
router.get('/', (req, res) => {
    const { sprint_id } = req.query;

    let query = 'SELECT * FROM goals';
    const params = [];

    if (sprint_id) {
        query += ' WHERE sprint_id = ?';
        params.push(sprint_id);
    }

    query += ' ORDER BY id ASC';

    const goals = db.prepare(query).all(...params);
    res.json(goals);
});

// POST /api/goals - Create new goal
router.post('/', (req, res) => {
    const { sprint_id, description } = req.body;

    if (!sprint_id || !description) {
        return res.status(400).json({ error: 'sprint_id and description are required' });
    }

    const sprint = db.prepare('SELECT id FROM sprints WHERE id = ?').get(sprint_id);
    if (!sprint) {
        return res.status(404).json({ error: 'Sprint not found' });
    }

    const result = db.prepare(`
        INSERT INTO goals (sprint_id, description)
        VALUES (?, ?)
    `).run(sprint_id, description);

    const goal = db.prepare('SELECT * FROM goals WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(goal);
});

// PUT /api/goals/:id - Update goal (toggle completed)
router.put('/:id', (req, res) => {
    const { description, completed } = req.body;

    const existing = db.prepare('SELECT * FROM goals WHERE id = ?').get(req.params.id);
    if (!existing) {
        return res.status(404).json({ error: 'Goal not found' });
    }

    db.prepare(`
        UPDATE goals
        SET description = ?, completed = ?
        WHERE id = ?
    `).run(
        description ?? existing.description,
        completed ?? existing.completed,
        req.params.id
    );

    const goal = db.prepare('SELECT * FROM goals WHERE id = ?').get(req.params.id);
    res.json(goal);
});

// DELETE /api/goals/:id - Delete goal
router.delete('/:id', (req, res) => {
    const result = db.prepare('DELETE FROM goals WHERE id = ?').run(req.params.id);

    if (result.changes === 0) {
        return res.status(404).json({ error: 'Goal not found' });
    }

    res.status(204).send();
});

module.exports = router;
