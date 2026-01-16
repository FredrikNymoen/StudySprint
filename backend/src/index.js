import express from 'express';
import cors from 'cors';

import sprintsRouter from './routes/sprints.js';
import sessionsRouter from './routes/sessions.js';
import tagsRouter from './routes/tags.js';
import goalsRouter from './routes/goals.js';
import statsRouter from './routes/stats.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/sprints', sprintsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/tags', tagsRouter);
app.use('/api/goals', goalsRouter);
app.use('/api/stats', statsRouter);

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`StudySprint backend running on http://localhost:${PORT}`);
});
