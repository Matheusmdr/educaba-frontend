export type Application =  {
    id: string;
    program_id: string;
    goal_id: string;
    user_id: string | null;
    created_at: string;
    updated_at: string | null;
    goal_name: string;
    inputs: Record<string, string | number>;
    program_name: string;
}
