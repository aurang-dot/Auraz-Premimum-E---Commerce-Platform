import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { ProductCard } from '../components/ProductCard';
import { Checkbox } from '../components/ui/checkbox';
import { Label } from '../components/ui/label';
import { Slider } from '../components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../components/ui/sheet';
import { categories } from '../lib/mockData';
import { useApp } from '../lib/AppContext';

export function CategoryPage() {
  const { categoryId } = useParams();
  const { products } = useApp();
  const [priceRange, setPriceRange] = useState([0, 15000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('popularity');
  const [showInStock, setShowInStock] = useState(false);

  // Get category name
  const categoryName = categories.find((c) => c.id === categoryId)?.name || 'All Products';

  // Get products for current category
  const categoryProducts = categoryId && categoryId !== 'all' 
    ? (products || []).filter((p) => p?.category === categoryName)
    : (products || []);

  // Get unique brands from category products
  const brands = Array.from(new Set(categoryProducts.filter(p => p?.brand).map((p) => p.brand))).sort();

  // Filter and sort products
  let filteredProducts = categoryProducts.filter((product) => {
    if (!product) return false;
    if (product.price < priceRange[0] || product.price > priceRange[1]) return false;
    if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) return false;
    if (product.rating < minRating) return false;
    if (showInStock && product.stock === 0) return false;
    return true;
  });

  // Sort products
  filteredProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'newest':
        return 0; // In real app, would sort by date
      case 'popularity':
      default:
        return b.reviewCount - a.reviewCount;
    }
  });

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const clearFilters = () => {
    setPriceRange([0, 15000]);
    setSelectedBrands([]);
    setMinRating(0);
    setShowInStock(false);
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Price Range */}
      <div>
        <h4 className="mb-3">Price Range</h4>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          min={0}
          max={15000}
          step={100}
          className="mb-2"
        />
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>৳{priceRange[0]}</span>
          <span>৳{priceRange[1]}</span>
        </div>
      </div>

      {/* Brands */}
      <div>
        <h4 className="mb-3">Brands</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {brands.map((brand) => (
            <div key={brand} className="flex items-center space-x-2">
              <Checkbox
                id={`brand-${brand}`}
                checked={selectedBrands.includes(brand)}
                onCheckedChange={() => toggleBrand(brand)}
              />
              <Label htmlFor={`brand-${brand}`} className="cursor-pointer">
                {brand}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <h4 className="mb-3">Minimum Rating</h4>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center space-x-2">
              <Checkbox
                id={`rating-${rating}`}
                checked={minRating === rating}
                onCheckedChange={() => setMinRating(minRating === rating ? 0 : rating)}
              />
              <Label htmlFor={`rating-${rating}`} className="cursor-pointer">
                {rating}+ Stars
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Stock */}
      <div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="in-stock"
            checked={showInStock}
            onCheckedChange={(checked) => setShowInStock(checked as boolean)}
          />
          <Label htmlFor="in-stock" className="cursor-pointer">
            In Stock Only
          </Label>
        </div>
      </div>

      <Button onClick={clearFilters} variant="outline" className="w-full">
        Clear All Filters
      </Button>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1>{categoryName}</h1>
          <p className="text-gray-600">{filteredProducts.length} products found</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popularity">Most Popular</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
            </SelectContent>
          </Select>

          {/* Mobile Filter Toggle */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="md:hidden">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <FilterContent />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 flex-shrink-0">
          <div className="sticky top-24 bg-white border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3>Filters</h3>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <FilterContent />
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-gray-500 mb-4">No products found</p>
              <p className="text-gray-400 mb-6">Try adjusting your filters or browse other categories</p>
              <div className="flex gap-3 justify-center">
                <Button onClick={clearFilters} variant="outline">
                  Clear Filters
                </Button>
                <Button asChild>
                  <a href="/">Back to Home</a>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
