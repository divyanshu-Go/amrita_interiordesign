// app/dashboard/layout.jsx
'use client';

import { useAuth } from '@/app/providers/AuthProvider';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const { user } = useAuth();

  const handleLogout = () => {
    
    router.push('/');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Brand */}
            <Link href="/dashboard" className="font-bold text-xl text-gray-900">
              Dashboard
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              <Link
                href="/dashboard"
                className="text-gray-700 hover:text-gray-900 font-medium text-sm"
              >
                Overview
              </Link>
              <Link
                href="/dashboard/profile"
                className="text-gray-700 hover:text-gray-900 font-medium text-sm"
              >
                Profile
              </Link>
              <Link
                href="/dashboard/addresses"
                className="text-gray-700 hover:text-gray-900 font-medium text-sm"
              >
                Addresses
              </Link>
              <Link
                href="/dashboard/cart"
                className="text-gray-700 hover:text-gray-900 font-medium text-sm"
              >
                Cart
              </Link>
              <Link
                href="/dashboard/orders"
                className="text-gray-700 hover:text-gray-900 font-medium text-sm"
              >
                Orders
              </Link>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-sm text-gray-600">
                <p className="font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex gap-4 py-2 border-t border-gray-100 overflow-x-auto">
            <Link
              href="/dashboard"
              className="text-gray-700 hover:text-gray-900 font-medium text-sm whitespace-nowrap"
            >
              Overview
            </Link>
            <Link
              href="/dashboard/profile"
              className="text-gray-700 hover:text-gray-900 font-medium text-sm whitespace-nowrap"
            >
              Profile
            </Link>
            <Link
              href="/dashboard/addresses"
              className="text-gray-700 hover:text-gray-900 font-medium text-sm whitespace-nowrap"
            >
              Addresses
            </Link>
            <Link
              href="/dashboard/cart"
              className="text-gray-700 hover:text-gray-900 font-medium text-sm whitespace-nowrap"
            >
              Cart
            </Link>
            <Link
              href="/dashboard/orders"
              className="text-gray-700 hover:text-gray-900 font-medium text-sm whitespace-nowrap"
            >
              Orders
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}