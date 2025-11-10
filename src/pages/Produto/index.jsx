import { useEffect, useState } from "react";

function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [mensagem, setMensagem] = useState("");

  const token = localStorage.getItem("token");

  const carregarProdutos = async () => {
    try {
      const response = await fetch("https://localhost:7182/v1/produto", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) throw new Error("Erro ao carregar produtos");

      const data = await response.json();
      setProdutos(data);
    } catch (error) {
      console.error(error);
      setMensagem("⚠️ Não foi possível carregar seus produtos.");
    }
  };

  useEffect(() => {
    carregarProdutos();
  }, []);

  
  const cadastrarProduto = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://localhost:7182/v1/produto", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ nome, descricao, preco })
      });

      if (response.ok) {
        setMensagem("✅ Produto cadastrado com sucesso!");
        setNome("");
        setDescricao("");
        setPreco("");
        carregarProdutos();
      } else {
        const erro = await response.text();
        setMensagem("❌ Erro: " + erro);
      }
    } catch (error) {
      console.error(error);
      setMensagem("⚠️ Falha na conexão com o servidor.");
    }
  };

 
  const excluirProduto = async (id) => {
    if (!confirm("Deseja realmente excluir este produto?")) return;

    try {
      const response = await fetch(`https://localhost:7182/v1/produto/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        setMensagem("🗑️ Produto removido com sucesso!");
        carregarProdutos();
      } else {
        const erro = await response.text();
        setMensagem("❌ Erro: " + erro);
      }
    } catch (error) {
      console.error(error);
      setMensagem("⚠️ Erro de conexão.");
    }
  };

  return (
    <div className="bg-[#ECE5DF] min-h-screen flex flex-col items-center py-10">
      <div className="bg-[#C4C7B6] p-8 rounded-xl shadow-lg w-[600px]">
        <h1 className="text-3xl font-bold text-[#1D361F] mb-6 text-center">
          Gerenciar Produtos
        </h1>

        <form
          onSubmit={cadastrarProduto}
          className="flex flex-col gap-4 mb-8"
        >
          <input
            type="text"
            placeholder="Nome do produto"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1D361F]"
          />

          <input
            type="text"
            placeholder="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1D361F]"
          />

          <input
            type="text"
            placeholder="Preço (ex: 19.90)"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            required
            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1D361F]"
          />

          <button
            type="submit"
            className="bg-[#1D361F] text-white py-2 rounded-md hover:bg-green-700 transition"
          >
            Adicionar Produto
          </button>
        </form>

        {mensagem && (
          <p className="text-center text-sm font-semibold text-[#1D361F] mb-4">
            {mensagem}
          </p>
        )}

        <div className="bg-white rounded-lg shadow-md p-4">
          {produtos.length === 0 ? (
            <p className="text-center text-gray-600">Nenhum produto cadastrado.</p>
          ) : (
            <ul className="divide-y">
              {produtos.map((p) => (
                <li key={p.id} className="py-3 flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-[#1D361F]">{p.nome}</p>
                    <p className="text-sm text-gray-700">{p.descricao}</p>
                    <p className="text-sm text-green-800 font-bold">
                      R$ {p.preco.toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={() => excluirProduto(p.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition"
                  >
                    Excluir
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default Produtos;
