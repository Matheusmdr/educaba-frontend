import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { env } from "@/env";
import { AppParams } from "@/types/app";
import { Patient } from "@/types/patient";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, Clock, MoreHorizontal, User } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

interface PatientCardProps {
  patient: Patient;
}

function PatientCard({ patient }: PatientCardProps) {
  const params: AppParams = useParams();
  const router = useRouter();
  const handleClick = (patientId: string) => {
    router.push(`/${params.organizationId}/${patientId}`);
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  };

  const formatUpdatedAt = (date: string) => {
    return formatDistanceToNow(new Date(date), {
      addSuffix: true,
      locale: ptBR,
    });
  };

  const age = calculateAge(patient.birth_date);
  const lastUpdate = formatUpdatedAt(patient.updated_at);

  return (
    <Card
      key={patient.id}
      className="overflow-hidden transition-all hover:shadow-md border-2 border-transparent hover:border-primary"
    >
      <CardContent className="p-0">
        <div
          className="flex items-start p-4 gap-3 cursor-pointer"
          onClick={() => handleClick(patient.id)}
        >
          <div className="relative h-12 w-12 overflow-hidden rounded-full border">
            <Image
              src={`${env.NEXT_PUBLIC_API_HOST}${patient.image}`}
              alt={patient.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-medium text-base truncate">
                  {patient.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {patient.sex === "male" ? "Masculino" : "Feminino"}, {age}{" "}
                  anos
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger
                  asChild
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Abrir menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Ações</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(
                        `/${params.organizationId}/edit/${patient.id}`
                      );
                    }}
                  >
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      alert(`Remover ${patient.id}`);
                    }}
                  >
                    Remover
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="mt-1 flex items-center text-xs text-muted-foreground">
              <Clock className="mr-1 h-3 w-3" />
              <span>Atualizado {lastUpdate}</span>
            </div>
          </div>
        </div>
        <div className="bg-muted/30 px-4 py-3 text-sm">
          <div className="flex items-center text-muted-foreground">
            <Calendar className="mr-2 h-3.5 w-3.5" />
            <span>
              Nascimento:{" "}
              {new Date(patient.birth_date).toLocaleDateString("pt-BR")}
            </span>
          </div>
          <div className="flex items-center text-muted-foreground mt-1">
            <User className="mr-2 h-3.5 w-3.5" />
            <span>ID: {patient.id.substring(0, 8)}...</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export { PatientCard };
