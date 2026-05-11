import { createBrowserRouter } from "react-router-dom";
import Layout from "./templates/Layout";
import Home from "./views/Home";
import CriarContaForm from "./views/CriarConta";
import Duvidas from "./views/Duvidas";
import NoPage from "./views/NoPage";
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
      { path: "duvidas", element: <Duvidas /> },
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
