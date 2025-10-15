
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
// import { Button } from '@/components/ui/button';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface DashboardSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  merchantStatus: string;
  isTourRunning: boolean;
  activeOffersCount?: number;
}

export function DashboardSidebar({ activeTab, onTabChange, sidebarOpen, setSidebarOpen, merchantStatus, isTourRunning, activeOffersCount = 0 }: DashboardSidebarProps) {
  const router = useRouter();
  const { merchant, logout } = useMerchantAuth(); // ✅ Auth context
  const [merchantInfo, setMerchantInfo] = useState<any>(null);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [emoji, setEmoji] = useState('😟');


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
    { id: 'offers', label: 'Offers', icon: Gift, badge: activeOffersCount > 0 ? activeOffersCount.toString() : null },
    { id: 'products', label: 'CityWitty Store', icon: Package, badge: null },
    { id: 'offline-products', label: 'Your Offline Store', icon: Package, badge: null },
    { id: 'requests', label: 'Purchase Requests', icon: FileText, badge: '5' },
    { id: 'profile', label: 'Profile Settings', icon: Settings, badge: null },
    { id: 'support', label: 'Digital Support', icon: HelpCircle, badge: null }
  ];

  const handleLogout = () => {
    setLogoutModalOpen(true);
  };

  const confirmLogout = () => {
    logout(); // ✅ Auth context ka logout
    router.push("/login");
  };

  return (
    <div className={`fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-200 z-40 lg:z-auto transform lg:transform-none transition-all duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:block overflow-y-auto`}>
      <div className="h-full flex flex-col">
        <div className="p-4 flex-shrink-0">
          {/* Logo */}
          <Link href="/" className="flex items-center justify-center mb-4 group">
            <div className="w-full max-w-28 h-14 py-2 bg-white rounded-lg flex items-center justify-center border border-slate-200 transition-all duration-200 overflow-hidden">
              <img src="/merchant-hub.png" alt="Citywitty Logo" className="w-full h-full object-contain" />
            </div>
          </Link>

          {/* ✅ Merchant Info Dynamic */}
          {merchantInfo && (
            <div className="p-3 mb-4">
              <div className="flex items-center space-x-3">
                {/* avatar: never shrink */}
                {merchantInfo.logo ? (
                  <img
                    src={merchantInfo.logo}
                    alt="Merchant Logo"
                    className="flex-shrink-0 w-14 h-14 rounded-full border-4 border-white object-contain hover:scale-105 transform transition-transform duration-300"
                  />
                ) : (
                  <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center border-4 border-white hover:scale-105 transform transition-transform duration-300">
                    <span className="text-white font-extrabold text-xl select-none">
                      {(merchantInfo.displayName || merchantInfo.businessName)?.charAt(0) || "M"}
                    </span>
                  </div>
                )}

                {/* text area: allow truncation (min-w-0 required inside flex) */}
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-gray-900 text-lg truncate tracking-wide">
                    {merchantInfo.displayName || merchantInfo.businessName}
                  </div>
                  <div className="text-xs text-gray-600 truncate italic tracking-wide">
                    {merchantInfo.email}
                  </div>
                </div>
              </div>
            </div>
          )}


          {/* Navigation Menu */}
          <nav className="flex-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              // Allow opening tabs for tour even if disabled
              const isDisabled = merchantStatus === "pending" && item.id !== "profile" && item.id !== "overview";
              const allowOpenForTour = merchantStatus === "pending" && isTourRunning;
              return (
                <button
                  key={item.id}
                  id={`tour-sidebar-${item.id}`}
                  onClick={() => {
                    if (!isDisabled || allowOpenForTour) {
                      onTabChange(item.id);
                    }
                  }}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 mb-2 rounded-lg transition-all duration-200 group relative ${isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md border-l-4 border-l-blue-500'
                    : 'text-slate-700 bg-white/60 border border-slate-200/40 border-l-2 border-l-slate-300 shadow-sm hover:shadow-md hover:bg-white/70 hover:text-slate-900 hover:scale-105'
                    } ${isDisabled && !allowOpenForTour ? 'opacity-50 cursor-not-allowed' : ''} ${item.id === 'profile' ? 'allow-during-tour' : ''}`}
                >

                  <Icon className={`h-5 w-5 transition-all duration-200 transform ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-blue-600 group-hover:scale-110 group-hover:bg-blue-100 group-hover:rounded-full'
                    }`} />
                  <span className="flex-1 text-left font-medium text-sm">{item.label}</span>
                  {item.badge && (
                    <Badge variant="secondary" className={`text-xs font-semibold ${isActive ? 'bg-white/20 text-white' : 'bg-red-100 text-red-700'
                      }`}>
                      {item.badge}
                    </Badge>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Actions */}
          <div className="mt-4 pt-4 border-t border-slate-200 flex-shrink-0">
            <div className="space-y-2">
              <Button
                id="tour-preview-shop"
                variant="outline"
                size="sm"
                className="w-full justify-start bg-white/40 border-slate-200 hover:bg-white hover:border-blue-300 transition-all duration-200 rounded-lg py-2 text-sm"
                onClick={() => merchantInfo.merchantSlug && window.open(`https://www.citywitty.com/merchants/${merchantInfo.merchantSlug}`, '_blank')}
                disabled={merchantStatus === "pending"}
              >
                <Eye className="h-4 w-4 mr-2 text-slate-600" />
                <span className="font-medium text-slate-700">Preview Store</span>
                <ExternalLink className="h-3 w-3 ml-auto text-slate-400" />
              </Button>
              <Button
                id="tour-notifications"
                variant="outline"
                size="sm"
                className="w-full justify-start bg-white/40 border-slate-200 hover:bg-white hover:border-blue-300 transition-all duration-200 rounded-lg py-2 text-sm"
                disabled={merchantStatus === "pending"}
              >
                <Bell className="h-4 w-4 mr-2 text-slate-600" />
                <span className="font-medium text-slate-700">Notifications</span>
                <Badge variant="secondary" className="ml-auto bg-red-100 text-red-700 text-xs font-semibold">2</Badge>
              </Button>
              <Button
                id="tour-logout"
                variant="destructive"
                size="sm"
                className="w-full justify-start transition-all duration-200 rounded-lg py-2 text-sm"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span className="font-medium">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={logoutModalOpen} onOpenChange={setLogoutModalOpen}>
        <DialogContent className="sm:max-w-[425px] animate-in fade-in-0 zoom-in-95 bg-red-100 text-red-900 rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-3">
              <span className="text-5xl select-none">{emoji}</span>
              <span>Confirm Logout</span>
            </DialogTitle>
            <DialogDescription className="text-black">
              Are you sure you want to logout? Hoping to see you again soon!
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
              onClick={() => setLogoutModalOpen(false)}
              onMouseEnter={() => setEmoji('😀')}
              onMouseLeave={() => setEmoji('😟')}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="bg-red-800 text-white hover:bg-red-900"
              onClick={confirmLogout}
              onMouseEnter={() => setEmoji('😢')}
              onMouseLeave={() => setEmoji('😟')}
            >
              Yes, Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
