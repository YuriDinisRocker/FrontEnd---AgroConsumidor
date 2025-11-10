import { useEffect, useState } from "react";

function CreatePost() {
  const API_URL = "https://localhost:7182/v1";
  const token = localStorage.getItem("token");

  const [produtos, setProdutos] = useState([]);
  const [posts, setPosts] = useState([]);
  const [idProduto, setIdProduto] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [nomeProduto, setNomeProduto] = useState({});

  
  async function carregarProdutos() {
    try {
      const res = await fetch(`${API_URL}/produto`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erro ao carregar produtos");
      const data = await res.json();
      setProdutos(data || []);
    } catch (err) {
      setMensagem("⚠️ Erro ao carregar produtos.");
    }
  }

  
  async function carregarPosts() {
    try {
      const res = await fetch(`${API_URL}/post`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erro ao carregar posts");
      const data = await res.json();
      setPosts(data || []);
      
      const nome={};
      for(const n of data){
        const res = await fetch(`${API_URL}/produto/${n.idproduto}`);
        if(res.ok){
          const produto = await res.json();
          nome[n.idproduto] = produto.nome;
        }
        
      }
      setNomeProduto(nome);
    } catch (err) {
      console.error(err);
      setMensagem("⚠️ Erro ao carregar posts.");
    }
  }

  
  async function criarPost(e) {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ idProduto: parseInt(idProduto) }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data || "Erro ao criar post.");

      setMensagem("✅ Post criado com sucesso!");
      setIdProduto("");
      carregarPosts();
    } catch (err) {
      setMensagem("❌ " + err.message);
    }
  }


  async function deletarPost(id) {
    if (!window.confirm("Deseja realmente deletar este post?")) return;

    try {
      const res = await fetch(`${API_URL}/post/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Erro ao deletar post");
      setMensagem("🗑️ Post deletado com sucesso!");
      carregarPosts();
    } catch (err) {
      setMensagem("❌ " + err.message);
    }
  }

  useEffect(() => {
    carregarProdutos();
    carregarPosts();
  }, []);

  return (
    <div className="bg-[#ECE5DF] min-h-screen flex flex-col items-center py-10">
      <div className="bg-[#C4C7B6] p-8 rounded-xl shadow-lg w-[500px]">
        <h1 className="text-3xl font-bold text-[#1D361F] mb-6 text-center">
          Gerenciar Posts
        </h1>

        {/* Formulário de criação */}
        <form onSubmit={criarPost} className="flex flex-col gap-4 mb-8">
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

          <button
            type="submit"
            className="bg-[#1D361F] text-white py-2 rounded-md hover:bg-green-700 transition"
          >
            Criar Post
          </button>
        </form>

        {/* Lista de posts */}
        <h2 className="text-xl font-semibold text-[#1D361F] mb-3">Seus Posts:</h2>
        {posts.length === 0 ? (
          <p className="text-center text-gray-700">Nenhum post criado ainda.</p>
        ) : (
          <ul className="space-y-3">
            {posts.map((p) => (
              <li
                key={p.id}
                className="bg-white p-3 rounded-md shadow-sm flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">Produto: {nomeProduto[p.idproduto]} || ID: {p.idproduto}</p>
                  <p className="text-sm text-gray-600">
                    Post ID: {p.id}
                  </p>
                </div>

                <button
                  onClick={() => deletarPost(p.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                >
                  Excluir
                </button>
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

export default CreatePost;
