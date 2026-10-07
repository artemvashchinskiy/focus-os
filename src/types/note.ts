//  note.ts

export interface Note{

    id:number;

    date:string;

    text:string;

    duration:number;

    remaining:number;

    completed:boolean;

    running:boolean;

    startedAt?:number;

    endAt?:number;

    finishedAt?:number; 

    notified?:boolean;

    goalId?:number;

    // Matrix task selected when the note was created/edited.
    matrixTaskId?: number;
    matrixQuadrant?: "urgent-important" | "not-urgent-important";
    matrixTaskText?: string;

    duplicate?: boolean;

    duplicateGroup?: string;

    duplicateImportedAt?: number;

    duplicateColor?: string;

    duplicateNumber?: number;

    duplicateType?: "original" | "imported";

}