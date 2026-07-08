export function formatarCPF(cpf: string | undefined): string {
  if (!cpf) return "-";
  const apenasNumeros = cpf.replace(/\D/g, "");
  if (apenasNumeros.length !== 11) return cpf;
  return apenasNumeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

export function formatarDataIsoParaBr(dataIso: string | undefined): string {
  if (!dataIso) return "-";
  const partes = dataIso.split("-");
  if (partes.length !== 3) return dataIso;
  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

export function formatarDataHoraBr(iso: string | undefined): string {
  if (!iso) return "-";
  const [data, hora] = iso.split("T");
  const dataBr = formatarDataIsoParaBr(data);
  const horaBr = hora ? hora.slice(0, 5) : "";
  return horaBr ? `${dataBr} às ${horaBr}` : dataBr;
}

export function formatarHora(hora: string | undefined): string {
  if (!hora) return "-";
  return hora.slice(0, 5);
}

export function hojeISO(): string {
  const d = new Date();
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mes}-${dia}`;
}

export function mascaraCPFInput(valor: string): string {
  if (!valor) return "";

  return valor
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})/, "$1-$2")
    .replace(/(-\d{2})\d+?$/, "$1");
}
