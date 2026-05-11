import React from "react";
import "./Duvidas.css";
import { useNavigate } from "react-router-dom";

export default function Duvidas() {
    const navigate = useNavigate();

    return (
        <div className="duvidas-container">
            <div className="duvidas-card">
                <h1 className="duvidas-title">
                    Seção de Dúvidas sobre o Sistema
                </h1>

                <div className="duvidas-question">
                    <h2>Qual é o objetivo do sistema?</h2>
                </div>

                <div className="duvidas-answer">
                    <p>• Garantir um processo de rastreabilidade eficiente</p>
                    <p>• Assegurar a qualidade e conformidade dos produtos</p>
                    <p>• Evitar vendas de itens fora do prazo de validade</p>
                    <p>• Reduzir perdas financeiras para comerciantes e distribuidores</p>
                </div>
            </div>

            <div className="text">
                <p>
                    Nosso sistema foi desenvolvido para oferecer controle, segurança e automação no
                    gerenciamento de produtos. Ele auxilia atacadistas e varejistas a manterem um
                    fluxo de estoque organizado e confiável, reduzindo riscos e otimizando processos.
                </p>
            </div>

            <div className="return">
                <p>
                    Acesse agora mesmo o nosso sistema e faça o cadastro do seu comércio para garantir nossas vantagens de mercado!
                </p>
            </div>

            <div className="div-botao">
                <button className="botao" onClick={() => navigate("/criarconta")}>Começar agora</button>
            </div>
        </div>
    );
}
