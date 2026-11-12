import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useApp } from '../lib/AppContext.jsx';
import { CATEGORIA_NOME, moeda, numero, whatsappLink } from '../lib/format.js';
import { IconeZap } from '../components/Icones.jsx';

const STATUS = {
  nova: { classe: 'tag--ouro', rotulo: 'Nova' },
  em_contato: { classe: 'tag', rotulo: 'Em contato' },
  publicada: { classe: 'tag--verde', rotulo: 'Publicada' },
  recusada: { classe: 'tag--cinza', rotulo: 'Recusada' },
};

function Solicitacao({ s, aoMudar }) {
  const [aberta, setAberta] = useState(s.status === 'nova');
  const [observacao, setObservacao] = useState('');
  const a = s.aeronave;
  const st = STATUS[s.status] || STATUS.nova;
  const msg = `Olá ${s.contato.nome.split(' ')[0]}, aqui é da FlyTrade. Recebemos sua solicitação (${s.protocolo}) para anunciar o ${a.fabricante} ${a.modelo} ${a.ano}. Podemos conversar?`;

  return (
    <article className="solicitacao">
      <header className="solicitacao__topo" onClick={() => setAberta((v) => !v)}>
        <div>
          <span className={`tag ${st.classe}`}>{st.rotulo}</span>
          <strong style={{ display: 'block', margin: '10px 0 4px', fontSize: '1.05rem' }}>
            {a.fabricante} {a.modelo} <span style={{ color: 'var(--cinza-400)' }}>{a.ano}</span>
          </strong>
          <span style={{ color: 'var(--cinza-600)', fontSize: '0.86rem' }}>
            {s.protocolo} · {s.contato.nome} ({s.contato.tipo}) · {new Date(s.criadoEm).toLocaleString('pt-BR')}
          </span>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="preco" style={{ fontSize: '1.1rem' }}>{moeda(a.preco)}</div>
          <span style={{ color: 'var(--cinza-400)', fontSize: '0.8rem' }}>{aberta ? 'ocultar' : 'ver detalhes'}</span>
        </div>
      </header>

      {aberta && (
        <div className="solicitacao__corpo">
          <div className="ficha">
            <div><span>Categoria</span><strong>{CATEGORIA_NOME[a.categoria] || a.categoria}</strong></div>
            <div><span>Matrícula</span><strong>{a.matricula}</strong></div>
            <div><span>Nº de série</span><strong>{a.numeroSerie}</strong></div>
            <div><span>Horas totais</span><strong>{numero(a.horasTotais)} h</strong></div>
            <div><span>Horas de motor</span><strong>{numero(a.horasMotor)} h {a.tipoHorasMotor}</strong></div>
            <div><span>Assentos</span><strong>{a.assentos}</strong></div>
            <div><span>Localização</span><strong>{a.localizacao}</strong></div>
            <div><span>Plano pretendido</span><strong style={{ textTransform: 'capitalize' }}>{s.plano}</strong></div>
          </div>

          {a.descricao && <div className="bloco-texto" style={{ marginTop: 16 }}><strong>Descrição do vendedor</strong><p>{a.descricao}</p></div>}
          {a.manutencao && a.manutencao !== '—' && <div className="bloco-texto" style={{ marginTop: 10 }}><strong>Manutenção</strong><p>{a.manutencao}</p></div>}
          {s.arquivos?.length > 0 && (
            <div className="bloco-texto" style={{ marginTop: 10 }}>
              <strong>Arquivos enviados ({s.arquivos.length})</strong>
              <p>{s.arquivos.join(', ')}</p>
            </div>
          )}

          <div className="solicitacao__contato">
            <div>
              <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--cinza-400)', fontWeight: 700 }}>
                Contato do vendedor
              </span>
              <strong style={{ display: 'block', margin: '4px 0' }}>{s.contato.telefone}</strong>
              {s.contato.email && <a href={`mailto:${s.contato.email}`} className="limpar">{s.contato.email}</a>}
            </div>
            <a className="btn btn--zap" href={whatsappLink(s.contato.telefone.replace(/\D/g, ''), msg)} target="_blank" rel="noreferrer">
              <IconeZap width="18" height="18" /> Chamar no WhatsApp
            </a>
          </div>

          {s.observacoes?.length > 0 && (
            <ul className="solicitacao__historico">
              {s.observacoes.map((o, i) => (
                <li key={i}><b>{new Date(o.em).toLocaleString('pt-BR')}</b> — {o.texto} <i>({o.por})</i></li>
              ))}
            </ul>
          )}

          <div className="campo" style={{ marginTop: 16 }}>
            <label>Registrar observação (opcional)</label>
            <input value={observacao} onChange={(e) => setObservacao(e.target.value)} placeholder="Ex.: falei com o proprietário, aguardando as cadernetas." />
          </div>

          <div className="solicitacao__acoes">
            {s.status === 'nova' && (
              <button className="btn btn--navy" onClick={() => aoMudar(s.id, 'status', 'em_contato', observacao)}>
                Marcar como "em contato"
              </button>
            )}
            {s.status !== 'publicada' && (
              <button className="btn btn--ouro" onClick={() => aoMudar(s.id, 'publicar')}>
                Publicar no catálogo
              </button>
            )}
            {s.anuncioId && <Link to={`/aeronave/${s.anuncioId}`} className="btn btn--contorno">Ver anúncio publicado</Link>}
            {s.status !== 'recusada' && s.status !== 'publicada' && (
              <button className="btn btn--contorno" onClick={() => aoMudar(s.id, 'status', 'recusada', observacao)}>
                Recusar
              </button>
            )}
            {observacao && (
              <button className="btn btn--contorno" onClick={() => aoMudar(s.id, 'status', s.status, observacao)}>
                Salvar só a observação
              </button>
            )}
          </div>
        </div>
      )}
    </article>
  );
}

