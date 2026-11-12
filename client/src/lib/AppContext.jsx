import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from './api.js';

const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);

const ler = (chave, padrao) => {
  try {
    const v = localStorage.getItem(chave);
    return v ? JSON.parse(v) : padrao;
  } catch {
    return padrao;
  }
};
const gravar = (chave, valor) => {
  try {
    localStorage.setItem(chave, JSON.stringify(valor));
  } catch {
    /* ignora */
  }
};

export function AppProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [favoritos, setFavoritos] = useState(() => ler('flytrade:favoritos', []));
  const [comparar, setComparar] = useState(() => ler('flytrade:comparar', []));
  const [aviso, setAviso] = useState(null);

  useEffect(() => { gravar('flytrade:favoritos', favoritos); }, [favoritos]);
  useEffect(() => { gravar('flytrade:comparar', comparar); }, [comparar]);

  useEffect(() => {
    if (!localStorage.getItem('flytrade:token')) return;
    api
      .eu()
      .then(({ usuario: u }) => {
        setUsuario(u);
        setFavoritos((atuais) => [...new Set([...atuais, ...(u.favoritos || [])])]);
      })
      .catch(() => localStorage.removeItem('flytrade:token'));
  }, []);

  const notificar = useCallback((mensagem, tom = 'sucesso') => {
    setAviso({ mensagem, tom, id: Date.now() });
    setTimeout(() => setAviso(null), 4000);
  }, []);

  const alternarFavorito = useCallback(
    (id) => {
      setFavoritos((atuais) => {
        const proximos = atuais.includes(id) ? atuais.filter((x) => x !== id) : [...atuais, id];
        if (localStorage.getItem('flytrade:token')) api.salvarFavoritos(proximos).catch(() => {});
        notificar(atuais.includes(id) ? 'Removido dos favoritos.' : 'Salvo nos favoritos!');
        return proximos;
      });
    },
    [notificar],
  );

  const alternarComparar = useCallback(
    (id) => {
      setComparar((atuais) => {
        if (atuais.includes(id)) return atuais.filter((x) => x !== id);
        if (atuais.length >= 3) {
          notificar('Você pode comparar até 3 aeronaves.', 'erro');
          return atuais;
        }
        return [...atuais, id];
      });
    },
    [notificar],
  );

  const entrar = useCallback(
    async (credenciais, modo = 'login') => {
      const { token, usuario: u } = await (modo === 'login' ? api.login(credenciais) : api.cadastro(credenciais));
      localStorage.setItem('flytrade:token', token);
      setUsuario(u);
      setFavoritos((atuais) => [...new Set([...atuais, ...(u.favoritos || [])])]);
      notificar(`Bem-vindo, ${u.nome.split(' ')[0]}!`);
      return u;
    },
    [notificar],
  );

  const sair = useCallback(() => {
    localStorage.removeItem('flytrade:token');
    setUsuario(null);
    notificar('Sessão encerrada.');
  }, [notificar]);

  const valor = useMemo(
    () => ({
      usuario,
      favoritos,
      comparar,
      aviso,
      notificar,
      alternarFavorito,
      alternarComparar,
      limparComparacao: () => setComparar([]),
      entrar,
      sair,
    }),
    [usuario, favoritos, comparar, aviso, notificar, alternarFavorito, alternarComparar, entrar, sair],
  );

  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>;
}
