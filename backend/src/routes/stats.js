const express = require('express');
const db = require('../db/database');

const router = express.Router();

// GET /api/stats/weekly - Weekly report
router.get('/weekly', (req, res) => {
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 6);

    const fromDate = weekAgo.toISOString().split('T')[0];
    const toDate = today.toISOString().split('T')[0];

    const dailyStats = db.prepare(`
        SELECT
            DATE(started_at) as date,
            COUNT(*) as session_count,
            SUM(duration_minutes) as total_minutes,
            SUM(CASE WHEN type = 'pomodoro' THEN 1 ELSE 0 END) as pomodoro_count,
            SUM(CASE WHEN type = 'free' THEN 1 ELSE 0 END) as free_count
        FROM sessions
        WHERE DATE(started_at) >= DATE(?) AND DATE(started_at) <= DATE(?)
        GROUP BY DATE(started_at)
        ORDER BY date ASC
    `).all(fromDate, toDate);

    const totals = db.prepare(`
        SELECT
            COUNT(*) as total_sessions,
            COALESCE(SUM(duration_minutes), 0) as total_minutes
        FROM sessions
        WHERE DATE(started_at) >= DATE(?) AND DATE(started_at) <= DATE(?)
    `).get(fromDate, toDate);

    const days = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date(weekAgo);
        d.setDate(d.getDate() + i);
        const dateStr = d.toISOString().split('T')[0];
        const dayData = dailyStats.find(s => s.date === dateStr);

        days.push({
            date: dateStr,
            session_count: dayData?.session_count || 0,
            total_minutes: dayData?.total_minutes || 0,
            pomodoro_count: dayData?.pomodoro_count || 0,
            free_count: dayData?.free_count || 0
        });
    }

    res.json({
        period: { from: fromDate, to: toDate },
        days,
        totals: {
            sessions: totals.total_sessions,
            minutes: totals.total_minutes,
            hours: Math.round(totals.total_minutes / 60 * 10) / 10
        }
    });
});

// GET /api/stats/streaks - Current and best streak
router.get('/streaks', (req, res) => {
    const daysWithSessions = db.prepare(`
        SELECT DISTINCT DATE(started_at) as date
        FROM sessions
        ORDER BY date DESC
    `).all().map(r => r.date);

    if (daysWithSessions.length === 0) {
        return res.json({
            current_streak: 0,
            best_streak: 0,
            last_session_date: null
        });
    }

    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    let currentStreak = 0;
    let checkDate = new Date();

    if (daysWithSessions[0] === today || daysWithSessions[0] === yesterdayStr) {
        if (daysWithSessions[0] === today) {
            currentStreak = 1;
            checkDate.setDate(checkDate.getDate() - 1);
        } else {
            checkDate = yesterday;
        }

        for (const date of daysWithSessions) {
            const checkStr = checkDate.toISOString().split('T')[0];
            if (date === checkStr) {
                currentStreak++;
                checkDate.setDate(checkDate.getDate() - 1);
            } else if (date < checkStr) {
                break;
            }
        }
    }

    let bestStreak = 0;
    let tempStreak = 1;

    for (let i = 0; i < daysWithSessions.length - 1; i++) {
        const current = new Date(daysWithSessions[i]);
        const next = new Date(daysWithSessions[i + 1]);
        const diffDays = (current - next) / (1000 * 60 * 60 * 24);

        if (diffDays === 1) {
            tempStreak++;
        } else {
            bestStreak = Math.max(bestStreak, tempStreak);
            tempStreak = 1;
        }
    }
    bestStreak = Math.max(bestStreak, tempStreak);

    res.json({
        current_streak: currentStreak,
        best_streak: bestStreak,
        last_session_date: daysWithSessions[0]
    });
});

// GET /api/stats/summary - Overall summary
router.get('/summary', (req, res) => {
    const totals = db.prepare(`
        SELECT
            COUNT(*) as total_sessions,
            COALESCE(SUM(duration_minutes), 0) as total_minutes,
            COUNT(DISTINCT DATE(started_at)) as days_studied
        FROM sessions
    `).get();

    const sprintStats = db.prepare(`
        SELECT
            COUNT(*) as total_sprints,
            SUM(CASE WHEN completed = 1 THEN 1 ELSE 0 END) as completed_sprints
        FROM sprints
    `).get();

    const goalStats = db.prepare(`
        SELECT
            COUNT(*) as total_goals,
            SUM(CASE WHEN completed = 1 THEN 1 ELSE 0 END) as completed_goals
        FROM goals
    `).get();

    res.json({
        sessions: {
            total: totals.total_sessions,
            total_minutes: totals.total_minutes,
            total_hours: Math.round(totals.total_minutes / 60 * 10) / 10,
            days_studied: totals.days_studied
        },
        sprints: {
            total: sprintStats.total_sprints,
            completed: sprintStats.completed_sprints
        },
        goals: {
            total: goalStats.total_goals,
            completed: goalStats.completed_goals
        }
    });
});

module.exports = router;
