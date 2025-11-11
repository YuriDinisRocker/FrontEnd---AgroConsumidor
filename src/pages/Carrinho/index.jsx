import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Carrinho() {
    const [itens, setItens] = useState([]);
    const [total, setTotal] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const dados = localStorage.getItem("carrinho");
        if (dados) {
            const carrinho = JSON.parse(dados);
            setItens(carrinho);

            const valorTotal = carrinho.reduce(
                (acc, item) => acc + (item.post.produto?.preco || 0) * (item.quantidade),
                0
            );
            setTotal(valorTotal);
        }
    }, []);

    const removerItem = (id) => {
        const novos = itens.filter((i) => i.post.id !== id);
        setItens(novos);
        localStorage.setItem("carrinho", JSON.stringify(novos));
        const novoTotal = novos.reduce(
            (acc, item) => acc + (item.post.produto?.preco || 0) * (item.quantidade || 1),
            0
        );
        setTotal(novoTotal);
    };

    const token = localStorage.getItem("token");

    if (!token) {
        return (navigate("/login"))
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-gradient-to-b from-[#1D361F] to-[#254B2A] flex justify-between items-center h-20 px-10 shadow-lg rounded-b-2xl">
                <h1 className="text-xl font-bold text-white">🛒 Seu Carrinho</h1>
                <button
                    onClick={() => navigate(-1)}
                    className="bg-white text-green-700 font-semibold px-4 py-2 rounded-lg hover:bg-gray-100 transition"
                >
                    Voltar
                </button>
            </header>

            <main className="p-6">
                {itens.length === 0 ? (
                    <p className="text-center text-gray-500 mt-10">
                        Nenhum item no carrinho ❌
                    </p>
                ) : (
                    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6">
                        {itens.map((item) => (
                            <div
                                key={item.id}
                                className="flex justify-between items-center border-b border-gray-200 py-3"
                            >
                                <div>
                                    <p className="font-semibold text-lg text-green-700">
                                        {item.post.produto?.nome || "Produto"}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {item.post.produto?.descricao}
                                    </p>
                                     <p className="text-sm text-gray-600">
                                        {item.quantidade}
                                    </p>
                                    <p className="text-gray-800">
                                        💰 Valor unitário: R$ {(item.post.produto?.preco ?? 0).toFixed(2)}
                                    </p>
                                    <p className="text-gray-800">
                                        💰 Sub total: R$ {(item.post.produto?.preco ?? 0) * (item.quantidade || 1).toFixed(2)}
                                    </p>
                                </div>
                                <button
                                    onClick={() => removerItem(item.post.id)}
                                    className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700"
                                >
                                    Remover
                                </button>
                            </div>
                        ))}

                        <div className="mt-6 text-right">
                            <h3 className="text-2xl font-bold text-green-800">
                                Total: R$ {total.toFixed(2)}
                            </h3>
                            <button
                                className="mt-4 bg-green-700 text-white px-6 py-3 rounded-xl hover:bg-green-800 transition"
                                onClick={() => alert("Compra finalizada!")}
                            >
                                Finalizar Compra
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default Carrinho;
