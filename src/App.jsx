// App.jsx
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Cadastro from "./pages/Cadastro";
import Login from "./pages/Entrar";
import Home from "./pages/Home";
import Produtos from "./pages/Produto";
import Estoque from "./pages/Estoque";
import CreatePost from "./pages/CreatePost";
import Notificacoes from "./pages/Notificacao";
import Carrinho from "./pages/Carrinho";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/produto" element={<Produtos />} />
      <Route path="/estoque" element={<Estoque />} />
      <Route path="/post" element={<CreatePost />} />
      <Route path="/notificacao" element={<Notificacoes />} />
      <Route path="/carrinho" element={<Carrinho />} />
    </Routes>
  );
}

export default App;
