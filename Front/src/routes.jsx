import { createBrowserRouter } from "react-router-dom";
import Layout from "./templates/Layout";
import Home from "./views/Home";
import PDVPage from "./views/PDVPage";
import CriarContaForm from "./views/CriarConta";
import Duvidas from "./views/Duvidas";
import NoPage from "./views/NoPage";
import Historico from "./views/Historico";
import ComercioForm from "./views/CadastrarComercio";
import Dash from "./views/Dashboard";
import LoginUser from "./views/Login";
import ProdutosForm from "./views/CadastrarProdutos";
import Completar from "./views/CompletarCadastro";
import Contactos from "./views/Contatos";
import Senha from "./views/RecuperarSenha";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <NoPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "criarconta", element: <CriarContaForm /> },
      { path:"cadastrarcomercio", element: <ComercioForm />},
      { path:"pdv", element: <PDVPage />},
      { path: "duvidas", element: <Duvidas /> },
      { path: "historico", element: <Historico /> },
      { path:"cadastrarprodutos", element:<ProdutosForm/>},
      { path: "login", element: <LoginUser /> },
      { path: "dashboard", element: <Dash /> },
      { path: "completar-cadastro", element: <Completar /> },
      { path: "contatos", element: <Contactos /> },
      { path: "recuperar-senha", element: <Senha /> },
    ],
  },
]);

export default router;
