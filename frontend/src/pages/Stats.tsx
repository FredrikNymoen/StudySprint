import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { useWeeklyStats, useStreaks, useSummary } from '../hooks/queries';

export function Stats() {
    const { data: weeklyStats } = useWeeklyStats();
    const { data: streaks } = useStreaks();
    const { data: summary } = useSummary();

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Statistikk</h1>

            {/* Overview stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-indigo-600">
                                {streaks?.current_streak || 0}
                            </div>
                            <div className="text-sm text-gray-500">Nåværende streak</div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-purple-600">
                                {streaks?.best_streak || 0}
                            </div>
                            <div className="text-sm text-gray-500">Beste streak</div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-green-600">
                                {summary?.sessions.total_hours || 0}
                            </div>
                            <div className="text-sm text-gray-500">Totalt timer</div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-orange-600">
                                {summary?.sessions.days_studied || 0}
                            </div>
                            <div className="text-sm text-gray-500">Dager studert</div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Weekly chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Denne uken</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-end gap-3 h-48">
                        {weeklyStats?.days.map((day) => {
                            const maxMinutes = Math.max(
                                ...weeklyStats.days.map((d) => d.total_minutes),
                                1
                            );
                            const height = (day.total_minutes / maxMinutes) * 100;
                            const dayName = new Date(day.date).toLocaleDateString('nb-NO', {
                                weekday: 'short',
                            });
                            const isToday =
                                new Date(day.date).toDateString() === new Date().toDateString();

                            return (
                                <div key={day.date} className="flex-1 flex flex-col items-center">
                                    <div className="text-xs text-gray-500 mb-1">
                                        {day.total_minutes > 0 ? `${day.total_minutes}m` : ''}
                                    </div>
                                    <div
                                        className="w-full bg-gray-100 rounded-t relative"
                                        style={{ height: '160px' }}
                                    >
                                        <div
                                            className={`absolute bottom-0 w-full rounded-t transition-all ${
                                                isToday ? 'bg-indigo-600' : 'bg-indigo-400'
                                            }`}
                                            style={{ height: `${height}%` }}
                                        />
                                    </div>
                                    <span
                                        className={`text-xs mt-2 ${
                                            isToday ? 'font-bold text-indigo-600' : 'text-gray-500'
                                        }`}
                                    >
                                        {dayName}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-3 text-center">
                        <div>
                            <div className="text-xl font-bold text-gray-900">
                                {weeklyStats?.totals.sessions || 0}
                            </div>
                            <div className="text-sm text-gray-500">Økter</div>
                        </div>
                        <div>
                            <div className="text-xl font-bold text-gray-900">
                                {weeklyStats?.totals.hours || 0}
                            </div>
                            <div className="text-sm text-gray-500">Timer</div>
                        </div>
                        <div>
                            <div className="text-xl font-bold text-gray-900">
                                {weeklyStats?.totals.minutes || 0}
                            </div>
                            <div className="text-sm text-gray-500">Minutter</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Sprints & Goals */}
            <div className="grid md:grid-cols-2 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Sprints</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Totalt</span>
                                <span className="font-semibold">{summary?.sprints.total || 0}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Fullført</span>
                                <span className="font-semibold text-green-600">
                                    {summary?.sprints.completed || 0}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Aktive</span>
                                <span className="font-semibold text-indigo-600">
                                    {(summary?.sprints.total || 0) - (summary?.sprints.completed || 0)}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Mål</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Totalt</span>
                                <span className="font-semibold">{summary?.goals.total || 0}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Fullført</span>
                                <span className="font-semibold text-green-600">
                                    {summary?.goals.completed || 0}
                                </span>
                            </div>
                            {summary?.goals.total && summary.goals.total > 0 && (
                                <div className="pt-2">
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-green-500 rounded-full"
                                            style={{
                                                width: `${((summary.goals.completed || 0) / summary.goals.total) * 100}%`,
                                            }}
                                        />
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1 text-right">
                                        {Math.round(
                                            ((summary.goals.completed || 0) / summary.goals.total) * 100
                                        )}
                                        % fullført
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
