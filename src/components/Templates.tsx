import React, { useState } from 'react';
import { Search, Copy, Edit, Star, Filter } from 'lucide-react';
import { templates } from '../data/templates';

export function Templates() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(templates.map(t => t.category)))];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCopyTemplate = (template: typeof templates[0]) => {
    navigator.clipboard.writeText(template.content);
    // You could add a toast notification here
  };

  const handleUseTemplate = (template: typeof templates[0]) => {
    // This would integrate with the writing tools
    console.log('Using template:', template.name);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Smart Templates</h1>
        <p className="text-gray-600">Accelerate your writing with pre-optimized professional templates</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category === 'all' ? 'All' : category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900">{template.name}</h3>
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                  <span className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs font-medium">
                    {template.category}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <div className="bg-gray-50 rounded-lg p-3 border-l-4 border-blue-500">
                  <p className="text-sm text-gray-700 line-clamp-3">
                    {template.content}
                  </p>
                </div>
              </div>

              {template.variables.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                    Variables ({template.variables.length})
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {template.variables.slice(0, 3).map((variable, index) => (
                      <span
                        key={index}
                        className="inline-block bg-purple-100 text-purple-700 px-2 py-1 rounded-md text-xs"
                      >
                        {variable}
                      </span>
                    ))}
                    {template.variables.length > 3 && (
                      <span className="inline-block bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs">
                        +{template.variables.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => handleUseTemplate(template)}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Use Template
                </button>
                <button
                  onClick={() => handleCopyTemplate(template)}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Filter className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
          <p className="text-gray-600">Try adjusting your search filters or explore other categories.</p>
        </div>
      )}

      {/* Create Template CTA */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white text-center">
        <h3 className="text-xl font-bold mb-2">Create Your Own Templates</h3>
        <p className="text-purple-100 mb-4">
          Transform your best texts into reusable templates and boost your productivity
        </p>
        <button className="bg-white text-purple-600 px-6 py-2 rounded-lg font-medium hover:bg-purple-50 transition-colors">
          Create Custom Template
        </button>
      </div>
    </div>
  );
}