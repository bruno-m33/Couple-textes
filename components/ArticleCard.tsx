
import React from 'react';
import { GroundingSource } from '../types';

interface ArticleCardProps {
  source: GroundingSource;
  index: number;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ source, index }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition-shadow group">
      <div className="flex items-start justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-indigo-500 bg-indigo-50 px-2 py-1 rounded">
          Source {index + 1}
        </span>
      </div>
      <h3 className="mt-3 text-lg font-bold text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors">
        {source.title}
      </h3>
      <div className="mt-4 flex items-center justify-between">
        <a 
          href={source.uri} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-sm font-medium text-slate-500 hover:text-indigo-600 flex items-center gap-1"
        >
          Consulter l'article original
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default ArticleCard;
