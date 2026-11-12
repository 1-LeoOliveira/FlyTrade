import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useApp } from '../lib/AppContext.jsx';
import CardAeronave from '../components/CardAeronave.jsx';
import { moeda } from '../lib/format.js';

function Autenticacao() {
  const { entrar } = useApp();
  const [modo, setModo] = useState('login');
  const [dados, setDados] = useState({ nome: '', email: '', senha: '', telefone: '' });
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function enviar(e) {
    e.preventDefault();
    setErro('');
    setCarregando(true);
    try {
      await entrar(dados, modo);
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="container" style={{ padding: '46px 0 90px', maxWidth: 520 }}>
      <span className="olho">Área do usuário</span>
      <h1 style={{ margin: '14px 0 10px', fontSize: '2rem' }}>{modo === 'login' ? 'Entrar na sua conta' : 'Criar conta'}</h1>
      <p className="secao-sub" style={{ marginBottom: 28 }}>
        Acompanhe favoritos, anúncios, mensagens e propostas em um só lugar.
      </p>

      <div className="painel">
        {erro && <div className="mensagem-erro" style={{ marginBottom: 16 }}>{erro}</div>}
        <form onSubmit={enviar} style={{ display: 'grid', gap: 16 }}>
          {modo === 'cadastro' && (
            <>
              <div className="campo"><label>Nome completo *</label><input required value={dados.nome} onChange={(e) => setDados({ ...dados, nome: e.target.value })} /></div>
              <div className="campo"><label>Telefone</label><input value={dados.telefone} onChange={(e) => setDados({ ...dados, telefone: e.target.value })} /></div>
            </>
          )}
          <div className="campo"><label>E-mail *</label><input type="email" required value={dados.email} onChange={(e) => setDados({ ...dados, email: e.target.value })} /></div>
          <div className="campo"><label>Senha *</label><input type="password" required value={dados.senha} onChange={(e) => setDados({ ...dados, senha: e.target.value })} /></div>
          <button className="btn btn--ouro btn--bloco" disabled={carregando}>
            {carregando ? 'Aguarde...' : modo === 'login' ? 'Entrar' : 'Criar conta'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 18, fontSize: '0.9rem', color: 'var(--cinza-600)' }}>
          {modo === 'login' ? 'Ainda não tem conta?' : 'Já tem conta?'}{' '}
          <button className="limpar" onClick={() => setModo(modo === 'login' ? 'cadastro' : 'login')}>
            {modo === 'login' ? 'Cadastre-se' : 'Entrar'}
          </button>
        </p>

        <div className="mensagem-ok" style={{ marginTop: 22, fontSize: '0.86rem' }}>
          <strong>Contas de demonstração</strong>
          <p style={{ marginTop: 6 }}>
            Cliente: cliente@flytrade.com.br · senha <code>flytrade</code><br />
            Admin: admin@flytrade.com.br · senha <code>flytrade</code>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Conta() {
  const { usuario, favoritos, sair } = useApp();
  const [params, setParams] = useSearchParams();
  const aba = params.get('aba') || 'favoritos';
  const [itens, setItens] = useState([]);
  const [leads, setLeads] = useState([]);
  const [anuncios, setAnuncios] = useState([]);

  useEffect(() => {
    if (favoritos.length === 0) return setItens([]);
    Promise.all(favoritos.map((id) => api.aeronave(id).then((d) => d.aeronave).catch(() => null)))
      .then((lista) => setItens(lista.filter(Boolean)));
  }, [favoritos]);

  useEffect(() => {
    if (!usuario) return;
    api.leads().then(setLeads).catch(() => {});
    api.aeronaves({}).then((r) => setAnuncios(r.itens.filter((a) => a.vendedor?.nome === usuario.nome))).catch(() => {});
  }, [usuario]);

  if (!usuario && aba !== 'favoritos') return <Autenticacao />;

  return (
    <div className="container" style={{ padding: '36px 0 80px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 20, flexWrap: 'wrap', marginBottom: 30 }}>
        <div>
          <span className="olho">Área do usuário</span>
          <h1 style={{ margin: '14px 0 6px', fontSize: 'clamp(1.8rem, 3.6vw, 2.5rem)' }}>
            {usuario ? `Olá, ${usuario.nome.split(' ')[0]}` : 'Meus favoritos'}
          </h1>
          {usuario && <p style={{ color: 'var(--cinza-600)' }}>{usuario.email}</p>}
        </div>
        {usuario ? (
          <div style={{ display: 'flex', gap: 10 }}>
            {usuario.papel === 'admin' && <Link to="/admin" className="btn btn--navy">Painel administrativo</Link>}
            <button className="btn btn--contorno" onClick={sair}>Sair</button>
          </div>
        ) : (
          <Link to="/conta?aba=entrar" className="btn btn--navy">Entrar ou cadastrar</Link>
        )}
      </div>

      <div className="abas-conta">
        {[
          ['favoritos', `Favoritos (${favoritos.length})`],
          ['anuncios', 'Meus anúncios'],
          ['mensagens', 'Mensagens e propostas'],
        ].map(([id, rotulo]) => (
          <button key={id} className={aba === id ? 'ativa' : ''} onClick={() => setParams({ aba: id })}>{rotulo}</button>
        ))}
      </div>

      {aba === 'favoritos' && (
        itens.length === 0 ? (
          <div className="vazio">
            <h3>Nenhuma aeronave favoritada</h3>
            <p style={{ color: 'var(--cinza-600)', margin: '10px 0 20px' }}>Toque no coração dos anúncios para salvá-los aqui.</p>
            <Link to="/catalogo" className="btn btn--navy">Ver catálogo</Link>
          </div>
        ) : (
          <div className="grade">{itens.map((a) => <CardAeronave key={a.id} aeronave={a} />)}</div>
        )
      )}

      {aba === 'anuncios' && (
        !usuario ? <Autenticacao /> : anuncios.length === 0 ? (
          <div className="vazio">
            <h3>Você ainda não tem anúncios publicados</h3>
            <p style={{ color: 'var(--cinza-600)', margin: '10px 0 20px' }}>Cadastre sua aeronave e alcance compradores qualificados.</p>
            <Link to="/anuncie" className="btn btn--ouro">Solicitar anúncio</Link>
          </div>
        ) : (
          <table className="tabela">
            <thead><tr><th>Aeronave</th><th>Ano</th><th>Preço</th><th>Status</th><th /></tr></thead>
            <tbody>
              {anuncios.map((a) => (
                <tr key={a.id}>
                  <td><strong>{a.fabricante} {a.modelo}</strong></td>
                  <td>{a.ano}</td>
                  <td>{moeda(a.preco)}</td>
                  <td><span className="tag tag--verde">Publicado</span></td>
                  <td><Link to={`/aeronave/${a.id}`} className="limpar">Ver anúncio</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}

      {aba === 'mensagens' && (
        !usuario ? <Autenticacao /> : leads.length === 0 ? (
          <div className="vazio">
            <h3>Nenhuma mensagem ainda</h3>
            <p style={{ color: 'var(--cinza-600)', marginTop: 10 }}>
              Propostas e pedidos de contato recebidos nos seus anúncios aparecem aqui.
            </p>
          </div>
        ) : (
          <table className="tabela">
            <thead><tr><th>Data</th><th>Tipo</th><th>Aeronave</th><th>Contato</th><th>Mensagem</th></tr></thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l.id}>
                  <td>{new Date(l.criadoEm).toLocaleDateString('pt-BR')}</td>
                  <td><span className="tag tag--cinza">{l.tipo}</span></td>
                  <td>{l.aeronaveNome || '—'}</td>
                  <td>{l.nome}<br /><span style={{ color: 'var(--cinza-600)', fontSize: '0.84rem' }}>{l.telefone}</span></td>
                  <td style={{ maxWidth: 320 }}>{l.mensagem}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}

      {aba === 'entrar' && !usuario && <Autenticacao />}
    </div>
  );
}
