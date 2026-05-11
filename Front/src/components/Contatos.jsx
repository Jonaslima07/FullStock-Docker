import "./Contatos.css";
import { FaWhatsapp, FaEnvelope } from "react-icons/fa";

const Contatos = () => {
  return (
    <div className="contatos-container">
      <div className="grid-contatos">
        <h4 className="text-contatos">
          Entre em contato conosco através das opções abaixo:
        </h4>

        <ul className="contatos-lista">
          <li>
            <a
              className="zap"
              href="https://wa.me/5583004107147"
              rel="noreferrer"
            >
              <FaWhatsapp className="icon" />
              WhatsApp
            </a>
          </li>

          <li>
            <a className="email" href="mailto:jonaslimastz@gmail.com">
              <FaEnvelope className="icon" />
              Email
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Contatos;
