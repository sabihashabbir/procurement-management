
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  ArrowDownToLine,
  CheckCircle2,
  Clock,
  CreditCard,
  Plus,
  RefreshCw,
  Search,
  X,
  AlertCircle,
  Wallet,
  XCircle,
} from 'lucide-react'

const API_URL = 'http://127.0.0.1:8000'

type TransactionStatus = 'Pending' | 'Completed' | 'Failed'

type Transaction = {
  id: number
  purchase_order_id: number
  supplier: string
  amount: number
  payment_method?: string | null
  reference_number?: string | null
  status: TransactionStatus | string
  transaction_date?: string | null
  notes?: string | null
  created_at?: string | null
}

type PurchaseOrder = {
  id: number
  supplier: string
  amount: number
  status?: string
}

type TransactionForm = {
  purchase_order_id: string
  amount: string
  payment_method: string
  reference_number: string
  notes: string
}

const emptyForm: TransactionForm = {
  purchase_order_id: '',
  amount: '',
  payment_method: '',
  reference_number: '',
  notes: '',
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0)

const formatDate = (date?: string | null) => {
  if (!date) return '—'

  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime())) return '—'

  return parsed.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

const statusStyle = (status: string) => {
  switch (status) {
    case 'Completed':
      return 'bg-emerald-50 text-emerald-700'
    case 'Failed':
      return 'bg-red-50 text-red-700'
    default:
      return 'bg-amber-50 text-amber-700'
  }
}

