import { useMemo, useState } from "react";
import type { Goal, GoalCategory, GoalPeriod } from "../../types/goal";
import "./Goals.scss";

interface GoalsProps {
    goals: Goal[];
    date: Date;
    onAdd: (text: string, period: GoalPeriod, periodKey: string, category: GoalCategory) => void;
    onUpdate: (id: number, text: string, category: GoalCategory) => void;
    onMove: (id: number, direction: -1 | 1) => void;
    onDelete: (id: number) => void;
}

const CATEGORIES: GoalCategory[] = [
    "None", "Career", "Health", "Finance", "Relationships", "Personal", "Other"
];
const PERIODS: GoalPeriod[] = ["year", "quarter", "month", "week"];
const pad = (v: number) => String(v).padStart(2, "0");

function isoWeek(date: Date) {
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const day = d.getDay() || 7;
    d.setDate(d.getDate() + 4 - day);
    const year = d.getFullYear();
    const start = new Date(year, 0, 1);
    const week = Math.ceil((((d.getTime() - start.getTime()) / 86400000) + 1) / 7);
    return { year, week };
}

function periodKey(date: Date, period: GoalPeriod) {
    if (period === "year") return String(date.getFullYear());
    if (period === "quarter") return `${date.getFullYear()}-Q${Math.floor(date.getMonth() / 3) + 1}`;
    if (period === "month") return `${date.getFullYear()}-${pad(date.getMonth() + 1)}`;
    const week = isoWeek(date);
    return `${week.year}-W${pad(week.week)}`;
}

function weekRange(date: Date) {
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const day = d.getDay() || 7;
    const monday = new Date(d);
    monday.setDate(d.getDate() - day + 1);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    const fmt = (value: Date) =>
        `${pad(value.getDate())} ${value.toLocaleString(undefined, { month: "short" })}`;
    return `${fmt(monday)} – ${fmt(sunday)}`;
}

function label(date: Date, period: GoalPeriod) {
    if (period === "year") return String(date.getFullYear());
    if (period === "quarter") return `${date.getFullYear()} Q${Math.floor(date.getMonth() / 3) + 1}`;
    if (period === "month") return date.toLocaleString(undefined, { month: "long", year: "numeric" });
    const week = isoWeek(date);
    return `${weekRange(date)} (${week.year}-W${pad(week.week)})`;
}

function shift(date: Date, period: GoalPeriod, direction: -1 | 1) {
    const next = new Date(date);
    if (period === "year") next.setFullYear(next.getFullYear() + direction);
    if (period === "quarter") next.setMonth(next.getMonth() + direction * 3);
    if (period === "month") next.setMonth(next.getMonth() + direction);
    if (period === "week") next.setDate(next.getDate() + direction * 7);
    return next;
}

