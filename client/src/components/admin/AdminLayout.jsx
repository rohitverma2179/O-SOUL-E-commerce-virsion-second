import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Users, 
  LogOut, 
  Menu, 
  X, 
  ChevronRight,
  Bell,
  Search,
  ArrowRight,
  PackagePlus,
  Megaphone,
  Info
} from 'lucide-react';
import { API_BASE_URL } from '../../lib/api';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Users', icon: <Users size={20} />, path: '/admin/users' },
    { name: 'Catalog', icon: <PackagePlus size={20} />, path: '/admin/catalog' },
    { name: 'Promo Popup', icon: <Megaphone size={20} />, path: '/admin/popup' },
    { name: 'Footer Settings', icon: <Info size={20} />, path: '/admin/footer' },
    { name: 'Back to Site', icon: <ArrowRight size={20} />, path: '/' },
  ];

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/admin/logout`, { 
        method: 'POST',
        credentials: 'include'
      });
      navigate('/admin/login');
    } catch (error) {
      navigate('/admin/login');
    }
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-900 font-sans">
      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-[#0f172a] text-white transition-all duration-300 ease-in-out flex flex-col z-50`}
      >
        <div className="p-6 flex items-center justify-between">
          {isSidebarOpen && (
            <span className="text-xl font-bold tracking-tighter text-white">
              O'SOUL <span className="text-olive">ADMIN</span>
            </span>
          )}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <nav className="flex-1 px-4 mt-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center p-3 rounded-xl transition-all duration-200 group ${
                location.pathname === item.path 
                  ? 'bg-olive text-white shadow-lg shadow-olive/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {isSidebarOpen && (
                <span className="ml-3 font-medium transition-opacity duration-300">
                  {item.name}
                </span>
              )}
              {isSidebarOpen && location.pathname === item.path && (
                <ChevronRight size={14} className="ml-auto opacity-50" />
              )}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full p-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-xl transition-all duration-200"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="ml-3 font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <div className="flex items-center bg-slate-100 px-3 py-2 rounded-lg w-96">
            {/* <Search size={18} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Search anything..." 
              className="bg-transparent border-none focus:ring-0 text-sm ml-2 w-full"
            /> */}
          </div>

          <div className="flex items-center gap-4">
            {/* <button className="p-2 text-slate-400 hover:text-olive transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button> */}
            <div className="h-8 w-px bg-slate-200 mx-2"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden md:block">
                <p className="text-sm font-semibold leading-none">Super Admin</p>
                <p className="text-xs text-slate-400 mt-1">rohit@osoul.com</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-olive flex items-center justify-center text-white font-bold">
                R
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
