import { Link } from 'react-router-dom';
import { IconeChave, IconeDocumento, IconeEscudo, IconeHelice, IconeLupa, IconeMoeda, IconeSeta } from '../components/Icones.jsx';
import Simulador from '../components/Simulador.jsx';

const SERVICOS = [
  { id: 'inspecao', icone: <IconeLupa />, titulo: 'Inspeção pré-compra', texto: 'Pre-buy inspection em oficina homologada ANAC, com laudo independente de célula, motor, hélice, aviônicos e revisão das cadernetas. Você recebe um relatório fotográfico e a estimativa de custos de regularização antes de assinar qualquer contrato.' },
  { id: 'documentacao', icone: <IconeDocumento />, titulo: 'Documentação e transferência ANAC', texto: 'Conduzimos a transferência de propriedade no RAB, emissão e revalidação de CA e CVA, baixa de gravames, contratos de compra e venda e registro de alienação fiduciária quando há financiamento.' },
  { id: 'financiamento', icone: <IconeMoeda />, titulo: 'Financiamento', texto: 'Cartas de crédito com bancos e fundos especializados em aviação: até 80% do valor, prazos de 24 a 180 meses, leasing e operações em dólar para aeronaves importadas.' },
  { id: 'seguro', icone: <IconeEscudo />, titulo: 'Seguro aeronáutico', texto: 'Cotação com as principais seguradoras do mercado para casco, RETA e responsabilidade civil, com cobertura ajustada ao perfil do piloto e ao tipo de operação.' },
  { id: 'ferry', icone: <IconeHelice />, titulo: 'Translado (ferry flight)', texto: 'Tripulação habilitada no tipo, plano de voo, autorizações de sobrevoo e seguro específico para levar a aeronave do hangar do vendedor até a sua base — inclusive internacional.' },
  { id: 'consultoria', icone: <IconeChave />, titulo: 'Consultoria e avaliação', texto: 'Avaliação de mercado com laudo, escolha do modelo ideal para a sua missão, estruturação de propriedade compartilhada e análise de custo por hora voada.' },
];

export default function Servicos() {
  return (
    <>
      <section className="secao secao--navy" style={{ paddingTop: 70 }}>
        <div className="container">
          <span className="olho">Serviços</span>
          <h1 style={{ margin: '16px 0 14px', color: '#fff' }}>Muito além do anúncio</h1>
          <p className="secao-sub" style={{ fontSize: '1.1rem' }}>
            A FlyTrade acompanha a negociação do primeiro contato até a chave na sua mão — com time técnico,
            jurídico e financeiro especializado em aviação.
          </p>
        </div>
      </section>

      <section className="secao">
        <div className="container">
          <div className="vantagens">
            {SERVICOS.map((s) => (
              <div className="vantagem" key={s.id} id={s.id} style={{ scrollMarginTop: 100 }}>
                <div className="vantagem__icone">{s.icone}</div>
                <h3>{s.titulo}</h3>
                <p>{s.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="secao secao--cinza">
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 40, alignItems: 'start' }}>
          <div>
            <span className="olho">Financiamento</span>
            <h2 style={{ margin: '14px 0 14px' }}>Simule a sua aeronave</h2>
            <p style={{ color: 'var(--cinza-600)' }}>
              Ajuste valor, entrada, prazo e taxa para ver a parcela estimada. Em seguida nossa mesa de crédito
              busca as melhores condições com bancos parceiros — sem custo e sem compromisso.
            </p>
            <Link to="/contato" className="btn btn--navy" style={{ marginTop: 24 }}>
              Falar com a mesa de crédito <IconeSeta />
            </Link>
          </div>
          <Simulador valorInicial={8000000} />
        </div>
      </section>

      <section className="secao">
        <div className="container">
          <div className="cta">
            <div>
              <span className="olho">Pronto para começar?</span>
              <h2 style={{ marginTop: 14, color: '#fff' }}>Converse com um consultor FlyTrade</h2>
              <p>Atendimento de segunda a sábado, das 8h às 20h.</p>
            </div>
            <Link to="/contato" className="btn btn--ouro">Fale conosco <IconeSeta /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
