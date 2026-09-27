
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
} from 'lucide-react'

type HeaderProps = {
  active: string
  setMenuOpen: (open: boolean) => void
  search: string
  setSearch: (value: string) => void
}

export default function Header({
  active,
  setMenuOpen,
  search,
  setSearch,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setMenuOpen(true)}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
        >
          <Menu size={21} />
        </button>

        <div>
          <h1 className="text-xl font-bold text-slate-900">
            {active}
          </h1>
          <p className="hidden text-xs text-slate-400 sm:block">
            Manage your procurement operations
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 sm:flex">
          <Search size={17} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-40 bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
        </div>

        <button className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100">
          <Bell size={19} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <button className="hidden items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-50 sm:flex">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
            SA
          </div>
          <ChevronDown size={15} className="text-slate-400" />
        </button>
      </div>
    </header>
  )
}