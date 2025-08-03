import { z } from "zod";

const InputValueSchema = z.union([z.number().nonnegative(), z.string()]);
export const RecordSchema = z.object({
  setId: z.string().min(1),
  goalId: z.string().min(1),
  inputs: z.record(InputValueSchema),
});