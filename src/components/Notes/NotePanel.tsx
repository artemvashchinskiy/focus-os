import { useState } from "react";
import type { Note } from "../../types/note";
import type { Goal } from "../../types/goal";


interface NotePanelProps {

    date:string;

    note?:Note | null;

    onSave:(note:Note)=>void;

    onClose:()=>void;

    goals:Goal[];

}



function NotePanel({

    date,
    note,
    onSave,
    onClose,
    goals

}:NotePanelProps){



    const [text,setText] = useState(
        note?.text ?? ""
    );


    const [goalId,setGoalId] = useState<number | "">(note?.goalId ?? "");


    const [minutes,setMinutes] = useState(
        note
        ?
        note.duration / 60
        :
        25
    );



    function saveNote(){


    const timerSeconds = minutes * 60;


    const updatedNote:Note = {

        id: note?.id ?? Date.now(),

        date,

        text,

        duration:timerSeconds,

        remaining:

            note?.running

            ? note.remaining

            : timerSeconds,


        completed:

            note?.completed ?? false,


        running:

            note?.running ?? false,


        startedAt:

            note?.startedAt,


        endAt:

            note?.endAt,


        finishedAt:

            note?.finishedAt,


        notified:

            note?.notified,

        goalId: goalId === "" ? undefined : goalId

    };



        onSave(updatedNote);


        setText("");

    }





    return(

        <div className="note-panel">


            <div className="panel-header">


                <b>

                    {
                        note
                        ?
                        "Edit Note"
                        :
                        "New Note"
                    }

                </b>


                <button

                    onClick={onClose}

                >
                    ✕
                </button>


            </div>





            <div className="small">

                Date:
                {" "}
                {date}

            </div>





            <textarea

                value={text}

                onChange={
                    e=>setText(e.target.value)
                }

                placeholder="Write your task..."

            />





            <label>

                Goal:

            </label>

            <select
                value={goalId}
                onChange={e => setGoalId(e.target.value ? Number(e.target.value) : "")}
            >
                <option value="">No goal</option>
                {goals.map(goal => (
                    <option key={goal.id} value={goal.id}>
                        {goal.text} ({goal.period})
                    </option>
                ))}
            </select>


            <label>

                Timer minutes:

            </label>



            <input

                type="number"

                min="1"

                value={minutes}

                onChange={
                    e=>
                    setMinutes(
                        Number(e.target.value)
                    )
                }

            />





            <div className="actions">


                <button

                    onClick={saveNote}

                    disabled={!text.trim()}

                >

                    Save

                </button>



                <button

                    onClick={onClose}

                >

                    Cancel

                </button>


            </div>



        </div>

    )

}


export default NotePanel;