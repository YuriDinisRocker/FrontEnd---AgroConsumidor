import { useNavigate } from "react-router-dom";


function LandingPage() {

  const navigate = useNavigate();


  return (
    <div className="bg-[#ECE5DF] min-h-screen flex flex-col justify-between">
    
      <header className="bg-gradient-to-b from-[#1D361F] to-[#254B2A] flex justify-end items-center h-20 px-10 shadow-lg rounded-b-2xl">
        <div className="flex gap-5">
          <button onClick={()=>{navigate("/cadastro")}} className="px-5 py-2 bg-gray-100 text-[#1D361F] font-semibold rounded-md border border-[#1D361F] transition-all duration-300 hover:bg-[#2E5433] hover:text-white hover:scale-105">
            Cadastrar
          </button>
          <button onClick={()=>{navigate("/login")}} className="px-5 py-2 bg-[#1D361F] text-white font-semibold rounded-md border border-[#1D361F] transition-all duration-300 hover:bg-[#2E5433] hover:scale-105">
            Entrar
          </button>
        </div>
      </header>

      
      <main className="flex flex-col items-center justify-center flex-grow text-center px-4">
        <div className="bg-[#C4C7B6] rounded-2xl p-10 shadow-md flex flex-col items-center gap-4 max-w-2xl">
          <h1 className="text-5xl md:text-6xl font-extrabold text-[#1D361F] tracking-wide">
            Agro<span className="text-[#4E7137]">Consumidor</span>
          </h1>
          <p className="text-xl text-[#859B48] font-medium">
            Conectando o agricultor rural ao consumidor final
          </p>
          <p className="text-sm text-gray-700 mt-2">
            Uma plataforma que une o campo e a cidade, promovendo sustentabilidade e acesso direto a produtos frescos.
          </p>

          <div className="mt-6 flex gap-4">
            <button className="px-6 py-3 bg-[#1D361F] text-white rounded-md text-lg font-medium hover:bg-[#2E5433] transition-all">
              Quero Vender
            </button>
            <button className="px-6 py-3 bg-white text-[#1D361F] border border-[#1D361F] rounded-md text-lg font-medium hover:bg-[#C4C7B6] transition-all">
              Quero Comprar
            </button>
          </div>
        </div>
      </main>

      
      <footer className="bg-gradient-to-t from-[#1D361F] to-[#254B2A] text-center text-gray-100 py-4 rounded-t-2xl">
        <p className="text-sm">
            AgroConsumidor
        </p>
      </footer>
    </div>
  );
}

export default LandingPage;
