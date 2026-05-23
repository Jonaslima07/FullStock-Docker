from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required
from helpers.database import db

from models.Vendas import Vendas
from models.Itens import ItensVenda
from models.Produtos import Produto

vendas_bp = Blueprint("vendas", __name__)

@vendas_bp.route("/vendas", methods=["POST"])
@jwt_required()
def criar_venda():

    user_id = int(get_jwt_identity())

    dados = request.get_json()

    itens = dados["itens"]
    forma_pagamento = dados["forma_pagamento"]

    valor_total = 0

    venda = Vendas(
        usuario_id=user_id,
        valor_total=0,
        forma_pagamento=forma_pagamento
    )

    db.session.add(venda)
    db.session.flush()

    for item in itens:

        produto = Produto.query.get(item["produto_id"])

        if not produto:
            return jsonify({
                "erro": "Produto não encontrado"
            }), 404

        if produto.quantidade < item["quantidade"]:
            return jsonify({
                "erro": f"Estoque insuficiente para {produto.nome}"
            }), 400

        subtotal = (
            produto.preco *
            item["quantidade"]
        )

        item_venda = ItensVenda(
            venda_id=venda.id,
            produto_id=produto.id,
            quantidade=item["quantidade"],
            preco_unitario=produto.preco,
            subtotal=subtotal
        )

        produto.quantidade -= item["quantidade"]

        valor_total += subtotal

        db.session.add(item_venda)

    venda.valor_total = valor_total

    db.session.commit()

    return jsonify({
        "msg": "Venda realizada com sucesso",
        "venda_id": venda.id,
        "valor_total": valor_total
    }), 201

@vendas_bp.route("/vendas", methods=["GET"])
@jwt_required()
def listar_vendas():

    vendas = Vendas.query.all()

    resultado = []

    for venda in vendas:
        resultado.append(venda.to_dict())

    return jsonify(resultado), 200

@vendas_bp.route("/vendas/<int:id>", methods=["GET"])
@jwt_required()
def buscar_venda(id):

    venda = Vendas.query.get_or_404(id)

    itens = []

    for item in venda.itens:
        itens.append({
            "produto": item.produto.nome,
            "quantidade": item.quantidade,
            "subtotal": item.subtotal
        })

    return jsonify({
        "venda": venda.to_dict(),
        "itens": itens
    })