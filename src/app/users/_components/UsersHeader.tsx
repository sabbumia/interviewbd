// src/app/users/_components/UsersHeader.tsx
import { Users, Network } from 'lucide-react';

interface UsersHeaderProps {
  totalUsers: number;
  totalConnections: number;
}

export default function UsersHeader({ totalUsers, totalConnections }: UsersHeaderProps) {
  return (
    <div className="w-[58%] mx-auto relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 overflow-hidden rounded-xl">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20"></div>
      
      <div className="relative px-6 md:px-8 py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">
              Community Network
            </h1>
            <p className="text-gray-300 text-sm md:text-base">
              Connect and collaborate with professionals and students
            </p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4 border border-white/20">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Users className="w-5 h-5 text-blue-400" />
                <p className="text-3xl font-bold text-white">{totalUsers}</p>
              </div>
              <p className="text-xs text-gray-300 font-medium">Total Members</p>
            </div>
            
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4 border border-white/20">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Network className="w-5 h-5 text-green-400" />
                <p className="text-3xl font-bold text-white">{totalConnections}</p>
              </div>
              <p className="text-xs text-gray-300 font-medium">Your Connections</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
