import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useApp } from '../lib/AppContext.jsx';
import { reais } from '../lib/format.js';

const ETAPAS = ['Aeronave', 'Dados técnicos', 'Fotos e documentos', 'Plano e contato'];

const PLANOS = [
  {
    id: 'basico', nome: 'Básico', preco: 0, chamada: 'Grátis por 60 dias',
    itens: ['Anúncio no catálogo', 'Até 8 fotos', 'Contato por formulário', 'Suporte por e-mail'],
  },
  {
    id: 'destaque', nome: 'Destaque', preco: 890, chamada: 'por mês',
    itens: ['Tudo do Básico', 'Posição privilegiada na busca', 'Até 20 fotos + vídeo', 'Selo "Verificado"', 'WhatsApp direto no anúncio'],
    recomendado: true,
  },
  {
    id: 'premium', nome: 'Premium', preco: 2490, chamada: 'por mês',
    itens: ['Tudo do Destaque', 'Vitrine na home', 'Ensaio fotográfico profissional', 'Consultor dedicado', 'Divulgação para a base de compradores', 'Avaliação de mercado por laudo'],
  },
];

const inicial = {
  categoria: 'jato', fabricante: '', modelo: '', ano: '', matricula: '', numeroSerie: '',
  horasTotais: '', horasMotor: '', tipoHorasMotor: 'TSN', horasHelice: '', assentos: '',
  autonomia: '', velocidadeCruzeiro: '', tetoServico: '', motores: '', avionicos: '',
  interior: '', pintura: '', manutencao: '', descricao: '', preco: '', localizacao: '', aeroporto: '',
  plano: 'destaque', contatoNome: '', contatoTipo: 'Proprietário', contatoTelefone: '', contatoEmail: '',
};

