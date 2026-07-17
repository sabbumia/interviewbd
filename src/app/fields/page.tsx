// src/app/fields/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Layers, Compass } from 'lucide-react';
import Loading from '@/components/Loading';
import PageHero from '@/components/PageHero';
import EmptyState from '@/components/EmptyState';
import FieldCard from './_components/FieldCard';

interface Field {
  id: string;
  name: string;
  description: string;
  categories?: Array<{ id: string }>;
}

export default function FieldsPage() {
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchFields();
  }, []);

  const fetchFields = async () => {
    try {
      const res = await fetch('/api/fields');
      const data = await res.json();
      setFields(data);
    } catch (error) {
      console.error('Error fetching fields:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredFields = fields.filter(
    (field) =>
      field.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      field.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <Loading message="Loading fields…" />;
  }

  return (
    <div className="min-h-screen bg-paper">
      <PageHero
        eyebrow={
          <span className="section-eyebrow">
            <Compass className="w-3.5 h-3.5 text-brand-600" />
            Explore
          </span>
        }
        title={
          <>
            Explore Interview <span className="text-gradient">Fields</span>
          </>
        }
        description="Choose your domain and master interview questions from industry experts."
        stats={[{ icon: Layers, value: fields.length, label: 'Total Fields' }]}
        search={{
          value: searchQuery,
          onChange: setSearchQuery,
          placeholder: 'Search fields by name or description…',
        }}
      />

      <div className="section-container py-12">
        {filteredFields.length === 0 ? (
          <EmptyState
            title="No fields found"
            description={
              searchQuery ? 'Try adjusting your search terms.' : 'No fields available yet.'
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-fade-in">
            {filteredFields.map((field, i) => (
              <FieldCard key={field.id} field={field} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
