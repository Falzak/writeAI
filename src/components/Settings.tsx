import React, { useState } from 'react';
import { User, Bell, Shield, CreditCard, Palette, Globe, Key, Download } from 'lucide-react';

export function Settings() {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'billing', name: 'Billing', icon: CreditCard },
    { id: 'appearance', name: 'Appearance', icon: Palette },
    { id: 'language', name: 'Language', icon: Globe },
    { id: 'api', name: 'API Keys', icon: Key }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account preferences and settings</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex">
          {/* Tabs Sidebar */}
          <div className="w-64 border-r border-gray-200 bg-gray-50">
            <nav className="p-4 space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-6">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      defaultValue="John Silva"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      defaultValue="john@example.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                    <input
                      type="text"
                      defaultValue="My Company LLC"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                    <input
                      type="text"
                      defaultValue="Marketing Manager"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  <textarea
                    rows={4}
                    defaultValue="Digital marketing professional focused on content creation and process automation."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Save Changes
                </button>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Notification Preferences</h2>
                
                <div className="space-y-4">
                  {[
                    { id: 'email', label: 'Email Notifications', description: 'Receive important updates via email' },
                    { id: 'push', label: 'Push Notifications', description: 'Real-time browser notifications' },
                    { id: 'projects', label: 'Project Completed', description: 'Get notified when projects are finished' },
                    { id: 'audio', label: 'Audio Ready', description: 'Notification when TTS conversion is complete' },
                    { id: 'weekly', label: 'Weekly Report', description: 'Weekly summary of your productivity' }
                  ].map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900">{item.label}</h3>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Billing and Subscription</h2>
                
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">Premium Plan</h3>
                      <p className="text-blue-100">Complete access to all tools</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">$97/month</p>
                      <p className="text-blue-100 text-sm">Next billing: Feb 15, 2024</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-semibold text-gray-900">Projects This Month</h3>
                    <p className="text-2xl font-bold text-blue-600 mt-2">127</p>
                  </div>
                  <div className="text-center p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-semibold text-gray-900">Words Generated</h3>
                    <p className="text-2xl font-bold text-purple-600 mt-2">45.2K</p>
                  </div>
                  <div className="text-center p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-semibold text-gray-900">Audio Created</h3>
                    <p className="text-2xl font-bold text-green-600 mt-2">89</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                    Billing History
                  </button>
                  <button className="bg-red-100 text-red-700 px-6 py-2 rounded-lg hover:bg-red-200 transition-colors">
                    Cancel Subscription
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'api' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">API Keys</h2>
                <p className="text-gray-600">Configure your integrations with external services</p>
                
                <div className="space-y-4">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-900">OpenAI API Key</h3>
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Connected</span>
                    </div>
                    <div className="flex gap-3">
                      <input
                        type="password"
                        value="sk-..." 
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                        readOnly
                      />
                      <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                        Edit
                      </button>
                    </div>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-900">ElevenLabs API Key</h3>
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Connected</span>
                    </div>
                    <div className="flex gap-3">
                      <input
                        type="password"
                        value="el_..." 
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                        readOnly
                      />
                      <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                        Edit
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="font-medium text-yellow-800 mb-2">Important</h3>
                  <p className="text-yellow-700 text-sm">
                    Keep your API keys secure. They are necessary for the AI tools 
                    and text-to-speech functionality to work properly.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}