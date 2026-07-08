export interface MedicoRequest {
  cpf: string;
  nome: string;
  email: string;
  senha?: string;
  dataNascimento: string;
  ehAdministrador: number;
  numero: number;
  estado: string;
  especialidades: string[];
}

export interface MedicoResponse extends MedicoRequest {
  id: number;
}
