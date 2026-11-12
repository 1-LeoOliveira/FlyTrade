import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IconeSeta } from '../components/Icones.jsx';

function CreditosFotos() {
  const [creditos, setCreditos] = useState([]);
  const [aberto, setAberto] = useState(false);

  useEffect(() => {
    fetch('/aeronaves/creditos.json')
      .then((r) => (r.ok ? r.json() : []))
      .then(setCreditos)
      .catch(() => {});
  }, []);

  if (creditos.length === 0) return null;

  return (
    <div style={{ marginTop: 40, fontSize: '0.84rem', color: 'var(--cinza-600)' }}>
      <button className="limpar" onClick={() => setAberto((v) => !v)}>
        {aberto ? 'Ocultar' : 'Ver'} créditos das fotos das aeronaves ({creditos.length})
      </button>
      {aberto && (
        <ul style={{ listStyle: 'none', padding: 0, margin: '16px 0 0', display: 'grid', gap: 6, maxHeight: 320, overflow: 'auto' }}>
          {creditos.map((c) => (
            <li key={c.arquivo}>
              <a href={c.pagina} target="_blank" rel="noreferrer" style={{ color: 'var(--azul)' }}>
                {c.titulo.replace(/^File:/, '')}
              </a>{' '}
              — {c.autor || 'autor não informado'} · {c.licenca} · via Wikimedia Commons
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const NUMEROS = [
  ['US$ 240 mi', 'em aeronaves negociadas'],
  ['38 dias', 'tempo médio de venda'],
  ['+480', 'aeronaves vendidas'],
  ['22', 'estados atendidos'],
];

const TIME = [
  ['Rafael Lima', 'CEO e fundador', 'Piloto de linha aérea e 18 anos no mercado de aeronaves usadas.'],
  ['Juliana Prado', 'Diretora técnica', 'Engenheira aeronáutica, responsável pela curadoria e pelas inspeções.'],
  ['Marcos Vilela', 'Diretor jurídico', 'Especialista em direito aeronáutico e registros no RAB.'],
  ['Ana Beatriz Rocha', 'Mesa de crédito', 'Estrutura financiamentos e leasing para aviação executiva.'],
];

export default function Sobre() {
  return (
    <>
      <section className="secao secao--navy" style={{ paddingTop: 70 }}>
        <div className="container">
          <span className="olho">Sobre nós</span>
          <h1 style={{ margin: '16px 0 14px', color: '#fff' }}>A concessionária aérea que faltava no Brasil</h1>
          <p className="secao-sub" style={{ fontSize: '1.1rem' }}>
            Nascemos da inquietação de pilotos e engenheiros cansados de negociações opacas: anúncios sem ficha
            técnica, histórico duvidoso e documentação de última hora. Criamos o padrão que gostaríamos de encontrar.
          </p>
          <div className="hero__metricas" style={{ marginTop: 44 }}>
            {NUMEROS.map(([valor, rotulo]) => (
              <div key={rotulo}><strong>{valor}</strong><span>{rotulo}</span></div>
            ))}
          </div>
        </div>
      </section>

      <section className="secao">
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 40 }}>
          <div>
            <span className="olho">Nosso jeito</span>
            <h2 style={{ margin: '14px 0 16px' }}>Transparência técnica em cada negócio</h2>
            <p style={{ color: 'var(--cinza-600)' }}>
              Toda aeronave anunciada passa por checagem de matrícula no RAB, conferência das cadernetas e validação
              do vendedor. Quando há pendência, ela aparece no anúncio — porque comprador bem informado fecha negócio
              mais rápido, e vendedor sério não tem nada a esconder.
            </p>
            <p style={{ color: 'var(--cinza-600)', marginTop: 16 }}>
              Do outro lado, oferecemos ao vendedor avaliação de mercado honesta, fotografia profissional e uma base
              de compradores qualificados que já demonstraram capacidade de compra.
            </p>
          </div>
          <div className="vantagens" style={{ gridTemplateColumns: '1fr' }}>
            <div className="vantagem"><h3>Missão</h3><p>Tornar a compra e a venda de aeronaves tão segura e previsível quanto a de um imóvel bem assessorado.</p></div>
            <div className="vantagem"><h3>Valores</h3><p>Rigor técnico, transparência de informação, sigilo nas negociações e respeito ao tempo do cliente.</p></div>
          </div>
        </div>
      </section>

      <section className="secao secao--cinza">
        <div className="container">
          <div className="cabecalho-secao">
            <div><span className="olho">Time</span><h2 style={{ marginTop: 14 }}>Quem conduz a sua negociação</h2></div>
          </div>
          <div className="vantagens">
            {TIME.map(([nome, cargo, bio]) => (
              <div className="vantagem" key={nome}>
                <div className="avatar" style={{ width: 56, height: 56, marginBottom: 16 }}>
                  {nome.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                </div>
                <h3>{nome}</h3>
                <strong style={{ display: 'block', color: 'var(--azul)', fontSize: '0.86rem', margin: '4px 0 8px' }}>{cargo}</strong>
                <p>{bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="secao">
        <div className="container">
          <div className="cta">
            <div>
              <h2 style={{ color: '#fff' }}>Vamos voar juntos?</h2>
              <p>Comprar, vender ou apenas entender o valor da sua aeronave — comece por uma conversa.</p>
            </div>
            <Link to="/contato" className="btn btn--ouro">Falar com a FlyTrade <IconeSeta /></Link>
          </div>
          <CreditosFotos />
        </div>
      </section>
    </>
  );
}
