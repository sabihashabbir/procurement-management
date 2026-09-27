import { X } from 'lucide-react'

type PurchaseOrdersProps = {
  purchaseOrders: any[]
  poLoading: boolean
  approvedRequests: any[]
  setShowPOForm: (value: boolean) => void
  showPOForm: boolean
  poRequestId: string
  poSupplier: string
  setPoSupplier: (value: string) => void
  poAmount: string
  setPoAmount: (value: string) => void
  poSubmitting: boolean
  handleCreatePurchaseOrder: (
    event: React.FormEvent<HTMLFormElement>
  ) => void
  handlePORequestChange: (requestId: string) => void
}

function PurchaseOrders({
  purchaseOrders,
  poLoading,
  approvedRequests,
  setShowPOForm,
  showPOForm,
  poRequestId,
  poSupplier,
  setPoSupplier,
  poAmount,
  setPoAmount,
  poSubmitting,
  handleCreatePurchaseOrder,
  handlePORequestChange,
}: PurchaseOrdersProps) {
  return (
    <>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-2xl font-bold">
            Purchase Orders
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Create and manage purchase orders from approved requests.
          </p>
        </div>

        <button
          onClick={() => setShowPOForm(true)}
          disabled={approvedRequests.length === 0}
          className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          + Create Purchase Order
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Total Purchase Orders
          </p>

          <p className="mt-3 text-2xl font-bold">
            {purchaseOrders.length}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Approved Requests
          </p>

          <p className="mt-3 text-2xl font-bold text-emerald-600">
            {approvedRequests.length}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Draft Orders
          </p>

          <p className="mt-3 text-2xl font-bold text-amber-600">
            {
              purchaseOrders.filter(
                (order) => order.status === 'Draft'
              ).length
            }
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h3 className="font-bold">
            Purchase Order List
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Orders generated from approved purchase requests.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs text-slate-400">
                <th className="pb-3 font-medium">
                  PURCHASE ORDER
                </th>

                <th className="pb-3 font-medium">
                  REQUEST ID
                </th>

                <th className="pb-3 font-medium">
                  SUPPLIER
                </th>

                <th className="pb-3 font-medium">
                  AMOUNT
                </th>

                <th className="pb-3 font-medium">
                  STATUS
                </th>
              </tr>
            </thead>

            <tbody>
              {poLoading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-10 text-center text-slate-400"
                  >
                    Loading purchase orders...
                  </td>
                </tr>
              ) : purchaseOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-10 text-center text-slate-400"
                  >
                    No purchase orders yet. Create one from an approved request.
                  </td>
                </tr>
              ) : (
                purchaseOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-slate-50 last:border-0"
                  >
                    <td className="py-4 pr-3">
                      <p className="font-semibold">
                        PO-{String(order.id).padStart(4, '0')}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {order.created_at
                          ? new Date(order.created_at).toLocaleDateString('en-IN')
                          : '—'}
                      </p>
                    </td>

                    <td className="py-4 pr-3 text-slate-500">
                      #{order.request_id}
                    </td>

                    <td className="py-4 pr-3 font-medium">
                      {order.supplier}
                    </td>

                    <td className="py-4 pr-3 font-semibold">
                      ₹{Number(order.amount).toLocaleString('en-IN')}
                    </td>

                    <td className="py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          order.status === 'Approved'
                            ? 'bg-emerald-50 text-emerald-700'
                            : order.status === 'Rejected'
                            ? 'bg-red-50 text-red-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showPOForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Create Purchase Order
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Create an order from an approved purchase request.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowPOForm(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>

            {approvedRequests.length === 0 ? (
              <div className="rounded-xl bg-amber-50 p-4 text-sm text-amber-700">
                There are currently no approved purchase requests available for creating a purchase order.
              </div>
            ) : (
              <form onSubmit={handleCreatePurchaseOrder}>
                <div className="mb-4">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Approved Purchase Request
                  </label>

                  <select
                    value={poRequestId}
                    onChange={(e) =>
                      handlePORequestChange(e.target.value)
                    }
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                    required
                  >
                    <option value="">
                      Select an approved request
                    </option>

                    {approvedRequests.map((request) => (
                      <option
                        key={request.id}
                        value={request.id}
                      >
                        #{request.id} — {request.title} — ₹
                        {Number(request.amount).toLocaleString('en-IN')}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Supplier
                  </label>

                  <input
                    type="text"
                    placeholder="e.g. ABC Office Supplies Pvt Ltd"
                    value={poSupplier}
                    onChange={(e) => setPoSupplier(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Amount (₹)
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Purchase order amount"
                    value={poAmount}
                    onChange={(e) => setPoAmount(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowPOForm(false)}
                    className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={poSubmitting}
                    className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {poSubmitting
                      ? 'Creating...'
                      : 'Create Purchase Order'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default PurchaseOrders