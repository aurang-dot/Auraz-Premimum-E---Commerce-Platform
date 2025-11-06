import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { categories } from '../lib/mockData';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useApp } from '../lib/AppContext';

export function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { products } = useApp();
  const [searchResults, setSearchResults] = useState({
    products: [] as typeof products,
    categories: [] as typeof categories,
    sellers: [] as Array<{ id: string; name: string; count: number }>,
  });

  useEffect(() => {
    if (!query) {
      setSearchResults({ products: [], categories: [], sellers: [] });
      return;
    }

    const searchTerm = query.toLowerCase();

    // Search products
    const matchedProducts = (products || []).filter(
      (product) =>
        product &&
        (product.name?.toLowerCase().includes(searchTerm) ||
        product.brand?.toLowerCase().includes(searchTerm) ||
        product.category?.toLowerCase().includes(searchTerm) ||
        product.description?.toLowerCase().includes(searchTerm))
    );

    // Search categories
    const matchedCategories = categories.filter((category) =>
      category && (category.name || '').toLowerCase().includes(searchTerm)
    );

    // Search sellers
    const sellerMap = new Map<string, { id: string; name: string; count: number }>();
    (products || []).forEach((product) => {
      if (
        product &&
        (product.seller?.name?.toLowerCase().includes(searchTerm) ||
        product.name?.toLowerCase().includes(searchTerm) ||
        product.category?.toLowerCase().includes(searchTerm))
      ) {
        if (product.seller?.id) {
          const existing = sellerMap.get(product.seller.id);
          if (existing) {
            existing.count++;
          } else {
            sellerMap.set(product.seller.id, {
              id: product.seller.id,
              name: product.seller.name,
              count: 1,
            });
          }
        }
      }
    });

    setSearchResults({
      products: matchedProducts,
      categories: matchedCategories,
      sellers: Array.from(sellerMap.values()),
    });
  }, [query, products]);

  const totalResults =
    searchResults.products.length +
    searchResults.categories.length +
    searchResults.sellers.length;

  if (!query) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Search className="h-16 w-16 mx-auto mb-4 text-gray-400" />
        <h1 className="mb-4">Search AURAZ</h1>
        <p className="text-gray-600">Enter a search term to find products, categories, and sellers</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2">
          Search Results for "{query}"
        </h1>
        <p className="text-gray-600">
          {totalResults} result{totalResults !== 1 ? 's' : ''} found
        </p>
      </div>

      {totalResults === 0 ? (
        <div className="text-center py-16">
          <Search className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <p className="text-xl text-gray-500 mb-4">No results found for "{query}"</p>
          <p className="text-gray-400 mb-6">Try different keywords or browse our categories</p>
          <Button asChild>
            <Link to="/">Browse All Products</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Categories */}
          {searchResults.categories.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <h2>Categories</h2>
                <Badge variant="secondary">{searchResults.categories.length}</Badge>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {searchResults.categories.map((category) => (
                  <Link
                    key={category.id}
                    to={`/category/${category.id}`}
                    className="border rounded-lg p-4 hover:border-[#591220] hover:shadow-md transition-all text-center"
                  >
                    <p className="font-medium">{category.name}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {products.filter((p) => p.category === category.name).length} products
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Sellers */}
          {searchResults.sellers.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <h2>Sellers</h2>
                <Badge variant="secondary">{searchResults.sellers.length}</Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchResults.sellers.map((seller) => (
                  <div
                    key={seller.id}
                    className="border rounded-lg p-4 hover:border-[#591220] hover:shadow-md transition-all"
                  >
                    <p className="font-medium mb-2">{seller.name}</p>
                    <p className="text-sm text-gray-500">{seller.count} products</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Products */}
          {searchResults.products.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <h2>Products</h2>
                <Badge variant="secondary">{searchResults.products.length}</Badge>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {searchResults.products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
