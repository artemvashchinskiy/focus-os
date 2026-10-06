import { useEffect, useState } from "react";
import type { Note } from "../../types/note";
import type { EisenhowerTask } from "../../types/eisenhower";

interface NotePanelProps {
    date: string;
    note?: Note | null;
    onSave: (note: Note) => void;
    onClose: () => void;
    matrixTasks: EisenhowerTask[];
}

function NotePanel({
    date,
    note,
    onSave,
    onClose,
    matrixTasks
}: NotePanelProps) {
    const [text, setText] = useState(note?.text ?? "");
    const [minutes, setMinutes] = useState(note ? note.duration / 60 : 25);
    const [selectedTaskId, setSelectedTaskId] = useState("");

    const availableTasks = matrixTasks.filter(
        task =>
            !task.completed &&
            (task.quadrant === "urgent-important" ||
                task.quadrant === "not-urgent-important")
    );

    useEffect(() => {
        setText(note?.text ?? "");
        setMinutes(note ? note.duration / 60 : 25);
        setSelectedTaskId("");
    }, [note, date]);

    function attachMatrixTask(id: string) {
        setSelectedTaskId(id);

        if (!id) return;

        const task = availableTasks.find(item => String(item.id) === id);
        if (task) {
            setText(task.text);
        }
    }

    function saveNote() {
        const value = text.trim();
        if (!value) return;

        const timerSeconds = Math.max(1, Number(minutes) || 25) * 60;

        const updatedNote: Note = {
            id: note?.id ?? Date.now(),
            date,
            text: value,
            duration: timerSeconds,
            remaining: note?.running ? note.remaining : timerSeconds,
            completed: note?.completed ?? false,
            running: note?.running ?? false,
            startedAt: note?.startedAt,
            endAt: note?.endAt,
            finishedAt: note?.finishedAt,
            notified: note?.notified,
            goalId: note?.goalId
        };

        onSave(updatedNote);
    }

    return (
        <div className="note-panel">
            <div className="panel-header">
                <b>{note ? "Edit Note" : "New Note"}</b>
                <button type="button" onClick={onClose} aria-label="Close note editor">
                    ✕
                </button>
            </div>

            <div className="small">Date: {date}</div>

            <textarea
                value={text}
                onChange={event => setText(event.target.value)}
                placeholder="Write your task..."
                autoFocus={!note}
                rows={5}
            />

            <label htmlFor="matrix-task-select">Attach unfinished Matrix task:</label>

            <select
                id="matrix-task-select"
                value={selectedTaskId}
                onChange={event => attachMatrixTask(event.target.value)}
            >
                <option value="">Choose from Do first / Schedule...</option>
                {availableTasks.map(task => (
                    <option key={task.id} value={task.id}>
                        {task.text}
                    </option>
                ))}
            </select>

            <div className="note-panel-hint">
                Selecting a Matrix task copies its text into this day's note.
            </div>

            <label htmlFor="timer-minutes">Timer minutes:</label>

            <input
                id="timer-minutes"
                type="number"
                min="1"
                value={minutes}
                onChange={event => setMinutes(Number(event.target.value))}
            />

            <div className="actions">
                <button type="button" onClick={saveNote} disabled={!text.trim()}>
                    Save
                </button>
                <button type="button" onClick={onClose}>
                    Cancel
                </button>
            </div>
        </div>
    );
}

export default NotePanel;
