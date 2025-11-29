import React from 'react';
import { HadithResult } from '../types';
import { CheckCircle2, AlertCircle, XCircle, HelpCircle, Book, Link as LinkIcon } from 'lucide-react';

interface ResultsCardProps {
  data: HadithResult;
  groundingUrls: { title: string; uri: string }[];
}

const getStatusColor = (status: string) => {
  const s = status.toLowerCase();
  if (s.includes('sahih')) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
  if (s.includes('hasan')) return 'bg-blue-100 text-blue-800 border-blue-200';
  if (s.includes('daif') || s.includes('lemah')) return 'bg-orange-100 text-orange-800 border-orange-200';
  if (s.includes('palsu') || s.includes('maudhu')) return 'bg-red-100 text-red-800 border-red-200';
  return 'bg-slate-100 text-slate-800 border-slate-200';
};

const getStatusIcon = (status: string) => {
  const s = status.toLowerCase();
  if (s.includes('sahih')) return <CheckCircle2 size={18} />;
  if (s.includes('hasan')) return <CheckCircle2 size={18} />;
  if (s.includes('daif')) return <AlertCircle size={18} />;
  if (s.includes('palsu')) return <XCircle size={18} />;
  return <HelpCircle size={18} />;
};

export const ResultsCard: React.FC<ResultsCardProps> = ({ data, groundingUrls }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-fade-in">
      {/* Status Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-500">Status Hadis:</span>
          <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold border ${getStatusColor(data.status)}`}>
            {getStatusIcon(data.status)}
            {data.status}
          </span>
        </div>
        <div className="text-xs text-slate-400">
          Disemak oleh AI
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Matan (Arabic) */}
        <div className="space-y-3 text-center">
          <h3 className="text-xs uppercase tracking-wider font-semibold text-slate-400">Matan Hadis</h3>
          <p className="font-arabic text-2xl md:text-3xl leading-loose text-slate-800" dir="rtl">
            {data.matan}
          </p>
        </div>

        {/* Translation */}
        <div className="space-y-3 bg-slate-50 p-5 rounded-xl border border-slate-100">
          <h3 className="text-xs uppercase tracking-wider font-semibold text-slate-400 flex items-center gap-2">
            <Book size={14} /> Terjemahan
          </h3>
          <p className="text-slate-700 leading-relaxed text-lg">
            {data.translation}
          </p>
        </div>

        {/* Details Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Sources */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-900">Sumber Kitab</h3>
            <div className="flex flex-wrap gap-2">
              {data.sources.map((source, idx) => (
                <span key={idx} className="bg-white border border-slate-200 text-slate-600 px-3 py-1 rounded-md text-sm shadow-sm">
                  {source}
                </span>
              ))}
            </div>
          </div>

          {/* Explanation */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-900">Huraian Ringkas</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {data.explanation}
            </p>
          </div>
        </div>
        
        {/* Grounding Sources (Actual Web Links) */}
        {groundingUrls.length > 0 && (
          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-xs font-semibold text-slate-500 mb-3 uppercase">Pautan Rujukan Web</h3>
            <ul className="space-y-2">
              {groundingUrls.map((url, idx) => (
                <li key={idx}>
                  <a 
                    href={url.uri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700 hover:underline truncate"
                  >
                    <LinkIcon size={14} />
                    {url.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};