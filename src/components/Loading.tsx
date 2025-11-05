// src/components/Loading.tsx

interface LoadingProps {
  message?: string;
}

export default function Loading({ message = "Loading..." }: LoadingProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-slate-50 to-zinc-50">
      <div className="text-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200 border-t-slate-700 mx-auto"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-slate-700 rounded-full animate-pulse"></div>
          </div>
        </div>
        <p className="text-slate-600 font-semibold mt-6">{message}</p>
      </div>
    </div>
  );
}