'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMerchantAuth } from '@/lib/auth-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  Bell,
  Settings,
  ExternalLink,
  Copy,
  LogOut,
  User,
  Calendar,
  CreditCard,
  Star,
  Crown,
  ChevronDown,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface DashboardNavbarProps {
  merchantStatus: string;
  merchantSlug?: string;
  merchantId?: string;
  unreadNotificationsCount?: number;
  notificationCountLoading?: boolean;
  onNotificationClick?: () => void;
  onProfileSettingsClick?: () => void;
  merchantName?: string;
  purchasedPackage?: {
    variantName?: string;
    purchaseDate?: string;
    expiryDate?: string;
    transactionId?: string;
  };
}



export function DashboardNavbar({
  merchantStatus,
  merchantSlug,
  merchantId,
  unreadNotificationsCount = 0,
  notificationCountLoading = false,
  onNotificationClick,
  onProfileSettingsClick,
  merchantName = 'Merchant',
  purchasedPackage,
}: DashboardNavbarProps) {
  const router = useRouter();
  const { logout } = useMerchantAuth();
  const [copied, setCopied] = useState(false);
  const [merchantIdCopied, setMerchantIdCopied] = useState(false);

  const handleCopyProfileUrl = () => {
    if (merchantSlug) {
      const url = `https://www.citywitty.com/merchants/${merchantSlug}`;
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopyMerchantId = () => {
    if (merchantId) {
      navigator.clipboard.writeText(merchantId);
      setMerchantIdCopied(true);
      setTimeout(() => setMerchantIdCopied(false), 2000);
    }
  };

  const handleOpenProfile = () => {
    if (merchantSlug) {
      window.open(`https://www.citywitty.com/merchants/${merchantSlug}`, '_blank');
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="sticky top-0 z-20 bg-white border-b border-slate-200 shadow-sm">
      <div className="flex items-center justify-between px-1.5 sm:px-3 py-1.5">
        {/* Left Section - Merchant ID Display */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {merchantId && (
            <>
              <div className="flex items-center gap-1 px-1.5 py-0.5 sm:px-2 sm:py-1 bg-slate-50 rounded-md border border-slate-200 max-w-[120px] sm:max-w-[200px]">
                <span className="text-[10px] sm:text-xs font-medium text-slate-700 truncate">ID:</span>
                <span className="text-[10px] sm:text-xs font-mono text-slate-900 truncate" title={merchantId}>{merchantId}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopyMerchantId}
                className="h-6 w-6 sm:h-7 sm:w-7 rounded-md text-slate-600 hover:bg-slate-100 flex-shrink-0"
                title={merchantIdCopied ? 'Copied!' : 'Copy Merchant ID'}
              >
                <Copy className={`h-2.5 w-2.5 sm:h-3 sm:w-3 ${merchantIdCopied ? 'text-green-600' : ''}`} />
              </Button>
            </>
          )}
        </div>

        {/* Right Section - Icons and Actions */}
        <div className="flex items-center gap-1 ml-auto flex-shrink-0">
          {/* View Profile Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleOpenProfile}
            disabled={merchantStatus === 'pending'}
            className="h-8 w-8 rounded-md text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
            title="View Public Profile"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </Button>

          {/* Copy Profile URL Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopyProfileUrl}
            disabled={merchantStatus === 'pending'}
            className="h-8 w-8 rounded-md text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
            title={copied ? 'Copied!' : 'Copy Profile URL'}
          >
            <Copy className={`h-3.5 w-3.5 ${copied ? 'text-green-600' : ''}`} />
          </Button>

          {/* Plan Information Dropdown */}
          {purchasedPackage?.variantName && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="rounded-md bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border border-yellow-200 transition-colors duration-200 px-2 py-1.5 h-auto sm:hidden"
                >
                  <Crown className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="rounded-md bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border border-yellow-200 transition-colors duration-200 px-2 py-1.5 h-auto hidden sm:flex"
                >
                  <div className="flex items-center gap-1">
                    <Crown className="h-3.5 w-3.5" />
                    <span className="text-xs font-medium">Membership</span>
                    <ChevronDown className="h-3 w-3" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel className="font-semibold text-gray-900">
                  Active Plan
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <div className="px-2 py-1.5">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-4 w-4 text-yellow-600" />
                    <span className="font-medium text-sm">{purchasedPackage.variantName}</span>
                  </div>

                  {purchasedPackage.purchaseDate && (
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      <div className="text-xs">
                        <div className="text-gray-600">Purchased</div>
                        <div className="font-medium">{new Date(purchasedPackage.purchaseDate).toLocaleDateString('en-GB')}</div>
                      </div>
                    </div>
                  )}

                  {purchasedPackage.expiryDate && (
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className={`h-4 w-4 ${new Date(purchasedPackage.expiryDate) < new Date() ? 'text-red-600' : new Date(purchasedPackage.expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) ? 'text-orange-600' : 'text-green-600'}`} />
                      <div className="text-xs">
                        <div className="text-gray-600">Active till</div>
                        <div className={`font-medium ${new Date(purchasedPackage.expiryDate) < new Date() ? 'text-red-600' : ''}`}>
                          {new Date(purchasedPackage.expiryDate).toLocaleDateString('en-GB')}
                          {new Date(purchasedPackage.expiryDate) < new Date() && (
                            <span className="text-red-600 font-bold ml-1">(Expired)</span>
                          )}
                          {new Date(purchasedPackage.expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) && new Date(purchasedPackage.expiryDate) >= new Date() && (
                            <span className="text-orange-600 font-bold ml-1">(Expiring Soon)</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {purchasedPackage.transactionId && (
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-green-600" />
                      <div className="text-xs">
                        <div className="text-gray-600">Transaction ID</div>
                        <div className="font-medium font-mono text-xs">{purchasedPackage.transactionId}</div>
                      </div>
                    </div>
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Profile Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-700 hover:bg-slate-100">
                <User className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-semibold text-gray-900">
                {merchantName}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={onProfileSettingsClick} className="cursor-pointer">
                <Settings className="h-4 w-4 mr-2" />
                <span>Profile Settings</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600">
                <LogOut className="h-4 w-4 mr-2" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications Bell - Rightmost position */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onNotificationClick}
            className="relative h-8 w-8 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200"
            title="Notifications"
          >
            <Bell className="h-3.5 w-3.5" />
            {!notificationCountLoading && (
              <Badge variant={unreadNotificationsCount > 0 ? "destructive" : "secondary"} className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center text-xs p-0">
                {unreadNotificationsCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
