import React from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  TrendingUp,
  DollarSign,
  Clock,
  Shield,
} from "lucide-react";
import "./Information.css";

const benefits = [
  {
    icon: DollarSign,
    title: "Reduza Perdas",
    description: "Diminua prejuízos com produtos vencidos em até 85%",
  },
  {
    icon: TrendingUp,
    title: "Aumente Eficiência",
    description: "Otimize processos e ganhe até 60% mais produtividade",
  },
  {
    icon: Clock,
    title: "Economize Tempo",
    description: "Automatize tarefas e economize horas de trabalho manual",
  },
  {
    icon: Shield,
    title: "Conformidade Total",
    description: "Mantenha-se em dia com regulamentações e auditorias",
  },
];

export default function Information() {
  return (
    <section className="benefits-section">
      <div className="benefits-container">
        <div className="benefits-content">
          <div className="benefits-left">
            <h2>
              Transforme Seu <span className="highlight">Atacado</span> Com
              Tecnologia
            </h2>
            <p className="subtitle">
              Empresas atacadistas que utilizam nosso sistema têm resultados
              comprovados em gestão de estoque e controle de validade.
            </p>

            <div className="benefit-list">
              {benefits.map((benefit, index) => (
                <div className="benefit-card" key={index}>
                  <div className="benefit-icon">
                    <benefit.icon size={26} />
                  </div>
                  <div>
                    <h3>{benefit.title}</h3>
                    <p>{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link to="/cadastrarcomercio" className="btn-primary">
              Cadastre seu comércio agora!
            </Link>
          </div>

          <div className="benefits-right">
            <h3>O Que Você Ganha:</h3>
            <ul>
              {[
                "Dashboard intuitivo e fácil de usar",
                "Integração com sistemas existentes",
                "Suporte técnico especializado",
                "Atualizações constantes sem custo adicional",
                "Treinamento completo da equipe",
              ].map((item, index) => (
                <li key={index}>
                  <CheckCircle2 size={18} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
