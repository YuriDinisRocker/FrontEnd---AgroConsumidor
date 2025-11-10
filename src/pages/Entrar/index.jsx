import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
    const [tipo, setTipo] = useState("consumidor");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [celular, setCelular] = useState("");
    const [permissao, setPermissao] = useState(1);
    const [mensagem, setMensagem] = useState("");

    const navigate = useNavigate();

    
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            navigate("/home");
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const endpoint =
            tipo === "vendedor"
                ? "https://localhost:7182/v1/login-vendedor"
                : "https://localhost:7182/v1/login-consumidor";

        const body =
            tipo === "vendedor"
                ? { email, password, celular }
                : { email, password, permissao: parseInt(permissao) };

        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (response.ok) {
                const token = await response.text();

                
                localStorage.setItem("token", token);
                localStorage.setItem("tipoUsuario", tipo);

                setMensagem("✅ Login realizado com sucesso!");
                
                
                setTimeout(() => navigate("/home"), 1000);
            } else {
                const error = await response.text();
                setMensagem("❌ Falha no login: " + error);
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
            setMensagem("⚠️ Erro ao conectar ao servidor.");
        }
    };

    return (
        <div className="bg-[#ECE5DF] min-h-screen flex flex-col justify-center items-center">
            <div className="bg-[#C4C7B6] p-10 rounded-xl shadow-lg w-[400px]">
                <h1 className="text-3xl font-bold text-[#1D361F] mb-6 text-center">
                    Login
                </h1>

                {/* Botões de seleção de tipo */}
                <div className="flex justify-center mb-6">
                    <button
                        onClick={() => setTipo("consumidor")}
                        className={`px-4 py-2 rounded-l-md border ${
                            tipo === "consumidor"
                                ? "bg-[#1D361F] text-white"
                                : "bg-gray-200 text-gray-800"
                        }`}
                    >
                        Consumidor
                    </button>
                    <button
                        onClick={() => setTipo("vendedor")}
                        className={`px-4 py-2 rounded-r-md border ${
                            tipo === "vendedor"
                                ? "bg-[#1D361F] text-white"
                                : "bg-gray-200 text-gray-800"
                        }`}
                    >
                        Vendedor
                    </button>
                </div>

                {/* Formulário de login */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="email"
                        placeholder="E-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1D361F]"
                        required
                    />

                    <input
                        type="password"
                        placeholder="Senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1D361F]"
                        required
                    />

                    {/* Campo extra apenas para vendedores */}
                    {tipo === "vendedor" && (
                        <input
                            type="text"
                            placeholder="Celular"
                            value={celular}
                            onChange={(e) => setCelular(e.target.value)}
                            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1D361F]"
                            required
                        />
                    )}

                    <button
                        type="submit"
                        className="bg-[#1D361F] text-white py-2 rounded-md mt-4 hover:bg-green-700 transition"
                    >
                        Entrar
                    </button>
                </form>

                {mensagem && (
                    <p className="text-center text-sm mt-4 font-semibold text-[#1D361F]">
                        {mensagem}
                    </p>
                )}
            </div>
        </div>
    );
}

export default Login;
