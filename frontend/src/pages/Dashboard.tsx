import {
  Users,
  FileText,
  ClipboardList,
  BarChart3,
  TrendingUp,
  Clock,
  AlertTriangle,
  ShieldCheck,
  Search,
} from 'lucide-react'

type DashboardProps = {
  setShowRequestForm: (value: boolean) => void
  stats: any[]
  setActive: (value: string) => void
  search: string
  setSearch: (value: string) => void
  loading: boolean
  filteredRequests: any[]
  handleUpdateRequest: (
    requestId: number,
    action: 'approve' | 'reject'
  ) => void
}

function Dashboard({
  setShowRequestForm,
  stats,
  setActive,
  search,
  setSearch,
  loading,
  filteredRequests,
  handleUpdateRequest,
}: DashboardProps) {
  return (
    <>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-2xl font-bold">
            Welcome back, Admin!
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Here's what's happening with your procurement operations.
          </p>
        </div>

        <button
          onClick={() => setShowRequestForm(true)}
          className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700"
        >
          + New Purchase Request
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(
          ({
            label,
            value,
            change,
            icon: Icon,
            color,
          }) => (
            <div
              key={label}
              className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">
                  {label}
                </span>

                <div
                  className="rounded-xl p-3"
                  style={{
                    backgroundColor: `${color}18`,
                    color,
                  }}
                >
                  <Icon size={21} />
                </div>
              </div>

              <h3 className="mt-4 text-2xl font-bold">
                {value}
              </h3>

              <p className="mt-2 text-xs text-emerald-600">
                <TrendingUp
                  size={13}
                  className="mr-1 inline"
                />

                {change}

                <span className="text-slate-400">
                  {' '}vs last month
                </span>
              </p>
            </div>
          )
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm xl:col-span-2">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-bold">
                Recent Purchase Requests
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Track the latest procurement requests
              </p>
            </div>

            <button
              onClick={() => setActive('Purchase Requests')}
              className="text-sm font-semibold text-blue-600 hover:text-blue-800"
            >
              View all →
            </button>
          </div>

          <div className="mb-4 flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2.5">
            <Search
              size={17}
              className="text-slate-400"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search requests..."
              className="w-full text-sm outline-none"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs text-slate-400">
                  <th className="pb-3 font-medium">
                    REQUEST
                  </th>

                  <th className="pb-3 font-medium">
                    DEPARTMENT
                  </th>

                  <th className="pb-3 font-medium">
                    AMOUNT
                  </th>

                  <th className="pb-3 font-medium">
                    STATUS
                  </th>

                  <th className="pb-3 font-medium">
                    ACTIONS
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-8 text-center text-slate-400"
                    >
                      Loading requests...
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((r) => (
                    <tr
                      key={r.id}
                      className="border-b border-slate-50 last:border-0"
                    >
                      <td className="py-4 pr-3">
                        <p className="font-semibold">
                          {r.title}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {r.id}
                        </p>
                      </td>

                      <td className="py-4 pr-3 text-slate-500">
                        {r.department}
                      </td>

                      <td className="py-4 pr-3 font-semibold">
                        ₹{Number(r.amount).toLocaleString('en-IN')}
                      </td>

                      <td className="py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            r.status === 'Approved'
                              ? 'bg-emerald-50 text-emerald-700'
                              : r.status === 'Rejected'
                              ? 'bg-red-50 text-red-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>

                      <td className="py-4">
                        {r.status === 'Pending' ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                handleUpdateRequest(
                                  r.id,
                                  'approve'
                                )
                              }
                              className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600"
                            >
                              Approve
                            </button>

                            <button
                              onClick={() =>
                                handleUpdateRequest(
                                  r.id,
                                  'reject'
                                )
                              }
                              className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs font-medium text-slate-400">
                            Completed
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}

                {!loading &&
                  filteredRequests.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-8 text-center text-slate-400"
                      >
                        No matching requests
                      </td>
                    </tr>
                  )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="font-bold">
              Pending Approvals
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Requests requiring your attention
            </p>

            <div className="my-5 flex items-center gap-4 rounded-xl bg-amber-50 p-4">
              <div className="rounded-xl bg-amber-100 p-3 text-amber-700">
                <Clock size={22} />
              </div>

              <div>
                <p className="text-3xl font-bold text-amber-700">
                  12
                </p>

                <p className="text-xs text-amber-700">
                  Awaiting approval
                </p>
              </div>
            </div>

            <button
              onClick={() => setActive('Approvals')}
              className="w-full rounded-lg border border-slate-200 py-3 text-sm font-semibold hover:bg-slate-50"
            >
              Review Approvals →
            </button>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="font-bold">
              Contract Alerts
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Contracts that need attention
            </p>

            <div className="mt-5 space-y-4">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-red-50 p-2 text-red-600">
                  <AlertTriangle size={19} />
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    3 contracts expiring soon
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Within the next 30 days
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                  <ShieldCheck size={19} />
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    32 active contracts
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Across all departments
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setActive('Contracts')}
              className="mt-5 w-full rounded-lg border border-slate-200 py-3 text-sm font-semibold hover:bg-slate-50"
            >
              Manage Contracts →
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h3 className="font-bold">
          Quick Access
        </h3>

        <p className="mt-1 text-xs text-slate-500">
          Jump to commonly used modules
        </p>

        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            {
              name: 'Suppliers',
              icon: Users,
              color: 'text-emerald-600 bg-emerald-50',
            },
            {
              name: 'Purchase Orders',
              icon: ClipboardList,
              color: 'text-blue-600 bg-blue-50',
            },
            {
              name: 'Contracts',
              icon: FileText,
              color: 'text-violet-600 bg-violet-50',
            },
            {
              name: 'Analytics',
              icon: BarChart3,
              color: 'text-orange-600 bg-orange-50',
            },
          ].map(({ name, icon: Icon, color }) => (
            <button
              key={name}
              onClick={() => setActive(name)}
              className="flex flex-col items-center gap-3 rounded-xl border border-slate-100 p-5 transition hover:border-blue-200 hover:bg-blue-50/30"
            >
              <div className={`rounded-xl p-4 ${color}`}>
                <Icon size={23} />
              </div>

              <span className="text-sm font-semibold">
                {name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </>
  )
}

export default Dashboard