import {
  CheckCircle2,
  XCircle,
  Clock3,
  Check,
  X,
} from 'lucide-react'

type ApprovalsProps = {
  requests: any[]
  loading: boolean
  handleUpdateRequest: (
    requestId: number,
    action: 'approve' | 'reject'
  ) => void
}

function Approvals({
  requests,
  loading,
  handleUpdateRequest,
}: ApprovalsProps) {
  const pendingRequests = requests.filter(
    (request) => request.status === 'Pending'
  )

  const approvedRequests = requests.filter(
    (request) => request.status === 'Approved'
  )

  const rejectedRequests = requests.filter(
    (request) => request.status === 'Rejected'
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Approvals
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Review and approve or reject pending purchase requests.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Pending
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                {pendingRequests.length}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Clock3 size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Approved
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                {approvedRequests.length}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Rejected
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                {rejectedRequests.length}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <XCircle size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* Approval Queue */}
      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-5">
          <h2 className="text-lg font-bold text-slate-900">
            Approval Queue
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Purchase requests waiting for approval.
          </p>
        </div>

        {loading ? (
          <div className="p-10 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

            <p className="mt-4 text-sm text-slate-500">
              Loading approval requests...
            </p>
          </div>
        ) : pendingRequests.length === 0 ? (
          <div className="p-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 size={28} />
            </div>

            <h3 className="mt-4 text-lg font-bold text-slate-900">
              No pending approvals
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              All purchase requests have been reviewed.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    ID
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Request
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Department
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Amount
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {pendingRequests.map((request) => (
                  <tr
                    key={request.id}
                    className="border-b border-slate-100 last:border-b-0"
                  >
                    <td className="px-6 py-5 text-sm font-semibold text-slate-700">
                      #{request.id}
                    </td>

                    <td className="px-6 py-5">
                      <p className="font-semibold text-slate-900">
                        {request.title}
                      </p>

                      {request.description && (
                        <p className="mt-1 max-w-xs truncate text-xs text-slate-500">
                          {request.description}
                        </p>
                      )}
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-600">
                      {request.department}
                    </td>

                    <td className="px-6 py-5 text-sm font-semibold text-slate-900">
                      ₹
                      {Number(request.amount).toLocaleString(
                        'en-IN'
                      )}
                    </td>

                    <td className="px-6 py-5">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
                        <Clock3 size={13} />
                        Pending
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            handleUpdateRequest(
                              request.id,
                              'approve'
                            )
                          }
                          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700"
                        >
                          <Check size={15} />
                          Approve
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleUpdateRequest(
                              request.id,
                              'reject'
                            )
                          }
                          className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                        >
                          <X size={15} />
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Approvals