export default function Anuncie() {
  const { notificar } = useApp();
  const [etapa, setEtapa] = useState(0);
  const [dados, setDados] = useState(inicial);
  const [arquivos, setArquivos] = useState([]);
  const [enviando, setEnviando] = useState(false);
  const [concluido, setConcluido] = useState(false);
  const [protocolo, setProtocolo] = useState('');
  const [erro, setErro] = useState('');

  const definir = (campo) => (e) => setDados({ ...dados, [campo]: e.target.value });

  function proxima(evento) {
    evento.preventDefault();
    if (etapa < ETAPAS.length - 1) return setEtapa(etapa + 1);
    enviar();
  }

  async function enviar() {
    setErro('');
    setEnviando(true);
    try {
      const r = await api.criarSolicitacao({ ...dados, arquivos });
      setProtocolo(r.protocolo);
      setConcluido(true);
      notificar('Solicitação enviada! Nosso time entra em contato.');
    } catch (e) {
      setErro(e.message);
    } finally {
      setEnviando(false);
    }
  }

  if (concluido) {
    return (
      <div className="container" style={{ padding: '70px 0 90px', maxWidth: 720 }}>
        <div className="painel centro">
          <div className="vantagem__icone" style={{ margin: '0 auto 20px' }}>✓</div>
          <h1 style={{ fontSize: '2rem' }}>Solicitação recebida</h1>
          <p style={{ color: 'var(--cinza-600)', margin: '14px 0 20px' }}>
            Um consultor da FlyTrade vai analisar os dados da sua aeronave e <strong>entrar em contato com você</strong> pelo
            telefone informado em até 24 horas úteis — para confirmar a documentação, combinar as fotos e definir o
            preço de anúncio. A publicação no catálogo acontece depois dessa conversa.
          </p>
          {protocolo && (
            <div className="mensagem-ok" style={{ marginBottom: 26 }}>
              Protocolo da sua solicitação: <strong>{protocolo}</strong>
            </div>
          )}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/catalogo" className="btn btn--navy">Ver catálogo</Link>
            <button className="btn btn--contorno" onClick={() => { setDados(inicial); setArquivos([]); setEtapa(0); setConcluido(false); }}>
              Enviar outra solicitação
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '36px 0 80px' }}>
      <span className="olho">Para vendedores</span>
      <h1 style={{ margin: '14px 0 10px', fontSize: 'clamp(1.9rem, 4vw, 2.8rem)' }}>Anuncie sua aeronave</h1>
      <p className="secao-sub" style={{ marginBottom: 24 }}>
        Preencha as etapas abaixo para enviar sua solicitação. Um consultor entra em contato para validar a
        documentação, combinar as fotos e publicar o anúncio no catálogo.
      </p>
      <div className="passos-fluxo">
        <span><b>1</b> Você envia a solicitação</span>
        <span><b>2</b> A FlyTrade entra em contato</span>
        <span><b>3</b> Publicamos o anúncio</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 36 }}>
        <div className="painel">
          <div className="etapas">
            {ETAPAS.map((nome, i) => (
              <div key={nome} className={`etapa ${i === etapa ? 'ativa' : ''} ${i < etapa ? 'feita' : ''}`}>
                <b>{i < etapa ? '✓' : i + 1}</b> {nome}
              </div>
            ))}
          </div>

          {erro && <div className="mensagem-erro" style={{ marginBottom: 18 }}>{erro}</div>}

          <form onSubmit={proxima}>
            {etapa === 0 && (
              <div className="form-grid">
                <div className="campo">
                  <label>Categoria *</label>
                  <select value={dados.categoria} onChange={definir('categoria')}>
                    <option value="jato">Jato executivo</option>
                    <option value="turboelice">Turboélice</option>
                    <option value="pistao">Pistão</option>
                    <option value="helicoptero">Helicóptero</option>
                    <option value="experimental">Experimental</option>
                  </select>
                </div>
                <div className="campo"><label>Fabricante *</label><input required value={dados.fabricante} onChange={definir('fabricante')} placeholder="Embraer" /></div>
                <div className="campo"><label>Modelo *</label><input required value={dados.modelo} onChange={definir('modelo')} placeholder="Phenom 300E" /></div>
                <div className="campo"><label>Ano *</label><input required type="number" value={dados.ano} onChange={definir('ano')} placeholder="2021" /></div>
                <div className="campo"><label>Matrícula</label><input value={dados.matricula} onChange={definir('matricula')} placeholder="PR-XXX" /></div>
                <div className="campo"><label>Número de série</label><input value={dados.numeroSerie} onChange={definir('numeroSerie')} /></div>
                <div className="campo"><label>Preço pretendido (US$)</label><input type="number" value={dados.preco} onChange={definir('preco')} placeholder="Deixe vazio para 'sob consulta'" /></div>
                <div className="campo"><label>Cidade / UF</label><input value={dados.localizacao} onChange={definir('localizacao')} placeholder="São Paulo, SP" /></div>
                <div className="campo"><label>Aeroporto base</label><input value={dados.aeroporto} onChange={definir('aeroporto')} placeholder="SBMT - Campo de Marte" /></div>
                <div className="campo col-cheia"><label>Descrição do anúncio</label><textarea value={dados.descricao} onChange={definir('descricao')} placeholder="Conte o histórico da aeronave, diferenciais e motivo da venda." /></div>
              </div>
            )}

            {etapa === 1 && (
              <div className="form-grid">
                <div className="campo"><label>Horas totais (TT)</label><input type="number" value={dados.horasTotais} onChange={definir('horasTotais')} /></div>
                <div className="campo"><label>Horas de motor</label><input type="number" value={dados.horasMotor} onChange={definir('horasMotor')} /></div>
                <div className="campo">
                  <label>Referência das horas de motor</label>
                  <select value={dados.tipoHorasMotor} onChange={definir('tipoHorasMotor')}>
                    <option value="TSN">TSN (desde novo)</option>
                    <option value="TSO">TSO (desde overhaul)</option>
                    <option value="SMOH">SMOH</option>
                  </select>
                </div>
                <div className="campo"><label>Horas de hélice</label><input type="number" value={dados.horasHelice} onChange={definir('horasHelice')} /></div>
                <div className="campo"><label>Assentos</label><input type="number" value={dados.assentos} onChange={definir('assentos')} /></div>
                <div className="campo"><label>Autonomia (NM)</label><input type="number" value={dados.autonomia} onChange={definir('autonomia')} /></div>
                <div className="campo"><label>Velocidade de cruzeiro (kt)</label><input type="number" value={dados.velocidadeCruzeiro} onChange={definir('velocidadeCruzeiro')} /></div>
                <div className="campo"><label>Teto de serviço (ft)</label><input type="number" value={dados.tetoServico} onChange={definir('tetoServico')} /></div>
                <div className="campo col-cheia"><label>Motores</label><input value={dados.motores} onChange={definir('motores')} placeholder="2x Pratt & Whitney PW535E1" /></div>
                <div className="campo col-cheia"><label>Aviônicos</label><textarea value={dados.avionicos} onChange={definir('avionicos')} /></div>
                <div className="campo"><label>Interior</label><textarea value={dados.interior} onChange={definir('interior')} /></div>
                <div className="campo"><label>Pintura</label><textarea value={dados.pintura} onChange={definir('pintura')} /></div>
                <div className="campo col-cheia"><label>Histórico de manutenção</label><textarea value={dados.manutencao} onChange={definir('manutencao')} placeholder="Programas de motor, últimas inspeções, danos/reparos." /></div>
              </div>
            )}

            {etapa === 2 && (
              <div style={{ display: 'grid', gap: 18 }}>
                <label className="dropzone" style={{ cursor: 'pointer', display: 'block' }}>
                  <input type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={(e) => setArquivos([...arquivos, ...Array.from(e.target.files).map((f) => f.name)])} />
                  <strong style={{ display: 'block', color: 'var(--navy-800)' }}>Arraste ou selecione as fotos</strong>
                  <span style={{ fontSize: '0.88rem' }}>Externas, cabine, painel e detalhes. JPG ou PNG, mínimo 1600px.</span>
                </label>
                <label className="dropzone" style={{ cursor: 'pointer', display: 'block' }}>
                  <input type="file" multiple style={{ display: 'none' }} onChange={(e) => setArquivos([...arquivos, ...Array.from(e.target.files).map((f) => f.name)])} />
                  <strong style={{ display: 'block', color: 'var(--navy-800)' }}>Documentos</strong>
                  <span style={{ fontSize: '0.88rem' }}>CA, CVA, caderneta de célula/motor/hélice e laudo de inspeção (PDF).</span>
                </label>
                {arquivos.length > 0 && (
                  <div className="mensagem-ok">
                    <strong>{arquivos.length} arquivo(s) selecionado(s):</strong>
                    <p style={{ marginTop: 6, fontSize: '0.88rem' }}>{arquivos.join(', ')}</p>
                  </div>
                )}
                <p style={{ fontSize: '0.86rem', color: 'var(--cinza-600)' }}>
                  No plano Premium nossa equipe vai até o hangar fazer o ensaio fotográfico profissional sem custo adicional.
                </p>
              </div>
            )}

            {etapa === 3 && (
              <>
                <div id="planos" className="planos" style={{ marginBottom: 30 }}>
                  {PLANOS.map((p) => (
                    <label key={p.id} className={`plano ${dados.plano === p.id ? 'ativo' : ''}`}>
                      <input type="radio" name="plano" value={p.id} checked={dados.plano === p.id} onChange={definir('plano')} style={{ display: 'none' }} />
                      {p.recomendado && <span className="selo-plano">Mais escolhido</span>}
                      <strong style={{ fontSize: '1.1rem' }}>{p.nome}</strong>
                      <div className="plano__preco">{p.preco === 0 ? 'Grátis' : reais(p.preco)}</div>
                      <span style={{ fontSize: '0.84rem', color: 'var(--cinza-600)' }}>{p.chamada}</span>
                      <ul>{p.itens.map((i) => <li key={i}>{i}</li>)}</ul>
                    </label>
                  ))}
                </div>
                <div className="form-grid">
                  <div className="campo"><label>Seu nome *</label><input required value={dados.contatoNome} onChange={definir('contatoNome')} /></div>
                  <div className="campo">
                    <label>Você é</label>
                    <select value={dados.contatoTipo} onChange={definir('contatoTipo')}>
                      <option>Proprietário</option><option>Broker</option><option>Revenda</option>
                    </select>
                  </div>
                  <div className="campo"><label>WhatsApp *</label><input required value={dados.contatoTelefone} onChange={definir('contatoTelefone')} placeholder="5511999990000" /></div>
                  <div className="campo"><label>E-mail</label><input type="email" value={dados.contatoEmail} onChange={definir('contatoEmail')} /></div>
                </div>
              </>
            )}

            <div style={{ display: 'flex', gap: 12, marginTop: 28, flexWrap: 'wrap' }}>
              {etapa > 0 && <button type="button" className="btn btn--contorno" onClick={() => setEtapa(etapa - 1)}>Voltar</button>}
              <button className="btn btn--ouro" disabled={enviando} style={{ marginLeft: 'auto' }}>
                {etapa === ETAPAS.length - 1 ? (enviando ? 'Enviando...' : 'Enviar solicitação') : 'Continuar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
