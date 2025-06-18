import React from 'react';
import { BarChart3 } from 'lucide-react';

interface ActivityData {
  day: string;
  projects: number;
  words: number;
}

interface ActivityChartProps {
  data: ActivityData[];
  className?: string;
}

export function ActivityChart({ data, className = '' }: ActivityChartProps) {
  const maxProjects = Math.max(...data.map(d => d.projects), 1);
  const maxWords = Math.max(...data.map(d => d.words), 1);

  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Atividade Semanal</h3>
      </div>

      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium text-gray-700">{item.day}</span>
              <div className="flex gap-4 text-xs text-gray-500">
                <span>{item.projects} projetos</span>
                <span>{item.words} palavras</span>
              </div>
            </div>
            
            {/* Projects bar */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 w-16">Projetos</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(item.projects / maxProjects) * 100}%` }}
                />
              </div>
            </div>
            
            {/* Words bar */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 w-16">Palavras</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(item.words / maxWords) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {data.every(d => d.projects === 0 && d.words === 0) && (
        <div className="text-center py-8">
          <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Nenhuma atividade esta semana</p>
          <p className="text-sm text-gray-400 mt-1">Comece criando projetos para ver o gráfico!</p>
        </div>
      )}
    </div>
  );
}