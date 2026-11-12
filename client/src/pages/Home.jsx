import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api.js';
import { capaCategoria } from '../lib/fotos.js';
import CardAeronave from '../components/CardAeronave.jsx';
import { IconeDocumento, IconeEscudo, IconeLupa, IconeMoeda, IconeSeta } from '../components/Icones.jsx';

const FAIXAS = [
  { rotulo: 'Até US$ 500 mil', precoMax: 500000 },
  { rotulo: 'US$ 500 mil a US$ 2 mi', precoMin: 500000, precoMax: 2000000 },
  { rotulo: 'US$ 2 mi a US$ 6 mi', precoMin: 2000000, precoMax: 6000000 },
  { rotulo: 'Acima de US$ 6 milhões', precoMin: 6000000 },
];

const VANTAGENS = [
  { icone: <IconeEscudo />, titulo: 'Curadoria e segurança', texto: 'Cada anúncio passa por checagem de matrícula, situação no RAB e validação do vendedor antes de ir ao ar.' },
  { icone: <IconeLupa />, titulo: 'Inspeção pré-compra', texto: 'Rede de oficinas homologadas pela ANAC para a pré-buy inspection, com laudo técnico independente.' },
  { icone: <IconeDocumento />, titulo: 'Documentação ANAC', texto: 'Transferência de propriedade, CA, CVA e registro no RAB conduzidos pelo nosso time jurídico.' },
  { icone: <IconeMoeda />, titulo: 'Financiamento e seguro', texto: 'Simulação em segundos e cartas de crédito com bancos e seguradoras especializadas em aviação.' },
];

const DEPOIMENTOS = [
  {
    nome: 'Eduardo Rangel',
    papel: 'Vendeu seu Citation CJ3+',
    iniciais: 'ER',
    texto: 'Anunciei aqui e em menos de um mês minha venda foi realizada. O time cuidou da inspeção, do contrato e da transferência no RAB — não precisei entrar em nenhuma etapa burocrática.',
  },
  {
    nome: 'Marina Costa',
    papel: 'Diretora · Táxi aéreo',
    iniciais: 'MC',
    texto: 'Compramos dois King Air pela FlyTrade. Laudo técnico honesto, sem maquiagem, e negociação transparente do começo ao fim.',
  },
  {
    nome: 'Cmte. Paulo Ferraz',
    papel: 'Proprietário · Pilatus PC-12',
    iniciais: 'CF',
    texto: 'Procurava um PC-12 com histórico limpo havia meses. Recebi o laudo da pré-compra antes de qualquer proposta e negociei com total discrição. Fechei em duas semanas.',
  },
];

