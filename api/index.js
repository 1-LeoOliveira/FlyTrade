/**
 * Entrada serverless da Vercel: expõe a API do FlyTrade.
 * O vercel.json reescreve /api/* para cá; o Express cuida do roteamento.
 */
import app from '../server/src/app.js';

export default app;
