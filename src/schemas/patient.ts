import { z } from "zod";

const MAX_FILE_SIZE = 2 * 1024 * 1024;

export const patientSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  sex: z.string().min(1, "Sexo é obrigatório"),
  birth_date: z.string().refine((val) => !Number.isNaN(Date.parse(val)), {
    message: "Data de nascimento inválida",
  }),
  image: z
    .object({
      preview: z.string(),
      file: z.instanceof(File).optional(),
    })
    .refine(
      (value) => !value.file || value.file.type?.includes("image"),
      "Apenas arquivos .jpg, .jpeg, .png e .webp são aceitos."
    )
    .refine(
      (value) => !value.file || value.file?.size <= MAX_FILE_SIZE,
      `Tamanho máximo: ${MAX_FILE_SIZE / 1000}KB`
    )
    .refine((value) => value.preview?.trim(), "Por favor, insira uma imagem"),
  organization_id: z.string().optional(),
});

export const createPatientSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  sex: z.string().min(1, "Sexo é obrigatório"),
  birth_date: z.string().refine((val) => !Number.isNaN(Date.parse(val)), {
    message: "Data de nascimento inválida",
  }),
  image: z.instanceof(File).optional(),
  organization_id: z.string().optional(),
});