function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [updatingId, setUpdatingId] = useState<number | null>(null)

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<TransactionForm>(emptyForm)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const fetchTransactions = useCallback(async () => {
    const response = await fetch(`${API_URL}/api/transactions`)

    if (!response.ok) {
      throw new Error('Could not load transactions.')
    }

    const data = await response.json()
    setTransactions(Array.isArray(data) ? data : [])
  }, [])

  const fetchPurchaseOrders = useCallback(async () => {
    const response = await fetch(`${API_URL}/api/purchase-orders`)

    if (!response.ok) {
      throw new Error('Could not load purchase orders.')
    }

    const data = await response.json()
    setPurchaseOrders(Array.isArray(data) ? data : [])
  }, [])

  const loadData = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      await Promise.all([
        fetchTransactions(),
        fetchPurchaseOrders(),
      ])
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Could not load transaction data.',
      )
    } finally {
      setLoading(false)
    }
  }, [fetchTransactions, fetchPurchaseOrders])

  useEffect(() => {
    void loadData()
  }, [loadData])

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const searchText = [
        transaction.id,
        transaction.purchase_order_id,
        transaction.supplier,
        transaction.reference_number || '',
        transaction.payment_method || '',
        transaction.status,
      ]
        .join(' ')
        .toLowerCase()

      const matchesSearch = searchText.includes(search.toLowerCase())
      const matchesStatus =
        statusFilter === 'All' || transaction.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [transactions, search, statusFilter])

  const totalAmount = transactions.reduce(
    (sum, transaction) => sum + Number(transaction.amount || 0),
    0,
  )

  const completedAmount = transactions
    .filter((transaction) => transaction.status === 'Completed')
    .reduce((sum, transaction) => sum + Number(transaction.amount || 0), 0)

  const pendingCount = transactions.filter(
    (transaction) => transaction.status === 'Pending',
  ).length

  const failedCount = transactions.filter(
    (transaction) => transaction.status === 'Failed',
  ).length

  const handlePurchaseOrderChange = (value: string) => {
    const selected = purchaseOrders.find(
      (order) => String(order.id) === value,
    )

    setForm((current) => ({
      ...current,
      purchase_order_id: value,
      amount: selected ? String(selected.amount) : current.amount,
    }))
  }

  const handleCreateTransaction = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (!form.purchase_order_id || !form.amount) {
      setError('Select a purchase order and enter an amount.')
      return
    }

    const amount = Number(form.amount)

    if (!Number.isFinite(amount) || amount <= 0) {
      setError('Enter a valid amount greater than zero.')
      return
    }

    try {
      setSubmitting(true)

      const response = await fetch(`${API_URL}/api/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          purchase_order_id: Number(form.purchase_order_id),
          amount,
          payment_method: form.payment_method || null,
          reference_number: form.reference_number.trim() || null,
          notes: form.notes.trim() || null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.detail || 'Could not create the transaction.',
        )
      }

      setTransactions((current) => [data, ...current])
      setForm(emptyForm)
      setShowForm(false)
      setSuccess('Transaction created successfully.')
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Could not create the transaction.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  const handleStatusChange = async (
    transaction: Transaction,
    status: TransactionStatus,
  ) => {
    setError('')
    setSuccess('')

    if (transaction.status === status) return

    try {
      setUpdatingId(transaction.id)

      const response = await fetch(
        `${API_URL}/api/transactions/${transaction.id}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status }),
        },
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.detail || 'Could not update transaction status.',
        )
      }

      setTransactions((current) =>
        current.map((item) =>
          item.id === transaction.id ? data : item,
        ),
      )

      setSuccess(`Transaction #${transaction.id} updated to ${status}.`)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Could not update transaction status.',
      )
    } finally {
      setUpdatingId(null)
    }
  }

  const exportCSV = () => {
    const headers = [
      'Transaction ID',
      'Purchase Order ID',
      'Supplier',
      'Amount',
      'Payment Method',
      'Reference Number',
      'Status',
      'Transaction Date',
      'Notes',
    ]

    const rows = filteredTransactions.map((transaction) => [
      transaction.id,
      transaction.purchase_order_id,
      transaction.supplier,
      transaction.amount,
      transaction.payment_method || '',
      transaction.reference_number || '',
      transaction.status,
      transaction.transaction_date || '',
      transaction.notes || '',
    ])

    const escapeCSV = (value: unknown) =>
      `"${String(value ?? '').replace(/"/g, '""')}"`

    const csv = [headers, ...rows]
      .map((row) => row.map(escapeCSV).join(','))
      .join('\r\n')

    const blob = new Blob([csv], {
      type: 'text/csv;charset=utf-8;',
    })

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'transactions.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Transactions
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Track procurement payments and transaction records.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => void loadData()}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>

          <button
            type="button"
            onClick={exportCSV}
            disabled={filteredTransactions.length === 0}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            <ArrowDownToLine size={16} />
            Export CSV
          </button>

          <button
            type="button"
            onClick={() => {
              setError('')
              setSuccess('')
              setForm(emptyForm)
              setShowForm(true)
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            <Plus size={17} />
            New Transaction
          </button>
        </div>
      </div>

      {/* FEEDBACK */}
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">
              Total Transactions
            </span>
            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <Wallet size={20} />
            </div>
          </div>
          <p className="mt-4 text-2xl font-bold text-slate-900">
            {transactions.length}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            All recorded transactions
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">
              Total Transaction Value
            </span>
            <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
              <CreditCard size={20} />
            </div>
          </div>
          <p className="mt-4 text-2xl font-bold text-slate-900">
            {formatCurrency(totalAmount)}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Value of all recorded transactions
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">
              Completed Payments
            </span>
            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
              <CheckCircle2 size={20} />
            </div>
          </div>
          <p className="mt-4 text-2xl font-bold text-slate-900">
            {formatCurrency(completedAmount)}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            {transactions.filter((item) => item.status === 'Completed').length}{' '}
            completed transactions
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">
              Pending / Failed
            </span>
            <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
              <Clock size={20} />
            </div>
          </div>
          <p className="mt-4 text-2xl font-bold text-slate-900">
            {pendingCount + failedCount}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            {pendingCount} pending · {failedCount} failed
          </p>
        </div>
      </div>

      {/* TRANSACTIONS TABLE */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-bold text-slate-900">
              Transaction Records
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Search, review, and update transaction status.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search transactions..."
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-500 sm:w-64"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
            >
              <option value="All">All statuses</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Failed">Failed</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center text-sm text-slate-500">
            Loading transactions...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-4">Transaction</th>
                  <th className="px-5 py-4">Purchase Order</th>
                  <th className="px-5 py-4">Supplier</th>
                  <th className="px-5 py-4">Amount</th>
                  <th className="px-5 py-4">Payment Method</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Update Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="border-b border-slate-50 last:border-0 hover:bg-slate-50/70"
                  >
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-800">
                        TXN-{String(transaction.id).padStart(4, '0')}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {transaction.reference_number || 'No reference'}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm font-medium text-blue-600">
                      PO-{String(transaction.purchase_order_id).padStart(4, '0')}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-700">
                      {transaction.supplier}
                    </td>

                    <td className="px-5 py-4 text-sm font-semibold text-slate-900">
                      {formatCurrency(transaction.amount)}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {transaction.payment_method || '—'}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {formatDate(transaction.transaction_date)}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyle(
                          transaction.status,
                        )}`}
                      >
                        {transaction.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <select
                        value={transaction.status}
                        disabled={updatingId === transaction.id}
                        onChange={(event) =>
                          void handleStatusChange(
                            transaction,
                            event.target.value as TransactionStatus,
                          )
                        }
                        className="rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs outline-none focus:border-blue-500 disabled:opacity-50"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                        <option value="Failed">Failed</option>
                      </select>
                    </td>
                  </tr>
                ))}

                {filteredTransactions.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-5 py-16 text-center"
                    >
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                        <Wallet size={26} />
                      </div>
                      <p className="mt-4 font-semibold text-slate-700">
                        No transactions found
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {transactions.length === 0
                          ? 'Create your first transaction to see it here.'
                          : 'Try changing your search or status filter.'}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE TRANSACTION MODAL */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  New Transaction
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Record a payment against a purchase order.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateTransaction} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Purchase Order *
                </label>
                <select
                  value={form.purchase_order_id}
                  onChange={(event) =>
                    handlePurchaseOrderChange(event.target.value)
                  }
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-blue-500"
                >
                  <option value="">Select a purchase order</option>
                  {purchaseOrders.map((order) => (
                    <option key={order.id} value={order.id}>
                      PO-{String(order.id).padStart(4, '0')} — {order.supplier} —{' '}
                      {formatCurrency(order.amount)}
                    </option>
                  ))}
                </select>

                {purchaseOrders.length === 0 && (
                  <p className="mt-2 text-xs text-amber-600">
                    No purchase orders are available. Create a purchase order first.
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Amount (₹) *
                </label>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={form.amount}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      amount: event.target.value,
                    }))
                  }
                  placeholder="Enter transaction amount"
                  required
                  className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Payment Method
                </label>
                <select
                  value={form.payment_method}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      payment_method: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-blue-500"
                >
                  <option value="">Select payment method</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="UPI">UPI</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Debit Card">Debit Card</option>
                  <option value="Cheque">Cheque</option>
                  <option value="Cash">Cash</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Reference Number
                </label>
                <input
                  value={form.reference_number}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      reference_number: event.target.value,
                    }))
                  }
                  placeholder="Transaction or payment reference"
                  className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Notes
                </label>
                <textarea
                  value={form.notes}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      notes: event.target.value,
                    }))
                  }
                  placeholder="Optional notes"
                  rows={3}
                  className="w-full resize-none rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting || purchaseOrders.length === 0}
                  className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Create Transaction'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Transactions