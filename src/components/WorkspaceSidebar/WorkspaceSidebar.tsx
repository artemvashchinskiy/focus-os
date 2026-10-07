import type { EisenhowerQuadrant, EisenhowerTask } from "../../types/eisenhower";
import type { Expense, ExpenseCategory } from "../../types/expense";
import type { FreeNote } from "../../types/freeNote";
import type { Goal, GoalCategory, GoalPeriod } from "../../types/goal";
import Goals from "../Goals/Goals";
import Matrix from "../Matrix/Matrix";
import Expenses from "../Expenses/Expenses";
import FreeNotes from "../FreeNotes/FreeNotes";
import "./WorkspaceSidebar.scss";

type WorkspaceView = "notes" | "matrix" | "expenses" | "goals";

interface WorkspaceSidebarProps {
    open:boolean;
    view:WorkspaceView;
    onOpen:()=>void;
    onClose:()=>void;
    onViewChange:(view:WorkspaceView)=>void;
    freeNotes:FreeNote[];
    onAddFreeNote:(text:string)=>void;
    onUpdateFreeNote:(id:number,text:string)=>void;
    onDeleteFreeNote:(id:number)=>void;
    onMoveFreeNote:(id:number,direction:-1|1)=>void;
    matrixTasks:EisenhowerTask[];
    onAddMatrixTask:(text:string,quadrant:EisenhowerQuadrant)=>void;
    onToggleMatrixTask:(id:number)=>void;
    onUpdateMatrixTask:(id:number,text:string)=>void;
    onMoveMatrixTask:(id:number,direction:-1|1)=>void;
    onDeleteMatrixTask:(id:number)=>void;
    expenses:Expense[];
    onAddExpense:(amount:number,category:ExpenseCategory,description:string,date:string)=>void;
    onUpdateExpense:(id:number,amount:number,category:ExpenseCategory,description:string,date:string)=>void;
    onMoveExpense:(id:number,direction:-1|1)=>void;
    onDeleteExpense:(id:number)=>void;
    goals:Goal[];
    goalDate:Date;
    onAddGoal:(text:string,period:GoalPeriod,periodKey:string,category:GoalCategory)=>void;
    onUpdateGoal:(id:number,text:string,category:GoalCategory)=>void;
    onMoveGoal:(id:number,direction:-1|1)=>void;
    onDeleteGoal:(id:number)=>void;
}

function WorkspaceSidebar({
    open,view,onOpen,onClose,onViewChange,
    freeNotes,onAddFreeNote,onUpdateFreeNote,onDeleteFreeNote,onMoveFreeNote,
    matrixTasks,onAddMatrixTask,onToggleMatrixTask,onUpdateMatrixTask,onMoveMatrixTask,onDeleteMatrixTask,
    expenses,onAddExpense,onUpdateExpense,onMoveExpense,onDeleteExpense,
    goals,goalDate,onAddGoal,onUpdateGoal,onMoveGoal,onDeleteGoal
}:WorkspaceSidebarProps){
    return (
        <>
            {open && <div className="workspace-sidebar-overlay" onClick={onClose} />}
            <aside className={`workspace-sidebar ${open ? "open" : ""}`}>
                <div className="workspace-sidebar-handle" onClick={open ? onClose : onOpen} role="button" tabIndex={0} aria-label={open ? "Close workspace" : "Open workspace"}>
                    {open ? "❮" : "☰"}
                </div>

                <div className="workspace-sidebar-header">
                    <strong>FOCUS OS</strong>
                    <button type="button" className="workspace-close" onClick={onClose} aria-label="Close workspace">✕</button>
                </div>

                <nav className="workspace-nav">
                    <button type="button" className={view === "goals" ? "active" : ""} onClick={()=>onViewChange("goals")}>◎ Goals</button>
                    <button type="button" className={view === "matrix" ? "active" : ""} onClick={()=>onViewChange("matrix")}>☐ Matrix</button>
                    <button type="button" className={view === "notes" ? "active" : ""} onClick={()=>onViewChange("notes")}>📝 Notes</button>
                    <button type="button" className={view === "expenses" ? "active" : ""} onClick={()=>onViewChange("expenses")}>€ Expenses</button>
                </nav>

                <div className="workspace-sidebar-content">
                    {view === "notes" && <FreeNotes
                        notes={freeNotes}
                        onAdd={onAddFreeNote}
                        onUpdate={onUpdateFreeNote}
                        onDelete={onDeleteFreeNote}
                        onMove={onMoveFreeNote}
                    />}
                    {view === "matrix" && <Matrix
                        tasks={matrixTasks}
                        onAdd={onAddMatrixTask}
                        onToggle={onToggleMatrixTask}
                        onUpdate={onUpdateMatrixTask}
                        onMove={onMoveMatrixTask}
                        onDelete={onDeleteMatrixTask}
                    />}
                    {view === "expenses" && <Expenses
                        expenses={expenses}
                        onAdd={onAddExpense}
                        onUpdate={onUpdateExpense}
                        onMove={onMoveExpense}
                        onDelete={onDeleteExpense}
                    />}
                    {view === "goals" && <Goals
                        goals={goals}
                        date={goalDate}
                        onAdd={onAddGoal}
                        onUpdate={onUpdateGoal}
                        onMove={onMoveGoal}
                        onDelete={onDeleteGoal}
                    />}
                </div>
            </aside>
        </>
    );
}

export type { WorkspaceView };
export default WorkspaceSidebar;
