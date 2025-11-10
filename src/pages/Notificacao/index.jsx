import { useEffect, useState } from "react";


function Notificacoes() {
  const API_URL = "https://localhost:7182/v1";
  const token = localStorage.getItem("token");

  const [notificacoes, setNotificacoes] = useState([]);
  const [mensagem, setMensagem] = useState("");
  const [nomesProdutos, setNomesProdutos] = useState({});

  async function carregarNotificacoes() {
    try {
      const res = await fetch(`${API_URL}/notificacao-vendedor`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Erro ao carregar notificações");
      const data = await res.json();
      setNotificacoes(data || []);

      const nomes = {};
      for (const n of data) {
        const resProduto = await fetch(`${API_URL}/produto/${n.idproduto}`);
        if (resProduto.ok) {
          const produto = await resProduto.json();
          nomes[n.idProduto] = produto.nome;
        }
      }
      setNomesProdutos(nomes);
    } catch (err) {
      setMensagem("⚠️ Nenhuma notificação encontrada ou erro ao carregar.");
    }
  }



  async function aceitarNotificacao(n) {
    try {
      const estoqueAtual = await fetch(`${API_URL}/visualizarEstoque/${n.idproduto}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(estoqueAtual)
      const data = await estoqueAtual.json();
      const quantidadeEstoque = data[0].quantidade;


      const novaQtd = quantidadeEstoque - n.quantidade;
      console.log(n.quantidade);
      if (novaQtd < 0) return alert("Estoque insuficiente!");

    
      await fetch(`${API_URL}/estoque`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          idProduto: n.idproduto,
          quantidade: novaQtd.toString(),
        }),
      });

      
      await fetch(`${API_URL}/notificacao/${n.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      setMensagem("✅ Pedido aceito e estoque atualizado!");
      carregarNotificacoes();
    } catch (err) {
      setMensagem("❌ Erro ao aceitar notificação.");
    }
  }

  async function recusarNotificacao(id) {
    if (!window.confirm("Tem certeza que deseja recusar este pedido?")) return;
    try {
      await fetch(`${API_URL}/notificacao/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setMensagem("🚫 Pedido recusado com sucesso.");
      carregarNotificacoes();
    } catch {
      setMensagem("❌ Erro ao recusar notificação.");
    }
  }

  useEffect(() => {
    carregarNotificacoes();

  }, []);


  return (
    <div className="bg-[#ECE5DF] min-h-screen flex flex-col items-center py-10">
      <div className="bg-[#C4C7B6] p-8 rounded-xl shadow-lg w-[700px]">
        <h1 className="text-3xl font-bold text-[#1D361F] mb-6 text-center">
          Notificações de Pedidos
        </h1>

        {notificacoes.length === 0 ? (
          <p className="text-center text-gray-700">
            Nenhuma notificação no momento.
          </p>
        ) : (
          <ul className="space-y-4">
            {notificacoes.map((n) => (
              <li
                key={n.id}
                className="bg-white p-4 rounded-md shadow-md flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold text-lg text-[#1D361F]">

                    Produto: {nomesProdutos[n.idProduto] || "Carregando..."} || ID: {n.idproduto}

                  </p>
                  <p>Quantidade solicitada: {n.quantidade}</p>
                  <p>Valor total: R$ {n.valor}</p>
                  <p className="text-sm text-gray-600">
                    Data: {n.datasolicitacao}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => aceitarNotificacao(n)}
                    className="bg-green-600 text-white px-3 py-1 rounded-md"
                  >
                    Aceitar
                  </button>
                  <button
                    onClick={() => recusarNotificacao(n.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded-md"
                  >
                    Recusar
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

export default Notificacoes;
