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

export function mascaraCPFInput(valor: string): string {
  if (!valor) return "";

  return valor
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})/, "$1-$2")
    .replace(/(-\d{2})\d+?$/, "$1");
}
