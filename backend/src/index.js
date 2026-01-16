const express = require('express');
const cors = require('cors');

const sprintsRouter = require('./routes/sprints');
const sessionsRouter = require('./routes/sessions');
const tagsRouter = require('./routes/tags');
const goalsRouter = require('./routes/goals');
const statsRouter = require('./routes/stats');

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