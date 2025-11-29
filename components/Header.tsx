import React from 'react';
import { BookOpen, Search } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-emerald-100 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-600 p-2 rounded-lg text-white">
            <BookOpen size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 leading-tight">Takrij Hadis.my</h1>
            <p className="text-xs text-slate-500">Penyemakan status & matan hadis</p>
          </div>
        </div>
      </div>
    </header>
  );
};