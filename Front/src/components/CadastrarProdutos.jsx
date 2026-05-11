import { useEffect, useState } from "react";
import "./CadastrarProdutos.css";
import { FaArrowLeft } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CadastrarProdutos = () => {
  const [form, setForm] = useState({
    nome: "",
    categoria: "",
    marca: "",
    preco: "",
    tipo: "",
    quantidade: "",
    unidade: "un",
    data_validade: "",
  });

  const navigate = useNavigate();

  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editandoId, setEditandoId] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function fetchProdutos() {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:5000/produtos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401 || res.status === 422) {
        toast.error("Sessão expirada. Faça login novamente.");

        localStorage.removeItem("token");

        setTimeout(() => {
          navigate("/login");
        }, 1500);

        return;
      }

      const data = await res.json();
      setProdutos(data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchProdutos();
  }, []);

  const produtosFiltrados = produtos.filter((p) =>
    `${p.nome} ${p.categoria} ${p.marca}`
      .toLowerCase()
      .includes(busca.toLowerCase()),
  );

  async function handleSubmit(e) {
    e.preventDefault();

    const token = localStorage.getItem("token");

    try {
      setLoading(true);

      const metodo = editandoId ? "PUT" : "POST";
      const url = editandoId
        ? `http://localhost:5000/produtos/${editandoId}`
        : "http://localhost:5000/produtos";

      const body = {
        nome: form.nome,
        categoria: form.categoria,
        marca: form.marca,
        tipo: form.tipo,
        preco: Number(form.preco),
        quantidade: Number(form.quantidade),
        unidade: form.unidade,
        data_validade: form.data_validade,
      };

      const res = await fetch(url, {
        method: metodo,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (res.status === 401 || res.status === 422) {
        toast.error("Sessão expirada. Faça login novamente.");

        localStorage.removeItem("token");

        setTimeout(() => {
          navigate("/login");
        }, 1500);

        return;
      }

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Erro ao salvar");

      toast.success(editandoId ? "Produto atualizado!" : "Produto cadastrado!");

      setModalOpen(false);
      setEditandoId(null);
      fetchProdutos();

      setForm({
        nome: "",
        categoria: "",
        marca: "",
        preco: "",
        tipo: "",
        quantidade: "",
        unidade: "un",
        data_validade: "",
      });
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Token não encontrado. Faça login novamente.");
      navigate("/login");
      return;
    }

    if (!window.confirm("Deseja excluir este produto?")) return;

    try {
      const res = await fetch(`http://localhost:5000/produtos/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401 || res.status === 422) {
        toast.error("Sessão expirada. Faça login novamente.");

        localStorage.removeItem("token");

        setTimeout(() => {
          navigate("/login");
        }, 1500);

        return;
      }

      if (!res.ok) throw new Error("Erro ao excluir");

      toast.success("Produto excluído");
      fetchProdutos();
    } catch (err) {
      toast.error("Erro ao excluir");
    }
  }

  return (
    <div className="container-principal">
      <div className="header-produtos">
        <div className="header-left">
          <button className="btn-voltar" onClick={() => navigate("/dashboard")}>
            <FaArrowLeft />
          </button>

          <h2>Produtos Cadastrados</h2>
        </div>

        <button className="btn-add" onClick={() => setModalOpen(true)}>
          Adicionar
        </button>
      </div>

      <div className="busca-container">
        <input
          type="text"
          placeholder="Buscar produto..."
          className="input-busca"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>

      <div className="card-produtos">
        <table className="tabela-produtos">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Categoria</th>
              <th>Marca</th>
              <th>Tipo</th>
              <th>Preço</th>
              <th>Quantidade</th>
              <th>Validade</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {produtosFiltrados.length === 0 ? (
              <tr>
                <td colSpan="7">Nenhum produto encontrado</td>
              </tr>
            ) : (
              produtosFiltrados.map((p, index) => (
                <tr
                  key={p.id}
                  className={index % 2 === 0 ? "linha-par" : "linha-impar"}
                >
                  <td>{p.nome}</td>
                  <td>{p.categoria}</td>
                  <td>{p.marca}</td>
                  <td>{p.tipo}</td>
                  <td>R$ {Number(p.preco).toFixed(2)}</td>
                  <td>{p.quantidade}</td>
                  <td>{p.data_validade}</td>

                  <td className="acoes">
                    <button
                      className="btn-edit"
                      onClick={() => {
                        setForm({
                          nome: p.nome || "",
                          categoria: p.categoria || "",
                          marca: p.marca || "",
                          tipo: p.tipo || "",
                          preco: p.preco || "",
                          quantidade: p.quantidade || "",
                          unidade: p.unidade || "un",
                          data_validade: p.data_validade
                            ? p.data_validade.split("T")[0]
                            : "",
                        });
                        setEditandoId(p.id);
                        setModalOpen(true);
                      }}
                    >
                      Editar
                    </button>

                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(p.id)}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 🪟 MODAL */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setModalOpen(false)}>
              ✕
            </button>

            <h3>{editandoId ? "Editar Produto" : "Cadastrar Produto"}</h3>

            <form onSubmit={handleSubmit}>
              <input
                name="nome"
                placeholder="Nome"
                value={form.nome}
                onChange={handleChange}
              />
              <input
                name="categoria"
                placeholder="Categoria"
                value={form.categoria}
                onChange={handleChange}
              />
              <input
                type="date"
                name="data_validade"
                value={form.data_validade}
                onChange={handleChange}
              />
              <input
                name="marca"
                placeholder="Marca"
                value={form.marca}
                onChange={handleChange}
              />
              <input
                name="tipo"
                placeholder="Tipo"
                value={form.tipo}
                onChange={handleChange}
              />
              <input
                type="number"
                name="preco"
                placeholder="Preço"
                value={form.preco}
                onChange={handleChange}
              />
              <input
                type="number"
                name="quantidade"
                placeholder="Quantidade"
                value={form.quantidade}
                onChange={handleChange}
              />

              <select
                name="unidade"
                value={form.unidade}
                onChange={handleChange}
              >
                <option value="un">Unidade</option>
                <option value="kg">Kg</option>
                <option value="caixa">Lote</option>
              </select>

              <button type="submit">
                {loading ? "Salvando..." : "Salvar"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CadastrarProdutos;
