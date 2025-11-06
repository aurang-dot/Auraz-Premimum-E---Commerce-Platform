import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { Category } from '../lib/mockData';

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const IconComponent = Icons[category.icon as keyof typeof Icons] as React.ElementType;

  return (
    <Link
      to={`/category/${category.id}`}
      className="flex flex-col items-center gap-3 p-4 bg-white border rounded-lg hover:shadow-md hover:-translate-y-1 transition-all min-w-[120px]"
    >
      <div className="bg-gray-50 p-4 rounded-full">
        {IconComponent && <IconComponent className="h-8 w-8 text-[#591220]" />}
      </div>
      <span className="text-center">{category.name}</span>
    </Link>
  );
}
