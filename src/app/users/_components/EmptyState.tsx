// src/app/users/_components/EmptyState.tsx
import { UserPlus } from 'lucide-react';

export default function EmptyState() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <UserPlus className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">No users found</h3>
      <p className="text-gray-600">Try adjusting your search or filters</p>
    </div>
  );
}