import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Mail, Phone } from "lucide-react";
import "./Contact.css";

export default function Contact() {
  return (
    <section className="cta-section">
      <div className="cta-container">
        <div className="cta-box">
          <h2>
            Pronto Para <span className="highlight">Otimizar</span> Seu Atacado?
          </h2>
          <p className="cta-subtitle">
            Junte-se a mais de <strong>1500 empresas</strong> que já transformaram sua gestão de estoque com nossa plataforma.
          </p>

          <div className="cta-buttons">
            <Link to="/criarconta" className="btn-primary">
              Turbine seu comércio agora!
            </Link>
          <Link to="/contatos" className="btn-outline">
              Falar com especialista
            </Link>
          </div>

          <div className="cta-contact">
            <div className="contact-item">
              <Mail size={16} />
              <span>contato@sistema.com</span>
            </div>
            <div className="contact-item">
              <Phone size={16} />
              <span>(83) 994107147</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


// 1: 
// <button className="btn-primary">
//               Turbine seu comércio agora!
//               <ArrowRight className="btn-icon" size={18} />
//             </button>

// 2:
// <button className="btn-outline">Falar com Especialista</button>