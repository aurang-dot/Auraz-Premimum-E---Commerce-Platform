import { useState } from 'react';
import { Plus, Edit, Trash2, Sparkles, Eye, EyeOff, Check } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Switch } from '../../components/ui/switch';
import { useApp, PromoCard } from '../../lib/AppContext';

const gradientOptions = [
  { value: 'from-purple-500 to-purple-700', label: 'Purple', preview: 'bg-gradient-to-r from-purple-500 to-purple-700' },
  { value: 'from-blue-500 to-blue-700', label: 'Blue', preview: 'bg-gradient-to-r from-blue-500 to-blue-700' },
  { value: 'from-green-500 to-green-700', label: 'Green', preview: 'bg-gradient-to-r from-green-500 to-green-700' },
  { value: 'from-red-500 to-red-700', label: 'Red', preview: 'bg-gradient-to-r from-red-500 to-red-700' },
  { value: 'from-pink-500 to-pink-700', label: 'Pink', preview: 'bg-gradient-to-r from-pink-500 to-pink-700' },
  { value: 'from-indigo-500 to-indigo-700', label: 'Indigo', preview: 'bg-gradient-to-r from-indigo-500 to-indigo-700' },
  { value: 'from-orange-500 to-orange-700', label: 'Orange', preview: 'bg-gradient-to-r from-orange-500 to-orange-700' },
];

export function AdminPromoCards() {
  const { promoCards, addPromoCard, updatePromoCard, deletePromoCard } = useApp();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<PromoCard | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    buttonText: '',
    link: '',
    gradient: 'from-purple-500 to-purple-700',
    isActive: true,
    order: 1,
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      buttonText: '',
      link: '',
      gradient: 'from-purple-500 to-purple-700',
      isActive: true,
      order: promoCards.length + 1,
    });
    setEditingCard(null);
  };

  const handleOpenDialog = (card?: PromoCard) => {
    if (card) {
      setEditingCard(card);
      setFormData({
        title: card.title,
        description: card.description,
        buttonText: card.buttonText,
        link: card.link,
        gradient: card.gradient,
        isActive: card.isActive,
        order: card.order,
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingCard) {
      updatePromoCard(editingCard.id, formData);
    } else {
      addPromoCard({ ...formData, image: '' });
    }
    
    handleCloseDialog();
  };

  const handleDelete = (cardId: string) => {
    if (confirm('Are you sure you want to delete this promo card?')) {
      deletePromoCard(cardId);
    }
  };

  const sortedCards = [...promoCards].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2">Homepage Promo Cards</h1>
          <p className="text-gray-600">Manage promotional banners on homepage</p>
        </div>
        <Button
          onClick={() => handleOpenDialog()}
          className="bg-[#591220] hover:bg-[#6d1728]"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Promo Card
        </Button>
      </div>

      {/* Promo Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sortedCards.map((card) => (
          <div key={card.id} className="bg-white rounded-lg border overflow-hidden">
            {/* Preview */}
            <div className={`bg-gradient-to-r ${card.gradient} p-8 text-white relative`}>
              {!card.isActive && (
                <div className="absolute top-2 right-2">
                  <Badge className="bg-gray-800 text-white">Inactive</Badge>
                </div>
              )}
              <div className="flex items-start gap-2 mb-2">
                <Sparkles className="h-5 w-5 mt-1" />
                <h3 className="text-white">{card.title}</h3>
              </div>
              <p className="text-white/90 mb-4">{card.description}</p>
              <div className="inline-block bg-white text-gray-800 px-4 py-2 rounded">
                {card.buttonText}
              </div>
            </div>

            {/* Details */}
            <div className="p-4 space-y-3">
              <div>
                <p className="text-xs text-gray-600">Link</p>
                <p className="text-sm">{card.link}</p>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">Display Order</p>
                  <p className="text-sm">#{card.order}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleOpenDialog(card)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(card.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {sortedCards.length === 0 && (
          <div className="col-span-2 text-center py-16 border rounded-lg">
            <Sparkles className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500 mb-4">No promo cards created</p>
            <Button onClick={() => handleOpenDialog()} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Create First Promo Card
            </Button>
          </div>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingCard ? 'Edit Promo Card' : 'Create New Promo Card'}
            </DialogTitle>
            <DialogDescription>
              These cards will appear on the homepage to promote special sales
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Festive Season Sale"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="e.g., Celebrate with amazing discounts"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="buttonText">Button Text *</Label>
                <Input
                  id="buttonText"
                  value={formData.buttonText}
                  onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                  placeholder="e.g., Shop Now"
                  required
                />
              </div>
              <div>
                <Label htmlFor="link">Link *</Label>
                <Input
                  id="link"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  placeholder="e.g., /festive-sale"
                  required
                />
              </div>
            </div>

            <div>
              <Label>Color Gradient *</Label>
              <div className="grid grid-cols-4 gap-2 mt-2">
                {gradientOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, gradient: option.value })}
                    className={`h-12 rounded-lg ${option.preview} relative ${
                      formData.gradient === option.value ? 'ring-2 ring-[#591220] ring-offset-2' : ''
                    }`}
                  >
                    {formData.gradient === option.value && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-white rounded-full p-1">
                          <Check className="h-4 w-4 text-[#591220]" />
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="order">Display Order *</Label>
                <Input
                  id="order"
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  min="1"
                  required
                />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit" className="bg-[#591220] hover:bg-[#6d1728]">
                {editingCard ? 'Update Card' : 'Create Card'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
