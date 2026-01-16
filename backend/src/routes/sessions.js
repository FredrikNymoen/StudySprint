import express from 'express';
import db from '../db/database.js';

const router = express.Router();

// GET /api/sessions - List sessions with optional filters
router.get('/', (req, res) => {
    const { sprint_id, date, from, to } = req.query;

    let query = `
        SELECT s.*,
            GROUP_CONCAT(t.name) as tags
        FROM sessions s
        LEFT JOIN session_tags st ON s.id = st.session_id
        LEFT JOIN tags t ON st.tag_id = t.id
    `;

    const conditions = [];
    const params = [];

    if (sprint_id) {
        conditions.push('s.sprint_id = ?');
        params.push(sprint_id);
    }

    if (date) {
        conditions.push('DATE(s.started_at) = DATE(?)');
        params.push(date);
    }

    if (from) {
        conditions.push('DATE(s.started_at) >= DATE(?)');
        params.push(from);
    }

    if (to) {
        conditions.push('DATE(s.started_at) <= DATE(?)');
        params.push(to);
    }

    if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' GROUP BY s.id ORDER BY s.started_at DESC';

    const sessions = db.prepare(query).all(...params);

    const result = sessions.map(s => ({
        ...s,
        tags: s.tags ? s.tags.split(',') : []
    }));

    res.json(result);
});

// POST /api/sessions - Log new session
router.post('/', (req, res) => {
    const { sprint_id, type, duration_minutes, started_at, ended_at, notes, tags } = req.body;

    if (!type || !duration_minutes || !started_at) {
        return res.status(400).json({ error: 'type, duration_minutes, and started_at are required' });
    }

    if (!['pomodoro', 'free'].includes(type)) {
        return res.status(400).json({ error: 'type must be "pomodoro" or "free"' });
    }

    const result = db.prepare(`
        INSERT INTO sessions (sprint_id, type, duration_minutes, started_at, ended_at, notes)
        VALUES (?, ?, ?, ?, ?, ?)
    `).run(sprint_id || null, type, duration_minutes, started_at, ended_at || null, notes || null);

    const sessionId = result.lastInsertRowid;

    if (tags && Array.isArray(tags) && tags.length > 0) {
        const insertTag = db.prepare('INSERT OR IGNORE INTO tags (name) VALUES (?)');
        const getTagId = db.prepare('SELECT id FROM tags WHERE name = ?');
        const linkTag = db.prepare('INSERT INTO session_tags (session_id, tag_id) VALUES (?, ?)');

        for (const tagName of tags) {
            insertTag.run(tagName);
            const tag = getTagId.get(tagName);
            linkTag.run(sessionId, tag.id);
        }
    }

    const session = db.prepare('SELECT * FROM sessions WHERE id = ?').get(sessionId);
    res.status(201).json({ ...session, tags: tags || [] });
});

// GET /api/sessions/:id - Get single session
router.get('/:id', (req, res) => {
    const session = db.prepare(`
        SELECT s.*,
            GROUP_CONCAT(t.name) as tags
        FROM sessions s
        LEFT JOIN session_tags st ON s.id = st.session_id
        LEFT JOIN tags t ON st.tag_id = t.id
        WHERE s.id = ?
        GROUP BY s.id
    `).get(req.params.id);

    if (!session) {
        return res.status(404).json({ error: 'Session not found' });
    }

    res.json({
        ...session,
        tags: session.tags ? session.tags.split(',') : []
    });
});

// PUT /api/sessions/:id - Update session
router.put('/:id', (req, res) => {
    const { sprint_id, type, duration_minutes, started_at, ended_at, notes, tags } = req.body;

    const existing = db.prepare('SELECT * FROM sessions WHERE id = ?').get(req.params.id);
    if (!existing) {
        return res.status(404).json({ error: 'Session not found' });
    }

    db.prepare(`
        UPDATE sessions
        SET sprint_id = ?, type = ?, duration_minutes = ?, started_at = ?, ended_at = ?, notes = ?
        WHERE id = ?
    `).run(
        sprint_id ?? existing.sprint_id,
        type ?? existing.type,
        duration_minutes ?? existing.duration_minutes,
        started_at ?? existing.started_at,
        ended_at ?? existing.ended_at,
        notes ?? existing.notes,
        req.params.id
    );

    if (tags && Array.isArray(tags)) {
        db.prepare('DELETE FROM session_tags WHERE session_id = ?').run(req.params.id);

        const insertTag = db.prepare('INSERT OR IGNORE INTO tags (name) VALUES (?)');
        const getTagId = db.prepare('SELECT id FROM tags WHERE name = ?');
        const linkTag = db.prepare('INSERT INTO session_tags (session_id, tag_id) VALUES (?, ?)');

        for (const tagName of tags) {
            insertTag.run(tagName);
            const tag = getTagId.get(tagName);
            linkTag.run(req.params.id, tag.id);
        }
    }

    const session = db.prepare('SELECT * FROM sessions WHERE id = ?').get(req.params.id);
    res.json({ ...session, tags: tags || [] });
});

// DELETE /api/sessions/:id - Delete session
router.delete('/:id', (req, res) => {
    const result = db.prepare('DELETE FROM sessions WHERE id = ?').run(req.params.id);

    if (result.changes === 0) {
        return res.status(404).json({ error: 'Session not found' });
    }

    res.status(204).send();
});

export default router;
