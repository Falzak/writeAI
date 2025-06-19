import React, { useState } from 'react';
import { Search, Filter, Trash2, Edit, Share, Volume2, Calendar } from 'lucide-react';
import { useWritingProjects } from '../hooks/useWritingProjects';
import { WritingProject } from '../types';

export function Projects() {
  const { projects, deleteProject } = useWritingProjects();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'words'>('date');

  const filteredProjects = projects
    .filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        case 'words':
          return b.wordCount - a.wordCount;
        default:
          return 0;
      }
    });

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const getStatusColor = (status: string) => {
    return status === 'completed'
      ? 'bg-green-100 text-green-700'
      : 'bg-yellow-100 text-yellow-700';
  };

  const getStatusText = (status: string) => {
    return status === 'completed' ? 'Completed' : 'Draft';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">My Projects</h1>
          <p className="text-gray-600">Manage all your writing projects</p>
        </div>
        
        <div className="text-sm text-gray-500">
          {projects.length} {projects.length === 1 ? 'project' : 'projects'}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="draft">Drafts</option>
              <option value="completed">Completed</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="date">Last Modified</option>
              <option value="title">Title</option>
              <option value="words">Word Count</option>
            </select>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{project.title}</h3>
                  <p className="text-sm text-gray-600 capitalize">{project.tool}</p>
                </div>
                
                <div className="flex items-center gap-1">
                  <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                    <Share className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteProject(project.id)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 line-clamp-3">
                  {project.content || 'No content yet...'}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(project.updatedAt)}
                  </div>
                  <span>{project.wordCount} words</span>
                </div>
                
                <div className="flex items-center gap-2">
                  {project.hasAudio && (
                    <Volume2 className="w-4 h-4 text-purple-600" />
                  )}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                    {getStatusText(project.status)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm || filterStatus !== 'all' ? 'No projects found' : 'No projects yet'}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || filterStatus !== 'all' 
              ? 'Try adjusting your search filters.'
              : 'Start by creating your first project with our AI tools.'
            }
          </p>
          {!searchTerm && filterStatus === 'all' && (
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Create First Project
            </button>
          )}
        </div>
      )}

      {/* Summary Stats */}
      {filteredProjects.length > 0 && (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{filteredProjects.length}</p>
              <p className="text-blue-100 text-sm">Total Projects</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">
                {filteredProjects.filter(p => p.status === 'completed').length}
              </p>
              <p className="text-blue-100 text-sm">Completed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">
                {filteredProjects.reduce((acc, p) => acc + p.wordCount, 0).toLocaleString()}
              </p>
              <p className="text-blue-100 text-sm">Total Words</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">
                {filteredProjects.filter(p => p.hasAudio).length}
              </p>
              <p className="text-blue-100 text-sm">With Audio</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}