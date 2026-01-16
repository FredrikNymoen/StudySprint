import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout';
import { Dashboard, Timer, Sprints, SprintDetails, Stats } from './pages';

function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="timer" element={<Timer />} />
                <Route path="sprints" element={<Sprints />} />
                <Route path="sprints/:id" element={<SprintDetails />} />
                <Route path="stats" element={<Stats />} />
            </Route>
        </Routes>
    );
}

export default App;
