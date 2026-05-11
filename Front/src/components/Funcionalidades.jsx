import React from "react";
import {
  Calendar,
  Bell,
  BarChart3,
  Package,
  Shield,
  Zap,
} from "lucide-react";
import "./Funcionalidades.css";

const features = [
  {
    icon: Calendar,
    title: "Controle de Validade",
    description:
      "Monitore em tempo real as datas de validade de todos os produtos do seu estoque.",
  },
  {
    icon: Bell,
    title: "Alertas Inteligentes",
    description:
      "Receba notificações automáticas antes dos produtos vencerem para tomar ação.",
  },
  {
    icon: BarChart3,
    title: "Relatórios Completos",
    description:
      "Análises detalhadas e dashboards com insights sobre seu inventário.",
  },
  {
    icon: Package,
    title: "Gestão de Estoque",
    description:
      "Controle completo de entrada e saída de produtos com rastreabilidade total.",
  },
  {
    icon: Shield,
    title: "Segurança de Dados",
    description:
      "Seus dados protegidos com criptografia de ponta e backups automáticos.",
  },
  {
    icon: Zap,
    title: "Performance Rápida",
    description:
      "Sistema otimizado para processar milhares de produtos instantaneamente.",
  },
];

export default function Funcionalidades() {
  return (
    <section className="features-section">
      <div className="features-container">
        <div className="features-header">
          <h2>
            Funcionalidades <span className="highlight">Poderosas</span>
          </h2>
          <p>
            Tudo que você precisa para gerenciar seu atacado com eficiência.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div className="feature-card" key={index}>
              <div className="feature-icon">
                <feature.icon size={26} />
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
