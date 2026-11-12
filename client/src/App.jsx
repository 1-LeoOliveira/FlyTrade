import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Catalogo from './pages/Catalogo.jsx';
import Aeronave from './pages/Aeronave.jsx';
import Comparar from './pages/Comparar.jsx';
import Anuncie from './pages/Anuncie.jsx';
import Servicos from './pages/Servicos.jsx';
import Sobre from './pages/Sobre.jsx';
import Contato from './pages/Contato.jsx';
import Conta from './pages/Conta.jsx';
import Admin from './pages/Admin.jsx';
import NaoEncontrada from './pages/NaoEncontrada.jsx';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/aeronave/:id" element={<Aeronave />} />
        <Route path="/comparar" element={<Comparar />} />
        <Route path="/anuncie" element={<Anuncie />} />
        <Route path="/servicos" element={<Servicos />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/contato" element={<Contato />} />
        <Route path="/conta" element={<Conta />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<NaoEncontrada />} />
      </Routes>
    </Layout>
  );
}
