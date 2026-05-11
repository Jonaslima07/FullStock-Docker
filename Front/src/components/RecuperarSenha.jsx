import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import "./Senha.css"
import { toast } from "react-toastify";

const RecuperarSenha = () => {
  const [email, setEmail] = useState("");

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    await sendPasswordResetEmail(auth, email);
    toast.info("Se o email estiver cadastrado, você receberá um link. Verifique a caixa de SPAM");
  } catch (error) {
    console.error(error);
    toast.error("Erro ao enviar solicitação.");
  }
};

  return (
    <div className="container-senha">
      <h2 className="titulo-senha">Recuperar Senha</h2>
      <p className="subtitulo-senha">Preencha o campo a seguir com o email cadastrado no sistema.</p>

      <form className="form-senha" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Digite seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button className="botao-senha" type="submit">Enviar</button>
      </form>
    </div>
  );
};

export default RecuperarSenha;
