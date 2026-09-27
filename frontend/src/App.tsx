import { useEffect, useState } from 'react'
import {
  ShoppingCart,
  Users,
  FileText,
  Package,
  Wallet,
} from 'lucide-react'

import Header from './components/Header'
import Sidebar from './components/Sidebar'

import Dashboard from './pages/Dashboard'
import PurchaseRequests from './pages/PurchaseRequests'
import PurchaseOrders from './pages/PurchaseOrders'
import Suppliers from './pages/Suppliers'
import Contracts from './pages/Contracts'
import Transactions from './pages/Transactions'
import Categories from './pages/Categories'
import Departments from './pages/Departments'
import Approvals from './pages/Approvals'

const API_URL = 'http://127.0.0.1:8000'

const stats = [
  {
    label: 'Total Spend',
    value: '₹12,84,500',
    change: '+12.5%',
    icon: Wallet,
    color: '#5b6ee1',
  },
  {
    label: 'Purchase Requests',
    value: '248',
    change: '+8.2%',
    icon: ShoppingCart,
    color: '#e59b39',
  },
  {
    label: 'Active Suppliers',
    value: '64',
    change: '+4.3%',
    icon: Users,
    color: '#28a879',
  },
  {
    label: 'Active Contracts',
    value: '32',
    change: '+6.1%',
    icon: FileText,
    color: '#a16ad7',
  },
]

