import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useApp } from '../lib/AppContext.jsx';
import { whatsappLink } from '../lib/format.js';
import { IconeCoracao, IconeMenu, IconeUsuario, IconeZap, IconeComparar } from './Icones.jsx';

export const WHATSAPP_FLYTRADE = '5511999990000';

const LINKS = [
  { para: '/catalogo', rotulo: 'Catálogo' },
  { para: '/anuncie', rotulo: 'Anuncie sua aeronave' },
  { para: '/servicos', rotulo: 'Serviços' },
  { para: '/sobre', rotulo: 'Sobre' },
  { para: '/contato', rotulo: 'Contato' },
];

export function Logo({ className = '' }) {
  return (
    <Link to="/" className={`marca ${className}`} aria-label="FlyTrade — página inicial">
      <span className="marca__nome">
        Fly<span className="marca__ouro">Trade</span>
      </span>
      <span className="marca__linha">Compra · Venda · Negocie Aeronaves</span>
    </Link>
  );
}

function Header() {
  const { favoritos, comparar, usuario } = useApp();
  const [aberto, setAberto] = useState(false);
  const local = useLocation();

  useEffect(() => { setAberto(false); }, [local.pathname]);

  return (
    <header className="header">
      <div className="container header__inner">
        <Logo />
        <nav className={`nav ${aberto ? 'aberto' : ''}`}>
          {LINKS.map((l) => (
            <NavLink key={l.para} to={l.para} className={({ isActive }) => (isActive ? 'ativo' : '')}>
              {l.rotulo}
            </NavLink>
          ))}
        </nav>
        <div className="header__acoes">
          <Link to="/comparar" className="icone-btn" aria-label="Comparar aeronaves" title="Comparar">
            <IconeComparar width="18" height="18" />
            {comparar.length > 0 && <span className="selo">{comparar.length}</span>}
          </Link>
          <Link to="/conta?aba=favoritos" className="icone-btn" aria-label="Favoritos" title="Favoritos">
            <IconeCoracao width="18" height="18" />
            {favoritos.length > 0 && <span className="selo">{favoritos.length}</span>}
          </Link>
          <Link to="/conta" className="icone-btn" aria-label="Minha conta" title={usuario ? usuario.nome : 'Entrar'}>
            <IconeUsuario width="18" height="18" />
          </Link>
          <button className="icone-btn menu-mobile" onClick={() => setAberto((a) => !a)} aria-label="Abrir menu">
            <IconeMenu />
          </button>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div>
            <Logo />
            <p style={{ fontSize: '0.94rem', maxWidth: 330 }}>
              A concessionária aérea online do Brasil. Curadoria, inspeção pré-compra e documentação ANAC para
              compradores e vendedores de aeronaves.
            </p>
            <p style={{ marginTop: 18, fontSize: '0.9rem' }}>
              Av. Brigadeiro Faria Lima, 2000 — São Paulo/SP<br />
              (11) 99999-0000 · contato@flytrade.com.br
            </p>
          </div>
          <div>
            <h4>Comprar</h4>
            <ul>
              <li><Link to="/catalogo?categoria=jato">Jatos executivos</Link></li>
              <li><Link to="/catalogo?categoria=turboelice">Turboélices</Link></li>
              <li><Link to="/catalogo?categoria=pistao">Pistão</Link></li>
              <li><Link to="/catalogo?categoria=helicoptero">Helicópteros</Link></li>
              <li><Link to="/catalogo?categoria=experimental">Experimentais</Link></li>
            </ul>
          </div>
          <div>
            <h4>Vender</h4>
            <ul>
              <li><Link to="/anuncie">Solicitar anúncio</Link></li>
              <li><Link to="/anuncie#planos">Planos de anúncio</Link></li>
              <li><Link to="/conta?aba=anuncios">Meus anúncios</Link></li>
              <li><Link to="/admin">Painel administrativo</Link></li>
            </ul>
          </div>
          <div>
            <h4>Serviços</h4>
            <ul>
              <li><Link to="/servicos#inspecao">Inspeção pré-compra</Link></li>
              <li><Link to="/servicos#documentacao">Documentação ANAC</Link></li>
              <li><Link to="/servicos#financiamento">Financiamento</Link></li>
              <li><Link to="/servicos#seguro">Seguro aeronáutico</Link></li>
              <li><Link to="/servicos#ferry">Translado (ferry)</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer__fim">
          <span>© {new Date().getFullYear()} FlyTrade Aviação Executiva. Todos os direitos reservados.</span>
          <span>CNPJ 00.000.000/0001-00 · Projeto demonstrativo</span>
        </div>
      </div>
    </footer>
  );
}

function BarraComparar() {
  const { comparar, alternarComparar, limparComparacao } = useApp();
  if (comparar.length === 0) return null;
  return (
    <div className="barra-comparar">
      <div className="container">
        <strong style={{ fontSize: '0.9rem' }}>Comparando {comparar.length}/3</strong>
        <div className="barra-comparar__itens">
          {comparar.map((id) => (
            <span className="chip-comparar" key={id}>
              {id.replace(/-\d{4}$/, '').replace(/-/g, ' ')}
              <button onClick={() => alternarComparar(id)} aria-label="Remover">×</button>
            </span>
          ))}
        </div>
        <Link to="/comparar" className="btn btn--ouro">Comparar agora</Link>
        <button className="btn btn--claro" onClick={limparComparacao}>Limpar</button>
      </div>
    </div>
  );
}

function Aviso() {
  const { aviso } = useApp();
  if (!aviso) return null;
  return <div className={`aviso ${aviso.tom === 'erro' ? 'aviso--erro' : ''}`}>{aviso.mensagem}</div>;
}

export function Layout({ children }) {
  const { comparar } = useApp();
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return (
    <>
      <Header />
      <main style={{ paddingBottom: comparar.length ? 90 : 0 }}>{children}</main>
      <Footer />
      <a
        className="zap-flutuante"
        href={whatsappLink(WHATSAPP_FLYTRADE, 'Olá! Vim pelo site da FlyTrade e gostaria de falar com um consultor.')}
        target="_blank"
        rel="noreferrer"
        aria-label="Falar no WhatsApp"
      >
        <IconeZap />
      </a>
      <BarraComparar />
      <Aviso />
    </>
  );
}
