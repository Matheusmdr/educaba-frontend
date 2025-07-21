export type Goal = {
  name: string;
  id: string;
};

export type Set = {
  name: string;
  id: string;
  goals: Goal[];
  status: string;
};

export type Program = {
  id: string;
  name: string;
  patient_id: string;
  updated_at: string;
  created_at: string;
  sets: Set[];
  inputs: { name: string; type: string }[];
};
