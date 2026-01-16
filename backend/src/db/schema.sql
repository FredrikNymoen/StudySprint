-- Sprints (studieplaner)
CREATE TABLE IF NOT EXISTS sprints (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    deadline TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    completed INTEGER DEFAULT 0
);

-- Sessions (studieøkter)
CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sprint_id INTEGER,
    type TEXT NOT NULL CHECK (type IN ('pomodoro', 'free')),
    duration_minutes INTEGER NOT NULL,
    started_at TEXT NOT NULL,
    ended_at TEXT,
    notes TEXT,
    FOREIGN KEY (sprint_id) REFERENCES sprints(id) ON DELETE SET NULL
);

-- Tags
CREATE TABLE IF NOT EXISTS tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);

-- Session-Tag kobling (many-to-many)
CREATE TABLE IF NOT EXISTS session_tags (
    session_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL,
    PRIMARY KEY (session_id, tag_id),
    FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- Goals (mål for sprints)
CREATE TABLE IF NOT EXISTS goals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sprint_id INTEGER NOT NULL,
    description TEXT NOT NULL,
    completed INTEGER DEFAULT 0,
    FOREIGN KEY (sprint_id) REFERENCES sprints(id) ON DELETE CASCADE
);
