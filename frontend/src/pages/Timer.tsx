import { useEffect, useState } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useTimerStore } from '../stores';
import { useCreateSession } from '../hooks/mutations';
import { useSprints } from '../hooks/queries';

function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function Timer() {
    const {
        isRunning,
        isPaused,
        mode,
        timeRemaining,
        timeElapsed,
        startedAt,
        selectedSprintId,
        startPomodoro,
        startFreeSession,
        pause,
        resume,
        stop,
        tick,
        setSelectedSprint,
    } = useTimerStore();

    const { data: sprints } = useSprints();
    const createSession = useCreateSession();

    const [pomodoroMinutes, setPomodoroMinutes] = useState(25);

    useEffect(() => {
        if (!isRunning || isPaused) return;

        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, [isRunning, isPaused, tick]);

    // Auto-stop when pomodoro finishes
    useEffect(() => {
        if (mode === 'pomodoro' && timeRemaining === 0 && isRunning) {
            handleFinish();
        }
    }, [timeRemaining, mode, isRunning]);

    const handleFinish = async () => {
        if (!startedAt) return;

        const durationMinutes =
            mode === 'pomodoro' ? pomodoroMinutes : Math.floor(timeElapsed / 60);

        if (durationMinutes > 0) {
            await createSession.mutateAsync({
                type: mode,
                duration_minutes: durationMinutes,
                started_at: startedAt,
                ended_at: new Date().toISOString(),
                sprint_id: selectedSprintId || undefined,
            });
        }

        stop();
    };

    const displayTime = mode === 'pomodoro' ? timeRemaining : timeElapsed;

    return (
        <div className="max-w-md mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 text-center">Timer</h1>

            {/* Mode selection */}
            {!isRunning && (
                <div className="flex gap-2">
                    <button
                        onClick={() => {}}
                        className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                            mode === 'pomodoro'
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        Pomodoro
                    </button>
                    <button
                        onClick={() => {}}
                        className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                            mode === 'free'
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        Fri økt
                    </button>
                </div>
            )}

            {/* Timer display */}
            <Card padding="lg">
                <CardContent>
                    <div className="text-center">
                        <div className="text-7xl font-mono font-bold text-gray-900 mb-4">
                            {formatTime(displayTime)}
                        </div>
                        <div className="text-gray-500">
                            {mode === 'pomodoro' ? 'Pomodoro' : 'Fri økt'}
                            {isPaused && ' (pauset)'}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Sprint selection */}
            {!isRunning && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Koble til sprint (valgfritt)
                    </label>
                    <select
                        value={selectedSprintId || ''}
                        onChange={(e) =>
                            setSelectedSprint(e.target.value ? Number(e.target.value) : null)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="">Ingen sprint</option>
                        {sprints
                            ?.filter((s) => !s.completed)
                            .map((sprint) => (
                                <option key={sprint.id} value={sprint.id}>
                                    {sprint.title}
                                </option>
                            ))}
                    </select>
                </div>
            )}

            {/* Pomodoro duration */}
            {!isRunning && mode === 'pomodoro' && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Varighet (minutter)
                    </label>
                    <div className="flex gap-2">
                        {[15, 25, 45, 60].map((mins) => (
                            <button
                                key={mins}
                                onClick={() => setPomodoroMinutes(mins)}
                                className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                                    pomodoroMinutes === mins
                                        ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-500'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                {mins}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Controls */}
            <div className="flex gap-3">
                {!isRunning ? (
                    <>
                        <Button
                            className="flex-1"
                            onClick={() =>
                                mode === 'pomodoro'
                                    ? startPomodoro(pomodoroMinutes)
                                    : startFreeSession()
                            }
                        >
                            Start {mode === 'pomodoro' ? 'Pomodoro' : 'Fri økt'}
                        </Button>
                    </>
                ) : (
                    <>
                        {isPaused ? (
                            <Button className="flex-1" onClick={resume}>
                                Fortsett
                            </Button>
                        ) : (
                            <Button className="flex-1" variant="secondary" onClick={pause}>
                                Pause
                            </Button>
                        )}
                        <Button variant="danger" onClick={handleFinish}>
                            Stopp
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}
