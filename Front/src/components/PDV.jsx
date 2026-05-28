import { useEffect, useRef, useState } from "react";
import "./PDV.css";
import { toast } from "react-toastify";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function PDV() {
  const [codigo, setCodigo] = useState("");
  const [carrinho, setCarrinho] = useState([]);
  const [formaPagamento, setFormaPagamento] = useState("pix");

  const [mostrarProdutos, setMostrarProdutos] = useState(false);
  const [produtos, setProdutos] = useState([]);

  const [tipoCartao, setTipoCartao] = useState("credito");
  const [vezes, setVezes] = useState(1);

  const [loading, setLoading] = useState(false);

  const inputRef = useRef(null);

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      toast.error("Faça login novamente");

      navigate("/login");

      return;
    }

    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  function verificarTokenExpirado(response) {
    if (response.status === 401 || response.status === 422) {
      toast.error("Sessão expirada. Faça login novamente.");

      localStorage.removeItem("token");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

      return true;
    }

    return false;
  }

  async function buscarProduto(e) {
    if (e.key !== "Enter") return;

    if (!codigo.trim()) return;

    if (!token) {
      toast.error("Faça login novamente");

      navigate("/login");

      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `http://localhost:5000/produtos/codigo/${codigo}`,
        {
          method: "GET",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (verificarTokenExpirado(response)) return;

      const produto = await response.json();

      if (!response.ok) {
        toast.error(produto.msg || "Produto não encontrado");
        return;
      }

      const produtoExiste = carrinho.find(
        (item) => item.id === produto.id,
      );

      if (produtoExiste) {
        const atualizado = carrinho.map((item) => {
          if (item.id === produto.id) {
            return {
              ...item,
              quantidade: item.quantidade + 1,
            };
          }

          return item;
        });

        setCarrinho(atualizado);
      } else {
        setCarrinho([
          ...carrinho,
          {
            ...produto,
            quantidade: 1,
          },
        ]);
      }

      setCodigo("");

      if (inputRef.current) {
        inputRef.current.focus();
      }
    } catch (error) {
      console.log(error);

      toast.error("Erro ao buscar produto");
    } finally {
      setLoading(false);
    }
  }

  async function buscarTodosProdutos() {
    if (!token) {
      toast.error("Faça login novamente");

      navigate("/login");

      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/produtos",
        {
          method: "GET",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (verificarTokenExpirado(response)) return;

      const resultado = await response.json();

      if (!response.ok) {
        toast.error(
          resultado.msg || "Erro ao buscar produtos",
        );

        return;
      }

      setProdutos(resultado);

      setMostrarProdutos(true);
    } catch (error) {
      console.log(error);

      toast.error("Erro ao carregar produtos");
    } finally {
      setLoading(false);
    }
  }

  function aumentarQuantidade(id) {
    const atualizado = carrinho.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          quantidade: item.quantidade + 1,
        };
      }

      return item;
    });

    setCarrinho(atualizado);
  }

  function diminuirQuantidade(id) {
    const atualizado = carrinho
      .map((item) => {
        if (item.id === id) {
          return {
            ...item,
            quantidade: item.quantidade - 1,
          };
        }

        return item;
      })
      .filter((item) => item.quantidade > 0);

    setCarrinho(atualizado);
  }

  function removerProduto(id) {
    const atualizado = carrinho.filter(
      (item) => item.id !== id,
    );

    setCarrinho(atualizado);
  }

  const total = carrinho.reduce((acc, item) => {
    return acc + item.preco * item.quantidade;
  }, 0);

  async function finalizarVenda() {
    if (carrinho.length === 0) {
      toast.error("Carrinho vazio");
      return;
    }

    if (!token) {
      toast.error("Faça login novamente");

      navigate("/login");

      return;
    }

    try {
      setLoading(true);

      const dados = {
        forma_pagamento:
          formaPagamento === "cartao"
            ? tipoCartao
            : formaPagamento,

        parcelas:
          formaPagamento === "cartao" &&
          tipoCartao === "credito"
            ? vezes
            : 1,

        itens: carrinho.map((item) => ({
          produto_id: item.id,
          quantidade: item.quantidade,
        })),
      };

      const response = await fetch(
        "http://localhost:5000/vendas",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(dados),
        },
      );

      if (verificarTokenExpirado(response)) return;

      const resultado = await response.json();

      if (!response.ok) {
        toast.error(resultado.msg || "Erro na venda");

        return;
      }

      toast.success("Venda realizada com sucesso");

      setCarrinho([]);

      setCodigo("");

      if (inputRef.current) {
        inputRef.current.focus();
      }
    } catch (error) {
      console.log(error);

      toast.error("Erro ao finalizar venda");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pdv-container">
      <div className="pdv-content">
        <div className="pdv-header">
          <h1 className="pdv-title">PDV FullStock</h1>

          <button
            className="pdv-search-btn"
            onClick={buscarTodosProdutos}
          >
            <FaSearch />
          </button>
        </div>

        <input
          ref={inputRef}
          type="text"
          placeholder="Digite ou escaneie o código de barras"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          onKeyDown={buscarProduto}
          className="pdv-input"
        />

        {carrinho.length === 0 ? (
          <div className="pdv-empty">
            Nenhum produto no carrinho
          </div>
        ) : (
          <div className="pdv-cart">
            {carrinho.map((item) => (
              <div key={item.id} className="pdv-item">
                <div className="pdv-item-info">
                  <h3>{item.nome}</h3>

                  <p>
                    R$ {Number(item.preco).toFixed(2)}
                  </p>
                </div>

                <div className="pdv-quantity">
                  <button
                    onClick={() =>
                      diminuirQuantidade(item.id)
                    }
                  >
                    -
                  </button>

                  <span>{item.quantidade}</span>

                  <button
                    onClick={() =>
                      aumentarQuantidade(item.id)
                    }
                  >
                    +
                  </button>
                </div>

                <div className="pdv-price">
                  R${" "}
                  {(
                    item.preco * item.quantidade
                  ).toFixed(2)}
                </div>

                <button
                  className="pdv-remove"
                  onClick={() =>
                    removerProduto(item.id)
                  }
                >
                  Remover
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="pdv-footer">
          <h2 className="pdv-total">
            Total: R$ {total.toFixed(2)}
          </h2>

          <select
            value={formaPagamento}
            onChange={(e) =>
              setFormaPagamento(e.target.value)
            }
            className="pdv-select"
          >
            <option value="pix">PIX</option>

            <option value="cartao">Cartão</option>

            <option value="dinheiro">Dinheiro</option>
          </select>

          {formaPagamento === "cartao" && (
            <select
              value={tipoCartao}
              onChange={(e) =>
                setTipoCartao(e.target.value)
              }
              className="pdv-select-cartao"
            >
              <option value="credito">
                Crédito
              </option>

              <option value="debito">
                Débito
              </option>
            </select>
          )}

          {formaPagamento === "cartao" &&
            tipoCartao === "credito" && (
              <select
                value={vezes}
                onChange={(e) =>
                  setVezes(e.target.value)
                }
                className="pdv-select-vezes"
              >
                <option value="1">1 vez</option>
                <option value="2">2 vezes</option>
                <option value="3">3 vezes</option>
                <option value="4">4 vezes</option>
                <option value="5">5 vezes</option>
              </select>
            )}

          <br />

          <button
            onClick={finalizarVenda}
            disabled={loading}
            className="pdv-finalizar"
          >
            {loading
              ? "Processando..."
              : "Finalizar Venda"}
          </button>
        </div>

        {mostrarProdutos && (
          <div className="pdv-modal">
            <div className="pdv-modal-content">
              <div className="pdv-modal-header">
                <h2 className="pdv-modal-title">Produtos Cadastrados</h2>

                <button
                  onClick={() =>
                    setMostrarProdutos(false)
                  }
                  className="pdv-close"
                >
                  X
                </button>
              </div>

              <div className="pdv-produtos-lista">
                {produtos.map((produto) => (
                  <div
                    key={produto.id}
                    className="pdv-produto-card"
                  >
                    <h3>{produto.nome}</h3>

                    <p>
                      <strong>Código:</strong>{" "}
                      {produto.codigo_barras}
                    </p>

                    <p>
                      <strong>Quantidade:</strong>{" "}
                      {produto.quantidade}
                    </p>

                    <p>
                      <strong>Preço:</strong> R${" "}
                      {Number(produto.preco).toFixed(
                        2,
                      )}
                    </p>

                    <p>
                      <strong>Categoria:</strong>{" "}
                      {produto.categoria}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PDV;