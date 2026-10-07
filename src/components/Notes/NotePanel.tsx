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

type MatrixChoice = "urgent-important" | "not-urgent-important";

function NotePanel({
    date,
    note,
    onSave,
    onClose,
    matrixTasks
}: NotePanelProps) {
    const [text, setText] = useState(note?.text ?? "");

    const initialQuadrant: MatrixChoice =
        note?.matrixQuadrant ??
        "urgent-important";

    const [matrixQuadrant, setMatrixQuadrant] =
        useState<MatrixChoice>(initialQuadrant);

    const [matrixTaskId, setMatrixTaskId] =
        useState<number | "">(note?.matrixTaskId ?? "");

    const [minutes, setMinutes] = useState(
        note ? note.duration / 60 : 25
    );

    const availableMatrixTasks = matrixTasks.filter(
        task =>
            task.quadrant === matrixQuadrant &&
            (!task.completed || task.id === note?.matrixTaskId)
    );

    useEffect(() => {
        if (
            matrixTaskId !== "" &&
            availableMatrixTasks.some(task => task.id === matrixTaskId)
        ) {
            return;
        }

        // When changing Do first / Schedule, select the first available task.
        setMatrixTaskId(availableMatrixTasks[0]?.id ?? "");
    }, [matrixQuadrant, matrixTasks, note?.matrixTaskId]);

    function saveNote() {
        const timerSeconds = minutes * 60;

        const selectedMatrixTask = matrixTasks.find(
            task => task.id === matrixTaskId
        );

        const updatedNote: Note = {
            id: note?.id ?? Date.now(),
            date,
            text,
            duration: timerSeconds,
            remaining: note?.running
                ? note.remaining
                : timerSeconds,
            completed: note?.completed ?? false,
            running: note?.running ?? false,
            startedAt: note?.startedAt,
            endAt: note?.endAt,
            finishedAt: note?.finishedAt,
            notified: note?.notified,

            // Matrix selection is stored as a snapshot on the note.
            matrixTaskId:
                selectedMatrixTask?.id,
            matrixQuadrant:
                selectedMatrixTask?.quadrant as
                    | "urgent-important"
                    | "not-urgent-important"
                    | undefined,
            matrixTaskText:
                selectedMatrixTask?.text
        };

        onSave(updatedNote);
        setText("");
    }

    return (
        <div className="note-panel">
            <div className="panel-header">
                <b>{note ? "Edit Note" : "New Note"}</b>

                <button onClick={onClose}>✕</button>
            </div>

            <div className="small">
                Date: {date}
            </div>

            <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Write your task..."
            />

            <div className="matrix-note-field">
                <label className="matrix-note-label">
                    Matrix:
                </label>

                <div className="matrix-note-row">
                    <select
                        className="matrix-note-select"
                        value={matrixQuadrant}
                        onChange={e => {
                            setMatrixQuadrant(
                                e.target.value as MatrixChoice
                            );
                        }}
                        aria-label="Matrix priority"
                    >
                        <option value="urgent-important">
                            Do first
                        </option>
                        <option value="not-urgent-important">
                            Schedule
                        </option>
                    </select>

                    <select
                        className="matrix-note-select matrix-note-task-select"
                        value={matrixTaskId}
                        onChange={e =>
                            setMatrixTaskId(
                                e.target.value
                                    ? Number(e.target.value)
                                    : ""
                            )
                        }
                        aria-label="Matrix task"
                        disabled={availableMatrixTasks.length === 0}
                    >
                        <option value="">
                            {availableMatrixTasks.length === 0
                                ? "No tasks in this section"
                                : "Choose a Matrix task"}
                        </option>

                        {availableMatrixTasks.map(task => (
                            <option
                                key={task.id}
                                value={task.id}
                            >
                                {task.text}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="matrix-note-hint">
                    Select the priority section, then the Matrix task.
                    It will be shown in the saved note.
                </div>
            </div>

            <label>
                Timer minutes:
            </label>

            <input
                type="number"
                min="1"
                value={minutes}
                onChange={e =>
                    setMinutes(Number(e.target.value))
                }
            />

            <div className="actions">
                <button
                    onClick={saveNote}
                    disabled={!text.trim()}
                >
                    Save
                </button>

                <button onClick={onClose}>
                    Cancel
                </button>
            </div>
        </div>
    );
}

export default NotePanel;
