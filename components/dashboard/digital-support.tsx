'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, FileText, Calendar, CheckCircle, Clock, Image as ImageIcon } from 'lucide-react';

interface Request {
  id: string;
  type: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  submittedAt: string;
  completedAt: string | null;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
}

export function DigitalSupport() {
  const [requests, setRequests] = useState<Request[]>([
    {
      id: '1',
      type: 'banner',
      title: 'Festival Sale Banner',
      description: 'Need a banner for Diwali sale promotion',
      status: 'completed',
      submittedAt: '2025-01-10',
      completedAt: '2025-01-12',
      priority: 'normal'
    },
    {
      id: '2',
      type: 'social_media',
      title: 'Instagram Post Design',
      description: 'Social media post for new product launch',
      status: 'in_progress',
      submittedAt: '2025-01-14',
      completedAt: null,
      priority: 'normal'
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newRequest, setNewRequest] = useState<Omit<Request, 'id' | 'status' | 'submittedAt' | 'completedAt'>>({
    type: '',
    title: '',
    description: '',
    priority: 'normal'
  });

  const handleSubmitRequest = () => {
    if (!newRequest.type || !newRequest.title || !newRequest.description) return;

    const request: Request = {
      id: Date.now().toString(),
      ...newRequest,
      status: 'pending',
      submittedAt: new Date().toISOString().split('T')[0],
      completedAt: null
    };

    setRequests((prev) => [...prev, request]);
    setNewRequest({ type: '', title: '', description: '', priority: 'normal' });
    setIsDialogOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-600';
      case 'in_progress':
        return 'bg-blue-600';
      case 'pending':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-white" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-white" />;
      case 'pending':
        return <FileText className="h-4 w-4 text-white" />;
      default:
        return <FileText className="h-4 w-4 text-white" />;
    }
  };

  const templates = [
    { type: 'banner', title: 'Banner Design', description: 'Professional banners for promotions' },
    { type: 'social_media', title: 'Social Media Graphics', description: 'Instagram & Facebook posts' },
    { type: 'poster', title: 'Promotional Posters', description: 'Eye-catching marketing posters' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Digital Support</h2>
          <p className="text-gray-600">Request professional marketing materials and graphics</p>
        </div>

        {/* New Request Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600">
              <Plus className="h-4 w-4 mr-2" />
              New Request
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request Digital Support</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              {/* Request Type */}
              <div>
                <Label htmlFor="requestType">Request Type *</Label>
                <Select
                  value={newRequest.type}
                  onValueChange={(value) => setNewRequest({ ...newRequest, type: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select request type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="banner">Banner Design</SelectItem>
                    <SelectItem value="social_media">Social Media Graphics</SelectItem>
                    <SelectItem value="poster">Promotional Poster</SelectItem>
                    <SelectItem value="logo">Logo Design</SelectItem>
                    <SelectItem value="flyer">Flyer Design</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Title */}
              <div>
                <Label htmlFor="requestTitle">Title *</Label>
                <Input
                  id="requestTitle"
                  value={newRequest.title}
                  onChange={(e) => setNewRequest({ ...newRequest, title: e.target.value })}
                  placeholder="Brief title for your request"
                  className="mt-1"
                />
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="requestDescription">Description *</Label>
                <Textarea
                  id="requestDescription"
                  value={newRequest.description}
                  onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
                  placeholder="Describe what you need in detail..."
                  className="mt-1"
                  rows={4}
                />
              </div>

              {/* Priority */}
              {/* Priority */}
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={newRequest.priority}
                  onValueChange={(value) =>
                    setNewRequest({ ...newRequest, priority: value as 'low' | 'normal' | 'high' | 'urgent' })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>


              <Button onClick={handleSubmitRequest} className="w-full">
                Submit Request
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Templates */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {templates.map((template) => (
          <Card
            key={template.type}
            className="cursor-pointer hover:shadow-md transition-shadow border-dashed border-2 border-gray-200 hover:border-blue-300"
          >
            <CardContent className="p-6 text-center">
              <ImageIcon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">{template.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{template.description}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setNewRequest({ ...newRequest, type: template.type, title: template.title, description: '' });
                  setIsDialogOpen(true);
                }}
              >
                Request Now
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Request History */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900">Request History</h3>
        {requests.map((request) => (
          <Card key={request.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-lg" style={{ backgroundColor: getStatusColor(request.status) }}>
                    {getStatusIcon(request.status)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{request.title}</h4>
                    <p className="text-gray-600 text-sm">{request.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Submitted: {new Date(request.submittedAt).toLocaleDateString()}
                      </span>
                      {request.completedAt && (
                        <span className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Completed: {new Date(request.completedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <Badge className="text-white capitalize">{request.status.replace('_', ' ')}</Badge>
                  {request.status === 'completed' && (
                    <Button variant="outline" size="sm" className="mt-2">
                      Download
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
