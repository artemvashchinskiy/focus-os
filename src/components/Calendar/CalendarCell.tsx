import type { Note } from "../../types/note";


interface CalendarCellProps {

    date:string;

    day:number;

    notes:Note[];

    onClick:(date:string)=>void;

}

interface CalendarCellProps{

    date:string;
    day:number;
    notes:Note[];
    selected:boolean;
    onClick:(date:string)=>void;

}


function CalendarCell({

    date,
    day,
    notes,
    selected,
    onClick

}:CalendarCellProps){



    const safeNotes = Array.isArray(notes) ? notes : [];

    const dayNotes =
        safeNotes.filter(
            note=>note.date===date
        );



    const hasNotes =
        dayNotes.length > 0;


    const today = new Date();

    const todayString =

        `${today.getFullYear()}-` +

        `${String(today.getMonth()+1).padStart(2,"0")}-` +

        `${String(today.getDate()).padStart(2,"0")}`;

    const isToday =
        date === todayString;

    return(

        <div

            className={
                `
                calendar-cell
                ${hasNotes ? "has-note":""}
                ${selected ? "selected" : ""}
                ${isToday ? "today":""}
                `
            }


            onClick={()=>onClick(date)}

        >


            <span className="day-number">

                {day}

            </span>



            {
                hasNotes &&

                <div
                    className="note-indicator"
                    aria-label={`${dayNotes.length} note${dayNotes.length === 1 ? "" : "s"}`}
                    title={`${dayNotes.length} note${dayNotes.length === 1 ? "" : "s"}`}
                >
                    <span className="note-dot">●</span>
                    <small className="note-count">
                        {dayNotes.length}
                    </small>
                </div>
            }


        </div>

    )

}


export default CalendarCell;