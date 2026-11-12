import { Link } from 'react-router-dom';
import { useApp } from '../lib/AppContext.jsx';
import { capa } from '../lib/fotos.js';
import { CATEGORIA_NOME, moeda, numero, titulo } from '../lib/format.js';
import { IconeComparar, IconeCoracao, IconeLocal } from './Icones.jsx';

export default function CardAeronave({ aeronave }) {
  const { favoritos, alternarFavorito, comparar, alternarComparar } = useApp();
  const favorito = favoritos.includes(aeronave.id);
  const comparando = comparar.includes(aeronave.id);

  return (
    <article className="card">
      <div className="card__foto">
        <Link to={`/aeronave/${aeronave.id}`}>
          <img src={capa(aeronave)} alt={`${titulo(aeronave)} ${aeronave.ano}`} loading="lazy" />
        </Link>
        <div className="card__tags">
          <span className="tag">{CATEGORIA_NOME[aeronave.categoria]}</span>
          {aeronave.destaque && <span className="tag tag--ouro">Destaque</span>}
        </div>
        <button
          className={`card__fav ${favorito ? 'ativo' : ''}`}
          onClick={() => alternarFavorito(aeronave.id)}
          aria-label={favorito ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
        >
          <IconeCoracao preenchido={favorito} width="18" height="18" />
        </button>
      </div>

      <div className="card__corpo">
        <div className="card__titulo">
          <div>
            <h3><Link to={`/aeronave/${aeronave.id}`}>{titulo(aeronave)}</Link></h3>
            <div className="card__local"><IconeLocal /> {aeronave.localizacao}</div>
          </div>
          <span className="tag tag--cinza">{aeronave.ano}</span>
        </div>

        <div className="card__specs">
          <div><span>Horas totais</span><strong>{numero(aeronave.horasTotais)} h</strong></div>
          <div><span>{aeronave.tipoHorasMotor || 'Motor'}</span><strong>{numero(aeronave.horasMotor)} h</strong></div>
          <div><span>Assentos</span><strong>{aeronave.assentos}</strong></div>
        </div>

        <div className="card__rodape">
          <div className={aeronave.preco == null ? 'preco preco--consulta' : 'preco'}>{moeda(aeronave.preco)}</div>
          <button
            className={`link-comparar ${comparando ? 'ativo' : ''}`}
            onClick={() => alternarComparar(aeronave.id)}
          >
            <IconeComparar /> {comparando ? 'Comparando' : 'Comparar'}
          </button>
        </div>
      </div>
    </article>
  );
}
