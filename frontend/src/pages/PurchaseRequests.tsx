import { X } from 'lucide-react'

type PurchaseRequestsProps = {
  requests: any[]
  loading: boolean
  search: string
  setSearch: (value: string) => void
  filteredRequests: any[]
  setShowRequestForm: (value: boolean) => void
  handleUpdateRequest: (
    requestId: number,
    action: 'approve' | 'reject'
  ) => void

  showRequestForm: boolean
  formTitle: string
  setFormTitle: (value: string) => void
  formDepartment: string
  setFormDepartment: (value: string) => void
  formAmount: string
  setFormAmount: (value: string) => void
  formDescription: string
  setFormDescription: (value: string) => void
  submitting: boolean
  handleCreateRequest: (
    event: React.FormEvent<HTMLFormElement>
  ) => void
}

function PurchaseRequests({
  requests,
  loading,
  search,
  setSearch,
  filteredRequests,
  setShowRequestForm,
  handleUpdateRequest,
  showRequestForm,
  formTitle,
  setFormTitle,
  formDepartment,
  setFormDepartment,
  formAmount,
  setFormAmount,
  formDescription,
  setFormDescription,
  submitting,
  handleCreateRequest,
}: PurchaseRequestsProps) {
  return (
    <>
      <div className="space-y-6">

        {/* HEADER */}

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-2xl font-bold">
              Purchase Requests
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Create, review, and manage procurement requests.
            </p>
          </div>

          <button
            onClick={() => setShowRequestForm(true)}
            className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:bg-blue-700"
          >
            + New Request
          </button>
        </div>

        {/* SUMMARY */}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Total Requests
            </p>

            <p className="mt-2 text-2xl font-bold">
              {requests.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Pending
            </p>

            <p className="mt-2 text-2xl font-bold text-amber-600">
              {
                requests.filter(
                  (request) => request.status === 'Pending'
                ).length
              }
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Approved
            </p>

            <p className="mt-2 text-2xl font-bold text-emerald-600">
              {
                requests.filter(
                  (request) => request.status === 'Approved'
                ).length
              }
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Rejected
            </p>

            <p className="mt-2 text-2xl font-bold text-red-600">
              {
                requests.filter(
                  (request) => request.status === 'Rejected'
                ).length
              }
            </p>
          </div>

        </div>

        {/* REQUEST TABLE */}

        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">

          <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

            <div>
              <p className="text-sm text-slate-500">
                All Purchase Requests
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Review and manage submitted procurement requests.
              </p>
            </div>

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search requests..."
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 sm:max-w-xs"
            />

          </div>

          <div className="overflow-x-auto">

            <table className="w-full min-w-[900px] text-left text-sm">

              <thead>
                <tr className="border-b border-slate-100 text-xs text-slate-400">
                  <th className="pb-3 pr-4">
                    ID
                  </th>

                  <th className="pb-3 pr-4">
                    REQUEST
                  </th>

                  <th className="pb-3 pr-4">
                    DEPARTMENT
                  </th>

                  <th className="pb-3 pr-4">
                    AMOUNT
                  </th>

                  <th className="pb-3 pr-4">
                    STATUS
                  </th>

                  <th className="pb-3">
                    ACTIONS
                  </th>
                </tr>
              </thead>

              <tbody>

                {loading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-10 text-center text-slate-400"
                    >
                      Loading purchase requests...
                    </td>
                  </tr>
                ) : filteredRequests.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-10 text-center text-slate-400"
                    >
                      No purchase requests found.
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((request) => (
                    <tr
                      key={request.id}
                      className="border-b border-slate-50 last:border-0"
                    >

                      <td className="py-4 pr-4 font-semibold text-slate-600">
                        #{request.id}
                      </td>

                      <td className="py-4 pr-4">
                        <div>
                          <p className="font-semibold text-slate-800">
                            {request.title}
                          </p>

                          {request.description && (
                            <p className="mt-1 max-w-xs truncate text-xs text-slate-400">
                              {request.description}
                            </p>
                          )}
                        </div>
                      </td>

                      <td className="py-4 pr-4 text-slate-600">
                        {request.department}
                      </td>

                      <td className="py-4 pr-4 font-semibold">
                        ₹
                        {Number(
                          request.amount || 0
                        ).toLocaleString('en-IN')}
                      </td>

                      <td className="py-4 pr-4">

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            request.status === 'Approved'
                              ? 'bg-emerald-50 text-emerald-700'
                              : request.status === 'Rejected'
                              ? 'bg-red-50 text-red-600'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {request.status}
                        </span>

                      </td>

                      <td className="py-4">

                        {request.status === 'Pending' ? (
                          <div className="flex flex-wrap gap-2">

                            <button
                              onClick={() =>
                                handleUpdateRequest(
                                  request.id,
                                  'approve'
                                )
                              }
                              className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
                            >
                              Approve
                            </button>

                            <button
                              onClick={() =>
                                handleUpdateRequest(
                                  request.id,
                                  'reject'
                                )
                              }
                              className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-100"
                            >
                              Reject
                            </button>

                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">
                            No actions
                          </span>
                        )}

                      </td>

                    </tr>
                  ))
                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

      {/* CREATE PURCHASE REQUEST MODAL */}

      {showRequestForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">

            <div className="mb-6 flex items-start justify-between">

              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  New Purchase Request
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Submit a new request for procurement approval.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowRequestForm(false)
                }
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={20} />
              </button>

            </div>

            <form onSubmit={handleCreateRequest}>

              <div className="mb-4">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Request Title
                </label>

                <input
                  type="text"
                  placeholder="e.g. Office Laptops"
                  value={formTitle}
                  onChange={(event) =>
                    setFormTitle(event.target.value)
                  }
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Department
                </label>

                <input
                  type="text"
                  placeholder="e.g. IT"
                  value={formDepartment}
                  onChange={(event) =>
                    setFormDepartment(event.target.value)
                  }
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Amount (₹)
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="e.g. 150000"
                  value={formAmount}
                  onChange={(event) =>
                    setFormAmount(event.target.value)
                  }
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Description
                </label>

                <textarea
                  placeholder="Describe what is required..."
                  value={formDescription}
                  onChange={(event) =>
                    setFormDescription(event.target.value)
                  }
                  rows={4}
                  className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-3">

                <button
                  type="button"
                  onClick={() =>
                    setShowRequestForm(false)
                  }
                  className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting
                    ? 'Creating...'
                    : 'Create Request'}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </>
  )
}

export default PurchaseRequests