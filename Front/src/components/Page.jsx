import React from "react";
import "./Page.css";
import background from "../assets/atacado.jpg";
import { useNavigate } from "react-router-dom";

const Page = () => {
  const navigate = useNavigate();

  return (
    <div
      className="dashboard-container"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="overlay"></div>

      <div className="dashboard-content">
        <div className="badge">Sistema Completo de Gestão</div>

        <h1 className="title">
          Gerencie a Validade dos <p>Seus Produtos Atacadistas</p>

        </h1>

        <p className="subtitle">
          Controle total do estoque, alertas automáticos de vencimento e
          relatórios completos para sua operação atacadista.
        </p>

        <div className="buttons">
          <button onClick={() => navigate("/criarconta")} className="btn btn-primary" >Começar Agora →</button>
          <button onClick={() => navigate("/duvidas")} className="btn btn-secondary">Dúvidas sobre o sistema</button>
        </div>

        <div className="stats">
          <div>
            <h2>99.9%</h2>
            <p>Tempo de Atividade</p>
          </div>
          <div>
            <h2>1500+</h2>
            <p>Produtos Monitorados</p>
          </div>
          <div>
            <h2>24/7</h2>
            <p>Monitoramento</p>
          </div>
          <div>
            <h2>100%</h2>
            <p>Segurança Garantida</p>
          </div>
        </div>

      </div>
    </div>

  );
}

export default Page