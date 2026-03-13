import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Briefcase, User, LayoutDashboard, BookOpen, ShieldCheck, MessageSquare, Menu, X, ChevronRight, LogOut, ClipboardList } from 'lucide-react';
import BKBIETLogo from './BKBIETLogo';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole')?.toUpperCase() || '';
  const userName = localStorage.getItem('userName') || '';
  const isAdminOrCoordinator = userRole === 'ADMIN' || userRole === 'COORDINATOR';

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ...(isAdminOrCoordinator ? [{ path: '/admin', label: 'Admin Panel', icon: ShieldCheck }] : []),
    { path: '/jobs', label: 'Drives', icon: Briefcase },
    { path: '/applications', label: 'Tracker', icon: ClipboardList },
    { path: '/resources', label: 'Resources', icon: BookOpen },
    { path: '/messages', label: 'Messages', icon: MessageSquare },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    navigate('/');
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 glass-morphism border-b border-gray-200/50 supports-[backdrop-filter]:bg-white/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* Logo — clickable, goes to home */}
          <Link
            to={token ? '/dashboard' : '/'}
            className="flex items-center gap-3 group"
            onClick={() => setMobileOpen(false)}
          >
            <div className="h-10 w-10 rounded-full bg-white shadow-sm border border-gray-100 overflow-hidden flex items-center justify-center transition-transform group-hover:scale-105">
              <img
                src="/bkbiet-logo.png"
                alt="BKBIET Logo"
                className="h-10 w-10 object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <BKBIETLogo size={36} className="hidden" />
            </div>
            <div>
              <span className="text-base font-bold text-gray-900 tracking-tight leading-none hidden sm:block">
                BKBIET
              </span>
              <span className="text-xs text-gray-500 leading-none hidden sm:block">Placement Cell</span>
            </div>
          </Link>

          {/* Desktop nav */}
          {token && (
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          )}

          {/* Right side: auth */}
          <div className="flex items-center gap-3">
            {token ? (
              <>
                {/* User badge */}
                <div className="hidden sm:flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1.5">
                  <div className="h-6 w-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                    {(userName || userRole || 'U').charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-medium text-gray-700 max-w-[100px] truncate">
                    {userName || userRole}
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                    userRole === 'ADMIN' ? 'bg-red-100 text-red-700' :
                    userRole === 'COORDINATOR' ? 'bg-indigo-100 text-indigo-700' :
                    userRole === 'COMPANY' ? 'bg-purple-100 text-purple-700' :
                    'bg-green-100 text-green-700'
                  }`}>{userRole}</span>
                </div>

                {/* Sign out */}
                <button
                  onClick={handleLogout}
                  className="hidden sm:flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all border border-transparent hover:border-red-100"
                >
                  <LogOut className="w-4 h-4" /> Sign out
                </button>

                {/* Mobile hamburger */}
                <button
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 shadow-[0_2px_8px_rgba(37,99,235,0.2)] hover:shadow-[0_4px_12px_rgba(37,99,235,0.3)] transition-all"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileOpen && token && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg animate-in slide-in-from-top-2 duration-200">
          {/* User info */}
          <div className="px-4 py-3 border-b border-gray-50 flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
              {(userName || userRole || 'U').charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{userName || 'User'}</p>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                userRole === 'ADMIN' ? 'bg-red-100 text-red-700' :
                userRole === 'COORDINATOR' ? 'bg-indigo-100 text-indigo-700' :
                'bg-green-100 text-green-700'
              }`}>{userRole}</span>
            </div>
          </div>

          {/* Nav items */}
          <nav className="px-2 py-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl mb-1 transition-all ${
                    isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <item.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </span>
                  <ChevronRight className="w-4 h-4 opacity-30" />
                </Link>
              );
            })}
          </nav>

          {/* Mobile sign out */}
          <div className="px-4 py-3 border-t border-gray-50">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100 transition-colors"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
