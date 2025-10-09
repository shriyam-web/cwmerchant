'use client';
import Image from 'next/image';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit2, Trash2, Calendar, Percent } from 'lucide-react';

export function OffersManagement() {
  const [offers, setOffers] = useState([
    {
      id: '1',
      title: '20% Off on Electronics',
      description: 'Get 20% discount on all electronic items',
      discount: '20%',
      validUntil: '2025-02-28',
      status: 'active',
      used: 45
    },
    {
      id: '2',
      title: 'Buy 2 Get 1 Free',
      description: 'Special offer on accessories',
      discount: 'BOGO',
      validUntil: '2025-03-15',
      status: 'active',
      used: 23
    },
    {
      id: '3',
      title: 'Festival Special',
      description: 'Flat 15% off on all items',
      discount: '15%',
      validUntil: '2025-01-20',
      status: 'expired',
      used: 78
    }
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newOffer, setNewOffer] = useState({
    title: '',
    description: '',
    discount: '',
    validUntil: ''
  });

  const handleAddOffer = () => {
    const offer = {
      id: Date.now().toString(),
      ...newOffer,
      status: 'active',
      used: 0
    };
    setOffers([...offers, offer]);
    setNewOffer({ title: '', description: '', discount: '', validUntil: '' });
    setIsAddDialogOpen(false);
  };

  const handleDeleteOffer = (id: string) => {
    setOffers(offers.filter(offer => offer.id !== id));
  };

  return (
    <div id="tour-offers-main">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Offers Management</h2>
          <p className="text-gray-600">Create and manage your promotional offers</p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button id="tour-offers-add" className="bg-gradient-to-r from-blue-600 to-indigo-600">
              <Plus className="h-4 w-4 mr-2" />
              Add New Offer
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Offer</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="offerTitle">Offer Title *</Label>
                <Input
                  id="offerTitle"
                  value={newOffer.title}
                  onChange={(e) => setNewOffer({ ...newOffer, title: e.target.value })}
                  placeholder="e.g., 20% Off on Electronics"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="offerDescription">Description *</Label>
                <Textarea
                  id="offerDescription"
                  value={newOffer.description}
                  onChange={(e) => setNewOffer({ ...newOffer, description: e.target.value })}
                  placeholder="Describe your offer"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="discount">Discount *</Label>
                <Input
                  id="discount"
                  value={newOffer.discount}
                  onChange={(e) => setNewOffer({ ...newOffer, discount: e.target.value })}
                  placeholder="e.g., 20% or ₹500"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="validUntil">Valid Until *</Label>
                <Input
                  id="validUntil"
                  type="date"
                  value={newOffer.validUntil}
                  onChange={(e) => setNewOffer({ ...newOffer, validUntil: e.target.value })}
                  className="mt-1"
                />
              </div>
              <Button onClick={handleAddOffer} className="w-full">
                Create Offer
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offers.map((offer) => (
          <Card key={offer.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{offer.title}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge
                      variant={offer.status === 'active' ? 'default' : 'secondary'}
                      className={offer.status === 'active' ? 'bg-green-600' : 'bg-gray-500'}
                    >
                      {offer.status}
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Percent className="h-3 w-3" />
                      {offer.discount}
                    </Badge>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="sm">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteOffer(offer.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{offer.description}</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Used by customers:</span>
                  <span className="font-medium">{offer.used} times</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Valid until:
                  </span>
                  <span className="font-medium">
                    {new Date(offer.validUntil).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}