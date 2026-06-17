import { useState } from "react";
import "./CriarConta.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { FcGoogle } from "react-icons/fc";

const CriarConta = () => {
  const [form, setForm] = useState({
    nome: "",
    cpf: "",
    email: "",
    senha: "",
    confirmarSenha: "",
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

 async function handleGoogleRegister(e) {
  e.preventDefault();

  try {
    const result = await signInWithPopup(auth, provider);
    const idToken = await result.user.getIdToken();

    const response = await fetch("http://localhost:5000/auth/google", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idToken }),
    });

    const data = await response.json();

    console.log("RESPOSTA GOOGLE:", data);

    if (!response.ok) {
      throw new Error(
        data.error || "Erro ao criar conta com Google"
      );
    }

    if (!data.access_token) {
      throw new Error("Token não recebido do backend");
    }

    localStorage.setItem("token", data.access_token);
    localStorage.setItem("user", JSON.stringify(data.user));

    console.log(
      "TOKEN SALVO:",
      localStorage.getItem("token")
    );

    toast.success("Conta criada com Google 🎉");
    console.log("RESPOSTA GOOGLE:", data);

    if (data.user?.cadastro_completo) {
      navigate("/dashboard");
    } else {
      navigate("/completar-cadastro");
    }
  } catch (err) {
    console.error(err);
    toast.error(err.message || "Erro ao criar conta com Google");
  }
}
  function validarSenha(senha) {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-])[A-Za-z\d@$!%*?&.#_-]{8,}$/;

    return regex.test(senha);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const { nome, cpf, email, senha, confirmarSenha } = form;

    if (!nome || !cpf || !email || !senha || !confirmarSenha) {
      toast.error("Preencha todos os campos.");
      return;
    }

    if (senha !== confirmarSenha) {
      toast.error("As senhas não coincidem.");
      return;
    }

    if (!validarSenha(senha)) {
      toast.error(
        "A senha deve ter no mínimo 8 caracteres, incluindo letra maiúscula, minúscula, número e caractere especial.",
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://localhost:5000/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome,
          email,
          cpf,
          senha,
          confirmarSenha,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Erro ao criar conta");
      }

      toast.success("Conta cadastrada com sucesso! 🎉");
      navigate("/login");
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-criar-conta">
      <h2 className="h2-text">Crie sua conta agora</h2>

      <div className="form-conta">
        <form onSubmit={handleSubmit}>
          <label>Nome completo:</label>
          <input
            type="text"
            name="nome"
            value={form.nome}
            onChange={handleChange}
            placeholder="Digite seu nome"
          />

          <label>CPF:</label>
          <input
            type="text"
            name="cpf"
            value={form.cpf}
            onChange={handleChange}
            placeholder="Digite seu CPF"
          />

          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Digite seu email"
          />

          <label>Senha:</label>
          <input
            type="password"
            name="senha"
            value={form.senha}
            onChange={handleChange}
            placeholder="Digite sua senha"
          />

          <label>Confirmar senha:</label>
          <input
            type="password"
            name="confirmarSenha"
            value={form.confirmarSenha}
            onChange={handleChange}
            placeholder="Digite sua senha novamente"
          />

          <button type="submit" disabled={loading}>
            {loading ? "Criando..." : "Cadastrar"}
          </button>

          <p className="text-login">
            Já possui conta?
            <Link className="link" to="/login">
              Faça login
            </Link>
          </p>

          
          <button
            className="button-google"
            type="button"
            onClick={handleGoogleRegister}
          >
            <FcGoogle size={22} />
            <span>Google</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default CriarConta;
