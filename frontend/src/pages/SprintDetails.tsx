import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { useSprint, useGoals, useSessions } from '../hooks/queries';
import { useUpdateSprint, useDeleteSprint, useCreateGoal, useUpdateGoal, useDeleteGoal } from '../hooks/mutations';

export function SprintDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const sprintId = Number(id);

    const { data: sprint, isLoading } = useSprint(sprintId);
    const { data: goals } = useGoals(sprintId);
    const { data: sessions } = useSessions({ sprint_id: sprintId });

    const updateSprint = useUpdateSprint();
    const deleteSprint = useDeleteSprint();
    const createGoal = useCreateGoal();
    const updateGoal = useUpdateGoal();
    const deleteGoal = useDeleteGoal();

    const [newGoal, setNewGoal] = useState('');

    const handleAddGoal = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newGoal.trim()) return;

        await createGoal.mutateAsync({
            sprint_id: sprintId,
            description: newGoal.trim(),
        });
        setNewGoal('');
    };

    const handleToggleGoal = async (goalId: number, currentCompleted: number) => {
        await updateGoal.mutateAsync({
            id: goalId,
            data: { completed: currentCompleted ? 0 : 1 },
        });
    };

    const handleToggleComplete = async () => {
        if (!sprint) return;
        await updateSprint.mutateAsync({
            id: sprintId,
            data: { completed: sprint.completed ? 0 : 1 },
        });
    };

    const handleDelete = async () => {
        if (!confirm('Er du sikker på at du vil slette denne sprinten?')) return;
        await deleteSprint.mutateAsync(sprintId);
        navigate('/sprints');
    };

    if (isLoading) {
        return <div className="text-center py-8 text-gray-500">Laster...</div>;
    }

    if (!sprint) {
        return <div className="text-center py-8 text-gray-500">Sprint ikke funnet</div>;
    }

    const totalMinutes = sessions?.reduce((sum, s) => sum + s.duration_minutes, 0) || 0;
    const totalHours = Math.round((totalMinutes / 60) * 10) / 10;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-gray-900">{sprint.title}</h1>
                        {sprint.completed ? (
                            <Badge variant="success">Fullført</Badge>
                        ) : (
                            sprint.deadline && <Badge>{new Date(sprint.deadline).toLocaleDateString('nb-NO')}</Badge>
                        )}
                    </div>
                    {sprint.description && (
                        <p className="text-gray-500 mt-1">{sprint.description}</p>
                    )}
                </div>
                <div className="flex gap-2">
                    <Button
                        variant={sprint.completed ? 'secondary' : 'primary'}
                        onClick={handleToggleComplete}
                    >
                        {sprint.completed ? 'Gjenåpne' : 'Marker fullført'}
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        Slett
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                <Card>
                    <CardContent>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-indigo-600">{totalHours}</div>
                            <div className="text-sm text-gray-500">Timer studert</div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                                {sessions?.length || 0}
                            </div>
                            <div className="text-sm text-gray-500">Økter</div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-orange-600">
                                {goals?.filter((g) => g.completed).length || 0}/
                                {goals?.length || 0}
                            </div>
                            <div className="text-sm text-gray-500">Mål fullført</div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Goals */}
            <Card>
                <CardHeader>
                    <CardTitle>Mål</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAddGoal} className="flex gap-2 mb-4">
                        <Input
                            value={newGoal}
                            onChange={(e) => setNewGoal(e.target.value)}
                            placeholder="Legg til nytt mål..."
                            className="flex-1"
                        />
                        <Button type="submit" disabled={createGoal.isPending}>
                            Legg til
                        </Button>
                    </form>

                    {goals?.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">Ingen mål ennå</p>
                    ) : (
                        <div className="space-y-2">
                            {goals?.map((goal) => (
                                <div
                                    key={goal.id}
                                    className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                                >
                                    <button
                                        onClick={() => handleToggleGoal(goal.id, goal.completed)}
                                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                                            goal.completed
                                                ? 'bg-green-500 border-green-500 text-white'
                                                : 'border-gray-300 hover:border-green-500'
                                        }`}
                                    >
                                        {goal.completed && '✓'}
                                    </button>
                                    <span
                                        className={`flex-1 ${
                                            goal.completed ? 'line-through text-gray-400' : ''
                                        }`}
                                    >
                                        {goal.description}
                                    </span>
                                    <button
                                        onClick={() => deleteGoal.mutate(goal.id)}
                                        className="text-gray-400 hover:text-red-500"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Sessions */}
            <Card>
                <CardHeader>
                    <CardTitle>Økter</CardTitle>
                </CardHeader>
                <CardContent>
                    {sessions?.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">Ingen økter ennå</p>
                    ) : (
                        <div className="space-y-2">
                            {sessions?.map((session) => (
                                <div
                                    key={session.id}
                                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                                >
                                    <div>
                                        <div className="font-medium">
                                            {session.type === 'pomodoro' ? '🍅 Pomodoro' : '⏱️ Fri økt'}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {new Date(session.started_at).toLocaleDateString('nb-NO')}{' '}
                                            {new Date(session.started_at).toLocaleTimeString('nb-NO', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-semibold">{session.duration_minutes} min</div>
                                        {session.tags.length > 0 && (
                                            <div className="flex gap-1 mt-1">
                                                {session.tags.map((tag) => (
                                                    <Badge key={tag}>{tag}</Badge>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
