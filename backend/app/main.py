from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional


from .database import Base, engine, get_db
from .models import (
    PurchaseRequest,
    PurchaseOrder,
    Supplier,
    Department,
    Category,
    Transaction,
    Contract,
)

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Procurement Management System API")


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# PYDANTIC SCHEMAS
# ============================================================

# ----------------------------
# Purchase Request
# ----------------------------

class RequestCreate(BaseModel):
    title: str
    department: str
    amount: float
    description: Optional[str] = None


# ----------------------------
# Purchase Order
# ----------------------------

class PurchaseOrderCreate(BaseModel):
    request_id: int
    supplier: str
    amount: float


# ----------------------------
# Supplier
# ----------------------------

class SupplierCreate(BaseModel):
    name: str
    contact_person: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None


class SupplierUpdate(BaseModel):
    name: Optional[str] = None
    contact_person: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None


class SupplierStatusUpdate(BaseModel):
    status: str


# ----------------------------
# Department
# ----------------------------

class DepartmentCreate(BaseModel):
    name: str
    description: Optional[str] = None


class DepartmentUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None


class DepartmentStatusUpdate(BaseModel):
    status: str


# ----------------------------
# Category
# ----------------------------

class CategoryCreate(BaseModel):
    name: str
    description: Optional[str] = None


class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None


class CategoryStatusUpdate(BaseModel):
    status: str



# ----------------------------
# Transaction
# ----------------------------

class TransactionCreate(BaseModel):
    purchase_order_id: int
    amount: float
    payment_method: Optional[str] = None
    reference_number: Optional[str] = None
    notes: Optional[str] = None


class TransactionStatusUpdate(BaseModel):
    status: str


# ----------------------------
# Contract
# ----------------------------

class ContractCreate(BaseModel):
    supplier: str
    title: str
    contract_value: float
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    description: Optional[str] = None


class ContractUpdate(BaseModel):
    supplier: Optional[str] = None
    title: Optional[str] = None
    contract_value: Optional[float] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    description: Optional[str] = None


class ContractStatusUpdate(BaseModel):
    status: str


# ============================================================
# ROOT
# ============================================================

@app.get("/")
def root():
    return {
        "message": "Procurement Management API is running"
    }


# ============================================================
# PURCHASE REQUESTS
# ============================================================

@app.get("/api/requests")
def get_requests(db: Session = Depends(get_db)):
    return (
        db.query(PurchaseRequest)
        .order_by(PurchaseRequest.id.desc())
        .all()
    )


@app.post("/api/requests")
def create_request(
    request: RequestCreate,
    db: Session = Depends(get_db)
):
    if not request.title.strip():
        raise HTTPException(
            status_code=400,
            detail="Request title is required"
        )

    if not request.department.strip():
        raise HTTPException(
            status_code=400,
            detail="Department is required"
        )

    if request.amount <= 0:
        raise HTTPException(
            status_code=400,
            detail="Amount must be greater than zero"
        )

    new_request = PurchaseRequest(
        title=request.title.strip(),
        department=request.department.strip(),
        amount=request.amount,
        description=request.description,
        status="Pending"
    )

    db.add(new_request)
    db.commit()
    db.refresh(new_request)

    return new_request


@app.patch("/api/requests/{request_id}/{action}")
def update_request(
    request_id: int,
    action: str,
    db: Session = Depends(get_db)
):
    item = (
        db.query(PurchaseRequest)
        .filter(PurchaseRequest.id == request_id)
        .first()
    )

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Request not found"
        )

    if action not in ["approve", "reject"]:
        raise HTTPException(
            status_code=400,
            detail="Invalid action"
        )

    item.status = (
        "Approved"
        if action == "approve"
        else "Rejected"
    )

    db.commit()
    db.refresh(item)

    return item


# ============================================================
# PURCHASE ORDERS
# ============================================================

@app.get("/api/purchase-orders")
def get_purchase_orders(
    db: Session = Depends(get_db)
):
    return (
        db.query(PurchaseOrder)
        .order_by(PurchaseOrder.id.desc())
        .all()
    )


