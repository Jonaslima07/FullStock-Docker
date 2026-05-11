import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./CompletarCadastro.css";

const CompletarCadastro = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    cpf: "",
    senha: "",
    confirmarSenha: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      toast.error("Sessão expirada. Faça login novamente.");
      navigate("/login");
      return;
    }



    const user = JSON.parse(storedUser);

    if (user.cadastro_completo) {
      navigate("/cadastrarcomercio");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  async function handleSubmit(e) {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!form.cpf || !form.senha || !form.confirmarSenha) {
      toast.error("Preencha todos os campos");
      return;
    }

    if (form.senha !== form.confirmarSenha) {
      toast.error("As senhas não coincidem");
      return;
    }

    console.log("ENVIANDO:", form);

    try {
      const response = await fetch(
        "https://fullstock-back.onrender.com/usuarios/completar-cadastro",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            cpf: form.cpf,
            senha: form.senha,
            
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.msg || "Erro ao completar cadastro");
      }

      const storedUser = JSON.parse(localStorage.getItem("user"));

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...storedUser,
          cpf: form.cpf,
          cadastro_completo: true,
        })
      );

      toast.success("Cadastro completo 🎉");
      navigate("/cadastrarcomercio");
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div className="cc-container">
      <div className="cc-h2">
        <h2>Complete sua conta:</h2>
      </div>

      <form className="cc-form" onSubmit={handleSubmit}>
        <input
          className="cc-input"
          type="text"
          name="cpf"
          placeholder="CPF"
          value={form.cpf}
          onChange={handleChange}
        />

        <input
          className="cc-input"
          type="password"
          name="senha"
          placeholder="Senha"
          value={form.senha}
          onChange={handleChange}
        />

        <input
          className="cc-input"
          type="password"
          name="confirmarSenha"
          placeholder="Confirmar senha"
          value={form.confirmarSenha}
          onChange={handleChange}
        />

        <button className="cc-button" type="submit">
          Salvar
        </button>
      </form>
    </div>
  );
};

export default CompletarCadastro;
