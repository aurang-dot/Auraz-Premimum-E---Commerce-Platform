import { useState, useCallback } from 'react';
import { Upload, X, Crop, Link2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Slider } from './ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import Cropper from 'react-easy-crop';

interface ImageUploadWithCropProps {
  value: string;
  onChange: (imageUrl: string) => void;
  aspectRatio?: number;
}

export function ImageUploadWithCrop({ value, onChange, aspectRatio = 1 }: ImageUploadWithCropProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isCropDialogOpen, setIsCropDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        const imageDataUrl = reader.result as string;
        setImageSrc(imageDataUrl);
        setIsCropDialogOpen(true);
      });
      reader.readAsDataURL(file);
    }
  };

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.setAttribute('crossOrigin', 'anonymous');
      image.src = url;
    });

  const getCroppedImg = async (imageSrc: string, pixelCrop: any): Promise<string> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

    // Set canvas size to the cropped area
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    // Convert canvas to blob and then to data URL
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          console.error('Canvas is empty');
          return;
        }
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
      }, 'image/jpeg', 0.95);
    });
  };

  const handleSaveCrop = async () => {
    if (imageSrc && croppedAreaPixels) {
      try {
        const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
        onChange(croppedImage);
        setIsCropDialogOpen(false);
        setImageSrc(null);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleRemoveImage = () => {
    onChange('');
  };

  return (
    <div className="space-y-4">
      {value ? (
        <div className="relative">
          <div className="border rounded-lg overflow-hidden bg-gray-50">
            <img
              src={value}
              alt="Product"
              className="w-full h-64 object-cover"
            />
          </div>
          <div className="flex gap-2 mt-2">
            <label className="flex-1">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => document.getElementById('image-upload')?.click()}
              >
                <Crop className="h-4 w-4 mr-2" />
                Change Image
              </Button>
            </label>
            <Button
              type="button"
              variant="outline"
              onClick={handleRemoveImage}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload Image</TabsTrigger>
            <TabsTrigger value="url">Image URL</TabsTrigger>
          </TabsList>
          <TabsContent value="upload" className="mt-4">
            <label className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-[#591220] transition-colors block">
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 mb-1">Click to upload product image</p>
              <p className="text-sm text-gray-400">PNG, JPG up to 10MB</p>
            </label>
          </TabsContent>
          <TabsContent value="url" className="mt-4">
            <div className="space-y-3">
              <Input
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
              <Button
                type="button"
                onClick={() => {
                  if (imageUrl.trim()) {
                    onChange(imageUrl);
                    setImageUrl('');
                  }
                }}
                className="w-full bg-[#591220] hover:bg-[#6d1728]"
              >
                <Link2 className="h-4 w-4 mr-2" />
                Use URL
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      )}

      <input
        id="image-upload"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Crop Dialog */}
      <Dialog open={isCropDialogOpen} onOpenChange={setIsCropDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Crop Image</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden">
              {imageSrc && (
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={aspectRatio}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                />
              )}
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
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCropDialogOpen(false);
                setImageSrc(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveCrop}
              className="bg-[#591220] hover:bg-[#6d1728]"
            >
              Save & Apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
