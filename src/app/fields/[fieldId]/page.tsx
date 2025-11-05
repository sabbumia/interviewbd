// src/app/fields/[fieldId]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Loading from '@/components/Loading';
import FieldHeader from './_components/FieldHeader';
import CategoryCard from './_components/CategoryCard';
import CategoryEmptyState from './_components/CategoryEmptyState';

interface Category {
  id: string;
  name: string;
  description: string;
  fieldId: string;
  _count?: {
    questions: number;
  };
}

interface Field {
  id: string;
  name: string;
  description: string;
  categories: Category[];
}

export default function FieldCategoriesPage() {
  const [user, setUser] = useState<any>(null);
  const [field, setField] = useState<Field | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const params = useParams();
  const fieldId = params.fieldId as string;

  useEffect(() => {
    fetchUser();
    fetchField();
  }, [fieldId]);

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const fetchField = async () => {
    try {
      const res = await fetch(`/api/fields/${fieldId}`);
      if (res.ok) {
        const data = await res.json();
        setField(data);
      } else {
        router.push('/fields');
      }
    } catch (error) {
      console.error('Error fetching field:', error);
      router.push('/fields');
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = field?.categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  if (loading) {
    return <Loading message='Category Page Loading...' />;
  }

  if (!field) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-zinc-50">
      <FieldHeader 
        field={field} 
        categoriesCount={field.categories.length}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        {filteredCategories.length === 0 ? (
          <CategoryEmptyState searchQuery={searchQuery} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((category) => (
              <CategoryCard key={category.id} category={category} fieldId={fieldId} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}