import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useApp } from '../lib/AppContext.jsx';
import { capa } from '../lib/fotos.js';
import { CATEGORIA_NOME, moeda, numero, titulo } from '../lib/format.js';

const LINHAS = [
  ['Preço', (a) => moeda(a.preco)],
  ['Categoria', (a) => CATEGORIA_NOME[a.categoria]],
  ['Ano', (a) => a.ano],
  ['Horas totais (TT)', (a) => `${numero(a.horasTotais)} h`],
  ['Horas de motor', (a) => `${numero(a.horasMotor)} h ${a.tipoHorasMotor}`],
  ['Horas de hélice', (a) => (a.horasHelice ? `${numero(a.horasHelice)} h` : '—')],
  ['Assentos', (a) => `${a.assentos} lugares`],
  ['Motores', (a) => a.motores],
  ['Autonomia', (a) => `${numero(a.autonomia)} NM`],
  ['Velocidade de cruzeiro', (a) => `${numero(a.velocidadeCruzeiro)} kt`],
  ['Teto de serviço', (a) => `${numero(a.tetoServico)} ft`],
  ['Pista mínima', (a) => (a.pistaMinima ? `${numero(a.pistaMinima)} m` : '—')],
  ['Aviônicos', (a) => a.avionicos],
  ['Localização', (a) => a.localizacao],
  ['Vendedor', (a) => `${a.vendedor.nome} (${a.vendedor.tipo})`],
];

export default function Comparar() {
  const { comparar, alternarComparar, limparComparacao } = useApp();
  const [itens, setItens] = useState([]);

  useEffect(() => {
    Promise.all(comparar.map((id) => api.aeronave(id).then((d) => d.aeronave).catch(() => null)))
      .then((lista) => setItens(lista.filter(Boolean)));
  }, [comparar]);

  return (
    <div className="container" style={{ padding: '36px 0 80px' }}>
      <span className="olho">Lado a lado</span>
      <h1 style={{ margin: '14px 0 10px', fontSize: 'clamp(1.9rem, 4vw, 2.8rem)' }}>Comparar aeronaves</h1>
      <p className="secao-sub" style={{ marginBottom: 32 }}>
        Selecione até 3 aeronaves no catálogo e confronte ficha técnica, horas e preço na mesma tela.
      </p>

      {itens.length === 0 ? (
        <div className="vazio">
          <h3>Nenhuma aeronave selecionada</h3>
          <p style={{ color: 'var(--cinza-600)', margin: '10px 0 20px' }}>
            Use o botão “Comparar” nos cards do catálogo para montar sua comparação.
          </p>
          <Link to="/catalogo" className="btn btn--navy">Ir para o catálogo</Link>
        </div>
      ) : (
        <>
          <div style={{ overflowX: 'auto' }}>
            <table className="tabela-comparar">
              <thead>
                <tr>
                  <th />
                  {itens.map((a) => (
                    <th key={a.id} style={{ minWidth: 240 }}>
                      <img src={capa(a)} alt={titulo(a)} />
                      <strong style={{ display: 'block', fontSize: '1rem' }}>{titulo(a)}</strong>
                      <span style={{ color: 'var(--cinza-600)', fontSize: '0.85rem' }}>{a.ano} · {a.matricula}</span>
                      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                        <Link to={`/aeronave/${a.id}`} className="btn btn--navy" style={{ padding: '9px 16px', fontSize: '0.82rem' }}>Ver</Link>
                        <button className="btn btn--contorno" style={{ padding: '9px 16px', fontSize: '0.82rem' }} onClick={() => alternarComparar(a.id)}>
                          Remover
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {LINHAS.map(([rotulo, valor]) => (
                  <tr key={rotulo}>
                    <td>{rotulo}</td>
                    {itens.map((a) => <td key={a.id}>{valor(a)}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap' }}>
            <Link to="/catalogo" className="btn btn--contorno">Adicionar outra aeronave</Link>
            <button className="btn btn--contorno" onClick={limparComparacao}>Limpar comparação</button>
          </div>
        </>
      )}
    </div>
  );
}
