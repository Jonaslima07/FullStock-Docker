import React from "react";
import { FaLinkedin, FaWhatsapp } from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-section">
            <h3 className="footer-title">FullStock</h3>
            <p className="footer-text">
              Sistema profissional de gerenciamento de produtos
            </p>
          </div>

          <div className="produto">
            <h4 className="footer-subtitle">Produto</h4>
            <ul>
              <li><a href="/dashboard">Funcionalidades</a></li>
              
            </ul>
          </div>

          <div className="empresa">
            <h4 className="footer-subtitle">Empresa</h4>
            <ul>
              <li><a href="/duvidas">Sobre Nós</a></li>
            
              <li><a href="/contatos">Contatos</a></li>
            </ul>
          </div>

          <div className="legal">
            <h4 className="footer-subtitle">Legal</h4>
            <ul>
              <li><a target="_blank" href="https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm">LGPD</a></li>
            </ul>
          </div>
        </div>
      </div>

    
      <div className="footer-bottom">
        © {new Date().getFullYear()} FullStock - Todos os direitos reservados.
      </div>
    </footer>
  );
};

export default Footer;
