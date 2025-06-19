import React, { useState } from 'react';
import { User, Bell, Shield, CreditCard, Palette, Globe, Key, Download, Save } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export function Settings() {
  const { user, profile, updateProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Form states
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    email: profile?.email || user?.email || '',
    company: profile?.company || '',
    job_title: profile?.job_title || '',
    bio: profile?.bio || ''
  });

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    projects: true,
    audio: true,
    weekly: false
  });

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'billing', name: 'Billing', icon: CreditCard },
    { id: 'appearance', name: 'Appearance', icon: Palette },
    { id: 'language', name: 'Language', icon: Globe },
    { id: 'api', name: 'API Keys', icon: Key }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    setSuccessMessage('');
    
    try {
      const { error } = await updateProfile(formData);
      if (error) {
        console.error('Error updating profile:', error);
      } else {
        setSuccessMessage('Profile updated successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getUsagePercentage = () => {
    if (!profile) return 0;
    return Math.round(((profile.api_usage_count || 0) / (profile.monthly_usage_limit || 10000)) * 100);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your account preferences and settings</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-200">
        <div className="flex">
          {/* Tabs Sidebar */}
          <div className="w-64 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
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
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
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
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Profile Information</h2>
                
                {successMessage && (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                    <p className="text-green-700 dark:text-green-400 text-sm">{successMessage}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={formData.full_name}
                      onChange={(e) => handleInputChange('full_name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                      placeholder="Enter your email"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Company</label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                      placeholder="Your company name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Job Title</label>
                    <input
                      type="text"
                      value={formData.job_title}
                      onChange={(e) => handleInputChange('job_title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                      placeholder="Your job title"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bio</label>
                  <textarea
                    rows={4}
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-colors"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                {/* Account Info */}
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-3">Account Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Plan Type:</span>
                      <span className="ml-2 font-medium text-gray-900 dark:text-white capitalize">
                        {profile?.plan_type || 'Free'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Member Since:</span>
                      <span className="ml-2 font-medium text-gray-900 dark:text-white">
                        {formatDate(profile?.created_at || null)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Subscription Status:</span>
                      <span className={`ml-2 font-medium capitalize ${
                        profile?.subscription_status === 'active' 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-gray-600 dark:text-gray-400'
                      }`}>
                        {profile?.subscription_status || 'Inactive'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">API Usage:</span>
                      <span className="ml-2 font-medium text-gray-900 dark:text-white">
                        {(profile?.api_usage_count || 0).toLocaleString()} / {(profile?.monthly_usage_limit || 10000).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleSaveProfile}
                  disabled={isLoading}
                  className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Notification Preferences</h2>
                
                <div className="space-y-4">
                  {[
                    { id: 'email', label: 'Email Notifications', description: 'Receive important updates via email' },
                    { id: 'push', label: 'Push Notifications', description: 'Real-time browser notifications' },
                    { id: 'projects', label: 'Project Completed', description: 'Get notified when projects are finished' },
                    { id: 'audio', label: 'Audio Ready', description: 'Notification when TTS conversion is complete' },
                    { id: 'weekly', label: 'Weekly Report', description: 'Weekly summary of your productivity' }
                  ].map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 transition-colors">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">{item.label}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={notifications[item.id as keyof typeof notifications]}
                          onChange={(e) => handleNotificationChange(item.id, e.target.checked)}
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Appearance Settings</h2>
                
                <div className="space-y-4">
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">Theme</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Choose between light and dark mode
                        </p>
                      </div>
                      <button
                        onClick={toggleTheme}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode
                      </button>
                    </div>
                  </div>

                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 transition-colors">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">Current Theme</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                      {theme} mode is currently active
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Billing and Subscription</h2>
                
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold capitalize">
                        {profile?.plan_type || 'Free'} Plan
                      </h3>
                      <p className="text-blue-100">
                        {profile?.plan_type === 'free' ? 'Limited access with monthly limits' : 'Complete access to all tools'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">
                        {profile?.plan_type === 'free' ? 'Free' : '$97/month'}
                      </p>
                      {profile?.subscription_end_date && (
                        <p className="text-blue-100 text-sm">
                          Next billing: {formatDate(profile.subscription_end_date)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Usage Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 transition-colors">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Words Used</h3>
                    <p className="text-2xl font-bold text-blue-600 mt-2">
                      {(profile?.api_usage_count || 0).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      of {(profile?.monthly_usage_limit || 10000).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 transition-colors">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Usage Percentage</h3>
                    <p className="text-2xl font-bold text-purple-600 mt-2">{getUsagePercentage()}%</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">of monthly limit</p>
                  </div>
                  <div className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 transition-colors">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Status</h3>
                    <p className={`text-2xl font-bold mt-2 capitalize ${
                      profile?.subscription_status === 'active' 
                        ? 'text-green-600' 
                        : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      {profile?.subscription_status || 'Inactive'}
                    </p>
                  </div>
                </div>

                {profile?.plan_type === 'free' && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                    <h3 className="font-medium text-yellow-800 dark:text-yellow-400 mb-2">Upgrade to Premium</h3>
                    <p className="text-yellow-700 dark:text-yellow-300 text-sm mb-3">
                      Get unlimited access to all features, premium voices, and advanced tools.
                    </p>
                    <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors">
                      Upgrade Now
                    </button>
                  </div>
                )}

                <div className="flex gap-4">
                  <button className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                    Billing History
                  </button>
                  {profile?.plan_type !== 'free' && (
                    <button className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 px-6 py-2 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors">
                      Cancel Subscription
                    </button>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'api' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">API Keys</h2>
                <p className="text-gray-600 dark:text-gray-400">Configure your integrations with external services</p>
                
                <div className="space-y-4">
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-900 dark:text-white">OpenAI API Key</h3>
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-full">Connected</span>
                    </div>
                    <div className="flex gap-3">
                      <input
                        type="password"
                        value="sk-..." 
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                        readOnly
                      />
                      <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                        Edit
                      </button>
                    </div>
                  </div>

                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-900 dark:text-white">ElevenLabs API Key</h3>
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-full">Connected</span>
                    </div>
                    <div className="flex gap-3">
                      <input
                        type="password"
                        value="el_..." 
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                        readOnly
                      />
                      <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                        Edit
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <h3 className="font-medium text-yellow-800 dark:text-yellow-400 mb-2">Important</h3>
                  <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                    Keep your API keys secure. They are necessary for the AI tools 
                    and text-to-speech functionality to work properly.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Security Settings</h2>
                
                <div className="space-y-4">
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 transition-colors">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">Password</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Last changed: Never
                    </p>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      Change Password
                    </button>
                  </div>

                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 transition-colors">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Add an extra layer of security to your account
                    </p>
                    <button className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                      Enable 2FA
                    </button>
                  </div>

                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 transition-colors">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">Account Data</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Download or delete your account data
                    </p>
                    <div className="flex gap-3">
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Export Data
                      </button>
                      <button className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 px-4 py-2 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'language' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Language & Region</h2>
                
                <div className="space-y-4">
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 transition-colors">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-3">Interface Language</h3>
                    <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
                      <option value="en">English</option>
                      <option value="pt">Português</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                    </select>
                  </div>

                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 transition-colors">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-3">Default Content Language</h3>
                    <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
                      <option value="en-US">English (US)</option>
                      <option value="pt-BR">Português (Brasil)</option>
                      <option value="es-ES">Español (España)</option>
                      <option value="fr-FR">Français (France)</option>
                    </select>
                  </div>

                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 transition-colors">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-3">Timezone</h3>
                    <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">Eastern Time</option>
                      <option value="America/Los_Angeles">Pacific Time</option>
                      <option value="Europe/London">London</option>
                      <option value="America/Sao_Paulo">São Paulo</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}