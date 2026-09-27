
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  FileText,
  ClipboardList,
  BarChart3,
  Settings,
  Package,
  Wallet,
  ShieldCheck,
  LogOut,
  Building2,
  X,
} from 'lucide-react'

const navigation = [
  {
    title: 'OVERVIEW',
    items: [
      { name: 'Dashboard', icon: LayoutDashboard },
    ],
  },
  {
    title: 'PROCUREMENT',
    items: [
      { name: 'Purchase Requests', icon: ShoppingCart },
      { name: 'Purchase Orders', icon: ClipboardList },
      { name: 'Suppliers', icon: Users },
      { name: 'Contracts', icon: FileText },
      { name: 'Transactions', icon: Wallet },
    ],
  },
  {
    title: 'MANAGEMENT',
    items: [
      { name: 'Departments', icon: Building2 },
      { name: 'Categories', icon: Package },
      { name: 'Approvals', icon: ShieldCheck },
      { name: 'Analytics', icon: BarChart3 },
      { name: 'Settings', icon: Settings },
    ],
  },
]

type SidebarProps = {
  active: string
  role: string
  setRole: (role: string) => void
  menuOpen: boolean
  setMenuOpen: (open: boolean) => void
  handleNavigation: (name: string) => void
}

export default function Sidebar({
  active,
  role,
  setRole,
  menuOpen,
  setMenuOpen,
  handleNavigation,
}: SidebarProps) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-[#17243b] text-white transition-transform duration-200 ${
        menuOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}
    >
      <div className="flex h-20 items-center gap-3 border-b border-white/10 px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500">
          <Package size={22} />
        </div>

        <div>
          <h1 className="text-lg font-bold">ProcureFlow</h1>
          <p className="text-xs text-slate-400">
            Management System
          </p>
        </div>

        <button
          className="ml-auto lg:hidden"
          onClick={() => setMenuOpen(false)}
        >
          <X />
        </button>
      </div>

      <div className="border-b border-white/10 p-4">
        <label className="mb-2 block text-xs text-slate-400">
          CURRENT ROLE
        </label>

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full rounded-lg border border-white/10 bg-[#253550] px-3 py-2.5 text-sm text-white outline-none"
        >
          <option>Super Admin</option>
          <option>Admin</option>
        </select>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-4 py-6">
        {navigation.map((group) => (
          <div key={group.title}>
            <p className="mb-3 px-3 text-[10px] font-bold tracking-[2px] text-slate-500">
              {group.title}
            </p>

            <div className="space-y-1">
              {group.items
                .filter(
                  (item) =>
                    role === 'Super Admin' ||
                    ![
                      'Departments',
                      'Categories',
                      'Analytics',
                      'Settings',
                    ].includes(item.name)
                )
                .map(({ name, icon: Icon }) => (
                  <button
                    key={name}
                    onClick={() => handleNavigation(name)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm transition ${
                      active === name
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-950/20'
                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Icon size={18} />
                    {name}
                  </button>
                ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20 text-sm font-bold text-blue-300">
            SA
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">
              System Administrator
            </p>
            <p className="text-xs text-slate-400">{role}</p>
          </div>

          <LogOut size={17} className="text-slate-400" />
        </div>
      </div>
    </aside>
  )
}