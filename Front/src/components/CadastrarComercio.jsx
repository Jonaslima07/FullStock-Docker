import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./CadastrarComercio.css";

const CadastrarComercio = () => {
  const [form, setForm] = useState({
    nome_comercio: "",
    cnpj: "",
    segmento: "",
    telefone: "",
 
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token) {
    navigate("/login");
    return;
  }

  fetch("http://localhost:5000/comercios/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.has_comercio) {
        toast.info("Você já possui um comércio cadastrado");
        navigate("/dashboard");
      }
    })
    .catch(() => {
      toast.error("Erro ao verificar comércio");
    });
}, [navigate]);


  async function handleSubmit(e) {
    e.preventDefault();

    const { nome_comercio, cnpj, segmento, telefone } = form;

    if (!nome_comercio || !cnpj || !segmento || !telefone) {
      toast.error("Preencha todos os campos.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Usuário não autenticado");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://localhost:5000/comercios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          cadastro_completo: true,
        }),
      });

      const data = await response.json();

   
      if (!response.ok) {
        if (response.status === 409) {
          toast.error(data.msg);
          return;
        }

        if (response.status === 400) {
          toast.error("Você já possui um comércio cadastrado");
          return;
        }

       

        throw new Error(data.msg || "Erro ao cadastrar comércio");
      }

     
      toast.success("Comércio cadastrado com sucesso! 🎉");

      setForm({
        nome_comercio: "",
        cnpj: "",
        segmento: "",
        telefone: "",
      });

      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-comercio">
      <h2 className="h2-text">Faça o cadastro do seu comércio agora</h2>

      <div className="cadastro-comercio">
        <form onSubmit={handleSubmit}>
          <label>Nome do comércio</label>
          <input
            name="nome_comercio"
            value={form.nome_comercio}
            onChange={handleChange}
            placeholder="Digite o nome do comércio"
          />

          <label>CNPJ</label>
          <input
            name="cnpj"
            value={form.cnpj}
            onChange={handleChange}
            placeholder="Digite o CNPJ"
          />

          <label>Segmento</label>
          <input
            name="segmento"
            value={form.segmento}
            onChange={handleChange}
            placeholder="Ex: Mercado, Farmácia..."
          />

          <label>Telefone</label>
          <input
            name="telefone"
            value={form.telefone}
            onChange={handleChange}
            placeholder="Digite o telefone"
          />

          <button type="submit" disabled={loading}>
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CadastrarComercio;
