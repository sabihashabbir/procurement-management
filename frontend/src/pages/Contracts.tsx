
import { Package } from 'lucide-react'

function Contracts() {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-10 text-center shadow-sm">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
        <Package size={30} />
      </div>

      <h3 className="mt-5 text-xl font-bold">
        Contracts
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
        This module is ready for development. The Purchase Request and Purchase Order modules are currently connected to the backend.
      </p>
    </div>
  )
}

export default Contracts