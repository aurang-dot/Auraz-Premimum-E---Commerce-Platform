import { useState } from 'react';
import { Plus, Edit, Trash2, Image as ImageIcon } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { useApp, CarouselSlide } from '../../lib/AppContext';
import { ImageUploadWithCrop } from '../../components/ImageUploadWithCrop';

export function AdminCarousel() {
  const { carouselSlides, addCarouselSlide, updateCarouselSlide, deleteCarouselSlide } = useApp();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<CarouselSlide | null>(null);
  const [formData, setFormData] = useState({
    image: '',
    title: '',
    description: '',
    buttonText: '',
    buttonLink: '',
  });

  const handleSubmit = () => {
    if (editingSlide) {
      updateCarouselSlide(editingSlide.id, formData);
      setEditingSlide(null);
    } else {
      addCarouselSlide(formData);
    }
    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleEdit = (slide: CarouselSlide) => {
    setEditingSlide(slide);
    setFormData({
      image: slide.image,
      title: slide.title,
      description: slide.description,
      buttonText: slide.buttonText,
      buttonLink: slide.buttonLink,
    });
    setIsAddDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      image: '',
      title: '',
      description: '',
      buttonText: '',
      buttonLink: '',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2">Carousel Management</h1>
          <p className="text-gray-600">Manage homepage carousel slides</p>
        </div>
        <Dialog
          open={isAddDialogOpen}
          onOpenChange={(open) => {
            setIsAddDialogOpen(open);
            if (!open) {
              setEditingSlide(null);
              resetForm();
            }
          }}
        >
          <DialogTrigger asChild>
            <Button className="bg-[#591220] hover:bg-[#6d1728]">
              <Plus className="h-4 w-4 mr-2" />
              Add Slide
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingSlide ? 'Edit Slide' : 'Add New Slide'}</DialogTitle>
              <DialogDescription>
                {editingSlide ? 'Update slide information' : 'Add a new carousel slide to the homepage'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4 max-h-[65vh] overflow-y-auto pr-2">
              {/* Image Upload Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="image" className="text-base">Carousel Image *</Label>
                  <span className="text-xs text-gray-500">Required</span>
                </div>
                <p className="text-xs text-gray-500">
                  📐 Recommended size: 1200x500px (aspect ratio 12:5)
                </p>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 hover:border-[#591220] transition-colors">
                  <ImageUploadWithCrop
                    value={formData.image}
                    onChange={(imageUrl) => setFormData({ ...formData, image: imageUrl })}
                    aspectRatio={12 / 5}
                  />
                </div>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="title" className="text-base">Slide Title *</Label>
                  <span className="text-xs text-gray-500">Required</span>
                </div>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Summer Collection 2024"
                  className="h-11 text-base"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-base">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter a compelling description for this slide..."
                  rows={3}
                  className="resize-none text-base"
                />
              </div>

              {/* Button Text */}
              <div className="space-y-2">
                <Label htmlFor="buttonText" className="text-base">Button Text</Label>
                <Input
                  id="buttonText"
                  value={formData.buttonText}
                  onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                  placeholder="e.g., Shop Now, Explore Collection"
                  className="h-11 text-base"
                />
              </div>

              {/* Button Link */}
              <div className="space-y-2">
                <Label htmlFor="buttonLink" className="text-base">Button Link</Label>
                <Input
                  id="buttonLink"
                  value={formData.buttonLink}
                  onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                  placeholder="/category/electronics"
                  className="h-11 text-base font-mono"
                />
                <p className="text-xs text-gray-500">
                  💡 Tip: Use relative URLs like /category/electronics or /deals
                </p>
              </div>

              {/* Live Preview */}
              {formData.image && (
                <div className="space-y-2 pt-4 border-t">
                  <Label className="text-base">Live Preview</Label>
                  <div className="relative aspect-[12/5] rounded-lg overflow-hidden bg-gray-900 shadow-lg">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center p-8">
                      <div className="max-w-xl">
                        <h2 className="text-2xl md:text-3xl text-white mb-3">
                          {formData.title || 'Your Title Here'}
                        </h2>
                        <p className="text-base md:text-lg text-white/90 mb-6">
                          {formData.description || 'Your description will appear here...'}
                        </p>
                        <div className="bg-[#591220] hover:bg-[#6d1728] text-white px-8 py-3 rounded-lg inline-block transition-colors">
                          {formData.buttonText || 'Button Text'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <DialogFooter className="gap-2 pt-4 border-t">
              <Button 
                type="button"
                variant="outline" 
                onClick={() => {
                  setIsAddDialogOpen(false);
                  setEditingSlide(null);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button 
                type="button"
                onClick={handleSubmit} 
                disabled={!formData.image || !formData.title}
                className="bg-[#591220] hover:bg-[#6d1728]"
              >
                {editingSlide ? '✓ Update Slide' : '+ Add Slide'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Slides Grid */}
      <div className="space-y-4">
        {carouselSlides.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed rounded-lg bg-gray-50">
            <ImageIcon className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg mb-2 text-gray-700">No Carousel Slides Yet</h3>
            <p className="text-gray-500 mb-6">Create your first slide to display on the homepage</p>
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-[#591220] hover:bg-[#6d1728]"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Slide
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">
                {carouselSlides.length} {carouselSlides.length === 1 ? 'slide' : 'slides'} active
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6">
              {carouselSlides.map((slide, index) => (
                <div key={slide.id} className="bg-white border-2 rounded-lg overflow-hidden hover:border-[#591220] transition-colors shadow-sm">
                  <div className="relative aspect-[12/5] bg-gray-100">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center p-6 md:p-8">
                      <div className="max-w-2xl">
                        <div className="text-xs bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full inline-block mb-3">
                          Slide #{index + 1}
                        </div>
                        <h2 className="text-xl md:text-2xl mb-3 text-white">{slide.title}</h2>
                        <p className="text-sm md:text-base mb-4 text-white/90 line-clamp-2">{slide.description}</p>
                        <div className="bg-[#591220] text-white px-6 py-2 rounded-lg inline-block">
                          {slide.buttonText}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-gray-50">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 mb-1">Button Link:</p>
                      <p className="text-sm text-gray-900 font-mono truncate">{slide.buttonLink}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(slide)}
                        className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700"
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this slide?')) {
                            deleteCarouselSlide(slide.id);
                          }
                        }}
                        className="text-red-600 hover:bg-red-50 hover:border-red-300 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
