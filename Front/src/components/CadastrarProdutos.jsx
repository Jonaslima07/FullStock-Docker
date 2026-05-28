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
    codigo_barras: "",
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

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
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
      toast.error("Erro ao carregar produtos");
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

  function handleEdit(produto) {
    setEditandoId(produto.id);

    setForm({
      nome: produto.nome || "",
      categoria: produto.categoria || "",
      marca: produto.marca || "",
      preco: produto.preco || "",
      tipo: produto.tipo || "",
      codigo_barras: produto.codigo_barras || "",
      quantidade: produto.quantidade || "",
      unidade: produto.unidade || "un",
      data_validade: produto.data_validade || "",
    });

    setModalOpen(true);
  }

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
        codigo_barras: form.codigo_barras,
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

      if (!res.ok) {
        throw new Error(data.message || "Erro ao salvar produto");
      }

      toast.success(
        editandoId
          ? "Produto atualizado com sucesso!"
          : "Produto cadastrado com sucesso!",
      );

      setModalOpen(false);

      setEditandoId(null);

      setForm({
        nome: "",
        categoria: "",
        marca: "",
        preco: "",
        tipo: "",
        codigo_barras: "",
        quantidade: "",
        unidade: "un",
        data_validade: "",
      });

      fetchProdutos();
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
      toast.error("Token não encontrado.");
      navigate("/login");
      return;
    }

    const confirmar = window.confirm("Deseja realmente excluir este produto?");

    if (!confirmar) return;

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

      if (!res.ok) {
        throw new Error("Erro ao excluir produto");
      }

      toast.success("Produto excluído com sucesso!");

      fetchProdutos();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao excluir produto");
    }
  }

  return (
    <div className="container-principal">
      <div className="header-produtos">
        <div className="header-left">
          <button className="btn-voltar" onClick={() => navigate("/dashboard")}>
            <FaArrowLeft />
          </button>

          <h2 className="titulo-produtos">Produtos Cadastrados</h2>
        </div>

        <div className="header-actions">
          <button className="btn-pdv" onClick={() => navigate("/pdv")}>
            Ponto de Venda
          </button>

          <button
            className="btn-add"
            onClick={() => {
              setEditandoId(null);

              setForm({
                nome: "",
                categoria: "",
                marca: "",
                preco: "",
                data_validade: "",
                tipo: "",
                codigo_barras: "",
                quantidade: "",
                unidade: "un",
              });

              setModalOpen(true);
            }}
          >
            Adicionar
          </button>
        </div>
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
              <th>Validade</th>
              <th>Preço</th>
              <th>Código de Barras</th>
              <th>Quantidade</th>
              <th>Unidade</th>

              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {produtosFiltrados.map((p, index) => (
              <tr
                key={p.id}
                className={index % 2 === 0 ? "linha-par" : "linha-impar"}
              >
                <td>{p.nome}</td>
                <td>{p.categoria}</td>
                <td>{p.marca}</td>
                <td>{p.tipo}</td>
                <td>{p.data_validade}</td>

                <td>R$ {Number(p.preco).toFixed(2)}</td>

                <td>{p.codigo_barras}</td>

                <td>{p.quantidade}</td>

                <td>{p.unidade}</td>

                <td className="acoes">
                  <button onClick={() => handleEdit(p)} className="btn-edit">
                    ✏️
                  </button>

                  <button
                    onClick={() => handleDelete(p.id)}
                    className="btn-delete"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setModalOpen(false)}>
              ✕
            </button>

            <h3>{editandoId ? "Editar Produto" : "Cadastrar Produto"}</h3>

            <form onSubmit={handleSubmit}>
              <input
                required
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
                type="date"
                name="data_validade"
                value={form.data_validade}
                onChange={handleChange}
              />

              <input
                name="codigo_barras"
                placeholder="Código de Barras"
                value={form.codigo_barras}
                onChange={handleChange}
              />

              <input
                type="number"
                step="0.01"
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
                {loading
                  ? "Salvando..."
                  : editandoId
                    ? "Atualizar Produto"
                    : "Cadastrar Produto"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CadastrarProdutos;
