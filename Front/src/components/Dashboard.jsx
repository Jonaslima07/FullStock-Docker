import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Dashboard.css";
import fotoPerfil from "../assets/fotoPerfil.jpeg";

const Dashboard = () => {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [userModalOpen, setUserModalOpen] = useState(false);

  const [produtos, setProdutos] = useState([]);
  const [quantidadeEstoque, setQuantidadeEstoque] = useState(0);
  const [valorEstoque, setValorEstoque] = useState(0);
  const [mostrarValor, setMostrarValor] = useState(false);

  const [produtosVencidos, setProdutosVencidos] = useState([]);
  const [produtosPertoVencimento, setProdutosPertoVencimento] = useState([]);

  const formatarData = (data) => {
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  const fetchProdutos = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/produtos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setProdutos(data);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  };

  useEffect(() => {
    fetchProdutos();

    const interval = setInterval(() => {
      fetchProdutos();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const vencidos = produtos.filter((p) => {
      if (!p.data_validade) return false;

      const [ano, mes, dia] = p.data_validade.split("-");
      const data = new Date(ano, mes - 1, dia);
      data.setHours(0, 0, 0, 0);

      return data <= hoje;
    });

    setProdutosVencidos(vencidos);

    const perto = produtos.filter((p) => {
      if (!p.data_validade) return false;

      const [ano, mes, dia] = p.data_validade.split("-");
      const data = new Date(ano, mes - 1, dia);
      data.setHours(0, 0, 0, 0);

      const diffDias = (data - hoje) / (1000 * 60 * 60 * 24);

      return diffDias > 0 && diffDias <= 30;
    });

    setProdutosPertoVencimento(perto);
  }, [produtos]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    fetch("http://localhost:5000/usuarios/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        return res.json();
      })
      .then((data) => {
        console.log("Usuario:", data);
        setUsuario(data);
      })
      .catch((err) => {
        console.error("Erro ao buscar usuário:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  useEffect(() => {
    const total = produtos.reduce((acc, produto) => {
      const preco = Number(produto.preco) || 0;
      const quantidade = Number(produto.quantidade) || 0;

      return acc + preco * quantidade;
    }, 0);

    setValorEstoque(total);

    const quantidadeTotal = produtos.reduce((acc, produto) => {
      return acc + (Number(produto.quantidade) || 0);
    }, 0);

    setQuantidadeEstoque(quantidadeTotal);
  }, [produtos]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) {
    return <p style={{ color: "#fff", padding: "40px" }}>Carregando...</p>;
  }

  return (
    <div className="stock-dashboard">
      <div className="header-links">
        <div className="header-left">
          <div className="links-container">
          <Link className="link-header" to="/">
            Home
          </Link>

          <Link className="link-produtos" to="/cadastrarprodutos">
            Cadastrar Produtos
          </Link>

           <Link className="link-pdv" to="/pdv">
            Ponto de Venda
          </Link>
          </div>
        </div>

        <div
          className="header-user-avatar"
          onClick={() => setUserModalOpen(true)}
        >
          {usuario?.photo ? (
            <img
  src={usuario?.photo || fotoPerfil}
  alt="Foto do usuário"
   className="header-user-photo"
  onError={(e) => {
    e.target.src = fotoPerfil;
  }}
/>
          ) : (
            <span className="avatar-letter">
              {usuario?.nome?.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
      </div>

      {/* {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Produtos Cadastrados</h2>

              <button
                className="modal-close"
                onClick={() => setModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              {produtos.length === 0 ? (
                <p>Nenhum produto cadastrado.</p>
              ) : (
                <ul className="stock-list">
                  {produtos.map((produto) => (
                    <li key={produto.id}>
                      <strong>{produto.nome}</strong> - Quantidade:{" "}
                      {produto.quantidade} - Validade:{" "}
                      {formatarData(produto.data_validade)}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )} */}

      {userModalOpen && (
        <div className="modal-overlay" onClick={() => setUserModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setUserModalOpen(false)}
            >
              ✕
            </button>

            <img
  src={usuario?.photo || fotoPerfil}
  alt="Foto do usuário"
  className="modal-user-photo"
  onError={(e) => {
    e.target.src = fotoPerfil;
  }}
/>

            <h3>{usuario?.nome}</h3>
            <p>
              <strong className="text-email">E-mail: </strong>
              <span className="strong-email">{usuario?.email}</span>
            </p>

             <p className="p-comercio">
              <strong className="text-comercio">Comércio: </strong>
              <span className="strong-comercio">{usuario?.comercio}</span>
            </p>
           

            <button className="modal-logout" onClick={handleLogout}>
              Sair da conta
            </button>
          </div>
        </div>
      )}

      <h2 className="stock-dashboard-title">Dashboard de Estoque</h2>

      <p className="stock-dashboard-subtitle">
        Controle geral dos seus produtos
      </p>

      <section className="stock-metrics-grid">
        <div
          className="stock-metric-card"
          onClick={() => setModalOpen(true)}
          style={{ cursor: "pointer" }}
        >
          <h3>Total de produtos</h3>
          <span className="stock-metric-value">{produtos.length}</span>
        </div>

        <div className="stock-metric-card metric-warning">
          <h3>Perto do Vencimento</h3>
          <span className="stock-metric-value">
            {produtosPertoVencimento.length}
          </span>
        </div>

        <div className="stock-metric-card metric-danger">
          <h3>Produtos Vencidos</h3>
          <span className="stock-metric-value">{produtosVencidos.length}</span>
        </div>

        <div className="stock-metric-card metric-alert">
          <h3>Quantidade em Estoque</h3>
          <span className="stock-metric-value">{quantidadeEstoque}</span>
        </div>

        <div className="stock-metric-card metric-success">
          <div className="card-header">
            <h3>Valor em Estoque</h3>

            <button
              className="eye-button"
              onClick={() => setMostrarValor(!mostrarValor)}
            >
              {mostrarValor ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <span className="stock-metric-value">
            {mostrarValor ? `R$ ${valorEstoque.toFixed(2)}` : "••••••"}
          </span>
        </div>
      </section>

      <section className="stock-dashboard-sections">
        <div className="stock-section">
          <h2>⏰ Produtos perto do vencimento:</h2>

          <ul className="stock-list">
            {produtosPertoVencimento.length === 0 ? (
              <li>Sem produtos perto do vencimento</li>
            ) : (
              produtosPertoVencimento.map((p) => (
                <li key={p.id}>
                  • {p.nome} - vence em {formatarData(p.data_validade)}
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="stock-section">
          <h2>❌ Produtos vencidos:</h2>

          <ul className="stock-list stock-list-danger">
            {produtosVencidos.length === 0 ? (
              <li>Sem produtos vencidos</li>
            ) : (
              produtosVencidos.map((p) => (
                <li key={p.id}>
                  • {p.nome} - vencido em {formatarData(p.data_validade)}
                </li>
              ))
            )}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
