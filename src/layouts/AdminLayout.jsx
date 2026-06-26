import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'
import NotificationBell from '@/components/shared/NotificationBell'

const NAV = [
  { to: '/admin',               label: 'Dashboard',      icon: '▦', end: true },
  { to: '/admin/users',         label: 'Users',          icon: '👤' },
  { to: '/admin/verifications', label: 'Verifications',  icon: '✅' },
  { to: '/admin/categories',    label: 'Categories',     icon: '📂' },
  { to: '/admin/payments',      label: 'Payments',       icon: '💳' },
  { to: '/admin/reviews',       label: 'Reviews',        icon: '⭐' },
  { to: '/admin/reports',       label: 'Reports',        icon: '📊' },
  { to: '/admin/audit-logs',    label: 'Audit Logs',     icon: '🔍' },
  { to: '/admin/settings',      label: 'Settings',       icon: '⚙️' },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <aside className="w-64 shrink-0 border-r border-slate-200 bg-white flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-200 gap-2">
          <span className="text-lg font-bold text-slate-800" style={{ fontFamily: 'Georgia, serif' }}>Operalyn</span>
          <span className="text-xs font-bold bg-slate-900 text-white px-1.5 py-0.5 rounded-md">Admin</span>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV.map(({ to, label, icon, end }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) => cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              )}>
              <span className="text-base w-5 text-center leading-none">{icon}</span>{label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-slate-200">
          <div className="flex items-center gap-3 px-2 py-1.5">
            <div className="h-8 w-8 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800 truncate">{user?.name}</p>
              <p className="text-xs text-slate-400">Administrator</p>
            </div>
          </div>
          <button onClick={logout} className="mt-1 w-full text-left px-3 py-1.5 text-xs text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-md transition-colors">
            Sign out
          </button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 shrink-0 border-b border-slate-200 bg-white flex items-center px-6 gap-3">
          <h1 className="text-lg font-semibold text-slate-800 flex-1">Admin Panel</h1>
          <NotificationBell />
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto"><Outlet /></div>
        </main>
      </div>
    </div>
  )
}
