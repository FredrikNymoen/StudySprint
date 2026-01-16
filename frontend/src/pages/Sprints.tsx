import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import { useSprints } from '../hooks/queries';
import { useCreateSprint } from '../hooks/mutations';

export function Sprints() {
    const { data: sprints, isLoading } = useSprints();
    const createSprint = useCreateSprint();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [deadline, setDeadline] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        await createSprint.mutateAsync({
            title: title.trim(),
            description: description.trim() || undefined,
            deadline: deadline || undefined,
        });

        setTitle('');
        setDescription('');
        setDeadline('');
        setIsModalOpen(false);
    };

    const activeSprints = sprints?.filter((s) => !s.completed) || [];
    const completedSprints = sprints?.filter((s) => s.completed) || [];

    if (isLoading) {
        return <div className="text-center py-8 text-gray-500">Laster...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Sprints</h1>
                <Button onClick={() => setIsModalOpen(true)}>Ny sprint</Button>
            </div>

            {/* Active sprints */}
            <div>
                <h2 className="text-lg font-semibold text-gray-700 mb-3">
                    Aktive ({activeSprints.length})
                </h2>
                {activeSprints.length === 0 ? (
                    <Card>
                        <CardContent>
                            <p className="text-gray-500 text-center py-4">
                                Ingen aktive sprints. Opprett en ny!
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {activeSprints.map((sprint) => (
                            <Link key={sprint.id} to={`/sprints/${sprint.id}`}>
                                <Card className="hover:border-indigo-300 transition-colors">
                                    <CardContent>
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="font-semibold text-gray-900">
                                                    {sprint.title}
                                                </h3>
                                                {sprint.description && (
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        {sprint.description}
                                                    </p>
                                                )}
                                            </div>
                                            {sprint.deadline && (
                                                <Badge>
                                                    {new Date(sprint.deadline).toLocaleDateString(
                                                        'nb-NO'
                                                    )}
                                                </Badge>
                                            )}
                                        </div>
                                        {sprint.total_goals !== undefined &&
                                            sprint.total_goals > 0 && (
                                                <div className="mt-3">
                                                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                                                        <span>Fremgang</span>
                                                        <span>
                                                            {sprint.completed_goals}/
                                                            {sprint.total_goals} mål
                                                        </span>
                                                    </div>
                                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-green-500 rounded-full transition-all"
                                                            style={{
                                                                width: `${(sprint.completed_goals! / sprint.total_goals) * 100}%`,
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* Completed sprints */}
            {completedSprints.length > 0 && (
                <div>
                    <h2 className="text-lg font-semibold text-gray-700 mb-3">
                        Fullførte ({completedSprints.length})
                    </h2>
                    <div className="grid gap-4">
                        {completedSprints.map((sprint) => (
                            <Link key={sprint.id} to={`/sprints/${sprint.id}`}>
                                <Card className="opacity-60 hover:opacity-100 transition-opacity">
                                    <CardContent>
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-semibold text-gray-900">
                                                {sprint.title}
                                            </h3>
                                            <Badge variant="success">Fullført</Badge>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Create modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Ny sprint">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Tittel"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="F.eks. Økonomi 2: Kap 3-5"
                        required
                    />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Beskrivelse (valgfritt)
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Hva skal du oppnå?"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            rows={3}
                        />
                    </div>
                    <Input
                        label="Frist (valgfritt)"
                        type="date"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                    />
                    <div className="flex gap-3 pt-2">
                        <Button
                            type="button"
                            variant="secondary"
                            className="flex-1"
                            onClick={() => setIsModalOpen(false)}
                        >
                            Avbryt
                        </Button>
                        <Button type="submit" className="flex-1" disabled={createSprint.isPending}>
                            {createSprint.isPending ? 'Oppretter...' : 'Opprett'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
