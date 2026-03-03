import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Home, Package, ChefHat, Book, User, LogOut, Menu, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Navbar: React.FC = () => {
  const { logout, user } = useApp();
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: Home },
    { to: '/dispensa', label: 'Dispensa', icon: Package },
    { to: '/smart-chef', label: 'Smart Chef', icon: ChefHat },
    { to: '/ricette', label: 'Ricette', icon: Book },
    { to: '/profilo', label: 'Profilo', icon: User },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-gray-100">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
            <ChefHat className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-800">SmartMeal</span>
        </div>
        
        <div className="text-xs font-semibold text-gray-400 mb-4 px-2">MENU</div>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-xl transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-600 font-medium'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-gray-100">
         <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-sm">
                {user?.nome.charAt(0)}
            </div>
            <div className="overflow-hidden">
                <p className="text-sm font-medium text-gray-900 truncate">{user?.nome}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
         </div>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2 text-gray-500 hover:text-danger hover:bg-red-50 rounded-xl w-full transition-colors text-sm"
        >
          <LogOut className="w-5 h-5" />
          Esci dall'account
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-gray-100 sticky top-0 z-20">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <ChefHat className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg">SmartMeal</span>
        </div>
        <button onClick={toggleMenu} className="p-2 text-gray-600">
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={toggleMenu}>
          <div className="absolute left-0 top-0 h-full w-64 bg-white" onClick={e => e.stopPropagation()}>
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed left-0 top-0 h-full w-64 z-10">
        {sidebarContent}
      </div>
    </>
  );
};

const ToastContainer: React.FC = () => {
  const { toasts } = useApp();
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`px-4 py-3 rounded-lg shadow-lg text-white text-sm font-medium animate-fade-in-up ${
            toast.type === 'success' ? 'bg-secondary' :
            toast.type === 'error' ? 'bg-danger' :
            toast.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
          }`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
};

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f9fafb]">
      <Navbar />
      <main className="lg:ml-64 p-4 lg:p-8 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
      <ToastContainer />
    </div>
  );
};