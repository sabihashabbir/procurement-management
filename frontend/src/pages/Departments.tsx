
type DepartmentsProps = {
  departments: any[]
  departmentLoading: boolean
  departmentSearch: string
  setDepartmentSearch: (value: string) => void
  showDepartmentForm: boolean
  setShowDepartmentForm: (value: boolean) => void
  editingDepartment: any | null
  setEditingDepartment: (value: any | null) => void
  departmentName: string
  setDepartmentName: (value: string) => void
  departmentDescription: string
  setDepartmentDescription: (value: string) => void
  departmentSubmitting: boolean
  resetDepartmentForm: () => void
  handleSaveDepartment: (
    event: React.FormEvent<HTMLFormElement>
  ) => void
  handleToggleDepartment: (department: any) => void
}

function Departments({
  departments,
  departmentLoading,
  departmentSearch,
  setDepartmentSearch,
  showDepartmentForm,
  setShowDepartmentForm,
  editingDepartment,
  setEditingDepartment,
  departmentName,
  setDepartmentName,
  departmentDescription,
  setDepartmentDescription,
  departmentSubmitting,
  resetDepartmentForm,
  handleSaveDepartment,
  handleToggleDepartment,
}: DepartmentsProps) {
  const filtered = departments.filter((department) =>
    `${department.name || ''} ${
      department.description || ''
    } ${department.status || ''}`
      .toLowerCase()
      .includes(departmentSearch.toLowerCase())
  )

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-2xl font-bold">Departments</h3>

            <p className="mt-1 text-sm text-slate-500">
              Create and manage organizational departments.
            </p>
          </div>

          <button
            onClick={() => {
              resetDepartmentForm()
              setShowDepartmentForm(true)
            }}
            className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:bg-blue-700"
          >
            + Add Department
          </button>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm text-slate-500">
                Total Departments
              </p>

              <p className="mt-2 text-2xl font-bold">
                {departments.length}
              </p>
            </div>

            <input
              value={departmentSearch}
              onChange={(event) =>
                setDepartmentSearch(event.target.value)
              }
              placeholder="Search departments..."
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm sm:max-w-xs"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs text-slate-400">
                  <th className="pb-3 pr-3">DEPARTMENT</th>
                  <th className="pb-3 pr-3">DESCRIPTION</th>
                  <th className="pb-3 pr-3">STATUS</th>
                  <th className="pb-3">ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                {departmentLoading ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-10 text-center text-slate-400"
                    >
                      Loading departments...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-10 text-center text-slate-400"
                    >
                      No departments found. Add your first department.
                    </td>
                  </tr>
                ) : (
                  filtered.map((department) => (
                    <tr
                      key={department.id}
                      className="border-b border-slate-50 last:border-0"
                    >
                      <td className="py-4 pr-3 font-semibold">
                        {department.name}
                      </td>

                      <td className="py-4 pr-3 text-slate-500">
                        {department.description || '—'}
                      </td>

                      <td className="py-4 pr-3">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            department.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {department.status || 'Active'}
                        </span>
                      </td>

                      <td className="py-4">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => {
                              setEditingDepartment(department)
                              setDepartmentName(
                                department.name || ''
                              )
                              setDepartmentDescription(
                                department.description || ''
                              )
                              setShowDepartmentForm(true)
                            }}
                            className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              handleToggleDepartment(department)
                            }
                            className={`rounded-lg px-3 py-2 text-xs font-semibold ${
                              department.status === 'Active'
                                ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            }`}
                          >
                            {department.status === 'Active'
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
      </div>

      {showDepartmentForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  {editingDepartment
                    ? 'Edit Department'
                    : 'Add Department'}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Enter the department details below.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowDepartmentForm(false)
                  resetDepartmentForm()
                }}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveDepartment}>
              <div className="mb-4">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Department Name *
                </label>

                <input
                  value={departmentName}
                  onChange={(event) =>
                    setDepartmentName(event.target.value)
                  }
                  placeholder="e.g. Information Technology"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Description
                </label>

                <textarea
                  value={departmentDescription}
                  onChange={(event) =>
                    setDepartmentDescription(event.target.value)
                  }
                  placeholder="Optional description"
                  rows={3}
                  className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowDepartmentForm(false)
                    resetDepartmentForm()
                  }}
                  className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={departmentSubmitting}
                  className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {departmentSubmitting
                    ? 'Saving...'
                    : editingDepartment
                    ? 'Save Changes'
                    : 'Add Department'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default Departments