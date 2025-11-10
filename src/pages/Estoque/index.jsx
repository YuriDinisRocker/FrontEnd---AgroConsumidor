import { useEffect, useState } from "react";

function Estoque() {
  const API_URL = "https://localhost:7182/v1";
  const token = localStorage.getItem("token");

  const [produtos, setProdutos] = useState([]);
  const [estoque, setEstoque] = useState([]);
  const [idProduto, setIdProduto] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [nomesProdutos, setNomesProdutos] = useState({});


  async function carregarProdutos() {
    try {
      const res = await fetch(`${API_URL}/produto`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setProdutos(data || []);
    } catch (err) {
      console.error(err);
      setMensagem("⚠️ Erro ao carregar produtos.");
    }
  }

  
  async function carregarEstoque() {
    try {
      const res = await fetch(`${API_URL}/visualizarEstoque`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ idProduto: 0 }),
      })
      const data = await res.json();
      setEstoque(data.res || []);

      const nomes = {};
      for (const n of (data.res || [])) {
        const res = await fetch(`${API_URL}/produto/${n.idproduto}`);
        if (res.ok) {
          const produto = await res.json();
          nomes[n.idproduto] = produto.nome;
          console.log(produto)
        }
      }
      setNomesProdutos(nomes);
    } catch (err) {
      console.error(err);
      setMensagem("⚠️ Erro ao carregar estoque.");
    }
  }

  
  async function adicionarEstoque(e) {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/estoque`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          idProduto: parseInt(idProduto),
          idVendedor: 0, 
          quantidade: parseInt(quantidade),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data || "Erro ao adicionar item.");
      setMensagem("✅ Item adicionado ao estoque!");
      setQuantidade("");
      await carregarEstoque();
    } catch (err) {
      setMensagem("❌ " + err.message);
    }
  }

  
  async function atualizarEstoque(idProduto, novaQuantidade) {
    try {
      const res = await fetch(`${API_URL}/estoque`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          idProduto: idProduto,
          quantidade: novaQuantidade.toString(),
        }),
      });
      if (!res.ok) throw new Error("Erro ao atualizar estoque");
      setMensagem("✅ Quantidade atualizada!");
      await carregarEstoque();
    } catch (err) {
      setMensagem("❌ " + err.message);
    }
  }

  
  async function deletarEstoque(id) {
    try {
      const res = await fetch(`${API_URL}/estoque/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erro ao deletar item");

      setMensagem("🗑️ Item removido do estoque!");

      
      await carregarEstoque();
    } catch (err) {
      setMensagem("❌ " + err.message);
    }
  }

  useEffect(() => {
    carregarProdutos();
    carregarEstoque();
  }, []);

  return (
    <div className="bg-[#ECE5DF] min-h-screen flex flex-col items-center py-10">
      <div className="bg-[#C4C7B6] p-8 rounded-xl shadow-lg w-[500px]">
        <h1 className="text-3xl font-bold text-[#1D361F] mb-6 text-center">
          Estoque do Vendedor
        </h1>

        {/* Formulário de adição */}
        <form onSubmit={adicionarEstoque} className="flex flex-col gap-4 mb-8">
          <select
            value={idProduto}
            onChange={(e) => setIdProduto(e.target.value)}
            required
            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1D361F]"
          >
            <option value="">Selecione o produto</option>
            {produtos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Quantidade"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1D361F]"
            required
          />

          <button
            type="submit"
            className="bg-[#1D361F] text-white py-2 rounded-md hover:bg-green-700 transition"
          >
            Adicionar ao Estoque
          </button>
        </form>

        {/* Lista de estoque */}
        <h2 className="text-xl font-semibold text-[#1D361F] mb-3">Itens:</h2>
        {estoque.length === 0 ? (
          <p className="text-center text-gray-700">Nenhum item no estoque.</p>
        ) : (
          <ul className="space-y-3">
            {estoque.map((item) => (
              <li
                key={item.id}
                className="bg-white p-3 rounded-md shadow-sm flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">
                    Produto ID: {item.idproduto} || Nome: {nomesProdutos[item.idproduto] || "carregando..."}
                  </p>
                  <p className="text-sm text-gray-600">
                    Quantidade: {item.quantidade}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const novaQtd = prompt(
                        "Nova quantidade:",
                        item.quantidade
                      );
                      if (novaQtd) atualizarEstoque(item.idproduto, novaQtd);
                    }}
                    className="bg-blue-600 text-white px-2 py-1 rounded-md text-sm"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => deletarEstoque(item.id)}
                    className="bg-red-600 text-white px-2 py-1 rounded-md text-sm"
                  >
                    Excluir
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {mensagem && (
          <p className="text-center mt-4 font-semibold text-[#1D361F]">
            {mensagem}
          </p>
        )}
      </div>
    </div>
  );
}

export default Estoque;
