'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { CheckCircle, X, Clock, Filter, Search, Phone, Sparkles, Shield } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMerchantAuth } from '@/lib/auth-context';

type PurchaseRequestStatus = 'approved' | 'rejected' | 'pending' | 'expired';

interface PurchaseRequest {
  id: string;
  customerName: string;
  amount: number;
  product: string;
  submittedAt: string;
  status: PurchaseRequestStatus;
  customerPhone: string;
}

const normalizeStatus = (value: string): PurchaseRequestStatus => {
  const status = value.toLowerCase();
  if (status === 'approved' || status === 'rejected' || status === 'expired') {
    return status;
  }
  return 'pending';
};

const formatAmount = (value: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

export function PurchaseRequests() {
  const { merchant } = useMerchantAuth();
  const [requests, setRequests] = useState<PurchaseRequest[]>([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingStates, setLoadingStates] = useState<Record<string, 'approving' | 'rejecting' | null>>({});

  useEffect(() => {
    if (!merchant?.id) {
      return;
    }
    let cancelled = false;
    const fetchRequests = async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('merchantToken') : null;
        const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await fetch(`/api/merchant/dashboard?merchantId=${merchant.id}`, { headers });
        if (!response.ok) {
          throw new Error('Failed to fetch purchase requests');
        }
        const data = await response.json();
        if (cancelled) {
          return;
        }
        const normalized = (data.requests || []).map((request: any): PurchaseRequest => {
          const rawAmount = request.amount ?? request.finalAmount ?? request.purchaseAmount ?? 0;
          const numericAmount = typeof rawAmount === 'number'
            ? rawAmount
            : Number(String(rawAmount).replace(/[^0-9.-]/g, '')) || 0;
          const timestamp = request.submittedAt || request.createdAt || request.date;
          return {
            id: request.id || request.offlinePurchaseId || String(request._id || ''),
            customerName: request.customerName || request.userName || 'Unknown',
            amount: numericAmount,
            product: request.product || request.productPurchased || 'N/A',
            submittedAt: timestamp ? new Date(timestamp).toISOString() : new Date().toISOString(),
            status: normalizeStatus(request.status || 'pending'),
            customerPhone: request.customerPhone || request.userMobileNo || 'N/A',
          };
        });
        setRequests(normalized);
      } catch (error) {
        console.error(error);
        setRequests([]);
      }
    };
    fetchRequests();
    return () => {
      cancelled = true;
    };
  }, [merchant?.id]);

  const handleApprove = async (id: string) => {
    try {
      setLoadingStates(prev => ({ ...prev, [id]: 'approving' }));
      const token = typeof window !== 'undefined' ? localStorage.getItem('merchantToken') : null;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      };

      const response = await fetch('/api/merchant/dashboard', {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ requestId: id, status: 'approved' })
      });

      if (!response.ok) {
        throw new Error('Failed to approve request');
      }

      setRequests(prev => prev.map(req =>
        req.id === id ? { ...req, status: 'approved' } : req
      ));
    } catch (error) {
      console.error('Error approving request:', error);
      alert('Failed to approve request. Please try again.');
    } finally {
      setLoadingStates(prev => ({ ...prev, [id]: null }));
    }
  };

  const handleReject = async (id: string) => {
    try {
      setLoadingStates(prev => ({ ...prev, [id]: 'rejecting' }));
      const token = typeof window !== 'undefined' ? localStorage.getItem('merchantToken') : null;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      };

      const response = await fetch('/api/merchant/dashboard', {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ requestId: id, status: 'rejected' })
      });

      if (!response.ok) {
        throw new Error('Failed to reject request');
      }

      setRequests(prev => prev.map(req =>
        req.id === id ? { ...req, status: 'rejected' } : req
      ));
    } catch (error) {
      console.error('Error rejecting request:', error);
      alert('Failed to reject request. Please try again.');
    } finally {
      setLoadingStates(prev => ({ ...prev, [id]: null }));
    }
  };

  const filteredRequests = requests.filter(request => {
    const matchesFilter = filter === 'all' || request.status === filter;
    const matchesSearch = request.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.product.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: PurchaseRequestStatus) => {
    switch (status) {
      case 'approved': return 'bg-green-600';
      case 'rejected': return 'bg-red-500';
      case 'pending': return 'bg-orange-500';
      case 'expired': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const pendingCount = requests.filter(r => r.status === 'pending').length;

  return (
    <div id="tour-requests-main" className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Purchase Requests</h2>
          <p className="text-gray-600">Review and approve customer purchase requests</p>
        </div>
        {pendingCount > 0 && (
          <Badge variant="secondary" className="self-start sm:self-auto bg-orange-100 text-orange-700">
            {pendingCount} Pending {pendingCount === 1 ? 'Approval' : 'Approvals'}
          </Badge>
        )}
      </div>

      {/* Filters */}
      <div id="tour-requests-filters" className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by customer or product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Requests</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="rounded-full bg-gray-100 p-6">
                  <Clock className="h-12 w-12 text-gray-400" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-gray-900">No Purchase Requests</h3>
                  <p className="text-gray-600 max-w-md">
                    {searchTerm || filter !== 'all'
                      ? 'No requests match your current filters. Try adjusting your search or filter settings.'
                      : 'There are no purchase requests available at this time. New requests will appear here when customers submit them.'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredRequests.map((request) => (
            <Card key={request.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 space-y-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex w-full sm:w-auto items-start sm:items-center gap-4">
                    <Avatar className="w-12 h-12 flex-shrink-0">
                      <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                        {request.customerName
                          ? request.customerName
                            .split(' ')
                            .map(n => n[0])
                            .join('')
                          : 'NA'}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 truncate">{request.customerName}</div>
                      <div className="flex items-center gap-1.5 text-sm text-gray-600 break-words">
                        <Phone className="h-3.5 w-3.5 flex-shrink-0" />
                        {request.customerPhone}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        Submitted on {new Date(request.submittedAt).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex w-full sm:w-auto flex-col gap-2 sm:items-end">
                    <div className="text-xl font-bold text-gray-900">{formatAmount(request.amount)}</div>
                    <div className="text-sm text-gray-600 sm:text-right">{request.product}</div>
                    <Badge
                      variant="secondary"
                      className={`${getStatusColor(request.status)} text-white capitalize self-start sm:self-auto`}
                    >
                      {request.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                      {request.status === 'approved' && <CheckCircle className="h-3 w-3 mr-1" />}
                      {request.status === 'rejected' && <X className="h-3 w-3 mr-1" />}
                      {request.status}
                    </Badge>
                  </div>
                </div>

                {request.status === 'pending' && (
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-2 pt-4 border-t border-gray-200 sm:justify-between">
                    <Button
                      size="default"
                      disabled={!!loadingStates[request.id]}
                      className="w-full sm:flex-1 relative overflow-hidden bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 hover:from-green-600 hover:via-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border-0 group"
                      onClick={() => handleApprove(request.id)}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                      <div className="relative flex items-center justify-center gap-2">
                        {loadingStates[request.id] === 'approving' ? (
                          <>
                            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Approving...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                            <span className="font-semibold">Approve Request</span>
                            <Sparkles className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </>
                        )}
                      </div>
                    </Button>
                    <Button
                      size="default"
                      disabled={!!loadingStates[request.id]}
                      className="w-full sm:flex-1 relative overflow-hidden bg-gradient-to-r from-red-500 via-red-600 to-rose-600 hover:from-red-600 hover:via-red-700 hover:to-rose-700 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border-0 group"
                      onClick={() => handleReject(request.id)}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                      <div className="relative flex items-center justify-center gap-2">
                        {loadingStates[request.id] === 'rejecting' ? (
                          <>
                            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Rejecting...</span>
                          </>
                        ) : (
                          <>
                            <X className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
                            <span className="font-semibold">Reject Request</span>
                            <Shield className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </>
                        )}
                      </div>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
