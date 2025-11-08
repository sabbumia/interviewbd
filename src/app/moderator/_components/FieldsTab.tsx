// src/app/admin/_components/FieldsTab.tsx

import { useState, FormEvent } from "react";
import { Trash2, FolderTree, Layers, Plus, Search, AlertCircle } from "lucide-react";
import { Field } from "./types";

interface FieldsTabProps {
  fields: Field[];
  onCreateField: (name: string, description: string) => void;
  onCreateCategory: (name: string, description: string, fieldId: string) => void;
}

export default function FieldsTab({
  fields,
  onCreateField,
  onCreateCategory,
}: FieldsTabProps) {
  const [newFieldName, setNewFieldName] = useState("");
  const [newFieldDesc, setNewFieldDesc] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDesc, setNewCategoryDesc] = useState("");
  const [selectedFieldForCategory, setSelectedFieldForCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFields, setExpandedFields] = useState<Set<string>>(new Set());

  const handleCreateField = (e: FormEvent) => {
    e.preventDefault();
    if (!newFieldName.trim()) return;
    onCreateField(newFieldName, newFieldDesc);
    setNewFieldName("");
    setNewFieldDesc("");
  };

  const handleCreateCategory = (e: FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim() || !selectedFieldForCategory) return;
    onCreateCategory(newCategoryName, newCategoryDesc, selectedFieldForCategory);
    setNewCategoryName("");
    setNewCategoryDesc("");
    setSelectedFieldForCategory("");
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

  const filteredFields = fields.filter(field =>
    field.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    field.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalCategories = fields.reduce((sum, field) => sum + (field.categories?.length || 0), 0);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-50 rounded-lg">
            <FolderTree className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Fields & Categories</h2>
            <p className="text-gray-600 mt-1">Organize and manage your content structure</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Fields</p>
              <p className="text-3xl font-bold text-gray-900">{fields.length}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <FolderTree className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Categories</p>
              <p className="text-3xl font-bold text-gray-900">{totalCategories}</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <Layers className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Average Categories/Field</p>
              <p className="text-3xl font-bold text-gray-900">
                {fields.length > 0 ? (totalCategories / fields.length).toFixed(1) : '0'}
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <Layers className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Create Forms Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Create New Content
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Create Field Form */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <FolderTree className="w-5 h-5 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900">New Field</h4>
            </div>
            
            <form onSubmit={handleCreateField} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Field Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newFieldName}
                  onChange={(e) => setNewFieldName(e.target.value)}
                  placeholder="e.g., Computer Science"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newFieldDesc}
                  onChange={(e) => setNewFieldDesc(e.target.value)}
                  placeholder="Brief description of this field..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm h-28 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Plus className="w-5 h-5" />
                Create Field
              </button>
            </form>
          </div>

          {/* Create Category Form */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Layers className="w-5 h-5 text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900">New Category</h4>
            </div>
            
            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Field <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedFieldForCategory}
                  onChange={(e) => setSelectedFieldForCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  required
                >
                  <option value="">Choose a field...</option>
                  {fields.map((field) => (
                    <option key={field.id} value={field.id}>
                      {field.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="e.g., Data Structures"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newCategoryDesc}
                  onChange={(e) => setNewCategoryDesc(e.target.value)}
                  placeholder="Brief description of this category..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm h-28 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all resize-none"
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Plus className="w-5 h-5" />
                Create Category
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Fields List Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FolderTree className="w-5 h-5" />
            All Fields & Categories
          </h3>
          
          {/* Search Bar */}
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search fields..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        {filteredFields.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <AlertCircle className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">
              {searchQuery ? "No fields match your search" : "No fields created yet"}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {searchQuery ? "Try a different search term" : "Create your first field to get started"}
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
                  className="border-2 border-gray-200 rounded-xl overflow-hidden hover:border-blue-300 transition-all"
                >
                  {/* Field Header */}
                  <div className="bg-gray-50 p-5">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <FolderTree className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-bold text-xl text-gray-900">{field.name}</h4>
                            {field.description && (
                              <p className="text-sm text-gray-600 mt-1">{field.description}</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 ml-14 mt-3">
                          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-gray-200">
                            <Layers className="w-4 h-4 text-purple-600" />
                            <span className="text-sm font-semibold text-gray-700">
                              {categoryCount} {categoryCount === 1 ? 'Category' : 'Categories'}
                            </span>
                          </div>
                          
                          {categoryCount > 0 && (
                            <button
                              onClick={() => toggleFieldExpansion(field.id)}
                              className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                            >
                              {isExpanded ? 'Hide Categories ↑' : 'Show Categories ↓'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Categories List */}
                  {isExpanded && categoryCount > 0 && (
                    <div className="p-5 bg-white border-t border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {field.categories?.map((category) => (
                          <div
                            key={category.id}
                            className="flex items-center justify-between bg-purple-50 px-4 py-3 rounded-lg border border-purple-200 hover:border-purple-300 transition-all group"
                          >
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <Layers className="w-4 h-4 text-purple-600 flex-shrink-0" />
                              <span className="text-sm font-semibold text-gray-900 truncate">
                                {category.name}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Empty State for Categories */}
                  {isExpanded && categoryCount === 0 && (
                    <div className="p-8 bg-white border-t border-gray-200 text-center">
                      <Layers className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-sm text-gray-500 font-medium">No categories in this field</p>
                      <p className="text-xs text-gray-400 mt-1">Create a category to get started</p>
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