@app.post("/api/purchase-orders")
def create_purchase_order(
    order: PurchaseOrderCreate,
    db: Session = Depends(get_db)
):
    # Check purchase request
    request = (
        db.query(PurchaseRequest)
        .filter(PurchaseRequest.id == order.request_id)
        .first()
    )

    if not request:
        raise HTTPException(
            status_code=404,
            detail="Purchase request not found"
        )

    # Only approved requests can become POs
    if request.status != "Approved":
        raise HTTPException(
            status_code=400,
            detail="Only approved requests can create purchase orders"
        )

    # Validate supplier
    if not order.supplier.strip():
        raise HTTPException(
            status_code=400,
            detail="Supplier is required"
        )

    # Validate amount
    if order.amount <= 0:
        raise HTTPException(
            status_code=400,
            detail="Amount must be greater than zero"
        )

    new_order = PurchaseOrder(
        request_id=order.request_id,
        supplier=order.supplier.strip(),
        amount=order.amount,
        status="Draft"
    )

    db.add(new_order)
    db.commit()
    db.refresh(new_order)

    return new_order


# ============================================================
# SUPPLIERS
# ============================================================

@app.get("/api/suppliers")
def get_suppliers(
    db: Session = Depends(get_db)
):
    return (
        db.query(Supplier)
        .order_by(Supplier.id.desc())
        .all()
    )


@app.post("/api/suppliers")
def create_supplier(
    supplier: SupplierCreate,
    db: Session = Depends(get_db)
):
    if not supplier.name.strip():
        raise HTTPException(
            status_code=400,
            detail="Supplier name is required"
        )

    # Prevent duplicate supplier names
    existing = (
        db.query(Supplier)
        .filter(Supplier.name == supplier.name.strip())
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Supplier already exists"
        )

    new_supplier = Supplier(
        name=supplier.name.strip(),
        contact_person=supplier.contact_person,
        email=supplier.email,
        phone=supplier.phone,
        address=supplier.address,
        status="Active"
    )

    db.add(new_supplier)
    db.commit()
    db.refresh(new_supplier)

    return new_supplier


@app.put("/api/suppliers/{supplier_id}")
def update_supplier(
    supplier_id: int,
    supplier: SupplierUpdate,
    db: Session = Depends(get_db)
):
    item = (
        db.query(Supplier)
        .filter(Supplier.id == supplier_id)
        .first()
    )

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Supplier not found"
        )

    updates = supplier.model_dump(
        exclude_unset=True
    )

    if "name" in updates:
        if (
            not updates["name"]
            or not updates["name"].strip()
        ):
            raise HTTPException(
                status_code=400,
                detail="Supplier name cannot be empty"
            )

        updates["name"] = updates["name"].strip()

    for field, value in updates.items():
        setattr(item, field, value)

    db.commit()
    db.refresh(item)

    return item


@app.patch("/api/suppliers/{supplier_id}/status")
def update_supplier_status(
    supplier_id: int,
    update: SupplierStatusUpdate,
    db: Session = Depends(get_db)
):
    item = (
        db.query(Supplier)
        .filter(Supplier.id == supplier_id)
        .first()
    )

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Supplier not found"
        )

    if update.status not in ["Active", "Inactive"]:
        raise HTTPException(
            status_code=400,
            detail="Status must be Active or Inactive"
        )

    item.status = update.status

    db.commit()
    db.refresh(item)

    return item


# ============================================================
# DEPARTMENTS
# ============================================================

@app.get("/api/departments")
def get_departments(
    db: Session = Depends(get_db)
):
    return (
        db.query(Department)
        .order_by(Department.id.desc())
        .all()
    )


@app.post("/api/departments")
def create_department(
    department: DepartmentCreate,
    db: Session = Depends(get_db)
):
    name = department.name.strip()

    if not name:
        raise HTTPException(
            status_code=400,
            detail="Department name is required"
        )

    # Prevent duplicate department names
    existing = (
        db.query(Department)
        .filter(Department.name == name)
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Department already exists"
        )

    new_department = Department(
        name=name,
        description=department.description,
        status="Active"
    )

    db.add(new_department)
    db.commit()
    db.refresh(new_department)

    return new_department


