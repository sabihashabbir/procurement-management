
from sqlalchemy import Column, Integer, String, Float, Text, DateTime
from sqlalchemy.sql import func
from .database import Base
from sqlalchemy import ForeignKey


class Department(Base):
    __tablename__ = "departments"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, unique=True)
    description = Column(Text, nullable=True)
    status = Column(String(30), default="Active")
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, unique=True)
    description = Column(Text, nullable=True)
    status = Column(String(30), default="Active")
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )


class PurchaseRequest(Base):
    __tablename__ = "purchase_requests"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    department = Column(String(100), nullable=False)
    amount = Column(Float, nullable=False)
    description = Column(Text, nullable=True)
    status = Column(String(30), default="Pending")
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class PurchaseOrder(Base):
    __tablename__ = "purchase_orders"

    id = Column(Integer, primary_key=True, index=True)
    request_id = Column(Integer, nullable=False)
    supplier = Column(String(200), nullable=False)
    amount = Column(Float, nullable=False)
    status = Column(String(30), default="Draft")
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Supplier(Base):
    __tablename__ = "suppliers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    contact_person = Column(String(150), nullable=True)
    email = Column(String(200), nullable=True)
    phone = Column(String(30), nullable=True)
    address = Column(Text, nullable=True)
    status = Column(String(30), default="Active")
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)

    purchase_order_id = Column(
        Integer,
        ForeignKey("purchase_orders.id"),
        nullable=False
    )

    supplier = Column(String(200), nullable=False)
    amount = Column(Float, nullable=False)

    payment_method = Column(String(50), nullable=True)
    reference_number = Column(String(100), nullable=True)

    status = Column(String(30), default="Pending")
    transaction_date = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    notes = Column(Text, nullable=True)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

class Contract(Base):
    __tablename__ = "contracts"

    id = Column(Integer, primary_key=True, index=True)

    supplier = Column(String(200), nullable=False)
    title = Column(String(200), nullable=False)

    contract_value = Column(Float, nullable=False)

    start_date = Column(String(30), nullable=True)
    end_date = Column(String(30), nullable=True)

    status = Column(String(30), default="Draft")

    description = Column(Text, nullable=True)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )
