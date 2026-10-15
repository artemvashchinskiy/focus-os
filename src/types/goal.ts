export type GoalPeriod = "year" | "quarter" | "month" | "week";

export type GoalCategory =
    | "None"
    | "Career"
    | "Health"
    | "Finance"
    | "Relationships"
    | "Personal"
    | "Other";

export interface Goal {
    id: number;
    text: string;
    period: GoalPeriod;
    periodKey: string;
    category: GoalCategory;
    completed?: boolean;
    createdAt: number;
    updatedAt: number;
}
