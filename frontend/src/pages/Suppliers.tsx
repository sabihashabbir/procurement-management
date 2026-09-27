
import { Search, X } from 'lucide-react'

type SuppliersProps = {
  suppliers: any[]
  supplierLoading: boolean
  supplierSearch: string
  setSupplierSearch: (value: string) => void
  filteredSuppliers: any[]
  resetSupplierForm: () => void
  handleEditSupplier: (supplier: any) => void
  handleToggleSupplierStatus: (supplier: any) => void
  showSupplierForm: boolean
  setShowSupplierForm: (value: boolean) => void
  editingSupplier: any | null
  supplierSubmitting: boolean
  supplierName: string
  setSupplierName: (value: string) => void
  supplierContact: string
  setSupplierContact: (value: string) => void
  supplierEmail: string
  setSupplierEmail: (value: string) => void
  supplierPhone: string
  setSupplierPhone: (value: string) => void
  supplierAddress: string
  setSupplierAddress: (value: string) => void
  handleSaveSupplier: (
    event: React.FormEvent<HTMLFormElement>
  ) => void
}

function Suppliers({
  suppliers,
  supplierLoading,
  supplierSearch,
  setSupplierSearch,
  filteredSuppliers,
  resetSupplierForm,
  handleEditSupplier,
  handleToggleSupplierStatus,
  showSupplierForm,
  setShowSupplierForm,
  editingSupplier,
  supplierSubmitting,
  supplierName,
  setSupplierName,
  supplierContact,
  setSupplierContact,
  supplierEmail,
  setSupplierEmail,
  supplierPhone,
  setSupplierPhone,
  supplierAddress,
  setSupplierAddress,
  handleSaveSupplier,
}: SuppliersProps) {
  const activeSuppliers = suppliers.filter(
    (supplier) => supplier.status === 'Active'
  ).length

  const inactiveSuppliers =
    suppliers.length - activeSuppliers

  return (
    <>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-2xl font-bold">
            Suppliers
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Manage your supplier directory and contact information.
          </p>
        </div>

        <button
          onClick={() => {
            resetSupplierForm()
            setShowSupplierForm(true)
          }}
          className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700"
        >
          + Add Supplier
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Total Suppliers
          </p>

          <p className="mt-3 text-2xl font-bold">
            {suppliers.length}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Active Suppliers
          </p>

          <p className="mt-3 text-2xl font-bold text-emerald-600">
            {activeSuppliers}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Inactive Suppliers
          </p>

          <p className="mt-3 text-2xl font-bold text-slate-500">
            {inactiveSuppliers}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h3 className="font-bold">
              Supplier Directory
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              View, add, and update supplier records.
            </p>
          </div>

          <div className="flex w-full items-center gap-2 rounded-lg border border-slate-200 px-3 py-2.5 sm:max-w-sm">
            <Search
              size={17}
              className="text-slate-400"
            />

            <input
              value={supplierSearch}
              onChange={(event) =>
                setSupplierSearch(event.target.value)
              }
              placeholder="Search suppliers..."
              className="w-full text-sm outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs text-slate-400">
                <th className="pb-3 pr-3 font-medium">
                  SUPPLIER
                </th>

                <th className="pb-3 pr-3 font-medium">
                  CONTACT PERSON
                </th>

                <th className="pb-3 pr-3 font-medium">
                  EMAIL
                </th>

                <th className="pb-3 pr-3 font-medium">
                  PHONE
                </th>

                <th className="pb-3 pr-3 font-medium">
                  STATUS
                </th>

                <th className="pb-3 font-medium">
                  ACTIONS
                </th>
              </tr>
            </thead>

            <tbody>
              {supplierLoading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-10 text-center text-slate-400"
                  >
                    Loading suppliers...
                  </td>
                </tr>
              ) : filteredSuppliers.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-10 text-center text-slate-400"
                  >
                    {supplierSearch
                      ? 'No suppliers match your search.'
                      : 'No suppliers yet. Add your first supplier.'}
                  </td>
                </tr>
              ) : (
                filteredSuppliers.map((supplier) => (
                  <tr
                    key={supplier.id}
                    className="border-b border-slate-50 last:border-0"
                  >
                    <td className="py-4 pr-3">
                      <p className="font-semibold">
                        {supplier.name}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        SUP-
                        {String(supplier.id).padStart(4, '0')}
                      </p>
                    </td>

                    <td className="py-4 pr-3 text-slate-500">
                      {supplier.contact_person || '—'}
                    </td>

                    <td className="py-4 pr-3 text-slate-500">
                      {supplier.email || '—'}
                    </td>

                    <td className="py-4 pr-3 text-slate-500">
                      {supplier.phone || '—'}
                    </td>

                    <td className="py-4 pr-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          supplier.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {supplier.status || 'Active'}
                      </span>
                    </td>

                    <td className="py-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() =>
                            handleEditSupplier(supplier)
                          }
                          className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            handleToggleSupplierStatus(
                              supplier
                            )
                          }
                          className={`rounded-lg px-3 py-2 text-xs font-semibold ${
                            supplier.status === 'Active'
                              ? 'bg-red-50 text-red-600 hover:bg-red-100'
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          }`}
                        >
                          {supplier.status === 'Active'
                            ? 'Deactivate'
                            : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showSupplierForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  {editingSupplier
                    ? 'Edit Supplier'
                    : 'Add Supplier'}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Enter the supplier's details below.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowSupplierForm(false)
                  resetSupplierForm()
                }}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveSupplier}>
              <div className="mb-4">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Supplier Name *
                </label>

                <input
                  type="text"
                  value={supplierName}
                  onChange={(event) =>
                    setSupplierName(event.target.value)
                  }
                  placeholder="e.g. ABC Office Supplies Pvt Ltd"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Contact Person
                </label>

                <input
                  type="text"
                  value={supplierContact}
                  onChange={(event) =>
                    setSupplierContact(event.target.value)
                  }
                  placeholder="Contact person's name"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Email
                </label>

                <input
                  type="email"
                  value={supplierEmail}
                  onChange={(event) =>
                    setSupplierEmail(event.target.value)
                  }
                  placeholder="supplier@example.com"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Phone
                </label>

                <input
                  type="tel"
                  value={supplierPhone}
                  onChange={(event) =>
                    setSupplierPhone(event.target.value)
                  }
                  placeholder="Phone number"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div className="mb-6">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Address
                </label>

                <textarea
                  value={supplierAddress}
                  onChange={(event) =>
                    setSupplierAddress(event.target.value)
                  }
                  placeholder="Supplier address"
                  rows={3}
                  className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowSupplierForm(false)
                    resetSupplierForm()
                  }}
                  className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={supplierSubmitting}
                  className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {supplierSubmitting
                    ? 'Saving...'
                    : editingSupplier
                    ? 'Save Changes'
                    : 'Add Supplier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default Suppliers