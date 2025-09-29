
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  LayoutDashboard,
  Gift,
  Package,
  FileText,
  Settings,
  HelpCircle,
  LogOut,
  Bell,
  ExternalLink,
  Eye
} from 'lucide-react';
import { useEffect, useState } from 'react';
// ✅ If you’re using Auth Context
import { useMerchantAuth } from '@/lib/auth-context';

interface DashboardSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export function DashboardSidebar({ activeTab, onTabChange, sidebarOpen, setSidebarOpen }: DashboardSidebarProps) {
  const router = useRouter();
  const { merchant, logout } = useMerchantAuth(); // ✅ Auth context
  const [merchantInfo, setMerchantInfo] = useState<any>(null);

  useEffect(() => {
    if (merchant) {
      setMerchantInfo(merchant);
    } else {
      const stored = localStorage.getItem("merchant");
      if (stored) setMerchantInfo(JSON.parse(stored));
    }
  }, [merchant]);

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, badge: null },
    { id: 'offers', label: 'Offers', icon: Gift, badge: '3' },
    { id: 'products', label: 'Products', icon: Package, badge: null },
    { id: 'requests', label: 'Purchase Requests', icon: FileText, badge: '5' },
    { id: 'profile', label: 'Profile Settings', icon: Settings, badge: null },
    { id: 'support', label: 'Digital Support', icon: HelpCircle, badge: null }
  ];

  const handleLogout = () => {
    logout(); // ✅ Auth context ka logout
    router.push("/login");
  };

  return (
    <div className={`fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-40 lg:z-auto transform lg:transform-none transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:block`}>
      <div className="h-full flex flex-col">
        <div className="p-6 flex-shrink-0">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 mb-3">

            <div className="w-17 h-12 rounded-xl flex items-center justify-center overflow-hidden">
              <img src="/merchant-hub.png" alt="Citywitty Logo" className="w-full h-full object-contain p-1" />
            </div>

          </Link>

          {/* ✅ Merchant Info Dynamic */}
          {merchantInfo && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-3 mb-4">
              <div className="flex items-center space-x-3">
                {/* avatar: never shrink */}
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {merchantInfo.businessName?.charAt(0) || "M"}
                  </span>
                </div>

                {/* text area: allow truncation (min-w-0 required inside flex) */}
                <div className="min-w-0">
                  <div className="font-semibold text-gray-900 truncate">
                    {merchantInfo.businessName}
                  </div>
                  <div className="text-sm text-gray-600 truncate">
                    {merchantInfo.email}
                  </div>
                </div>
              </div>
            </div>
          )}


          {/* Navigation Menu */}
          <nav className="space-y-1 flex-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === item.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="flex-1 text-left font-medium">{item.label}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="bg-red-100 text-red-700 text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Actions */}
          <div className="mt-6 pt-6 border-t border-gray-200 flex-shrink-0">
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Eye className="h-4 w-4 mr-2" />
                Preview Shop
                <ExternalLink className="h-3 w-3 ml-auto" />
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
                <Badge variant="secondary" className="ml-auto bg-red-100 text-red-700 text-xs">2</Badge>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}