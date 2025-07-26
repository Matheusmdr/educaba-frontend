import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function parseAndFormat(dateStr?: string | null) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "-";
  return format(d, "dd/MM/yyyy - HH:mm", { locale: ptBR });
}