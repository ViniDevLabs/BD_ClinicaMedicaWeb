export interface CadastroPacienteRequest {
  cpf: string;
  nome: string;
  email: string;
  senha?: string;
  dataNascimento: string;
  ehAdministrador: number;
  convenio?: string;
  numCarteirinha?: string;
}

export interface PacienteResponse {
  id: number;
  cpf: string;
  nome: string;
  email: string;
  dataNascimento: string;
  ehAdministrador: number;
  convenio: string | null;
  numCarteirinha: string | null;
}
