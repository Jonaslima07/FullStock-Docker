from helpers.database import db
from datetime import datetime
from zoneinfo import ZoneInfo


class Vendas(db.Model):
    __tablename__ = "vendas"

    id = db.Column(db.Integer, primary_key=True)

    data = db.Column(
        db.DateTime,
        default=lambda: datetime.now(
            ZoneInfo("America/Sao_Paulo")
        ),
        nullable=False
    )

    valor_total = db.Column(
        db.Float,
        nullable=False
    )

    forma_pagamento = db.Column(
        db.String(50),
        nullable=False
    )

    usuario_id = db.Column(
        db.Integer,
        db.ForeignKey("usuarios.id"),
        nullable=True
    )

    itens = db.relationship(
        "ItensVenda",
        backref="venda",
        lazy=True,
        cascade="all, delete-orphan"
    )

    def to_dict_completo(self):
        return {
            "id": self.id,
            "data": self.data.strftime("%d/%m/%Y"),
            "hora": self.data.strftime("%H:%M"),
            "valor_total": self.valor_total,
            "forma_pagamento": self.forma_pagamento,
            "usuario_id": self.usuario_id,
            "itens": [item.to_dict() for item in self.itens]
        }