import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { auth, provider, signInWithPopup } from "../firebase";
import { FcGoogle } from "react-icons/fc";
import "./Login.css";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    senha: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  // 🔐 LOGIN NORMAL
  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.email || !form.senha) {
      toast.error("Preencha email e senha");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://localhost:5000/usuarios/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          senha: form.senha,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro no login");
      }

      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success("Login realizado com sucesso 🎉");

      if (data.user.cadastro_completo) {
        navigate("/dashboard");
      } else {
        navigate("/completar-cadastro");
      }

    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  // 🔵 LOGIN COM GOOGLE
  async function handleGoogleLogin() {
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

      if (!response.ok) {
        throw new Error(data.error || "Erro no login Google");
      }

      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success("Login com Google realizado 🎉");

      if (data.user.cadastro_completo) {
        navigate("/dashboard");
      } else {
        navigate("/completar-cadastro");
      }

    } catch (error) {
      console.error(error);
      toast.error("Erro ao fazer login com Google");
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Faça login e acesse sua conta</h2>

        <form className="login-form" onSubmit={handleSubmit}>
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

          <button type="submit" disabled={loading}>
            {loading ? "Logando..." : "Logar"}
          </button>

          <div className="div-senha">
            <a className="link-senha" href="/recuperar-senha">
              Esqueci minha senha
            </a>
          </div>
        </form>

        <hr className="login-divider" />

        <button
          className="button-google-login"
          type="button"
          onClick={handleGoogleLogin}
        >
          <FcGoogle size={22} />
          <span>Login com Google</span>
        </button>
      </div>
    </div>
  );
};

export default Login;