function App() {
  const [active, setActive] = useState('Dashboard')
  const [role, setRole] = useState('Super Admin')
  const [menuOpen, setMenuOpen] = useState(false)
  const [search, setSearch] = useState('')

  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [purchaseOrders, setPurchaseOrders] = useState<any[]>([])
  const [poLoading, setPoLoading] = useState(false)

  const [showRequestForm, setShowRequestForm] = useState(false)
  const [formTitle, setFormTitle] = useState('')
  const [formDepartment, setFormDepartment] = useState('')
  const [formAmount, setFormAmount] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const [showPOForm, setShowPOForm] = useState(false)
  const [poRequestId, setPoRequestId] = useState('')
  const [poSupplier, setPoSupplier] = useState('')
  const [poAmount, setPoAmount] = useState('')
  const [poSubmitting, setPoSubmitting] = useState(false)

  const [suppliers, setSuppliers] = useState<any[]>([])
  const [supplierLoading, setSupplierLoading] = useState(false)
  const [supplierSearch, setSupplierSearch] = useState('')
  const [showSupplierForm, setShowSupplierForm] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<any | null>(null)
  const [supplierSubmitting, setSupplierSubmitting] = useState(false)
  const [supplierName, setSupplierName] = useState('')
  const [supplierContact, setSupplierContact] = useState('')
  const [supplierEmail, setSupplierEmail] = useState('')
  const [supplierPhone, setSupplierPhone] = useState('')
  const [supplierAddress, setSupplierAddress] = useState('')

  const [categories, setCategories] = useState<any[]>([])
  const [categoryLoading, setCategoryLoading] = useState(false)
  const [categorySearch, setCategorySearch] = useState('')
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any | null>(null)
  const [categoryName, setCategoryName] = useState('')
  const [categoryDescription, setCategoryDescription] = useState('')
  const [categorySubmitting, setCategorySubmitting] = useState(false)

  const [departments, setDepartments] = useState<any[]>([])
  const [departmentLoading, setDepartmentLoading] = useState(false)
  const [departmentSearch, setDepartmentSearch] = useState('')
  const [showDepartmentForm, setShowDepartmentForm] = useState(false)
  const [editingDepartment, setEditingDepartment] = useState<any | null>(null)
  const [departmentName, setDepartmentName] = useState('')
  const [departmentDescription, setDepartmentDescription] = useState('')
  const [departmentSubmitting, setDepartmentSubmitting] = useState(false)

  useEffect(() => {
    fetch(`${API_URL}/api/requests`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch requests')
        }

        return response.json()
      })
      .then((data) => {
        setRequests(data)
      })
      .catch((error) => {
        console.error('Error fetching purchase requests:', error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    if (active !== 'Purchase Orders') {
      return
    }

    setPoLoading(true)

    fetch(`${API_URL}/api/purchase-orders`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch purchase orders')
        }

        return response.json()
      })
      .then((data) => {
        setPurchaseOrders(data)
      })
      .catch((error) => {
        console.error('Error fetching purchase orders:', error)
      })
      .finally(() => {
        setPoLoading(false)
      })
  }, [active])

  useEffect(() => {
    if (active !== 'Suppliers') {
      return
    }

    setSupplierLoading(true)

    fetch(`${API_URL}/api/suppliers`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch suppliers')
        }

        return response.json()
      })
      .then((data) => {
        setSuppliers(data)
      })
      .catch((error) => {
        console.error('Error fetching suppliers:', error)
        alert(
          'Could not load suppliers. Please check that the backend is running.'
        )
      })
      .finally(() => {
        setSupplierLoading(false)
      })
  }, [active])

  useEffect(() => {
    if (active !== 'Categories') {
      return
    }

    setCategoryLoading(true)

    fetch(`${API_URL}/api/categories`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch categories')
        }

        return response.json()
      })
      .then((data) => {
        setCategories(data)
      })
      .catch((error) => {
        console.error('Error fetching categories:', error)
        alert(
          'Could not load categories. Please check that the backend is running.'
        )
      })
      .finally(() => {
        setCategoryLoading(false)
      })
  }, [active])

  useEffect(() => {
    if (active !== 'Departments') {
      return
    }

    setDepartmentLoading(true)

    fetch(`${API_URL}/api/departments`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch departments')
        }

        return response.json()
      })
      .then((data) => {
        setDepartments(data)
      })
      .catch((error) => {
        console.error('Error fetching departments:', error)
        alert(
          'Could not load departments. Please check that the backend is running.'
        )
      })
      .finally(() => {
        setDepartmentLoading(false)
      })
  }, [active])

  const handleCreateRequest = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    if (!formTitle.trim() || !formDepartment.trim() || !formAmount) {
      alert('Please fill in the title, department, and amount.')
      return
    }

    try {
      setSubmitting(true)

      const response = await fetch(`${API_URL}/api/requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formTitle.trim(),
          department: formDepartment.trim(),
          amount: Number(formAmount),
          description: formDescription.trim() || null,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create purchase request')
      }

      const newRequest = await response.json()

      setRequests((currentRequests) => [
        newRequest,
        ...currentRequests,
      ])

      setFormTitle('')
      setFormDepartment('')
      setFormAmount('')
      setFormDescription('')
      setShowRequestForm(false)

      alert('Purchase request created successfully.')
    } catch (error) {
      console.error('Error creating purchase request:', error)
      alert('Could not create the purchase request.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdateRequest = async (
    requestId: number,
    action: 'approve' | 'reject'
  ) => {
    try {
      const response = await fetch(
        `${API_URL}/api/requests/${requestId}/${action}`,
        {
          method: 'PATCH',
        }
      )

      if (!response.ok) {
        throw new Error('Failed to update request')
      }

      const updatedRequest = await response.json()

      setRequests((currentRequests) =>
        currentRequests.map((request) =>
          request.id === updatedRequest.id
            ? updatedRequest
            : request
        )
      )

      alert(
        action === 'approve'
          ? 'Purchase request approved successfully.'
          : 'Purchase request rejected successfully.'
      )
    } catch (error) {
      console.error('Error updating request:', error)
      alert('Could not update the request.')
    }
  }

  const handleCreatePurchaseOrder = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    if (!poRequestId || !poSupplier.trim() || !poAmount) {
      alert('Please select an approved request, supplier, and amount.')
      return
    }

    try {
      setPoSubmitting(true)

      const response = await fetch(`${API_URL}/api/purchase-orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          request_id: Number(poRequestId),
          supplier: poSupplier.trim(),
          amount: Number(poAmount),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.detail || 'Failed to create purchase order'
        )
      }

      setPurchaseOrders((currentOrders) => [
        data,
        ...currentOrders,
      ])

      setPoRequestId('')
      setPoSupplier('')
      setPoAmount('')
      setShowPOForm(false)

      alert('Purchase order created successfully.')
    } catch (error) {
      console.error('Error creating purchase order:', error)

      if (error instanceof Error) {
        alert(error.message)
      } else {
        alert('Could not create the purchase order.')
      }
    } finally {
      setPoSubmitting(false)
    }
  }

  const handlePORequestChange = (requestId: string) => {
    setPoRequestId(requestId)

    const selectedRequest = requests.find(
      (request) => String(request.id) === requestId
    )

    if (selectedRequest) {
      setPoAmount(String(selectedRequest.amount))
    }
  }

  const resetSupplierForm = () => {
    setEditingSupplier(null)
    setSupplierName('')
    setSupplierContact('')
    setSupplierEmail('')
    setSupplierPhone('')
    setSupplierAddress('')
  }

  const handleEditSupplier = (supplier: any) => {
    setEditingSupplier(supplier)
    setSupplierName(supplier.name ?? '')
    setSupplierContact(supplier.contact_person ?? '')
    setSupplierEmail(supplier.email ?? '')
    setSupplierPhone(supplier.phone ?? '')
    setSupplierAddress(supplier.address ?? '')
    setShowSupplierForm(true)
  }

  const handleSaveSupplier = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    if (!supplierName.trim()) {
      alert('Please enter the supplier name.')
      return
    }

    try {
      setSupplierSubmitting(true)

      const isEditing = Boolean(editingSupplier)

      const url = isEditing
        ? `${API_URL}/api/suppliers/${editingSupplier.id}`
        : `${API_URL}/api/suppliers`

      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: supplierName.trim(),
          contact_person: supplierContact.trim() || null,
          email: supplierEmail.trim() || null,
          phone: supplierPhone.trim() || null,
          address: supplierAddress.trim() || null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.detail || 'Failed to save supplier'
        )
      }

      setSuppliers((current) =>
        isEditing
          ? current.map((supplier) =>
              supplier.id === data.id ? data : supplier
            )
          : [data, ...current]
      )

      setShowSupplierForm(false)
      resetSupplierForm()

      alert(
        isEditing
          ? 'Supplier updated successfully.'
          : 'Supplier added successfully.'
      )
    } catch (error) {
      console.error('Error saving supplier:', error)

      alert(
        error instanceof Error
          ? error.message
          : 'Could not save supplier.'
      )
    } finally {
      setSupplierSubmitting(false)
    }
  }

  const handleToggleSupplierStatus = async (supplier: any) => {
    const nextStatus =
      supplier.status === 'Active'
        ? 'Inactive'
        : 'Active'

    try {
      const response = await fetch(
        `${API_URL}/api/suppliers/${supplier.id}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: nextStatus,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.detail || 'Failed to update supplier status'
        )
      }

      setSuppliers((current) =>
        current.map((item) =>
          item.id === data.id ? data : item
        )
      )
    } catch (error) {
      console.error(
        'Error updating supplier status:',
        error
      )

      alert(
        error instanceof Error
          ? error.message
          : 'Could not update supplier status.'
      )
    }
  }

  const resetCategoryForm = () => {
    setCategoryName('')
    setCategoryDescription('')
    setEditingCategory(null)
  }

  const handleSaveCategory = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    if (!categoryName.trim()) {
      alert('Category name is required.')
      return
    }

    const editing = editingCategory !== null

    try {
      setCategorySubmitting(true)

      const response = await fetch(
        editing
          ? `${API_URL}/api/categories/${editingCategory.id}`
          : `${API_URL}/api/categories`,
        {
          method: editing ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: categoryName.trim(),
            description:
              categoryDescription.trim() || null,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.detail || 'Could not save category.'
        )
      }

      setCategories((current) =>
        editing
          ? current.map((item) =>
              item.id === data.id ? data : item
            )
          : [data, ...current]
      )

      setShowCategoryForm(false)
      resetCategoryForm()
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : 'Could not save category.'
      )
    } finally {
      setCategorySubmitting(false)
    }
  }

  const handleToggleCategory = async (category: any) => {
    const status =
      category.status === 'Active'
        ? 'Inactive'
        : 'Active'

    try {
      const response = await fetch(
        `${API_URL}/api/categories/${category.id}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.detail || 'Could not update category status.'
        )
      }

      setCategories((current) =>
        current.map((item) =>
          item.id === category.id ? data : item
        )
      )
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : 'Could not update category status.'
      )
    }
  }

  const resetDepartmentForm = () => {
    setDepartmentName('')
    setDepartmentDescription('')
    setEditingDepartment(null)
  }

  const handleSaveDepartment = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    if (!departmentName.trim()) {
      alert('Department name is required.')
      return
    }

    const editing = editingDepartment !== null

    try {
      setDepartmentSubmitting(true)

      const response = await fetch(
        editing
          ? `${API_URL}/api/departments/${editingDepartment.id}`
          : `${API_URL}/api/departments`,
        {
          method: editing ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: departmentName.trim(),
            description:
              departmentDescription.trim() || null,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.detail || 'Could not save department.'
        )
      }

      setDepartments((current) =>
        editing
          ? current.map((item) =>
              item.id === data.id ? data : item
            )
          : [data, ...current]
      )

      setShowDepartmentForm(false)
      resetDepartmentForm()
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : 'Could not save department.'
      )
    } finally {
      setDepartmentSubmitting(false)
    }
  }

  const handleToggleDepartment = async (department: any) => {
    const status =
      department.status === 'Active'
        ? 'Inactive'
        : 'Active'

    try {
      const response = await fetch(
        `${API_URL}/api/departments/${department.id}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.detail || 'Could not update department status.'
        )
      }

      setDepartments((current) =>
        current.map((item) =>
          item.id === department.id ? data : item
        )
      )
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : 'Could not update department status.'
      )
    }
  }

  const filteredSuppliers = suppliers.filter((supplier) =>
    `${supplier.name ?? ''} ${
      supplier.contact_person ?? ''
    } ${supplier.email ?? ''} ${
      supplier.phone ?? ''
    } ${supplier.status ?? ''}`
      .toLowerCase()
      .includes(supplierSearch.toLowerCase())
  )

  const filteredRequests = requests.filter((request) =>
    `${request.id} ${request.title} ${
      request.department
    } ${request.status}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  const approvedRequests = requests.filter(
    (request) => request.status === 'Approved'
  )

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-800">
      {menuOpen && (
        <button
          aria-label="Close menu"
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <Sidebar
        active={active}
        role={role}
        setRole={setRole}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        handleNavigation={(name) => {
          setActive(name)
          setMenuOpen(false)
        }}
      />

      <main className="min-h-screen lg:ml-64">
        <Header
          active={active}
          setMenuOpen={setMenuOpen}
          search={search}
          setSearch={setSearch}
        />

        <div className="space-y-6 p-4 md:p-8">
          {active === 'Dashboard' ? (
            <Dashboard
              setShowRequestForm={setShowRequestForm}
              stats={stats}
              setActive={setActive}
              search={search}
              setSearch={setSearch}
              loading={loading}
              filteredRequests={filteredRequests}
              handleUpdateRequest={handleUpdateRequest}
            />
          ) : active === 'Purchase Requests' ? (
            <PurchaseRequests
              requests={requests}
              loading={loading}
              search={search}
              setSearch={setSearch}
              filteredRequests={filteredRequests}
              setShowRequestForm={setShowRequestForm}
              handleUpdateRequest={handleUpdateRequest}
              showRequestForm={showRequestForm}
              formTitle={formTitle}
              setFormTitle={setFormTitle}
              formDepartment={formDepartment}
              setFormDepartment={setFormDepartment}
              formAmount={formAmount}
              setFormAmount={setFormAmount}
              formDescription={formDescription}
              setFormDescription={setFormDescription}
              submitting={submitting}
              handleCreateRequest={handleCreateRequest}
            />
          ) : active === 'Purchase Orders' ? (
            <PurchaseOrders
              purchaseOrders={purchaseOrders}
              poLoading={poLoading}
              approvedRequests={approvedRequests}
              setShowPOForm={setShowPOForm}
              showPOForm={showPOForm}
              poRequestId={poRequestId}
              poSupplier={poSupplier}
              setPoSupplier={setPoSupplier}
              poAmount={poAmount}
              setPoAmount={setPoAmount}
              poSubmitting={poSubmitting}
              handleCreatePurchaseOrder={
                handleCreatePurchaseOrder
              }
              handlePORequestChange={
                handlePORequestChange
              }
            />
          ) : active === 'Suppliers' ? (
            <Suppliers
              suppliers={suppliers}
              supplierLoading={supplierLoading}
              supplierSearch={supplierSearch}
              setSupplierSearch={setSupplierSearch}
              filteredSuppliers={filteredSuppliers}
              resetSupplierForm={resetSupplierForm}
              handleEditSupplier={handleEditSupplier}
              handleToggleSupplierStatus={
                handleToggleSupplierStatus
              }
              showSupplierForm={showSupplierForm}
              setShowSupplierForm={setShowSupplierForm}
              editingSupplier={editingSupplier}
              supplierSubmitting={supplierSubmitting}
              supplierName={supplierName}
              setSupplierName={setSupplierName}
              supplierContact={supplierContact}
              setSupplierContact={setSupplierContact}
              supplierEmail={supplierEmail}
              setSupplierEmail={setSupplierEmail}
              supplierPhone={supplierPhone}
              setSupplierPhone={setSupplierPhone}
              supplierAddress={supplierAddress}
              setSupplierAddress={setSupplierAddress}
              handleSaveSupplier={handleSaveSupplier}
            />
          ) : active === 'Contracts' ? (
            <Contracts />
          ) : active === 'Transactions' ? (
            <Transactions />
          ) : active === 'Departments' ? (
            <Departments
              departments={departments}
              departmentLoading={departmentLoading}
              departmentSearch={departmentSearch}
              setDepartmentSearch={setDepartmentSearch}
              showDepartmentForm={showDepartmentForm}
              setShowDepartmentForm={setShowDepartmentForm}
              editingDepartment={editingDepartment}
              setEditingDepartment={setEditingDepartment}
              departmentName={departmentName}
              setDepartmentName={setDepartmentName}
              departmentDescription={departmentDescription}
              setDepartmentDescription={setDepartmentDescription}
              departmentSubmitting={departmentSubmitting}
              resetDepartmentForm={resetDepartmentForm}
              handleSaveDepartment={handleSaveDepartment}
              handleToggleDepartment={handleToggleDepartment}
            />
          ) : active === 'Approvals' ? (
            <Approvals
              requests={requests}
              loading={loading}
              handleUpdateRequest={handleUpdateRequest}
            />
          ) : active === 'Categories' ? (
            <Categories
              categories={categories}
              categoryLoading={categoryLoading}
              categorySearch={categorySearch}
              setCategorySearch={setCategorySearch}
              showCategoryForm={showCategoryForm}
              setShowCategoryForm={setShowCategoryForm}
              editingCategory={editingCategory}
              setEditingCategory={setEditingCategory}
              categoryName={categoryName}
              setCategoryName={setCategoryName}
              categoryDescription={categoryDescription}
              setCategoryDescription={setCategoryDescription}
              categorySubmitting={categorySubmitting}
              resetCategoryForm={resetCategoryForm}
              handleSaveCategory={handleSaveCategory}
              handleToggleCategory={handleToggleCategory}
            />
          ) : (
            <div className="rounded-2xl border border-slate-100 bg-white p-10 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <Package size={30} />
              </div>

              <h3 className="mt-5 text-xl font-bold">
                {active}
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                This module is ready for development.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default App