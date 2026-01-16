import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useStreaks, useWeeklyStats, useSprints } from '../hooks/queries';

export function Dashboard() {
    const { data: streaks } = useStreaks();
    const { data: weeklyStats } = useWeeklyStats();
    const { data: sprints } = useSprints();

    const activeSprints = sprints?.filter((s) => !s.completed) || [];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <Link to="/timer">
                    <Button>Start økt</Button>
                </Link>
            </div>

            {/* Stats overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-indigo-600">
                                {streaks?.current_streak || 0}
                            </div>
                            <div className="text-sm text-gray-500 mt-1">Nåværende streak</div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-green-600">
                                {weeklyStats?.totals.hours || 0}
                            </div>
                            <div className="text-sm text-gray-500 mt-1">Timer denne uken</div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-orange-600">
                                {weeklyStats?.totals.sessions || 0}
                            </div>
                            <div className="text-sm text-gray-500 mt-1">Økter denne uken</div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Weekly chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Ukeoversikt</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-end gap-2 h-32">
                        {weeklyStats?.days.map((day) => {
                            const maxMinutes = Math.max(
                                ...weeklyStats.days.map((d) => d.total_minutes),
                                1
                            );
                            const height = (day.total_minutes / maxMinutes) * 100;
                            const dayName = new Date(day.date).toLocaleDateString('nb-NO', {
                                weekday: 'short',
                            });

                            return (
                                <div key={day.date} className="flex-1 flex flex-col items-center">
                                    <div className="w-full bg-gray-100 rounded-t relative" style={{ height: '100px' }}>
                                        <div
                                            className="absolute bottom-0 w-full bg-indigo-500 rounded-t transition-all"
                                            style={{ height: `${height}%` }}
                                        />
                                    </div>
                                    <span className="text-xs text-gray-500 mt-1">{dayName}</span>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Active sprints */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Aktive sprints</CardTitle>
                        <Link to="/sprints" className="text-sm text-indigo-600 hover:underline">
                            Se alle
                        </Link>
                    </div>
                </CardHeader>
                <CardContent>
                    {activeSprints.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">Ingen aktive sprints</p>
                    ) : (
                        <div className="space-y-3">
                            {activeSprints.slice(0, 3).map((sprint) => (
                                <Link
                                    key={sprint.id}
                                    to={`/sprints/${sprint.id}`}
                                    className="block p-3 rounded-lg border border-gray-200 hover:border-indigo-300 transition-colors"
                                >
                                    <div className="font-medium">{sprint.title}</div>
                                    {sprint.deadline && (
                                        <div className="text-sm text-gray-500">
                                            Frist:{' '}
                                            {new Date(sprint.deadline).toLocaleDateString('nb-NO')}
                                        </div>
                                    )}
                                    {sprint.total_goals !== undefined && sprint.total_goals > 0 && (
                                        <div className="mt-2">
                                            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                                                <span>Mål</span>
                                                <span>
                                                    {sprint.completed_goals}/{sprint.total_goals}
                                                </span>
                                            </div>
                                            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-green-500 rounded-full"
                                                    style={{
                                                        width: `${(sprint.completed_goals! / sprint.total_goals) * 100}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </Link>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
