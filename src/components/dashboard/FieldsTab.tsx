// src/components/dashboard/FieldsTab.tsx
'use client';

import { useState, FormEvent } from 'react';
import {
  Trash2,
  FolderTree,
  Layers,
  Plus,
  Search,
  ChevronDown,
  FileText,
} from 'lucide-react';
import TabHeader from './TabHeader';
import StatCard from './StatCard';
import { Field } from './types';

interface FieldsTabProps {
  fields: Field[];
  onCreateField: (name: string, description: string) => void;
  onCreateCategory: (name: string, description: string, fieldId: string) => void;
  onDeleteField: (fieldId: string) => void;
  onDeleteCategory: (categoryId: string) => void;
}

export default function FieldsTab({
  fields,
  onCreateField,
  onCreateCategory,
  onDeleteField,
  onDeleteCategory,
}: FieldsTabProps) {
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldDesc, setNewFieldDesc] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDesc, setNewCategoryDesc] = useState('');
  const [selectedFieldForCategory, setSelectedFieldForCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFields, setExpandedFields] = useState<Set<string>>(new Set());

  const handleCreateField = (e: FormEvent) => {
    e.preventDefault();
    if (!newFieldName.trim()) return;
    onCreateField(newFieldName, newFieldDesc);
    setNewFieldName('');
    setNewFieldDesc('');
  };

  const handleCreateCategory = (e: FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim() || !selectedFieldForCategory) return;
    onCreateCategory(newCategoryName, newCategoryDesc, selectedFieldForCategory);
    setNewCategoryName('');
    setNewCategoryDesc('');
    setSelectedFieldForCategory('');
  };

  const toggleFieldExpansion = (fieldId: string) => {
    const newExpanded = new Set(expandedFields);
    if (newExpanded.has(fieldId)) {
      newExpanded.delete(fieldId);
    } else {
      newExpanded.add(fieldId);
    }
    setExpandedFields(newExpanded);
  };

  const filteredFields = fields.filter(
    (field) =>
      field.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      field.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalCategories = fields.reduce((sum, field) => sum + (field.categories?.length || 0), 0);

  return (
    <div className="space-y-8">
      <TabHeader
        icon={FolderTree}
        iconClass="bg-brand-50 text-brand-600 border-brand-100"
        title="Fields & Categories"
        description="Organize and manage your content structure"
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-up" style={{ animationDelay: '80ms' }}>
        <StatCard
          icon={FolderTree}
          accent="bg-brand-50 text-brand-600 border-brand-100"
          value={fields.length}
          label="Total Fields"
        />
        <StatCard
          icon={Layers}
          accent="bg-violet-50 text-violet-600 border-violet-100"
          value={totalCategories}
          label="Total Categories"
        />
        <StatCard
          icon={FileText}
          accent="bg-emerald-50 text-emerald-600 border-emerald-100"
          value={fields.length > 0 ? (totalCategories / fields.length).toFixed(1) : '0'}
          label="Avg Categories / Field"
        />
      </div>

      {/* Create forms */}
      <div className="card p-6 sm:p-7 animate-fade-up" style={{ animationDelay: '140ms' }}>
        <h3 className="font-display text-lg font-bold text-ink mb-6 flex items-center gap-2">
          <Plus className="w-5 h-5 text-brand-600" />
          Create New Content
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* New field */}
          <form onSubmit={handleCreateField} className="space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center">
                <FolderTree className="w-4.5 h-4.5 text-brand-600" />
              </span>
              <h4 className="font-display font-bold text-ink">New Field</h4>
            </div>

            <div>
              <label htmlFor="new-field-name" className="field-label">
                Field Name <span className="text-rose-400">*</span>
              </label>
              <input
                id="new-field-name"
                type="text"
                value={newFieldName}
                onChange={(e) => setNewFieldName(e.target.value)}
                placeholder="e.g., Computer Science"
                className="field-input"
                required
              />
            </div>

            <div>
              <label htmlFor="new-field-desc" className="field-label">Description</label>
              <textarea
                id="new-field-desc"
                value={newFieldDesc}
                onChange={(e) => setNewFieldDesc(e.target.value)}
                placeholder="Brief description of this field…"
                className="field-input h-24 resize-none"
              />
            </div>

            <button type="submit" className="btn-brand w-full">
              <Plus className="w-4.5 h-4.5" />
              Create Field
            </button>
          </form>

          {/* New category */}
          <form onSubmit={handleCreateCategory} className="space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center">
                <Layers className="w-4.5 h-4.5 text-violet-600" />
              </span>
              <h4 className="font-display font-bold text-ink">New Category</h4>
            </div>

            <div>
              <label htmlFor="new-category-field" className="field-label">
                Select Field <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <select
                  id="new-category-field"
                  value={selectedFieldForCategory}
                  onChange={(e) => setSelectedFieldForCategory(e.target.value)}
                  className="field-input appearance-none pr-10 cursor-pointer"
                  required
                >
                  <option value="">Choose a field…</option>
                  {fields.map((field) => (
                    <option key={field.id} value={field.id}>
                      {field.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label htmlFor="new-category-name" className="field-label">
                Category Name <span className="text-rose-400">*</span>
              </label>
              <input
                id="new-category-name"
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="e.g., Data Structures"
                className="field-input"
                required
              />
            </div>

            <div>
              <label htmlFor="new-category-desc" className="field-label">Description</label>
              <textarea
                id="new-category-desc"
                value={newCategoryDesc}
                onChange={(e) => setNewCategoryDesc(e.target.value)}
                placeholder="Brief description of this category…"
                className="field-input h-24 resize-none"
              />
            </div>

            <button
              type="submit"
              className="btn w-full bg-violet-600 text-white px-5 py-2.5 text-sm hover:bg-violet-700 hover:-translate-y-0.5 shadow-card"
            >
              <Plus className="w-4.5 h-4.5" />
              Create Category
            </button>
          </form>
        </div>
      </div>

      {/* Fields list */}
      <div className="card p-6 sm:p-7 animate-fade-up" style={{ animationDelay: '200ms' }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h3 className="font-display text-lg font-bold text-ink flex items-center gap-2">
            <FolderTree className="w-5 h-5 text-brand-600" />
            All Fields & Categories
          </h3>

          <div className="relative sm:w-72 group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-brand-500 transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search fields…"
              className="field-input pl-9.5"
            />
          </div>
        </div>

        {filteredFields.length === 0 ? (
          <div className="text-center py-14">
            <div className="w-16 h-16 rounded-3xl bg-zinc-50 border border-zinc-100 flex items-center justify-center mx-auto mb-4">
              <FolderTree className="w-7 h-7 text-zinc-300" />
            </div>
            <p className="font-semibold text-zinc-500">
              {searchQuery ? 'No fields match your search' : 'No fields created yet'}
            </p>
            <p className="text-sm text-zinc-400 mt-1">
              {searchQuery ? 'Try a different search term' : 'Create your first field to get started'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFields.map((field) => {
              const isExpanded = expandedFields.has(field.id);
              const categoryCount = field.categories?.length || 0;

              return (
                <div
                  key={field.id}
                  className="rounded-2xl border border-zinc-200/80 overflow-hidden transition-all duration-300 hover:border-brand-200/80"
                >
                  {/* Field header */}
                  <div className="bg-zinc-50/60 p-5">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex items-start gap-3.5 min-w-0">
                        <span className="w-11 h-11 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center shrink-0">
                          <FolderTree className="w-5 h-5 text-brand-600" />
                        </span>
                        <div className="min-w-0">
                          <h4 className="font-display font-bold text-ink text-lg">{field.name}</h4>
                          {field.description && (
                            <p className="text-sm text-zinc-500 mt-0.5 leading-relaxed">{field.description}</p>
                          )}
                          <div className="flex items-center gap-3 mt-3 flex-wrap">
                            <span className="chip bg-white text-zinc-600 border border-zinc-200">
                              <Layers className="w-3.5 h-3.5 text-violet-500" />
                              {categoryCount} {categoryCount === 1 ? 'Category' : 'Categories'}
                            </span>
                            {categoryCount > 0 && (
                              <button
                                onClick={() => toggleFieldExpansion(field.id)}
                                aria-expanded={isExpanded}
                                className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors"
                              >
                                {isExpanded ? 'Hide Categories' : 'Show Categories'}
                                <ChevronDown
                                  className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                                />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => onDeleteField(field.id)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold text-rose-600 bg-rose-50 border border-rose-100
                          hover:bg-rose-100 transition-all duration-300 shrink-0 self-start"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete Field
                      </button>
                    </div>
                  </div>

                  {/* Categories */}
                  {isExpanded && categoryCount > 0 && (
                    <div className="p-5 border-t border-zinc-100 animate-fade-in">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                        {field.categories?.map((category) => (
                          <div
                            key={category.id}
                            className="group flex items-center justify-between gap-2 px-4 py-3 rounded-xl bg-violet-50/60 border border-violet-100
                              transition-all duration-300 hover:border-violet-200 hover:shadow-soft"
                          >
                            <span className="flex items-center gap-2 min-w-0">
                              <Layers className="w-4 h-4 text-violet-500 shrink-0" />
                              <span className="text-sm font-semibold text-ink truncate">{category.name}</span>
                            </span>
                            <button
                              onClick={() => onDeleteCategory(category.id)}
                              title="Delete category"
                              className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-rose-500 hover:bg-rose-100 transition-all shrink-0"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {isExpanded && categoryCount === 0 && (
                    <div className="p-8 border-t border-zinc-100 text-center animate-fade-in">
                      <Layers className="w-10 h-10 text-zinc-200 mx-auto mb-2.5" />
                      <p className="text-sm font-semibold text-zinc-400">No categories in this field</p>
                      <p className="text-xs text-zinc-300 mt-1">Create a category to get started</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
