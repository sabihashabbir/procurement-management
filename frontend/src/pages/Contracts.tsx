import { useEffect, useMemo, useState, type FormEvent } from 'react'
import {
  Plus,
  Search,
  Pencil,
  X,
  FileText,
  RefreshCw,
} from 'lucide-react'

const API_URL = 'http://127.0.0.1:8000'

type Contract = {
  id: number
  supplier: string
  title: string
  contract_value: number
  start_date: string | null
  end_date: string | null
  status: string
  description: string | null
  created_at?: string | null
}

type ContractForm = {
  supplier: string
  title: string
  contract_value: string
  start_date: string
  end_date: string
  description: string
}

const EMPTY_FORM: ContractForm = {
  supplier: '',
  title: '',
  contract_value: '',
  start_date: '',
  end_date: '',
  description: '',
}

const STATUSES = ['Draft', 'Active', 'Expired', 'Terminated']

export default function Contracts() {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [showForm, setShowForm] = useState(false)
  const [editingContract, setEditingContract] = useState<Contract | null>(null)
  const [form, setForm] = useState<ContractForm>(EMPTY_FORM)
  const [error, setError] = useState('')

  const loadContracts = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await fetch(`${API_URL}/api/contracts`)

      if (!response.ok) {
        throw new Error('Failed to load contracts.')
      }

      const data: Contract[] = await response.json()
      setContracts(data)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load contracts.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadContracts()
  }, [])

  const filteredContracts = useMemo(() => {
    const query = search.trim().toLowerCase()

    return contracts.filter((contract) => {
      const matchesSearch =
        query === '' ||
        contract.title.toLowerCase().includes(query) ||
        contract.supplier.toLowerCase().includes(query) ||
        String(contract.id).includes(query)

      const matchesStatus =
        statusFilter === 'All' || contract.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [contracts, search, statusFilter])

  const totalValue = contracts.reduce(
    (total, contract) => total + Number(contract.contract_value || 0),
    0
  )

  const activeContracts = contracts.filter(
    (contract) => contract.status === 'Active'
  ).length

  const draftContracts = contracts.filter(
    (contract) => contract.status === 'Draft'
  ).length

  const openCreateForm = () => {
    setEditingContract(null)
    setForm({ ...EMPTY_FORM })
    setError('')
    setShowForm(true)
  }

  const openEditForm = (contract: Contract) => {
    setEditingContract(contract)

    setForm({
      supplier: contract.supplier || '',
      title: contract.title || '',
      contract_value: String(contract.contract_value ?? ''),
      start_date: contract.start_date || '',
      end_date: contract.end_date || '',
      description: contract.description || '',
    })

    setError('')
    setShowForm(true)
  }

  const closeForm = () => {
    if (saving) return

    setShowForm(false)
    setEditingContract(null)
    setForm({ ...EMPTY_FORM })
  }

  const handleChange = (field: keyof ContractForm, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!form.supplier.trim()) {
      alert('Supplier is required.')
      return
    }

    if (!form.title.trim()) {
      alert('Contract title is required.')
      return
    }

    const contractValue = Number(form.contract_value)

    if (Number.isNaN(contractValue) || contractValue <= 0) {
      alert('Contract value must be greater than zero.')
      return
    }

    try {
      setSaving(true)
      setError('')

      const payload = {
        supplier: form.supplier.trim(),
        title: form.title.trim(),
        contract_value: contractValue,
        start_date: form.start_date || null,
        end_date: form.end_date || null,
        description: form.description.trim() || null,
      }

      const url = editingContract
        ? `${API_URL}/api/contracts/${editingContract.id}`
        : `${API_URL}/api/contracts`

      const response = await fetch(url, {
        method: editingContract ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to save contract.')
      }

      closeForm()
      await loadContracts()
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to save contract.'
      )
    } finally {
      setSaving(false)
    }
  }

  const handleStatusChange = async (
    contract: Contract,
    status: string
  ) => {
    if (status === contract.status) return

    try {
      setError('')

      const response = await fetch(
        `${API_URL}/api/contracts/${contract.id}/status`,
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
          data.detail || 'Failed to update contract status.'
        )
      }

      setContracts((current) =>
        current.map((item) =>
          item.id === contract.id ? data : item
        )
      )
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to update contract status.'
      )
    }
  }

  const formatCurrency = (value: number) => {
    return `₹${Number(value || 0).toLocaleString('en-IN', {
      maximumFractionDigits: 2,
    })}`
  }

  const formatDate = (value: string | null) => {
    if (!value) return '—'

    const date = new Date(value)

    if (Number.isNaN(date.getTime())) {
      return value
    }

    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  const getStatusClass = (status: string) => {
    if (status === 'Active') {
      return 'bg-emerald-50 text-emerald-700'
    }

    if (status === 'Expired') {
      return 'bg-orange-50 text-orange-700'
    }

    if (status === 'Terminated') {
      return 'bg-red-50 text-red-700'
    }

    return 'bg-amber-50 text-amber-700'
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-2xl font-bold">Contracts</h3>
          <p className="mt-1 text-sm text-slate-500">
            Create and manage supplier contracts.
          </p>
        </div>

        <button
          onClick={openCreateForm}
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700"
        >
          <Plus size={18} />
          New Contract
        </button>
      </div>

      {error && (
        <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span>{error}</span>
          <button
            onClick={() => setError('')}
            className="rounded-lg p-1 hover:bg-red-100"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total Contracts</p>
          <p className="mt-3 text-2xl font-bold">{contracts.length}</p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Active Contracts</p>
          <p className="mt-3 text-2xl font-bold text-emerald-600">
            {activeContracts}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total Contract Value</p>
          <p className="mt-3 text-2xl font-bold text-blue-600">
            {formatCurrency(totalValue)}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {draftContracts} draft contract
            {draftContracts === 1 ? '' : 's'}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search contracts or suppliers..."
              className="w-full rounded-lg border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
          >
            <option value="All">All Statuses</option>

            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <button
            onClick={loadContracts}
            className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="font-bold text-slate-900">Contract List</h2>
          <p className="mt-1 text-sm text-slate-500">
            {filteredContracts.length} contract
            {filteredContracts.length === 1 ? '' : 's'} found
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                <th className="px-3 py-3">Contract</th>
                <th className="px-3 py-3">Supplier</th>
                <th className="px-3 py-3">Value</th>
                <th className="px-3 py-3">Start Date</th>
                <th className="px-3 py-3">End Date</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-10 text-center text-sm text-slate-400"
                  >
                    Loading contracts...
                  </td>
                </tr>
              ) : filteredContracts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center">
                    <FileText
                      size={36}
                      className="mx-auto text-slate-300"
                    />
                    <p className="mt-3 text-sm font-semibold text-slate-600">
                      No contracts found
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Create a contract or change your filters.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredContracts.map((contract) => (
                  <tr
                    key={contract.id}
                    className="border-b border-slate-50 hover:bg-slate-50"
                  >
                    <td className="px-3 py-4">
                      <p className="font-semibold text-slate-800">
                        {contract.title}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        Contract #{contract.id}
                      </p>
                    </td>

                    <td className="px-3 py-4 text-sm text-slate-700">
                      {contract.supplier}
                    </td>

                    <td className="px-3 py-4 text-sm font-semibold text-slate-800">
                      {formatCurrency(contract.contract_value)}
                    </td>

                    <td className="px-3 py-4 text-sm text-slate-600">
                      {formatDate(contract.start_date)}
                    </td>

                    <td className="px-3 py-4 text-sm text-slate-600">
                      {formatDate(contract.end_date)}
                    </td>

                    <td className="px-3 py-4">
                      <select
                        value={contract.status}
                        onChange={(event) =>
                          handleStatusChange(
                            contract,
                            event.target.value
                          )
                        }
                        className={`rounded-full border-0 px-3 py-1.5 text-xs font-semibold outline-none ${getStatusClass(
                          contract.status
                        )}`}
                      >
                        {STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="px-3 py-4 text-right">
                      <button
                        onClick={() => openEditForm(contract)}
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        <Pencil size={14} />
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 p-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {editingContract ? 'Edit Contract' : 'New Contract'}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {editingContract
                    ? 'Update contract details.'
                    : 'Create a new supplier contract.'}
                </p>
              </div>

              <button
                onClick={closeForm}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-6">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Supplier *
                  </label>
                  <input
                    type="text"
                    value={form.supplier}
                    onChange={(event) =>
                      handleChange('supplier', event.target.value)
                    }
                    placeholder="Supplier name"
                    className="w-full rounded-lg border border-slate-200 px-3 py-3 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Contract Title *
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(event) =>
                      handleChange('title', event.target.value)
                    }
                    placeholder="Contract title"
                    className="w-full rounded-lg border border-slate-200 px-3 py-3 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Contract Value *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.contract_value}
                    onChange={(event) =>
                      handleChange(
                        'contract_value',
                        event.target.value
                      )
                    }
                    placeholder="250000"
                    className="w-full rounded-lg border border-slate-200 px-3 py-3 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={form.start_date}
                    onChange={(event) =>
                      handleChange('start_date', event.target.value)
                    }
                    className="w-full rounded-lg border border-slate-200 px-3 py-3 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={form.end_date}
                    onChange={(event) =>
                      handleChange('end_date', event.target.value)
                    }
                    className="w-full rounded-lg border border-slate-200 px-3 py-3 text-sm outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(event) =>
                    handleChange('description', event.target.value)
                  }
                  placeholder="Contract description..."
                  className="w-full resize-none rounded-lg border border-slate-200 px-3 py-3 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="rounded-lg border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? 'Saving...'
                    : editingContract
                      ? 'Update Contract'
                      : 'Create Contract'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
