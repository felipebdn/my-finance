/**
 * Converte um valor numérico em uma string formatada como valor monetário.
 * @param value - O valor numérico a ser convertido.
 * @returns O valor numérico com duas casas decimais.
 */
export function convertValueMonetary(value: number): number {
  // Arredonda o número para duas casas decimais
  return parseFloat(value.toFixed(2))
}
