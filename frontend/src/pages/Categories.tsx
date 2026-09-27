
// src/pages/Categories.tsx

type CategoriesProps = {
  categories: any[]
  categoryLoading: boolean
  categorySearch: string
  setCategorySearch: (value: string) => void
  showCategoryForm: boolean
  setShowCategoryForm: (value: boolean) => void
  editingCategory: any | null
  setEditingCategory: (value: any | null) => void
  categoryName: string
  setCategoryName: (value: string) => void
  categoryDescription: string
  setCategoryDescription: (value: string) => void
  categorySubmitting: boolean
  resetCategoryForm: () => void
  handleSaveCategory: (
    event: React.FormEvent<HTMLFormElement>
  ) => void
  handleToggleCategory: (category: any) => void
}

function Categories({
  categories,
  categoryLoading,
  categorySearch,
  setCategorySearch,
  showCategoryForm,
  setShowCategoryForm,
  editingCategory,
  setEditingCategory,
  categoryName,
  setCategoryName,
  categoryDescription,
  setCategoryDescription,
  categorySubmitting,
  resetCategoryForm,
  handleSaveCategory,
  handleToggleCategory,
}: CategoriesProps) {
  const filtered = categories.filter((category) =>
    `${category.name || ''} ${category.description || ''} ${
      category.status || ''
    }`
      .toLowerCase()
      .includes(categorySearch.toLowerCase())
  )

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-2xl font-bold">Categories</h3>

            <p className="mt-1 text-sm text-slate-500">
              Create and manage procurement categories.
            </p>
          </div>

          <button
            onClick={() => {
              resetCategoryForm()
              setShowCategoryForm(true)
            }}
            className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:bg-blue-700"
          >
            + Add Category
          </button>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm text-slate-500">
                Total Categories
              </p>

              <p className="mt-2 text-2xl font-bold">
                {categories.length}
              </p>
            </div>

            <input
              value={categorySearch}
              onChange={(event) =>
                setCategorySearch(event.target.value)
              }
              placeholder="Search categories..."
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm sm:max-w-xs"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs text-slate-400">
                  <th className="pb-3 pr-3">CATEGORY</th>
                  <th className="pb-3 pr-3">DESCRIPTION</th>
                  <th className="pb-3 pr-3">STATUS</th>
                  <th className="pb-3">ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                {categoryLoading ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-10 text-center text-slate-400"
                    >
                      Loading categories...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-10 text-center text-slate-400"
                    >
                      No categories found. Add your first category.
                    </td>
                  </tr>
                ) : (
                  filtered.map((category) => (
                    <tr
                      key={category.id}
                      className="border-b border-slate-50 last:border-0"
                    >
                      <td className="py-4 pr-3 font-semibold">
                        {category.name}
                      </td>

                      <td className="py-4 pr-3 text-slate-500">
                        {category.description || '—'}
                      </td>

                      <td className="py-4 pr-3">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            category.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {category.status || 'Active'}
                        </span>
                      </td>

                      <td className="py-4">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => {
                              setEditingCategory(category)
                              setCategoryName(category.name || '')
                              setCategoryDescription(
                                category.description || ''
                              )
                              setShowCategoryForm(true)
                            }}
                            className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              handleToggleCategory(category)
                            }
                            className={`rounded-lg px-3 py-2 text-xs font-semibold ${
                              category.status === 'Active'
                                ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            }`}
                          >
                            {category.status === 'Active'
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

      {showCategoryForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  {editingCategory
                    ? 'Edit Category'
                    : 'Add Category'}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Enter the category details below.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowCategoryForm(false)
                  resetCategoryForm()
                }}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCategory}>
              <div className="mb-4">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Category Name *
                </label>

                <input
                  value={categoryName}
                  onChange={(event) =>
                    setCategoryName(event.target.value)
                  }
                  placeholder="e.g. Office Supplies"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Description
                </label>

                <textarea
                  value={categoryDescription}
                  onChange={(event) =>
                    setCategoryDescription(event.target.value)
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
                    setShowCategoryForm(false)
                    resetCategoryForm()
                  }}
                  className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={categorySubmitting}
                  className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {categorySubmitting
                    ? 'Saving...'
                    : editingCategory
                    ? 'Save Changes'
                    : 'Add Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default Categories