export const CATEGORIA_NOME = {
  jato: 'Jato executivo',
  turboelice: 'Turboélice',
  pistao: 'Pistão',
  helicoptero: 'Helicóptero',
  experimental: 'Experimental',
};

/** Valores das aeronaves são negociados em dólar (USD). */
export function moeda(valor) {
  if (valor == null) return 'Sob consulta';
  return `US$ ${valor.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`;
}

export function moedaCurta(valor) {
  if (valor == null) return 'Sob consulta';
  if (valor >= 1_000_000) return `US$ ${(valor / 1_000_000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} mi`;
  if (valor >= 1_000) return `US$ ${(valor / 1_000).toLocaleString('pt-BR', { maximumFractionDigits: 0 })} mil`;
  return moeda(valor);
}

/** Planos de anúncio são cobrados em real (R$). */
export function reais(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
}

export const numero = (v, sufixo = '') =>
  v == null || v === '' ? '—' : `${Number(v).toLocaleString('pt-BR')}${sufixo}`;

export const titulo = (a) => `${a.fabricante} ${a.modelo}`;

export const whatsappLink = (telefone, texto) =>
  `https://wa.me/${telefone}?text=${encodeURIComponent(texto)}`;

/** Simulador de financiamento (Tabela Price). */
export function simularFinanciamento({ valor, entradaPct = 20, anos = 10, jurosAno = 11.5 }) {
  const entrada = (valor * entradaPct) / 100;
  const financiado = valor - entrada;
  const i = jurosAno / 100 / 12;
  const n = anos * 12;
  const parcela = i === 0 ? financiado / n : (financiado * i) / (1 - (1 + i) ** -n);
  const total = parcela * n + entrada;
  return { entrada, financiado, parcela, n, total, juros: total - valor };
}
