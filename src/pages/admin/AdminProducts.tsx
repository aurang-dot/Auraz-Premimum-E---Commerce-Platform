import { useState } from 'react';
import { Plus, Edit, Trash2, Search, Package } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { useApp } from '../../lib/AppContext';
import { categories } from '../../lib/mockData';
import { ImageUploadWithCrop } from '../../components/ImageUploadWithCrop';

export function AdminProducts() {
  const { products: adminProducts, addProduct, updateProduct, deleteProduct } = useApp();
  
  // Always use products from context (which now defaults to mockProducts)
  const displayProducts = adminProducts;
  
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    originalPrice: '',
    image: '',
    category: '',
    brand: '',
    description: '',
    stock: '',
    isDeal: false,
    isTrending: false,
    isNewArrival: false,
  });

  const filteredProducts = displayProducts.filter((product) => {
    if (!product || !product.name) return false;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleSubmit = () => {
    const productData = {
      name: formData.name,
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
      image: formData.image,
      images: [formData.image],
      category: formData.category,
      brand: formData.brand,
      description: formData.description,
      stock: parseInt(formData.stock),
      rating: 4.5,
      reviewCount: 0,
      seller: { id: 'admin', name: 'AURAZ' },
      isDeal: formData.isDeal,
      isTrending: formData.isTrending,
      isNewArrival: formData.isNewArrival,
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
      setEditingProduct(null);
    } else {
      addProduct(productData);
    }

    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || '',
      image: product.image,
      category: product.category,
      brand: product.brand,
      description: product.description,
      stock: product.stock.toString(),
      isDeal: product.isDeal || false,
      isTrending: product.isTrending || false,
      isNewArrival: product.isNewArrival || false,
    });
    setIsAddDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      originalPrice: '',
      image: '',
      category: '',
      brand: '',
      description: '',
      stock: '',
      isDeal: false,
      isTrending: false,
      isNewArrival: false,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2">Product Management</h1>
          <p className="text-gray-600">Manage all products in your store</p>
        </div>
        <Dialog
          open={isAddDialogOpen}
          onOpenChange={(open) => {
            setIsAddDialogOpen(open);
            if (!open) {
              setEditingProduct(null);
              resetForm();
            }
          }}
        >
          <DialogTrigger asChild>
            <Button className="bg-[#591220] hover:bg-[#6d1728]">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
              <DialogDescription>
                {editingProduct ? 'Update product information' : 'Add a new product to your store'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter product name"
                  />
                </div>
                <div>
                  <Label htmlFor="brand">Brand</Label>
                  <Input
                    id="brand"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="Enter brand name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price (৳)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="originalPrice">Original Price (৳)</Label>
                  <Input
                    id="originalPrice"
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category || undefined} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.name}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="stock">Stock</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <Label>Product Image</Label>
                <ImageUploadWithCrop
                  value={formData.image}
                  onChange={(imageUrl) => setFormData({ ...formData, image: imageUrl })}
                  aspectRatio={1}
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter product description"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Product Tags</Label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.isDeal}
                      onChange={(e) => setFormData({ ...formData, isDeal: e.target.checked })}
                      className="rounded"
                    />
                    <span className="text-sm">Today's Deal</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.isTrending}
                      onChange={(e) => setFormData({ ...formData, isTrending: e.target.checked })}
                      className="rounded"
                    />
                    <span className="text-sm">Trending</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.isNewArrival}
                      onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                      className="rounded"
                    />
                    <span className="text-sm">New Arrival</span>
                  </label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} className="bg-[#591220] hover:bg-[#6d1728]">
                {editingProduct ? 'Update Product' : 'Add Product'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.name}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500">No products found</p>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <div key={product.id} className="bg-white border rounded-lg overflow-hidden">
              <div className="aspect-square bg-gray-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="line-clamp-2 mb-2">{product.name || 'Unnamed Product'}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[#591220]">৳{(product.price || 0).toLocaleString()}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      ৳{(product.originalPrice || 0).toLocaleString()}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline">{product.category}</Badge>
                  {product.stock === 0 ? (
                    <Badge variant="destructive">Out of Stock</Badge>
                  ) : product.stock < 10 ? (
                    <Badge variant="secondary">Low Stock</Badge>
                  ) : (
                    <Badge className="bg-green-100 text-green-800">In Stock ({product.stock})</Badge>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleEdit(product)}
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteProduct(product.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