export default function Admin() {
  const { usuario, notificar } = useApp();
  const [resumo, setResumo] = useState(null);
  const [aba, setAba] = useState('solicitacoes');
  const [filtro, setFiltro] = useState('todas');
  const [erro, setErro] = useState('');

  const carregar = useCallback(() => {
    api.adminResumo().then(setResumo).catch((e) => setErro(e.message));
  }, []);

  useEffect(() => {
    if (usuario?.papel === 'admin') carregar();
  }, [usuario, carregar]);

  async function aoMudar(id, acao, status, observacao) {
    try {
      if (acao === 'publicar') {
        await api.publicarSolicitacao(id);
        notificar('Aeronave publicada no catálogo.');
      } else {
        await api.mudarStatus(id, status, observacao);
        notificar('Solicitação atualizada.');
      }
      carregar();
    } catch (e) {
      notificar(e.message, 'erro');
    }
  }

  if (usuario?.papel !== 'admin') {
    return (
      <div className="container" style={{ padding: '80px 0', maxWidth: 560 }}>
        <span className="olho">Restrito</span>
        <h1 style={{ margin: '14px 0 12px', fontSize: '2rem' }}>Painel administrativo</h1>
        <p style={{ color: 'var(--cinza-600)', marginBottom: 24 }}>
          Área exclusiva da equipe FlyTrade: aqui chegam as solicitações de anúncio dos vendedores para que o time
          entre em contato, valide a documentação e publique a aeronave no catálogo.
        </p>
        {erro && <div className="mensagem-erro" style={{ marginBottom: 20 }}>{erro}</div>}
        <div className="mensagem-ok" style={{ marginBottom: 24 }}>
          Conta de demonstração: <strong>admin@flytrade.com.br</strong> · senha <code>flytrade</code>
        </div>
        <Link to="/conta?aba=entrar" className="btn btn--navy">Entrar como administrador</Link>
      </div>
    );
  }

  const solicitacoes = resumo?.solicitacoes || [];
  const lista = filtro === 'todas' ? solicitacoes : solicitacoes.filter((s) => s.status === filtro);

  return (
    <div className="container" style={{ padding: '36px 0 80px' }}>
      <span className="olho">Administração</span>
      <h1 style={{ margin: '14px 0 26px', fontSize: 'clamp(1.8rem, 3.6vw, 2.5rem)' }}>Painel FlyTrade</h1>

      <div className="kpis">
        <div className="kpi"><strong>{resumo?.novas ?? 0}</strong><span>Solicitações novas</span></div>
        <div className="kpi"><strong>{resumo?.emContato ?? 0}</strong><span>Em contato</span></div>
        <div className="kpi"><strong>{resumo?.publicadas ?? 0}</strong><span>Anúncios publicados</span></div>
        <div className="kpi"><strong>{resumo?.leads?.length ?? 0}</strong><span>Leads de compradores</span></div>
      </div>

      <div className="abas-conta">
        <button className={aba === 'solicitacoes' ? 'ativa' : ''} onClick={() => setAba('solicitacoes')}>
          Solicitações de anúncio ({solicitacoes.length})
        </button>
        <button className={aba === 'leads' ? 'ativa' : ''} onClick={() => setAba('leads')}>
          Leads de compradores ({resumo?.leads?.length ?? 0})
        </button>
        <button className={aba === 'catalogo' ? 'ativa' : ''} onClick={() => setAba('catalogo')}>Catálogo publicado</button>
      </div>

      {aba === 'solicitacoes' && (
        <>
          <div className="barra-resultados">
            <strong>{lista.length} solicitação(ões)</strong>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.88rem' }}>
              Status
              <select value={filtro} onChange={(e) => setFiltro(e.target.value)}>
                <option value="todas">Todas</option>
                <option value="nova">Novas</option>
                <option value="em_contato">Em contato</option>
                <option value="publicada">Publicadas</option>
                <option value="recusada">Recusadas</option>
              </select>
            </label>
          </div>
          {lista.length === 0 ? (
            <div className="vazio">
              <h3>Nenhuma solicitação por aqui</h3>
              <p style={{ color: 'var(--cinza-600)', marginTop: 10 }}>
                As solicitações enviadas pela página “Anuncie sua aeronave” aparecem aqui para o time entrar em contato.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 16 }}>
              {lista.map((s) => <Solicitacao key={s.id} s={s} aoMudar={aoMudar} />)}
            </div>
          )}
        </>
      )}

      {aba === 'leads' && (
        (resumo?.leads || []).length === 0 ? (
          <div className="vazio"><h3>Nenhum lead recebido ainda</h3></div>
        ) : (
          <table className="tabela">
            <thead><tr><th>Data</th><th>Tipo</th><th>Aeronave</th><th>Vendedor</th><th>Contato</th><th>Mensagem</th></tr></thead>
            <tbody>
              {resumo.leads.map((l) => (
                <tr key={l.id}>
                  <td>{new Date(l.criadoEm).toLocaleString('pt-BR')}</td>
                  <td><span className="tag tag--cinza">{l.tipo}</span></td>
                  <td>{l.aeronaveNome || '—'}</td>
                  <td>{l.vendedor}</td>
                  <td>{l.nome}<br /><span style={{ color: 'var(--cinza-600)', fontSize: '0.84rem' }}>{l.email} · {l.telefone}</span></td>
                  <td style={{ maxWidth: 300 }}>{l.mensagem}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}

      {aba === 'catalogo' && (
        <table className="tabela">
          <thead><tr><th>Aeronave</th><th>Vendedor</th><th>Preço</th><th>Fotos</th><th /></tr></thead>
          <tbody>
            {(resumo?.anuncios || []).filter((a) => a.status === 'aprovado').map((a) => (
              <tr key={a.id}>
                <td>
                  <strong>{a.fabricante} {a.modelo}</strong><br />
                  <span style={{ color: 'var(--cinza-600)', fontSize: '0.84rem' }}>{a.ano} · {a.matricula} · {a.localizacao}</span>
                </td>
                <td>{a.vendedor?.nome}<br /><span style={{ color: 'var(--cinza-600)', fontSize: '0.84rem' }}>{a.vendedor?.tipo}</span></td>
                <td>{moeda(a.preco)}</td>
                <td>{a.fotos?.length ? `${a.fotos.length} foto(s)` : <span className="tag tag--ouro">sem fotos</span>}</td>
                <td><Link to={`/aeronave/${a.id}`} className="limpar">Ver</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
