import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Mail,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Globe,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useSettings } from '../../../context/SettingsContext';

const SidebarItem = ({ to, icon: Icon, label, onClick, end }) => (
  <NavLink
    to={to}
    end={end}
    onClick={onClick}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
        isActive
          ? 'bg-primary text-white shadow-lg shadow-primary/25 active'
          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
      }`
    }>
    <Icon size={20} strokeWidth={2} />
    <span className="font-medium">{label}</span>
    {/* Active Indicator */}
    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white opacity-0 group-[.active]:opacity-100 transition-opacity" />
  </NavLink>
);

export default function DashboardLayout() {
  const { logout } = useAuth();
  const { settings } = useSettings();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-72 bg-white border-r border-slate-200 p-6 z-50 transition-transform duration-300 lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        <div className="relative flex items-center justify-center mb-6 pt-4">
          <div className="flex items-center justify-center w-full px-4">
            {settings?.logo_url ? (
              <img
                src={settings.logo_url}
                alt={settings?.site_name || 'NextStop Logo'}
                className="h-20 w-auto object-contain transition-transform duration-300 hover:scale-105"
              />
            ) : (
              <img
                src="/logo.png"
                alt="NextStop Logo"
                className="h-28 w-auto object-contain transition-transform duration-300 hover:scale-105 drop-shadow-md"
              />
            )}
          </div>
          <button
            onClick={toggleSidebar}
            className="absolute right-0 top-2 lg:hidden p-2 hover:bg-slate-100 rounded-lg text-slate-500">
            <X size={20} />
          </button>
        </div>

        <nav className="space-y-2">
          <NavLink
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-accent hover:bg-accent/10 transition-all duration-300 mb-4 border border-accent/20 bg-accent/5">
            <Globe size={20} strokeWidth={2} />
            <span className="font-bold">Visit Website</span>
          </NavLink>

          <SidebarItem
            to="/admin"
            icon={LayoutDashboard}
            label="Overview"
            onClick={() => setSidebarOpen(false)}
            end
          />
          <SidebarItem
            to="/admin/submissions"
            icon={Users}
            label="Submissions"
            onClick={() => setSidebarOpen(false)}
          />
          <SidebarItem
            to="/admin/email"
            icon={Mail}
            label="Email System"
            onClick={() => setSidebarOpen(false)}
          />
          <SidebarItem
            to="/admin/settings"
            icon={Settings}
            label="Settings"
            onClick={() => setSidebarOpen(false)}
          />
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors">
            <LogOut size={20} />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        {/* Header */}
        <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between z-30">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 hover:bg-slate-100 rounded-lg text-slate-500">
            <Menu size={20} />
          </button>

          <div className="flex items-center ml-auto gap-4">
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div className="h-10 w-10 rounded-full bg-slate-200 overflow-hidden border border-slate-200">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"
                alt="User"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </header>

        {/* Page Content with Transition */}
        <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}>
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
