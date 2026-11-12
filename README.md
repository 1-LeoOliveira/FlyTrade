# FlyTrade — concessionária aérea online

Plataforma de compra e venda de aeronaves (jatos, turboélices, pistão, helicópteros e experimentais),
em **Vite + React** no front-end e **Node.js + Express** no back-end. Todo o conteúdo em português do Brasil.

## Stack

| Camada | Tecnologia |
| --- | --- |
| Front-end | Vite 5, React 18, React Router 6, CSS próprio (sem framework) |
| Back-end | Node.js + Express 4 (ESM), persistência em arquivo JSON |
| Imagens | Fotos reais em `client/public/aeronaves` (Wikimedia Commons, licenças CC/PD) com ilustração SVG como fallback |

## Como rodar

```bash
npm install          # instala client + server (npm workspaces)
npm run dev          # sobe API em :4000 e o site em :5173 (com proxy /api)
```

Produção:

```bash
npm run build        # gera client/dist
npm start            # Express serve a API e o build estático em :4000
```


## Deploy na Vercel

O projeto sobe como **uma única aplicação**: o Vite gera o site estático e a API Express roda como
função serverless em `api/index.js`.

Na Vercel, em **Settings → General → Root Directory**, use a **raiz do repositório** (`./`).
Apontar para `client` publica apenas o front-end: o site carrega, mas o catálogo volta vazio
porque `/api/*` não existe — e sem aeronaves nenhuma foto aparece.

O `vercel.json` já cuida do resto:

| Config | Valor |
| --- | --- |
| Build Command | `npm run build` |
| Output Directory | `client/dist` |
| Rewrite da API | `/api/*` → função `api/index.js` |
| Rewrite do SPA | demais rotas → `index.html` |

> **Persistência em produção:** o disco da Vercel é somente leitura, então o `store.js` passa a
> gravar em `/tmp`, que é efêmero. Solicitações de anúncio, leads e cadastros duram apenas
> enquanto a instância estiver quente e **somem entre deploys**. Para valer em produção, troque o
> `store.js` por um banco real (Vercel Postgres, Supabase, Neon, Mongo Atlas).


### Imagem de compartilhamento

`client/public/og-flytrade.jpg` (1200x630) e as meta tags Open Graph / Twitter Card em
`client/index.html` fazem o link exibir a logo no WhatsApp, LinkedIn, Facebook e Telegram.

Os scrapers não resolvem caminho relativo, então a URL absoluta é injetada no build por um
plugin do `vite.config.js`, que lê nesta ordem: `SITE_URL` → `VERCEL_PROJECT_PRODUCTION_URL`
→ `VERCEL_URL` → `http://localhost:5173`. Na Vercel funciona sem configurar nada; com domínio
próprio, defina `SITE_URL` nas variáveis de ambiente do projeto.

> Esses serviços guardam o preview em cache. Depois de trocar de domínio, revalide em
> [developers.facebook.com/tools/debug](https://developers.facebook.com/tools/debug/).

## Estrutura

```
FlyTrade/
├── api/index.js             # entrada serverless da Vercel (reexporta o app Express)
├── vercel.json
├── client/                  # Vite + React
│   ├── public/              # logo e favicon
│   └── src/
│       ├── components/      # Layout, CardAeronave, FormularioLead, Simulador, Icones
│       ├── lib/             # api.js, AppContext.jsx, format.js, aircraftImage.js
│       ├── pages/           # Home, Catalogo, Aeronave, Comparar, Anuncie, Servicos,
│       │                    # Sobre, Contato, Conta, Admin, NaoEncontrada
│       └── styles/global.css
└── server/
    ├── data/db.json         # gerado na 1ª execução (estoque, leads, usuários)
    └── src/
        ├── data/aeronaves.js  # 12 aeronaves de exemplo
        ├── store.js           # persistência (arquivo local ou /tmp em serverless)
        ├── app.js             # app Express com todas as rotas
        └── index.js           # sobe o servidor local (app.listen)
```

## Páginas

- **Home** — hero com a logo, busca rápida (tipo, fabricante, faixa de preço, ano), destaques, categorias, diferenciais, depoimentos e CTA de anúncio.
- **Catálogo** — grade com filtros (categoria, fabricante, ano, preço, horas totais, horas de motor, assentos, localização, busca livre) e 7 critérios de ordenação. O estado dos filtros fica na URL.
- **Página da aeronave** — galeria (externa, detalhe, cabine, painel), ficha técnica completa, equipamentos, abas de interesse / visita / proposta / financiamento, WhatsApp do vendedor e aeronaves semelhantes.
- **Anuncie sua aeronave** — formulário em 4 etapas + planos Básico, Destaque e Premium. Gera uma **solicitação** com protocolo; nada é publicado automaticamente.
- **Serviços** — inspeção pré-compra, documentação ANAC, financiamento, seguro, ferry e consultoria, com simulador.
- **Sobre**, **Contato**, **Área do usuário** (favoritos, anúncios, mensagens) e **Comparar** (até 3 lado a lado).
- **Admin** — recebe as solicitações dos vendedores (status nova → em contato → publicada/recusada), com link de WhatsApp para contato, histórico de observações e o botão que publica a aeronave no catálogo. Também lista os leads de compradores e o catálogo no ar.

## Contas de demonstração

| Perfil | E-mail | Senha |
| --- | --- | --- |
| Administrador | `admin@flytrade.com.br` | `flytrade` |
| Cliente | `cliente@flytrade.com.br` | `flytrade` |

## API

| Método | Rota | Descrição |
| --- | --- | --- |
| GET | `/api/filtros` | categorias, fabricantes, localizações e faixas |
| GET | `/api/aeronaves` | lista com filtros e ordenação via query string |
| GET | `/api/aeronaves/destaques` | aeronaves em destaque |
| GET | `/api/aeronaves/:id` | detalhe + 3 semelhantes |
| POST | `/api/leads` | cria lead (interesse, visita, proposta, contato) |
| GET | `/api/leads` | leads do usuário logado (todos, se admin) |
| POST | `/api/solicitacoes` | cria solicitação de anúncio (status `nova`) |
| GET | `/api/admin/resumo` | KPIs, solicitações, anúncios e leads (admin) |
| POST | `/api/admin/solicitacoes/:id/status` | muda status e registra observação (admin) |
| POST | `/api/admin/solicitacoes/:id/publicar` | publica a aeronave no catálogo (admin) |
| POST | `/api/auth/login` · `/api/auth/cadastro` | autenticação por token simples |
| GET | `/api/auth/eu` | usuário da sessão |
| PUT | `/api/favoritos` | sincroniza favoritos |

## Observações

- A autenticação é intencionalmente simples (token em memória, senha em texto puro no `db.json`) por se tratar de um projeto demonstrativo. Para produção: hash de senha (bcrypt/argon2), JWT assinado e banco de dados real.
- O upload de fotos/documentos na solicitação registra apenas os nomes dos arquivos; falta o armazenamento (S3/disco) para ficar completo.
- **Moedas:** as aeronaves são negociadas em dólar (US$); os planos de anúncio são cobrados em real (R$).
- **Fotos:** vieram do Wikimedia Commons sob licenças CC BY-SA / domínio público. A atribuição exigida está em `client/public/aeronaves/creditos.json` e é exibida na página Sobre. Para uso comercial real, substitua por fotos próprias das aeronaves anunciadas.
- Favoritos e comparação ficam no `localStorage` e são sincronizados com o servidor quando há login.
