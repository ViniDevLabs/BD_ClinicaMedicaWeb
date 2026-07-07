export function validarCPF(cpfCru: string): boolean {
  // Remove tudo o que não for número
  const cpf = cpfCru.replace(/\D/g, "");

  // Verifica se tem 11 dígitos ou se é uma sequência repetida (ex: 111.111.111-11)
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

  let soma = 0;
  let resto;

  // Validação do primeiro dígito verificador
  for (let i = 1; i <= 9; i++) {
    soma = soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(9, 10))) return false;

  soma = 0;
  // Validação do segundo dígito verificador
  for (let i = 1; i <= 10; i++) {
    soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(10, 11))) return false;

  return true;
}
