// src/app/fields/[fieldId]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, FolderOpen, Tag } from 'lucide-react';
import Loading from '@/components/Loading';
import PageHero from '@/components/PageHero';
import EmptyState from '@/components/EmptyState';
import CategoryCard from './_components/CategoryCard';

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
  const [field, setField] = useState<Field | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const params = useParams();
  const fieldId = params.fieldId as string;

  useEffect(() => {
    fetchField();
  }, [fieldId]);

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

  const filteredCategories =
    field?.categories.filter(
      (category) =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  if (loading) {
    return <Loading message="Loading categories…" />;
  }

  if (!field) {
    return null;
  }

  return (
    <div className="min-h-screen bg-paper">
      <PageHero
        breadcrumb={
          <Link
            href="/fields"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-500 hover:text-brand-600 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-300" />
            All Fields
          </Link>
        }
        eyebrow={
          <span className="section-eyebrow">
            <Tag className="w-3.5 h-3.5 text-brand-600" />
            Field
          </span>
        }
        title={field.name}
        description={field.description}
        stats={[{ icon: FolderOpen, value: field.categories.length, label: 'Categories' }]}
        search={{
          value: searchQuery,
          onChange: setSearchQuery,
          placeholder: 'Search categories by name or description…',
        }}
      />

      <div className="section-container py-12">
        {filteredCategories.length === 0 ? (
          <EmptyState
            title="No categories found"
            description={
              searchQuery ? 'Try adjusting your search terms.' : 'No categories available yet.'
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-fade-in">
            {filteredCategories.map((category, i) => (
              <CategoryCard key={category.id} category={category} fieldId={fieldId} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
