import { Link } from 'react-router-dom';

export default function NaoEncontrada() {
  return (
    <div className="container centro" style={{ padding: '120px 0' }}>
      <span className="olho" style={{ justifyContent: 'center' }}>Erro 404</span>
      <h1 style={{ margin: '18px 0 14px' }}>Página fora de rota</h1>
      <p style={{ color: 'var(--cinza-600)', maxWidth: 480, margin: '0 auto 28px' }}>
        O endereço que você procurou não existe ou foi movido. Vamos voltar para a pista?
      </p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link to="/" className="btn btn--navy">Ir para a home</Link>
        <Link to="/catalogo" className="btn btn--contorno">Ver catálogo</Link>
      </div>
    </div>
  );
}