function Goals({ goals, date, onAdd, onUpdate, onMove, onDelete }: GoalsProps) {
    const [cursors, setCursors] = useState<Record<GoalPeriod, Date>>({
        year: new Date(date),
        quarter: new Date(date),
        month: new Date(date),
        week: new Date(date)
    });

    const [adding, setAdding] = useState<GoalPeriod | null>(null);
    const [draft, setDraft] = useState("");
    const [category, setCategory] = useState<GoalCategory>("None");
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingText, setEditingText] = useState("");
    const [editingCategory, setEditingCategory] = useState<GoalCategory>("None");

    const groups = useMemo(
        () =>
            PERIODS.map(period => {
                const cursor = cursors[period];
                const key = periodKey(cursor, period);

                return {
                    period,
                    cursor,
                    key,
                    goals: goals.filter(
                        goal => goal.period === period && goal.periodKey === key
                    )
                };
            }),
        [goals, cursors]
    );

    function startAdd(period: GoalPeriod) {
        setAdding(period);
        setDraft("");
        setCategory("None");
    }

    function save(period: GoalPeriod, key: string) {
        if (!draft.trim()) return;
        onAdd(draft.trim(), period, key, category);
        setDraft("");
        setAdding(null);
    }

    function startEdit(goal: Goal) {
        setEditingId(goal.id);
        setEditingText(goal.text);
        setEditingCategory(goal.category);
    }

    function saveEdit() {
        if (editingId === null || !editingText.trim()) return;
        onUpdate(editingId, editingText.trim(), editingCategory);
        setEditingId(null);
        setEditingText("");
    }

    return (
        <div className="goals-panel">
            <div className="goals-intro">
                Plan goals by year, quarter, month and week. Use them as direction;
                attach specific work to a calendar day through Matrix tasks.
            </div>

            {groups.map(group => (
                <section className="goal-period" key={group.period}>
                    <div className="goal-period-header">
                        <strong>{label(group.cursor, group.period)}</strong>

                        <div className="goal-period-nav">
                            <button type="button" onClick={() => setCursors(value => ({
                                ...value,
                                [group.period]: shift(value[group.period], group.period, -1)
                            }))}>← prev</button>

                            <button type="button" onClick={() => setCursors(value => ({
                                ...value,
                                [group.period]: new Date(date)
                            }))}>this {group.period}</button>

                            <button type="button" onClick={() => setCursors(value => ({
                                ...value,
                                [group.period]: shift(value[group.period], group.period, 1)
                            }))}>next →</button>
                        </div>
                    </div>

                    {adding === group.period ? (
                        <div className="goal-add-form">
                            <input
                                autoFocus
                                value={draft}
                                onChange={event => setDraft(event.target.value)}
                                onKeyDown={event => {
                                    if (event.key === "Enter") save(group.period, group.key);
                                    if (event.key === "Escape") setAdding(null);
                                }}
                                placeholder="Goal..."
                            />

                            <select
                                value={category}
                                onChange={event => setCategory(event.target.value as GoalCategory)}
                            >
                                {CATEGORIES.map(item => <option key={item}>{item}</option>)}
                            </select>

                            <button type="button" className="primary" onClick={() => save(group.period, group.key)} disabled={!draft.trim()}>
                                Add
                            </button>

                            <button type="button" onClick={() => setAdding(null)}>
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <button type="button" className="goal-add-button" onClick={() => startAdd(group.period)}>
                            ＋ Add a goal
                        </button>
                    )}

                    <div className="goal-list">
                        {group.goals.length === 0 ? (
                            <div className="goals-empty">No goals yet for this {group.period}.</div>
                        ) : (
                            group.goals.map((goal, index) => (
                                <article className="goal-item" key={goal.id}>
                                    {editingId === goal.id ? (
                                        <div className="goal-edit">
                                            <textarea
                                                autoFocus
                                                value={editingText}
                                                onChange={event => setEditingText(event.target.value)}
                                                rows={3}
                                            />
                                            <select
                                                value={editingCategory}
                                                onChange={event => setEditingCategory(event.target.value as GoalCategory)}
                                            >
                                                {CATEGORIES.map(item => <option key={item}>{item}</option>)}
                                            </select>
                                            <div className="goal-edit-buttons">
                                                <button type="button" onClick={saveEdit}>Save</button>
                                                <button type="button" onClick={() => setEditingId(null)}>Cancel</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="goal-main">
                                                <div className="goal-actions" aria-label="Goal actions">
                                                    <button type="button" onClick={() => onMove(goal.id, -1)} disabled={index === 0}>↑</button>
                                                    <button type="button" onClick={() => onMove(goal.id, 1)} disabled={index === group.goals.length - 1}>↓</button>
                                                    <button type="button" onClick={() => startEdit(goal)}>✎</button>
                                                    <button type="button" onClick={() => onDelete(goal.id)}>×</button>
                                                </div>
                                                <div className="goal-text">{goal.text}</div>
                                                {goal.category !== "None" && <span className="goal-category">{goal.category}</span>}
                                            </div>
                                        </>
                                    )}
                                </article>
                            ))
                        )}
                    </div>

                    {group.period === "week" && (
                        <div className="goal-link-hint">
                            Build the goal here, then turn it into specific daily work through Matrix → Do first / Schedule.
                        </div>
                    )}
                </section>
            ))}
        </div>
    );
}

export default Goals;
