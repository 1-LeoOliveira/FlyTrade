import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../lib/api.js';
import { galeria } from '../lib/fotos.js';
import { CATEGORIA_NOME, moeda, numero, titulo, whatsappLink } from '../lib/format.js';
import { useApp } from '../lib/AppContext.jsx';
import CardAeronave from '../components/CardAeronave.jsx';
import FormularioLead from '../components/FormularioLead.jsx';
import Simulador from '../components/Simulador.jsx';
import { IconeComparar, IconeCoracao, IconeLocal, IconeZap } from '../components/Icones.jsx';

export default function Aeronave() {
  const { id } = useParams();
  const { favoritos, alternarFavorito, comparar, alternarComparar } = useApp();
  const [dados, setDados] = useState(null);
  const [erro, setErro] = useState('');
  const [foto, setFoto] = useState(0);
  const [aba, setAba] = useState('interesse');
  const painelRef = useRef(null);

  useEffect(() => {
    setDados(null);
    setFoto(0);
    api.aeronave(id).then(setDados).catch((e) => setErro(e.message));
  }, [id]);

  function irPara(novaAba) {
    setAba(novaAba);
    painelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  if (erro) {
    return (
      <div className="container" style={{ padding: '80px 0' }}>
        <h1>Aeronave não encontrada</h1>
        <p className="secao-sub">Este anúncio pode ter sido vendido ou removido.</p>
        <Link to="/catalogo" className="btn btn--navy" style={{ marginTop: 24 }}>Ver catálogo</Link>
      </div>
    );
  }

  if (!dados) {
    return (
      <div className="container" style={{ padding: '40px 0 80px' }}>
        <div className="esqueleto" style={{ height: 480 }} />
      </div>
    );
  }

  const { aeronave: a, similares } = dados;
  const fotos = galeria(a);
  const favorito = favoritos.includes(a.id);
  const comparando = comparar.includes(a.id);
  const mensagemZap = `Olá! Tenho interesse no ${titulo(a)} ${a.ano} (${a.matricula}) anunciado no FlyTrade.`;

  const ficha = [
    ['Fabricante', a.fabricante],
    ['Modelo', a.modelo],
    ['Ano de fabricação', a.ano],
    ['Categoria', CATEGORIA_NOME[a.categoria]],
    ['Matrícula', a.matricula],
    ['Número de série', a.numeroSerie],
    ['Horas totais (TT)', `${numero(a.horasTotais)} h`],
    [`Horas de motor (${a.tipoHorasMotor})`, `${numero(a.horasMotor)} h`],
    ['Horas de hélice', a.horasHelice ? `${numero(a.horasHelice)} h` : 'Não aplicável'],
    ['Motores', a.motores],
    ['Assentos', `${a.assentos} lugares`],
    ['Autonomia', `${numero(a.autonomia)} NM`],
    ['Velocidade de cruzeiro', `${numero(a.velocidadeCruzeiro)} kt`],
    ['Teto de serviço', `${numero(a.tetoServico)} ft`],
    ['Pista mínima', a.pistaMinima ? `${numero(a.pistaMinima)} m` : 'Não aplicável'],
    ['Localização', `${a.localizacao} · ${a.aeroporto}`],
  ];

  return (
    <div className="container" style={{ paddingBottom: 80 }}>
      <nav className="trilha">
        <Link to="/">Início</Link> › <Link to="/catalogo">Catálogo</Link> ›{' '}
        <Link to={`/catalogo?categoria=${a.categoria}`}>{CATEGORIA_NOME[a.categoria]}</Link> ›{' '}
        <span>{titulo(a)}</span>
      </nav>

      <div className="aeronave">
        <div>
          <div className="galeria__principal">
            <img src={fotos[foto]} alt={`${titulo(a)} — foto ${foto + 1}`} />
            <div className="card__tags" style={{ top: 18, left: 18 }}>
              <span className="tag">{CATEGORIA_NOME[a.categoria]}</span>
              {a.destaque && <span className="tag tag--ouro">Destaque</span>}
            </div>
            {fotos.length > 1 && (
              <>
                <button
                  className="galeria__seta galeria__seta--esq"
                  onClick={() => setFoto((f) => (f - 1 + fotos.length) % fotos.length)}
                  aria-label="Foto anterior"
                >
                  ‹
                </button>
                <button
                  className="galeria__seta galeria__seta--dir"
                  onClick={() => setFoto((f) => (f + 1) % fotos.length)}
                  aria-label="Próxima foto"
                >
                  ›
                </button>
                <span className="galeria__contador">{foto + 1} / {fotos.length}</span>
              </>
            )}
          </div>
          <div className="galeria__miniaturas">
            {fotos.map((src, i) => (
              <button key={src} className={foto === i ? 'ativa' : ''} onClick={() => setFoto(i)} title={`Foto ${i + 1}`}>
                <img src={src} alt={`${titulo(a)} — miniatura ${i + 1}`} loading="lazy" />
              </button>
            ))}
          </div>

          <h1 style={{ fontSize: 'clamp(1.8rem, 3.6vw, 2.5rem)', margin: '34px 0 10px' }}>
            {titulo(a)} <span style={{ color: 'var(--cinza-400)' }}>{a.ano}</span>
          </h1>
          <div className="card__local" style={{ fontSize: '0.95rem' }}>
            <IconeLocal /> {a.localizacao} · {a.aeroporto} · Matrícula {a.matricula}
          </div>
          <p style={{ color: 'var(--cinza-600)', margin: '20px 0 32px', fontSize: '1.02rem' }}>{a.descricao}</p>

          <h2 style={{ fontSize: '1.3rem', marginBottom: 16 }}>Ficha técnica</h2>
          <div className="ficha">
            {ficha.map(([rotulo, valor]) => (
              <div key={rotulo}><span>{rotulo}</span><strong>{valor}</strong></div>
            ))}
          </div>

          <h2 style={{ fontSize: '1.3rem', margin: '36px 0 16px' }}>Equipamentos e estado</h2>
          <div className="blocos-texto">
            <div className="bloco-texto"><strong>Aviônicos</strong><p>{a.avionicos}</p></div>
            <div className="bloco-texto"><strong>Interior</strong><p>{a.interior}</p></div>
            <div className="bloco-texto"><strong>Pintura</strong><p>{a.pintura}</p></div>
            <div className="bloco-texto"><strong>Histórico de manutenção</strong><p>{a.manutencao}</p></div>
          </div>
        </div>

        <aside>
          <div className="painel-compra">
            <span className="olho">{a.preco == null ? 'Valor' : 'Preço à vista'}</span>
            <div className={a.preco == null ? 'preco preco--consulta' : 'preco'} style={{ marginTop: 10 }}>
              {moeda(a.preco)}
            </div>
            {a.preco != null && (
              <p style={{ color: 'var(--cinza-600)', fontSize: '0.86rem', marginTop: 6 }}>
                ou entrada de 20% + parcelas — simule abaixo
              </p>
            )}

            <div className="painel-compra__acoes">
              <button className="btn btn--ouro btn--bloco" onClick={() => irPara('interesse')}>Tenho interesse</button>
              <button className="btn btn--navy btn--bloco" onClick={() => irPara('visita')}>Agendar visita / inspeção</button>
              <button className="btn btn--contorno btn--bloco" onClick={() => irPara('financiamento')}>Simular financiamento</button>
              <a className="btn btn--zap btn--bloco" href={whatsappLink(a.vendedor.telefone, mensagemZap)} target="_blank" rel="noreferrer">
                <IconeZap width="18" height="18" /> WhatsApp
              </a>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
              <button className="btn btn--contorno" style={{ flex: 1 }} onClick={() => alternarFavorito(a.id)}>
                <IconeCoracao preenchido={favorito} width="17" height="17" /> {favorito ? 'Salvo' : 'Favoritar'}
              </button>
              <button className="btn btn--contorno" style={{ flex: 1 }} onClick={() => alternarComparar(a.id)}>
                <IconeComparar /> {comparando ? 'Comparando' : 'Comparar'}
              </button>
            </div>

            <div className="vendedor">
              <strong style={{ color: 'var(--texto)', display: 'block', marginBottom: 4 }}>{a.vendedor.nome}</strong>
              {a.vendedor.tipo} · Anunciante verificado pela FlyTrade
              <br />
              Anúncio publicado em {new Date(a.criadoEm).toLocaleDateString('pt-BR')}
            </div>
          </div>
        </aside>
      </div>

      <div ref={painelRef} style={{ scrollMarginTop: 100 }}>
        <div className="abas">
          <button className={aba === 'interesse' ? 'ativa' : ''} onClick={() => setAba('interesse')}>Tenho interesse</button>
          <button className={aba === 'visita' ? 'ativa' : ''} onClick={() => setAba('visita')}>Agendar visita / inspeção</button>
          <button className={aba === 'proposta' ? 'ativa' : ''} onClick={() => setAba('proposta')}>Enviar proposta</button>
          <button className={aba === 'financiamento' ? 'ativa' : ''} onClick={() => setAba('financiamento')}>Simular financiamento</button>
        </div>

        <div className="painel" style={{ maxWidth: 760 }}>
          {aba === 'financiamento'
            ? <Simulador valorInicial={a.preco ?? 5000000} />
            : <FormularioLead key={aba} tipo={aba} aeronave={a} />}
        </div>
      </div>

      {similares.length > 0 && (
        <section style={{ marginTop: 70 }}>
          <div className="cabecalho-secao">
            <div>
              <span className="olho">Também pode gostar</span>
              <h2 style={{ marginTop: 14, fontSize: '1.9rem' }}>Aeronaves semelhantes</h2>
            </div>
          </div>
          <div className="grade">
            {similares.map((s) => <CardAeronave key={s.id} aeronave={s} />)}
          </div>
        </section>
      )}
    </div>
  );
}
