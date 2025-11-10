import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function Home() {
  const [posts, setPosts] = useState([]);
  const [quantidades, setQuantidades] = useState({});
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();
  const [qtdCarrinho, setQtdCarrinho] = useState(0);
  const [itensCarrinho, setItensCarrinho] = useState([]);

  const token = localStorage.getItem("token");


  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };


  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const id =
        decoded[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ] || decoded.id || decoded.Id || decoded.idConsumidor;

      const role =
        decoded[
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ] || decoded.role;

      setUsuario({ id, role });
    } catch (err) {
      console.error("Erro ao decodificar token:", err);
      handleLogout();
    }
  }, [token]);


  useEffect(() => {
    if (!usuario || usuario.role !== "Consumidor") {
      setLoading(false);
      return;
    }

    const fetchPosts = async () => {
      try {
        const res = await axios.get("https://localhost:7182/v1/post");
        const postsData = await Promise.all(
          res.data.map(async (post) => {
            const produto = await axios.get(
              `https://localhost:7182/v1/produto/${post.idproduto}`
            );
            const vendedor = await axios.get(
              `https://localhost:7182/v1/vendedor/${produto.data.idvendedor}`
            );
            return {
              ...post,
              produto: produto.data,
              vendedor: vendedor.data,
            };
          })
        );
        setPosts(postsData);
      } catch (err) {
        console.error("Erro ao carregar posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [usuario]);


  const handleQuantidade = (produtoId, value) => {
    setQuantidades((prev) => ({
      ...prev,
      [produtoId]: parseInt(value) || 1,
    }));
  };


  const comprar = async (idVendedor, idProduto, vendedorNome, telefone, nomeProduto) => {
    const quantidade = quantidades[idProduto] || 1;


    if (!usuario?.id) {
      alert("Erro: ID do consumidor não encontrado no token.");
      return;
    }

    try {
      await axios.post(
        "https://localhost:7182/v1/notificacao",
        {
          idVendedor,
          idProduto,
          idConsumidor: usuario.id,
          quantidade,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const mensagem = encodeURIComponent(
        `Olá ${vendedorNome}! Tenho interesse no seu produto (${nomeProduto}). Gostaria de comprar ${quantidade} unidade(s).`
      );
      const url = `https://wa.me/${telefone}?text=${mensagem}`;
      window.open(url, "_blank");
    } catch (err) {
      console.error("Erro ao criar notificação:", err);
      alert("Erro ao criar notificação. Verifique o console para detalhes.");
    }
  };

  useEffect(() => {
    console.log(itensCarrinho)
  }, [itensCarrinho])

  const adicionarAoCarrinho = function adicionarCarrinho(n) {
    setQtdCarrinho(prev => prev + 1);
    //Inserindo itens dentro do objeto para o carrinho
    setItensCarrinho(prev => [
      ...prev,
      {
        ...n
      },
    ]);

  }

  if (loading) {
    return <p className="text-center mt-10 text-gray-600">Carregando...</p>;
  }




  if (usuario?.role === "Vendedor") {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-gradient-to-b from-[#1D361F] to-[#254B2A] flex justify-end items-center h-20 px-10 shadow-lg rounded-b-2xl">
          <h1 className="text-xl font-bold">Painel Vendedor</h1>
          <button
            onClick={handleLogout}
            className="bg-white text-green-700 font-semibold px-4 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            Sair
          </button>
        </header>

        <main className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-6 text-green-700">
            Opções do Vendedor
          </h2>
          <div className="flex flex-col items-center gap-4">
            <button
              onClick={() => navigate("/estoque")}
              className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 w-60"
            >
              📦 Estoque
            </button>
            <button
              onClick={() => navigate("/produto")}
              className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 w-60"
            >
              🛒 Produtos
            </button>
            <button
              onClick={() => navigate("/post")}
              className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 w-60"
            >
              📰 Posts
            </button>
            <button
              onClick={() => navigate("/notificacao")}
              className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 w-60"
            >
              🔔 Notificações
            </button>
          </div>
        </main>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-b from-[#1D361F] to-[#254B2A] flex justify-end items-center h-20 px-10 shadow-lg rounded-b-2xl">
        <h1 className="text-center text-xl font-bold tracking-wide">AgroConsumidor</h1>
        <button
          onClick={handleLogout}
          className="bg-white text-green-700 font-semibold px-4 py-2 rounded-lg hover:bg-gray-100 transition"
        >
          Sair
        </button>
      </header>

      <main className="p-6">
        <h2 className="text-2xl font-bold mb-6 text-center text-green-700">
          🌾 Feed de Produtos
        </h2>

        {posts.length === 0 ? (
          <p className="text-center text-gray-500">Nenhum post disponível.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white p-5 rounded-2xl shadow-md hover:shadow-lg transition"
              >
                <h3 className="text-lg font-semibold text-gray-800">
                  {post.produto.nome}
                </h3>
                <p className="text-sm text-gray-500 mb-2">
                  {post.produto.descricao}
                </p>
                <p className="font-medium text-green-600">
                  Preço: R$ {post.produto.preco.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500 mb-3">
                  Vendedor: {post.vendedor.nome}
                </p>

                <div className="flex items-center gap-2 mb-3">
                  <label
                    htmlFor={`qtd-${post.id}`}
                    className="text-sm text-gray-700"
                  >
                    Quantidade:
                  </label>
                  <input
                    id={`qtd-${post.id}`}
                    type="number"
                    min="1"
                    value={quantidades[post.produto.id] || 1}
                    onChange={(e) =>
                      handleQuantidade(post.produto.id, e.target.value)
                    }
                    className="w-16 border border-gray-300 rounded-md px-2 py-1 text-center"
                  />
                </div>

                <button
                  onClick={() =>
                    comprar(
                      post.vendedor.id,
                      post.produto.id,
                      post.vendedor.nome,
                      post.vendedor.celular,
                      post.produto.nome
                    )
                  }
                  className="w-full bg-green-600 text-white py-2 rounded-xl hover:bg-green-700 transition"
                >
                  💲 Comprar
                </button>
                <button
                  onClick={() =>
                    adicionarAoCarrinho({
                      post,
                      quantidade: quantidades[post.produto.id] || 1
                    })

                  }
                  className="mt-2 w-full bg-green-500 text-white py-2 rounded-xl hover:bg-green-700 transition"
                >
                  ➕ Adicionar ao carrinho
                </button>
              </div>
            ))}
          </div>

        )}
        <div className="mt-5 flex justify-center items-center">
          <div className="bg-gradient-to-t from-[#1D361F] to-[#254B2A] text-center  text-gray-100 py-4 rounded-2xl w-50 group hover:from-[#4C8A56] to-[#38703F]">
            <button
              onClick={() => {
                localStorage.setItem("carrinho", JSON.stringify(itensCarrinho));
                navigate("/carrinho");
              }}
            >
              🛒 Carrinho
              <span className="text-red-500 text-lg font-bold group-hover:text-xl">
                {qtdCarrinho === 0 ? null : qtdCarrinho}
              </span>
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}

export default Home;
