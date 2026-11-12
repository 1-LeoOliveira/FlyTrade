import { useState } from 'react';
import { moeda, simularFinanciamento } from '../lib/format.js';

export default function Simulador({ valorInicial = 5000000 }) {
  const [valor, setValor] = useState(valorInicial || 5000000);
  const [entradaPct, setEntradaPct] = useState(20);
  const [anos, setAnos] = useState(10);
  const [jurosAno, setJurosAno] = useState(11.5);

  const r = simularFinanciamento({ valor, entradaPct, anos, jurosAno });

  return (
    <div className="simulador">
      <h3>Simulador de financiamento</h3>
      <p style={{ color: 'var(--cinza-600)', fontSize: '0.9rem', margin: '8px 0 18px' }}>
        Estimativa pela Tabela Price. Condições finais sujeitas à análise de crédito.
      </p>

      <div className="campo" style={{ marginBottom: 14 }}>
        <label htmlFor="sim-valor">Valor da aeronave</label>
        <input
          id="sim-valor"
          type="number"
          step="50000"
          value={valor}
          onChange={(e) => setValor(Number(e.target.value) || 0)}
        />
      </div>

      <label className="campo" style={{ marginBottom: 12 }}>
        <span style={{ fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--cinza-600)' }}>
          Entrada: {entradaPct}% ({moeda(r.entrada)})
        </span>
        <input type="range" min="10" max="70" step="5" value={entradaPct} onChange={(e) => setEntradaPct(Number(e.target.value))} />
      </label>

      <label className="campo" style={{ marginBottom: 12 }}>
        <span style={{ fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--cinza-600)' }}>
          Prazo: {anos} anos ({r.n} parcelas)
        </span>
        <input type="range" min="2" max="15" value={anos} onChange={(e) => setAnos(Number(e.target.value))} />
      </label>

      <label className="campo" style={{ marginBottom: 6 }}>
        <span style={{ fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--cinza-600)' }}>
          Juros: {jurosAno.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}% ao ano
        </span>
        <input type="range" min="7" max="20" step="0.5" value={jurosAno} onChange={(e) => setJurosAno(Number(e.target.value))} />
      </label>

      <div className="simulador__destaque">
        <strong>{moeda(r.parcela)}</strong>
        <span>por mês durante {r.n} meses</span>
      </div>

      <div style={{ marginTop: 16 }}>
        <div className="simulador__linha"><span>Entrada</span><strong>{moeda(r.entrada)}</strong></div>
        <div className="simulador__linha"><span>Valor financiado</span><strong>{moeda(r.financiado)}</strong></div>
        <div className="simulador__linha"><span>Custo total do crédito</span><strong>{moeda(r.juros)}</strong></div>
        <div className="simulador__linha"><span>Total pago</span><strong>{moeda(r.total)}</strong></div>
      </div>
    </div>
  );
}