export default function Home() {
  const [destaques, setDestaques] = useState([]);
  const [filtros, setFiltros] = useState(null);
  const [busca, setBusca] = useState({ categoria: '', fabricante: '', faixa: '', anoMin: '' });
  const navegar = useNavigate();

  useEffect(() => {
    api.destaques().then(setDestaques).catch(() => {});
    api.filtros().then(setFiltros).catch(() => {});
  }, []);

  function buscar(evento) {
    evento.preventDefault();
    const params = new URLSearchParams();
    if (busca.categoria) params.set('categoria', busca.categoria);
    if (busca.fabricante) params.set('fabricante', busca.fabricante);
    if (busca.anoMin) params.set('anoMin', busca.anoMin);
    const faixa = FAIXAS[busca.faixa];
    if (faixa) {
      if (faixa.precoMin) params.set('precoMin', faixa.precoMin);
      if (faixa.precoMax) params.set('precoMax', faixa.precoMax);
    }
    navegar(`/catalogo?${params.toString()}`);
  }

  return (
    <>
      <section className="hero">
        <div className="hero__fundo">
          <img src="/hero-jato.jpg" alt="" aria-hidden="true" fetchpriority="high" />
        </div>
        <div className="container hero__conteudo">
          <span className="olho">Concessionária aérea online</span>
          <h1>A sua próxima aeronave <em>começa aqui.</em></h1>
          <p className="hero__texto">
            Jatos executivos, turboélices, monomotores, helicópteros e experimentais com curadoria técnica,
            documentação verificada e assessoria completa do primeiro contato à transferência no RAB.
          </p>
          <div className="hero__acoes">
            <Link to="/catalogo" className="btn btn--ouro">Ver aeronaves disponíveis <IconeSeta /></Link>
            <Link to="/anuncie" className="btn btn--claro">Quero anunciar a minha</Link>
          </div>
          <div className="hero__metricas">
            <div><strong>{filtros?.total ?? 12}</strong><span>aeronaves no estoque</span></div>
            <div><strong>US$ 240 mi</strong><span>em aeronaves negociadas</span></div>
            <div><strong>38 dias</strong><span>tempo médio de venda</span></div>
            <div><strong>100%</strong><span>com inspeção pré-compra</span></div>
          </div>
        </div>
      </section>

      <div className="container">
        <form className="busca-rapida" onSubmit={buscar}>
          <div className="campo">
            <label htmlFor="b-cat">Tipo de aeronave</label>
            <select id="b-cat" value={busca.categoria} onChange={(e) => setBusca({ ...busca, categoria: e.target.value })}>
              <option value="">Todas as categorias</option>
              {(filtros?.categorias || []).map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
          </div>
          <div className="campo">
            <label htmlFor="b-fab">Fabricante</label>
            <select id="b-fab" value={busca.fabricante} onChange={(e) => setBusca({ ...busca, fabricante: e.target.value })}>
              <option value="">Todos</option>
              {(filtros?.fabricantes || []).map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div className="campo">
            <label htmlFor="b-preco">Faixa de preço</label>
            <select id="b-preco" value={busca.faixa} onChange={(e) => setBusca({ ...busca, faixa: e.target.value })}>
              <option value="">Qualquer valor</option>
              {FAIXAS.map((f, i) => <option key={f.rotulo} value={i}>{f.rotulo}</option>)}
            </select>
          </div>
          <div className="campo">
            <label htmlFor="b-ano">Ano a partir de</label>
            <select id="b-ano" value={busca.anoMin} onChange={(e) => setBusca({ ...busca, anoMin: e.target.value })}>
              <option value="">Qualquer ano</option>
              {[2020, 2015, 2010, 2005, 2000].map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <button className="btn btn--navy" type="submit">Buscar</button>
        </form>
      </div>

      <section className="secao">
        <div className="container">
          <div className="cabecalho-secao">
            <div>
              <span className="olho">Seleção FlyTrade</span>
              <h2 style={{ marginTop: 14 }}>Aeronaves em destaque</h2>
              <p className="secao-sub">Unidades com documentação completa, histórico de manutenção rastreável e prontas para entrega.</p>
            </div>
            <Link to="/catalogo" className="btn btn--contorno">Ver estoque completo <IconeSeta /></Link>
          </div>
          <div className="grade">
            {destaques.length === 0
              ? Array.from({ length: 3 }, (_, i) => <div key={i} className="esqueleto" style={{ height: 420 }} />)
              : destaques.map((a) => <CardAeronave key={a.id} aeronave={a} />)}
          </div>
        </div>
      </section>

      <section className="secao secao--cinza">
        <div className="container">
          <div className="cabecalho-secao">
            <div>
              <span className="olho">Categorias</span>
              <h2 style={{ marginTop: 14 }}>Encontre pelo tipo de operação</h2>
            </div>
          </div>
          <div className="categorias">
            {(filtros?.categorias || []).map((c) => (
              <Link key={c.id} to={`/catalogo?categoria=${c.id}`} className="categoria">
                <img src={capaCategoria(c.id)} alt={c.nome} loading="lazy" />
                <div className="categoria__texto">
                  <strong>{c.nome}</strong>
                  <span>{c.descricao}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="secao">
        <div className="container">
          <div className="cabecalho-secao cabecalho-secao--centro">
            <div>
              <span className="olho">Por que o FlyTrade</span>
              <h2 style={{ marginTop: 14 }}>Comprar aeronave sem sobressaltos</h2>
              <p className="secao-sub">Somos a ponte entre quem vende e quem compra — com o rigor técnico que uma aeronave exige.</p>
            </div>
          </div>
          <div className="vantagens vantagens--centro">
            {VANTAGENS.map((v) => (
              <div className="vantagem" key={v.titulo}>
                <div className="vantagem__icone">{v.icone}</div>
                <h3>{v.titulo}</h3>
                <p>{v.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="secao secao--navy">
        <div className="container">
          <div className="cabecalho-secao">
            <div>
              <span className="olho">Depoimentos</span>
              <h2 style={{ marginTop: 14, color: '#fff' }}>Quem já voou com a gente</h2>
            </div>
          </div>
          <div className="depoimentos">
            {DEPOIMENTOS.map((d) => (
              <blockquote className="depoimento" key={d.nome}>
                <div className="estrelas">★★★★★</div>
                <p>“{d.texto}”</p>
                <footer>
                  <div className="avatar">{d.iniciais}</div>
                  <div>
                    <strong style={{ color: '#fff', display: 'block', fontSize: '0.95rem' }}>{d.nome}</strong>
                    <span style={{ fontSize: '0.84rem' }}>{d.papel}</span>
                  </div>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="secao">
        <div className="container">
          <div className="cta">
            <div>
              <span className="olho">Para vendedores</span>
              <h2 style={{ marginTop: 14, color: '#fff' }}>Anuncie sua aeronave para quem realmente compra</h2>
              <p>
                Mais de 40 mil compradores qualificados por mês. Fotografia profissional, avaliação de mercado
                gratuita e um consultor dedicado até a assinatura do contrato.
              </p>
            </div>
            <Link to="/anuncie" className="btn btn--ouro">Solicitar anúncio <IconeSeta /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
