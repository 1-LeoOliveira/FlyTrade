import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../lib/api.js';
import CardAeronave from '../components/CardAeronave.jsx';

const ORDENS = [
  { id: 'relevancia', rotulo: 'Mais relevantes' },
  { id: 'preco-asc', rotulo: 'Menor preço' },
  { id: 'preco-desc', rotulo: 'Maior preço' },
  { id: 'ano-desc', rotulo: 'Mais novas' },
  { id: 'ano-asc', rotulo: 'Mais antigas' },
  { id: 'horas-asc', rotulo: 'Menos horas totais' },
  { id: 'recentes', rotulo: 'Anúncios recentes' },
];

const vazio = {
  busca: '', categoria: '', fabricante: '', localizacao: '',
  anoMin: '', anoMax: '', precoMin: '', precoMax: '',
  horasMax: '', horasMotorMax: '', assentosMin: '', ordem: 'relevancia',
};

export default function Catalogo() {
  const [params, setParams] = useSearchParams();
  const [filtros, setFiltros] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [abertoMobile, setAbertoMobile] = useState(false);

  const estado = useMemo(() => {
    const atual = { ...vazio };
    for (const chave of Object.keys(vazio)) {
      const v = params.get(chave);
      if (v !== null) atual[chave] = v;
    }
    return atual;
  }, [params]);

  useEffect(() => { api.filtros().then(setFiltros).catch(() => {}); }, []);

  useEffect(() => {
    setCarregando(true);
    api
      .aeronaves(estado)
      .then(setResultado)
      .catch(() => setResultado({ total: 0, itens: [] }))
      .finally(() => setCarregando(false));
  }, [estado]);

  function atualizar(mudancas) {
    const proximos = { ...estado, ...mudancas };
    const limpos = Object.fromEntries(
      Object.entries(proximos).filter(([k, v]) => v !== '' && !(k === 'ordem' && v === 'relevancia')),
    );
    setParams(limpos, { replace: true });
  }

  function alternarLista(chave, valor) {
    const atuais = estado[chave] ? estado[chave].split(',') : [];
    const proximos = atuais.includes(valor) ? atuais.filter((x) => x !== valor) : [...atuais, valor];
    atualizar({ [chave]: proximos.join(',') });
  }

  const marcado = (chave, valor) => (estado[chave] || '').split(',').includes(valor);
  const ativos = Object.entries(estado).filter(([k, v]) => v && k !== 'ordem').length;

  const painelFiltros = (
    <aside className={`filtros ${abertoMobile ? 'aberto' : ''}`}>
      <h3>
        Filtros
        {ativos > 0 && <button className="limpar" onClick={() => setParams({}, { replace: true })}>Limpar ({ativos})</button>}
      </h3>

      <div className="filtro-grupo">
        <strong>Busca livre</strong>
        <input
          type="search"
          placeholder="Modelo, matrícula, cidade..."
          value={estado.busca}
          onChange={(e) => atualizar({ busca: e.target.value })}
          style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1px solid var(--cinza-200)', background: 'var(--cinza-50)' }}
        />
      </div>

      <div className="filtro-grupo">
        <strong>Categoria</strong>
        {(filtros?.categorias || []).map((c) => (
          <label className="check" key={c.id}>
            <input type="checkbox" checked={marcado('categoria', c.id)} onChange={() => alternarLista('categoria', c.id)} />
            {c.nome}
          </label>
        ))}
      </div>

      <div className="filtro-grupo">
        <strong>Fabricante</strong>
        {(filtros?.fabricantes || []).map((f) => (
          <label className="check" key={f}>
            <input type="checkbox" checked={marcado('fabricante', f)} onChange={() => alternarLista('fabricante', f)} />
            {f}
          </label>
        ))}
      </div>

      <div className="filtro-grupo">
        <strong>Ano</strong>
        <div className="par">
          <input type="number" placeholder="De" value={estado.anoMin} onChange={(e) => atualizar({ anoMin: e.target.value })} className="campo-num" />
          <input type="number" placeholder="Até" value={estado.anoMax} onChange={(e) => atualizar({ anoMax: e.target.value })} className="campo-num" />
        </div>
      </div>

      <div className="filtro-grupo">
        <strong>Preço (US$)</strong>
        <div className="par">
          <input type="number" step="100000" placeholder="Mínimo" value={estado.precoMin} onChange={(e) => atualizar({ precoMin: e.target.value })} />
          <input type="number" step="100000" placeholder="Máximo" value={estado.precoMax} onChange={(e) => atualizar({ precoMax: e.target.value })} />
        </div>
      </div>

      <div className="filtro-grupo">
        <strong>Horas totais (TT) até</strong>
        <input type="number" step="100" placeholder="Ex.: 3000" value={estado.horasMax} onChange={(e) => atualizar({ horasMax: e.target.value })} style={{ width: '100%' }} />
      </div>

      <div className="filtro-grupo">
        <strong>Horas de motor (TSO/SMOH) até</strong>
        <input type="number" step="100" placeholder="Ex.: 1500" value={estado.horasMotorMax} onChange={(e) => atualizar({ horasMotorMax: e.target.value })} style={{ width: '100%' }} />
      </div>

      <div className="filtro-grupo">
        <strong>Assentos (mínimo)</strong>
        <select value={estado.assentosMin} onChange={(e) => atualizar({ assentosMin: e.target.value })} style={{ width: '100%' }}>
          <option value="">Qualquer</option>
          {[2, 4, 6, 8, 10, 12].map((n) => <option key={n} value={n}>{n}+ lugares</option>)}
        </select>
      </div>

      <div className="filtro-grupo">
        <strong>Localização</strong>
        <select value={estado.localizacao} onChange={(e) => atualizar({ localizacao: e.target.value })} style={{ width: '100%' }}>
          <option value="">Todo o Brasil</option>
          {(filtros?.localizacoes || []).map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>
    </aside>
  );

  return (
    <div className="container" style={{ paddingTop: 36, paddingBottom: 80 }}>
      <span className="olho">Estoque FlyTrade</span>
      <h1 style={{ margin: '14px 0 10px', fontSize: 'clamp(1.9rem, 4vw, 2.8rem)' }}>Catálogo de aeronaves</h1>
      <p className="secao-sub" style={{ marginBottom: 34 }}>
        Todas as unidades com ficha técnica verificada, histórico de manutenção e vendedor identificado.
      </p>

      <div className="catalogo">
        <div className="filtros-mobile">
          <button className="btn btn--contorno" onClick={() => setAbertoMobile((a) => !a)}>
            {abertoMobile ? 'Fechar filtros' : `Filtros${ativos ? ` (${ativos})` : ''}`}
          </button>
        </div>
        {painelFiltros}

        <div>
          <div className="barra-resultados">
            <strong>
              {carregando ? 'Buscando...' : `${resultado?.total ?? 0} aeronave${(resultado?.total ?? 0) === 1 ? '' : 's'} encontrada${(resultado?.total ?? 0) === 1 ? '' : 's'}`}
            </strong>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.88rem' }}>
              Ordenar por
              <select value={estado.ordem} onChange={(e) => atualizar({ ordem: e.target.value })}>
                {ORDENS.map((o) => <option key={o.id} value={o.id}>{o.rotulo}</option>)}
              </select>
            </label>
          </div>

          {carregando ? (
            <div className="grade">
              {Array.from({ length: 6 }, (_, i) => <div key={i} className="esqueleto" style={{ height: 420 }} />)}
            </div>
          ) : resultado.itens.length === 0 ? (
            <div className="vazio">
              <h3>Nenhuma aeronave com esses critérios</h3>
              <p style={{ color: 'var(--cinza-600)', margin: '10px 0 20px' }}>
                Ajuste os filtros ou cadastre um alerta: avisamos assim que algo compatível entrar no estoque.
              </p>
              <button className="btn btn--navy" onClick={() => setParams({}, { replace: true })}>Limpar filtros</button>
            </div>
          ) : (
            <div className="grade">
              {resultado.itens.map((a) => <CardAeronave key={a.id} aeronave={a} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
