'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Bell, 
  Info, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Megaphone,
  ExternalLink,
  Clock,
  Filter,
  Search
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMerchantAuth } from '@/lib/auth-context';
import { toast } from 'sonner';

type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'announcement';
type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';
type NotificationStatus = 'draft' | 'sent' | 'archived';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  status: NotificationStatus;
  link?: string;
  icon?: string;
  createdAt: string;
  expiresAt: string | null;
  isRead: boolean;
}

const TYPE_VALUES: NotificationType[] = ['info', 'success', 'warning', 'error', 'announcement'];
const PRIORITY_VALUES: NotificationPriority[] = ['low', 'medium', 'high', 'urgent'];

interface NotificationsProps {
  onUnreadCountChange?: (count: number) => void;
}

const getTypeIcon = (type: NotificationType) => {
  switch (type) {
    case 'success':
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case 'warning':
      return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    case 'error':
      return <XCircle className="h-5 w-5 text-red-500" />;
    case 'announcement':
      return <Megaphone className="h-5 w-5 text-purple-500" />;
    default:
      return <Info className="h-5 w-5 text-blue-500" />;
  }
};

const getTypeStyles = (type: NotificationType) => {
  switch (type) {
    case 'success':
      return 'bg-green-50 border-green-200 hover:bg-green-100';
    case 'warning':
      return 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100';
    case 'error':
      return 'bg-red-50 border-red-200 hover:bg-red-100';
    case 'announcement':
      return 'bg-purple-50 border-purple-200 hover:bg-purple-100';
    default:
      return 'bg-blue-50 border-blue-200 hover:bg-blue-100';
  }
};

const getPriorityBadge = (priority: NotificationPriority) => {
  const styles = {
    low: 'bg-gray-100 text-gray-700',
    medium: 'bg-blue-100 text-blue-700',
    high: 'bg-orange-100 text-orange-700',
    urgent: 'bg-red-100 text-red-700 animate-pulse',
  };

  return (
    <Badge variant="outline" className={styles[priority]}>
      {priority.toUpperCase()}
    </Badge>
  );
};

const getStatusBadge = (status: NotificationStatus) => {
  if (status === 'draft') {
    return (
      <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200">
        Draft
      </Badge>
    );
  }

  if (status === 'archived') {
    return (
      <Badge variant="outline" className="bg-gray-100 text-gray-600 border-gray-200">
        Archived
      </Badge>
    );
  }

  return null;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / 60000);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays < 7) return `${diffInDays}d ago`;
  
  return date.toLocaleDateString('en-IN', { 
    day: 'numeric', 
    month: 'short', 
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
  });
};

export function Notifications({ onUnreadCountChange }: NotificationsProps) {
  const { merchant } = useMerchantAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | NotificationType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [markingRead, setMarkingRead] = useState<Record<string, boolean>>({});
  const merchantIdentifier = merchant?.merchantId || merchant?.id;

  useEffect(() => {
    if (!merchantIdentifier) {
      setLoading(false);
      return;
    }

    fetchNotifications(merchantIdentifier);
  }, [merchantIdentifier]);

  const fetchNotifications = async (merchantIdParam = merchantIdentifier) => {
    if (!merchantIdParam) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const url = `/api/merchant/notifications?merchantId=${merchantIdParam}`;
      console.log('[Notifications] Fetching from:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log('[Notifications] Response received:', {
        success: data.success,
        count: data.notifications?.length,
        unreadCount: data.unreadCount,
        data: data
      });
      
      if (data.success && Array.isArray(data.notifications)) {
        setNotifications(
          data.notifications.map((notif: any) => ({
            ...notif,
            status: (notif.status ?? 'sent') as NotificationStatus,
            expiresAt: notif.expiresAt ?? null,
          }))
        );
        onUnreadCountChange?.(data.unreadCount || 0);
      } else {
        setNotifications([]);
        console.error('[Notifications] API error:', data.message);
        toast.error(data.message || 'Failed to load notifications');
      }
    } catch (error) {
      console.error('[Notifications] Fetch error:', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    if (!merchantIdentifier) {
      return;
    }
    try {
      setMarkingRead(prev => ({ ...prev, [notificationId]: true }));

      const response = await fetch('/api/merchant/notifications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notificationId,
          merchantId: merchantIdentifier,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setNotifications(prev => {
          const updated = prev.map(notif =>
            notif.id === notificationId ? { ...notif, isRead: true } : notif
          );
          const newUnreadCount = updated.filter(n => !n.isRead).length;
          onUnreadCountChange?.(newUnreadCount);
          return updated;
        });
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to mark as read');
    } finally {
      setMarkingRead(prev => ({ ...prev, [notificationId]: false }));
    }
  };

  const markAllAsRead = async () => {
    if (!merchantIdentifier) {
      return;
    }
    const unreadNotifications = notifications.filter(n => !n.isRead);
    
    try {
      for (const notif of unreadNotifications) {
        await fetch('/api/merchant/notifications', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            notificationId: notif.id,
            merchantId: merchantIdentifier,
          }),
        });
      }
      
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, isRead: true }))
      );
      
      onUnreadCountChange?.(0);
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast.error('Failed to mark all as read');
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    if (notif.status === 'archived') {
      return false;
    }

    const matchesSearch = notif.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notif.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'unread') return matchesSearch && !notif.isRead;
    return matchesSearch && notif.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (loading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {unreadCount} New
                </Badge>
              )}
            </CardTitle>
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                Mark All as Read
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="unread">Unread</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="announcement">Announcements</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-gray-100 p-4 mb-4">
              <Bell className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm || filter !== 'all' ? 'No Matching Notifications' : 'No Notifications'}
            </h3>
            <p className="text-sm text-gray-500 text-center max-w-sm">
              {searchTerm || filter !== 'all'
                ? 'Try adjusting your search or filter settings'
                : 'You\'re all caught up! New notifications will appear here when available.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <ScrollArea className="h-[calc(100vh-280px)]">
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <Card
                key={notification.id}
                className={`transition-all cursor-pointer ${
                  notification.isRead ? 'opacity-75' : 'border-l-4 border-l-primary'
                } ${getTypeStyles(notification.type)}`}
                onClick={() => !notification.isRead && markAsRead(notification.id)}
              >
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0 mt-1">
                      {getTypeIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className={`text-sm font-semibold ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                          {notification.title}
                        </h4>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(notification.status)}
                          {getPriorityBadge(notification.priority)}
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-3 whitespace-pre-wrap">
                        {notification.message}
                      </p>

                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          {formatDate(notification.createdAt)}
                        </div>

                        <div className="flex items-center gap-2">
                          {notification.link && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(notification.link, '_blank');
                              }}
                            >
                              View Details
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </Button>
                          )}
                          {!notification.isRead && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 text-xs"
                              disabled={markingRead[notification.id]}
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(notification.id);
                              }}
                            >
                              {markingRead[notification.id] ? 'Marking...' : 'Mark as Read'}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}