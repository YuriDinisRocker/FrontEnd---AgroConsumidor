import { useState } from "react";

function Cadastro() {
  const [tipo, setTipo] = useState("vendedor");
  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    celular: "",
  });
  const [mensagem, setMensagem] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem("Enviando...");

    const endpoint = `https://localhost:7182/v1/${tipo}`;
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        setMensagem("Cadastro realizado com sucesso!");
        setForm({ nome: "", email: "", senha: "", celular: "" });
      } else {
        setMensagem("Erro ao cadastrar. Verifique os dados.");
      }
    } catch (error) {
      setMensagem("Falha ao conectar ao servidor.");
    }
  };

  return (
    <div className="bg-[#ECE5DF] min-h-screen flex flex-col justify-center items-center">
      <div className="bg-[#C4C7B6] rounded-2xl p-10 shadow-lg w-96 text-center">
        <h1 className="text-3xl font-extrabold text-[#1D361F] mb-6">
          Criar Conta
        </h1>

        {/* Tipo de usuário */}
        <div className="flex justify-center gap-6 mb-6">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="tipo"
              value="vendedor"
              checked={tipo === "vendedor"}
              onChange={(e) => setTipo(e.target.value)}
              className="accent-[#1D361F]"
            />
            <span className="text-[#1D361F] font-medium">Vendedor</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="tipo"
              value="consumidor"
              checked={tipo === "consumidor"}
              onChange={(e) => setTipo(e.target.value)}
              className="accent-[#1D361F]"
            />
            <span className="text-[#1D361F] font-medium">Consumidor</span>
          </label>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="nome"
            placeholder="Nome"
            value={form.nome}
            onChange={handleChange}
            required
            className="p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1D361F]"
          />
          <input
            type="email"
            name="email"
            placeholder="E-mail"
            value={form.email}
            onChange={handleChange}
            required
            className="p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1D361F]"
          />
          <input
            type="password"
            name="senha"
            placeholder="Senha"
            value={form.senha}
            onChange={handleChange}
            required
            className="p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1D361F]"
          />
          <input
            type="text"
            name="celular"
            placeholder="Celular"
            value={form.celular}
            onChange={handleChange}
            required
            className="p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1D361F]"
          />

          <button
            type="submit"
            className="bg-[#1D361F] text-white py-2 rounded-md font-medium hover:bg-[#2E5433] transition-all mt-2"
          >
            Cadastrar
          </button>
        </form>

        {mensagem && (
          <p className="text-sm mt-4 text-[#1D361F] font-semibold">
            {mensagem}
          </p>
        )}
      </div>
    </div>
  );
}

export default Cadastro;
