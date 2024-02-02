// Interface para as propriedades de formatação monetária
interface ValueMonetaryProps {
  location: string // Código do idioma e país (ex: 'pt-BR' para português brasileiro)
  style: string // Estilo de formatação (ex: 'currency' para formatar como moeda)
  currency: string // Código da moeda (ex: 'BRL' para Real brasileiro)
}

/**
 * Converte um valor numérico formatada como valor monetário.
 * @param value - O valor numérico a ser convertido.
 * @param props - (Opcional) Propriedades de formatação monetária.
 *   - location: Código do idioma e país.
 *   - style: Estilo de formatação desejado.
 *   - currency: Código da moeda.
 * @returns O valor formatado como number.
 */
export function convertValueMonetary(
  value: number,
  props: ValueMonetaryProps = {
    currency: 'BRL',
    location: 'pt-BR',
    style: 'currency',
  },
): number {
  // Usa toLocaleString para formatar o valor de acordo com as propriedades fornecidas
  return parseFloat(
    value.toLocaleString(props.location, {
      style: props.style,
      currency: props.currency,
    }),
  )
}