@app.put("/api/departments/{department_id}")
def update_department(
    department_id: int,
    department: DepartmentUpdate,
    db: Session = Depends(get_db)
):
    item = (
        db.query(Department)
        .filter(Department.id == department_id)
        .first()
    )

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Department not found"
        )

    updates = department.model_dump(
        exclude_unset=True
    )

    if "name" in updates:
        if (
            not updates["name"]
            or not updates["name"].strip()
        ):
            raise HTTPException(
                status_code=400,
                detail="Department name cannot be empty"
            )

        updates["name"] = updates["name"].strip()

        # Prevent duplicate department names during editing
        existing = (
            db.query(Department)
            .filter(
                Department.name == updates["name"],
                Department.id != department_id
            )
            .first()
        )

        if existing:
            raise HTTPException(
                status_code=400,
                detail="Department already exists"
            )

    for field, value in updates.items():
        setattr(item, field, value)

    db.commit()
    db.refresh(item)

    return item


@app.patch("/api/departments/{department_id}/status")
def update_department_status(
    department_id: int,
    update: DepartmentStatusUpdate,
    db: Session = Depends(get_db)
):
    item = (
        db.query(Department)
        .filter(Department.id == department_id)
        .first()
    )

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Department not found"
        )

    if update.status not in ["Active", "Inactive"]:
        raise HTTPException(
            status_code=400,
            detail="Status must be Active or Inactive"
        )

    item.status = update.status

    db.commit()
    db.refresh(item)

    return item


# ============================================================
# CATEGORIES
# ============================================================

@app.get("/api/categories")
def get_categories(
    db: Session = Depends(get_db)
):
    return (
        db.query(Category)
        .order_by(Category.id.desc())
        .all()
    )


@app.post("/api/categories")
def create_category(
    category: CategoryCreate,
    db: Session = Depends(get_db)
):
    name = category.name.strip()

    if not name:
        raise HTTPException(
            status_code=400,
            detail="Category name is required"
        )

    # Prevent duplicate category names
    existing = (
        db.query(Category)
        .filter(Category.name == name)
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Category already exists"
        )

    new_category = Category(
        name=name,
        description=category.description,
        status="Active"
    )

    db.add(new_category)
    db.commit()
    db.refresh(new_category)

    return new_category


@app.put("/api/categories/{category_id}")
def update_category(
    category_id: int,
    category: CategoryUpdate,
    db: Session = Depends(get_db)
):
    item = (
        db.query(Category)
        .filter(Category.id == category_id)
        .first()
    )

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Category not found"
        )

    updates = category.model_dump(
        exclude_unset=True
    )

    if "name" in updates:
        if (
            not updates["name"]
            or not updates["name"].strip()
        ):
            raise HTTPException(
                status_code=400,
                detail="Category name cannot be empty"
            )

        updates["name"] = updates["name"].strip()

        # Prevent duplicate category names during editing
        existing = (
            db.query(Category)
            .filter(
                Category.name == updates["name"],
                Category.id != category_id
            )
            .first()
        )

        if existing:
            raise HTTPException(
                status_code=400,
                detail="Category already exists"
            )

    for field, value in updates.items():
        setattr(item, field, value)

    db.commit()
    db.refresh(item)

    return item


@app.patch("/api/categories/{category_id}/status")
def update_category_status(
    category_id: int,
    update: CategoryStatusUpdate,
    db: Session = Depends(get_db)
):
    item = (
        db.query(Category)
        .filter(Category.id == category_id)
        .first()
    )

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Category not found"
        )

    if update.status not in ["Active", "Inactive"]:
        raise HTTPException(
            status_code=400,
            detail="Status must be Active or Inactive"
        )

    item.status = update.status

    db.commit()
    db.refresh(item)

    return item



# ============================================================
# TRANSACTIONS
# ============================================================

@app.get("/api/transactions")
def get_transactions(db: Session = Depends(get_db)):
    return (
        db.query(Transaction)
        .order_by(Transaction.id.desc())
        .all()
    )


