import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { toast } from "react-toastify";
import "./HistoricoV.css";

function HistoricoVendas() {
  const [vendas, setVendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarDetalhes, setMostrarDetalhes] = useState(false);

  const [vendaSelecionada, setVendaSelecionada] = useState(null);

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    carregarVendas();
  }, []);

  async function abrirDetalhes(id) {
    try {
      const response = await fetch(`http://localhost:5000/vendas/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const resultado = await response.json();

      if (!response.ok) {
        toast.error("Erro ao carregar venda");
        return;
      }

      setVendaSelecionada(resultado);
      setMostrarDetalhes(true);
    } catch (error) {
      console.log(error);
      toast.error("Erro ao carregar detalhes");
    }
  }

  async function carregarVendas() {
    if (!token) {
      toast.error("Faça login novamente");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/vendas", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const resultado = await response.json();

      if (!response.ok) {
        toast.error(resultado.msg || "Erro ao carregar vendas");
        return;
      }

      setVendas(resultado);
    } catch (error) {
      console.log(error);
      toast.error("Erro ao carregar vendas");
    } finally {
      setLoading(false);
    }
  }

  return (
  <div className="historico-container">
    <div className="historico-content">
      <div className="historico-header">
        <button
          className="btn-voltar-historico"
          onClick={() => navigate("/pdv")}
        >
          <FaArrowLeft />
        </button>

        <h1 className="historico-title">Histórico de Vendas</h1>
      </div>

      {loading ? (
        <p className="historico-loading">Carregando vendas...</p>
      ) : vendas.length === 0 ? (
        <p className="historico-empty">Nenhuma venda encontrada.</p>
      ) : (
        <table className="historico-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Data</th>
              <th>Hora</th>
              <th>Pagamento</th>
              <th>Total</th>
              <th>Detalhes</th>
            </tr>
          </thead>

          <tbody>
            {vendas.map((venda) => (
              <tr key={venda.id}>
                <td>{venda.id}</td>

                <td>{venda.data}</td>

                <td>{venda.hora}</td>

                <td>{venda.forma_pagamento}</td>

                <td>
                  R$ {Number(venda.valor_total).toFixed(2)}
                </td>

                <td>
                  <button
                    className="historico-btn-detalhes"
                    onClick={() => abrirDetalhes(venda.id)}
                  >
                    Ver Produtos
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {mostrarDetalhes && vendaSelecionada && (
        <div className="historico-modal">
          <div className="historico-modal-content">
            <div className="historico-modal-header">
              <h2>Venda #{vendaSelecionada.id}</h2>

              <button
                className="historico-close"
                onClick={() => {
                  setMostrarDetalhes(false);
                  setVendaSelecionada(null);
                }}
              >
                X
              </button>
            </div>

            <div className="historico-info">
              <p>
                <strong>Data:</strong> {vendaSelecionada.data}
              </p>

              <p>
                <strong>Hora:</strong> {vendaSelecionada.hora}
              </p>

              <p>
                <strong>Pagamento:</strong>{" "}
                {vendaSelecionada.forma_pagamento}
              </p>

              <p>
                <strong>Total:</strong> R${" "}
                {Number(vendaSelecionada.valor_total).toFixed(2)}
              </p>
            </div>

            <table className="historico-table">
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Quantidade</th>
                  <th>Valor Unitário</th>
                  <th>Subtotal</th>
                </tr>
              </thead>

              <tbody>
                {vendaSelecionada.itens?.map((item) => (
                  <tr key={item.id}>
                    <td>{item.produto_nome}</td>

                    <td>{item.quantidade}</td>

                    <td>
                      R$ {Number(item.preco_unitario).toFixed(2)}
                    </td>

                    <td>
                      R$ {Number(item.subtotal).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  </div>

  );
}

export default HistoricoVendas;
