import { useState, useRef } from 'react';
import { User, MapPin, CreditCard, Heart, Package, LogOut, Camera, HelpCircle, Mail } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Card, CardContent } from './ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Button } from './ui/button';
import { useApp } from '../lib/AppContext';
import Cropper from 'react-easy-crop';
import { Upload, Trash2 } from 'lucide-react';
import { Slider } from './ui/slider';

interface ProfileSidebarProps {
  currentUser: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    profilePhoto?: string;
  };
}

export function ProfileSidebar({ currentUser }: ProfileSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { logout, updateUserProfile } = useApp();

  const [photoPreview, setPhotoPreview] = useState<string | null>(currentUser?.profilePhoto || null);
  const [isPhotoDialogOpen, setIsPhotoDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.src = url;
    });

  const getCroppedImg = async (imageSrc: string, pixelCrop: any): Promise<string> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

    // Set canvas size to desired output size
    canvas.width = 400;
    canvas.height = 400;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      400,
      400
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          throw new Error('Canvas is empty');
        }
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
      }, 'image/jpeg');
    });
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoUpload = async () => {
    if (selectedImage && croppedAreaPixels) {
      try {
        const croppedImage = await getCroppedImg(selectedImage, croppedAreaPixels);
        updateUserProfile(currentUser.id, { profilePhoto: croppedImage });
        setPhotoPreview(croppedImage);
        setSelectedImage(null);
        setIsPhotoDialogOpen(false);
      } catch (e) {
        console.error('Error cropping image:', e);
      }
    }
  };

  const handlePhotoCancel = () => {
    setSelectedImage(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setIsPhotoDialogOpen(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePhotoRemove = () => {
    updateUserProfile(currentUser.id, { profilePhoto: undefined });
    setPhotoPreview(null);
    setSelectedImage(null);
    setIsPhotoDialogOpen(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <Card className="lg:sticky lg:top-24">
      <CardContent className="p-4 md:p-6">
        {/* Profile Photo Section */}
        <div className="flex flex-col items-center mb-4 md:mb-6">
          <div className="relative group">
            <Avatar className="h-20 w-20 md:h-24 md:w-24 border-4 border-white shadow-lg">
              {photoPreview ? (
                <AvatarImage src={photoPreview} alt={currentUser.name} />
              ) : (
                <AvatarFallback className="bg-gradient-to-br from-[#591220] to-[#8b1d30] text-white text-3xl">
                  {currentUser.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
            <Dialog open={isPhotoDialogOpen} onOpenChange={setIsPhotoDialogOpen}>
              <DialogTrigger asChild>
                <button className="absolute bottom-0 right-0 bg-[#591220] hover:bg-[#6d1728] text-white rounded-full p-2 shadow-lg transition-all group-hover:scale-110">
                  <Camera className="h-4 w-4" />
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Profile Photo</DialogTitle>
                  <DialogDescription>
                    Upload and crop your profile photo
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  {/* Photo Preview / Cropper */}
                  {selectedImage ? (
                    <div className="space-y-4">
                      <div className="relative h-64 bg-gray-100 rounded-lg overflow-hidden">
                        <Cropper
                          image={selectedImage}
                          crop={crop}
                          zoom={zoom}
                          aspect={1}
                          cropShape="round"
                          showGrid={false}
                          onCropChange={setCrop}
                          onCropComplete={onCropComplete}
                          onZoomChange={setZoom}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm">Zoom</label>
                        <Slider
                          value={[zoom]}
                          onValueChange={(value) => setZoom(value[0])}
                          min={1}
                          max={3}
                          step={0.1}
                          className="w-full"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-4">
                      <Avatar className="h-32 w-32 border-4 border-gray-200">
                        {photoPreview ? (
                          <AvatarImage src={photoPreview} />
                        ) : (
                          <AvatarFallback className="bg-gradient-to-br from-[#591220] to-[#8b1d30] text-white text-4xl">
                            {currentUser.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        )}
                      </Avatar>

                      {/* Upload Input */}
                      <div className="flex flex-col items-center gap-3">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoSelect}
                          className="hidden"
                          id="photo-upload"
                        />
                        <label
                          htmlFor="photo-upload"
                          className="cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg transition-colors"
                        >
                          <Upload className="h-4 w-4" />
                          Choose Photo
                        </label>
                        <p className="text-xs text-gray-500">JPG, PNG or GIF (max. 5MB)</p>
                      </div>
                    </div>
                  )}
                </div>
                <DialogFooter className="flex-col sm:flex-row gap-2">
                  {photoPreview && !selectedImage && (
                    <Button
                      variant="outline"
                      onClick={handlePhotoRemove}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove Photo
                    </Button>
                  )}
                  <div className="flex gap-2 flex-1">
                    <Button
                      variant="outline"
                      onClick={handlePhotoCancel}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    {selectedImage && (
                      <Button
                        onClick={handlePhotoUpload}
                        className="flex-1 bg-[#591220] hover:bg-[#6d1728]"
                      >
                        Save Photo
                      </Button>
                    )}
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <h3 className="mt-3 md:mt-4 mb-1 text-center text-base md:text-lg break-words max-w-full px-2">{currentUser.name}</h3>
          <p className="text-xs md:text-sm text-gray-600 text-center break-all max-w-full px-2">{currentUser.email}</p>
          {currentUser.phone && (
            <p className="text-xs md:text-sm text-gray-500 text-center mt-1 break-all">{currentUser.phone}</p>
          )}
        </div>

        {/* Navigation */}
        <nav className="space-y-1 mb-4 md:mb-0">
          <Link
            to="/profile"
            className={`flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-lg transition-colors text-sm md:text-base ${
              isActive('/profile')
                ? 'bg-[#591220] text-white'
                : 'hover:bg-gray-100'
            }`}
          >
            <User className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
            <span>Profile</span>
          </Link>
          <Link
            to="/orders"
            className={`flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-lg transition-colors text-sm md:text-base ${
              isActive('/orders')
                ? 'bg-[#591220] text-white'
                : 'hover:bg-gray-100'
            }`}
          >
            <Package className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
            <span>Orders</span>
          </Link>
          <Link
            to="/wishlist"
            className={`flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-lg transition-colors text-sm md:text-base ${
              isActive('/wishlist')
                ? 'bg-[#591220] text-white'
                : 'hover:bg-gray-100'
            }`}
          >
            <Heart className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
            <span>Wishlist</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-lg hover:bg-red-50 w-full text-left text-red-600 transition-colors text-sm md:text-base"
          >
            <LogOut className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
            <span>Logout</span>
          </button>
        </nav>

        {/* Help & Support Section */}
        <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-gray-200">
          <div className="bg-gradient-to-br from-[#591220]/5 to-[#591220]/10 rounded-lg p-3 md:p-4 space-y-2 md:space-y-3">
            <div className="flex items-center gap-2 text-[#591220]">
              <HelpCircle className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
              <h4 className="text-sm md:text-base">Need Help?</h4>
            </div>
            <p className="text-xs md:text-sm text-gray-600">
              Contact our support team for assistance
            </p>
            <a
              href="mailto:support@auraz.com"
              className="flex items-center gap-2 text-xs md:text-sm text-[#591220] hover:underline break-all"
            >
              <Mail className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
              <span className="break-all">support@auraz.com</span>
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