@app.post("/api/transactions")
def create_transaction(
    transaction: TransactionCreate,
    db: Session = Depends(get_db)
):
    # Find the associated purchase order.
    order = (
        db.query(PurchaseOrder)
        .filter(PurchaseOrder.id == transaction.purchase_order_id)
        .first()
    )

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Purchase order not found"
        )

    if transaction.amount <= 0:
        raise HTTPException(
            status_code=400,
            detail="Amount must be greater than zero"
        )

    new_transaction = Transaction(
        purchase_order_id=order.id,
        supplier=order.supplier,
        amount=transaction.amount,
        payment_method=transaction.payment_method,
        reference_number=transaction.reference_number,
        notes=transaction.notes,
        status="Pending"
    )

    db.add(new_transaction)
    db.commit()
    db.refresh(new_transaction)

    return new_transaction


@app.patch("/api/transactions/{transaction_id}/status")
def update_transaction_status(
    transaction_id: int,
    update: TransactionStatusUpdate,
    db: Session = Depends(get_db)
):
    item = (
        db.query(Transaction)
        .filter(Transaction.id == transaction_id)
        .first()
    )

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Transaction not found"
        )

    if update.status not in ["Pending", "Completed", "Failed"]:
        raise HTTPException(
            status_code=400,
            detail="Status must be Pending, Completed, or Failed"
        )

    item.status = update.status

    db.commit()
    db.refresh(item)

    return item

# ============================================================
# CONTRACTS
# ============================================================

@app.get("/api/contracts")
def get_contracts(db: Session = Depends(get_db)):
    return (
        db.query(Contract)
        .order_by(Contract.id.desc())
        .all()
    )


@app.post("/api/contracts")
def create_contract(
    contract: ContractCreate,
    db: Session = Depends(get_db)
):
    if not contract.supplier.strip():
        raise HTTPException(
            status_code=400,
            detail="Supplier is required"
        )

    if not contract.title.strip():
        raise HTTPException(
            status_code=400,
            detail="Contract title is required"
        )

    if contract.contract_value <= 0:
        raise HTTPException(
            status_code=400,
            detail="Contract value must be greater than zero"
        )

    new_contract = Contract(
        supplier=contract.supplier.strip(),
        title=contract.title.strip(),
        contract_value=contract.contract_value,
        start_date=contract.start_date,
        end_date=contract.end_date,
        description=contract.description,
        status="Draft"
    )

    db.add(new_contract)
    db.commit()
    db.refresh(new_contract)

    return new_contract


@app.put("/api/contracts/{contract_id}")
def update_contract(
    contract_id: int,
    contract: ContractUpdate,
    db: Session = Depends(get_db)
):
    item = (
        db.query(Contract)
        .filter(Contract.id == contract_id)
        .first()
    )

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Contract not found"
        )

    updates = contract.model_dump(exclude_unset=True)

    if "supplier" in updates:
        if not updates["supplier"] or not updates["supplier"].strip():
            raise HTTPException(
                status_code=400,
                detail="Supplier cannot be empty"
            )
        updates["supplier"] = updates["supplier"].strip()

    if "title" in updates:
        if not updates["title"] or not updates["title"].strip():
            raise HTTPException(
                status_code=400,
                detail="Contract title cannot be empty"
            )
        updates["title"] = updates["title"].strip()

    if "contract_value" in updates:
        if updates["contract_value"] <= 0:
            raise HTTPException(
                status_code=400,
                detail="Contract value must be greater than zero"
            )

    for field, value in updates.items():
        setattr(item, field, value)

    db.commit()
    db.refresh(item)

    return item


@app.patch("/api/contracts/{contract_id}/status")
def update_contract_status(
    contract_id: int,
    update: ContractStatusUpdate,
    db: Session = Depends(get_db)
):
    item = (
        db.query(Contract)
        .filter(Contract.id == contract_id)
        .first()
    )

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Contract not found"
        )

    if update.status not in ["Draft", "Active", "Expired", "Terminated"]:
        raise HTTPException(
            status_code=400,
            detail="Invalid contract status"
        )

    item.status = update.status

    db.commit()
    db.refresh(item)

    return item

