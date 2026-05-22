from helpers.database import db


class ItensVenda(db.Model):
    __tablename__ = "itens_venda"

    id = db.Column(db.Integer, primary_key=True)

    venda_id = db.Column(
        db.Integer,
        db.ForeignKey("vendas.id"),
        nullable=False
    )

    produto_id = db.Column(
        db.Integer,
        db.ForeignKey("produtos.id"),
        nullable=False
    )

    quantidade = db.Column(
        db.Integer,
        nullable=False
    )

    preco_unitario = db.Column(
        db.Float,
        nullable=False
    )

    subtotal = db.Column(
        db.Float,
        nullable=False
    )

    produto = db.relationship(
        "Produto",
        backref="itens_venda",
        lazy=True
    )

    def to_dict(self):
        return {
            "id": self.id,
            "produto_id": self.produto_id,
            "quantidade": self.quantidade,
            "preco_unitario": self.preco_unitario,
            "subtotal": self.subtotal
        }