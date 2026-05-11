import { Link, useNavigate } from "react-router-dom";
import "./Header.css";

export default function Header() {
 
  const isAuthenticated = false;

  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  return (
    <header className="header">
      <h2 className="logo">FullStock</h2>

      {!isAuthenticated ? (
        <nav>
          {/* <Link to="/">Home</Link> */}
          <Link to="/criarconta">Criar Conta</Link>
          <Link to="/login">Login</Link>
          
        </nav>
      ) : (
        <nav>
          <Link to="/">Home</Link>
          <Link to="#">Produtos</Link>
          <Link to="#">Alertas</Link>
          <button className="btn-logout" onClick={handleLogout}>
            Sair
          </button>
        </nav>
      )}
    </header>
  );
}
