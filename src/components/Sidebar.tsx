import React, { useState } from "react";
import {
  PenTool,
  BarChart3,
  Settings,
  Sparkles,
  FileText,
  Volume2,
  Zap,
  Search,
  Bell,
  User,
  LogOut,
  Settings as SettingsIcon,
  Sun,
  Moon,
  MessageCircle,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { AuthModal } from "./auth/AuthModal";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const { user, profile, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const menuItems = [
    { id: "dashboard", name: "Dashboard", icon: BarChart3 },
    { id: "chat", name: "AI Chat", icon: MessageCircle },
    { id: "tools", name: "Writing Tools", icon: PenTool },
    { id: "audio", name: "Text-to-Speech", icon: Volume2 },
    { id: "projects", name: "Projects", icon: FileText },
    { id: "templates", name: "Templates", icon: Sparkles },
    { id: "settings", name: "Settings", icon: Settings },
  ];

  const handleSignOut = async () => {
    await signOut();
    setShowUserMenu(false);
  };

  if (!user) {
    return (
      <>
        <div className="w-64 h-full flex flex-col transition-all duration-200 p-2 relative">
          {/* Logo */}
          <div className="px-4 py-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg ring-1 ring-white/10">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">
                  WriteAI Pro
                </h1>
                <p className="text-xs text-gray-400 font-medium">
                  AI Writing Platform
                </p>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="px-3 pb-5">
            <div className="relative group">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 group-hover:text-gray-300 transition-colors" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-900/50 backdrop-blur-sm text-gray-100 placeholder-gray-500 rounded-xl border border-gray-800 focus:border-gray-700 focus:ring-1 focus:ring-gray-700 focus:outline-none transition-all duration-200"
                disabled
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3">
            <ul className="space-y-1.5">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      disabled
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-left transition-all duration-200 text-gray-500 cursor-not-allowed hover:bg-gray-800/50 font-medium text-sm"
                    >
                      <Icon className="w-[18px] h-[18px] opacity-75" />
                      <span>{item.name}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Bottom Actions */}
          <div className="px-3 pt-3 space-y-4">
            <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent opacity-50"></div>
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-xl transition-all duration-200 text-sm font-medium"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
              <span className="font-medium">
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </span>
            </button>

            {/* Auth Button */}
            <button
              onClick={() => setShowAuthModal(true)}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2.5 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg text-sm ring-1 ring-white/10"
            >
              Sign In / Sign Up
            </button>

            {/* Upgrade Card */}
            <div className="relative bg-gradient-to-br from-blue-600 to-purple-700 rounded-xl p-4 text-white shadow-lg ring-1 ring-white/20 overflow-hidden">
              <div className="absolute inset-0 bg-top bg-[radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.1),_transparent_70%)]"></div>
              <h3 className="font-semibold text-sm mb-1 relative">
                Upgrade to Pro
              </h3>
              <p className="text-xs text-blue-100/90 mb-3 relative">
                Unlimited access to all tools
              </p>
              <button className="w-full bg-white/10 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-white/20 transition-all duration-200 relative ring-1 ring-white/20">
                Subscribe Now
              </button>
            </div>
          </div>
        </div>

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      </>
    );
  }

  return (
    <div className="w-64 h-full flex flex-col transition-all duration-200 p-2 relative">
      {/* Logo */}
      <div className="px-4 py-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg ring-1 ring-white/10">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              WriteAI Pro
            </h1>
            <p className="text-xs text-gray-400 font-medium">
              AI Writing Platform
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="px-3 pb-5">
        <div className="relative group">
          <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 group-hover:text-gray-300 transition-colors" />
          <input
            type="text"
            placeholder="Search projects, templates..."
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-900/50 backdrop-blur-sm text-gray-100 placeholder-gray-500 rounded-xl border border-gray-800 focus:border-gray-700 focus:ring-1 focus:ring-gray-700 focus:outline-none transition-all duration-200"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3">
        <ul className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onSectionChange(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-left transition-all duration-200 font-medium text-sm ${
                    activeSection === item.id
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg ring-1 ring-white/20"
                      : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Section */}
      <div className="px-3 pt-3 space-y-4">
        <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent opacity-50"></div>
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-xl transition-all duration-200 text-sm font-medium"
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
          <span className="font-medium">
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </span>
        </button>

        {/* Notifications */}
        <button className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:text-white hover:bg-gray-600 dark:hover:bg-gray-700 rounded-xl transition-all duration-200 relative">
          <Bell className="w-5 h-5" />
          <span className="font-medium">Notifications</span>
          <span className="absolute top-2 left-6 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-full flex items-center gap-3 p-3 hover:bg-gray-600 dark:hover:bg-gray-700 rounded-xl transition-all duration-200"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-white">
                {profile?.full_name || user.email}
              </p>
              <p className="text-xs text-gray-400 capitalize">
                {profile?.plan_type || "Free"} Plan
              </p>
            </div>
          </button>

          {showUserMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowUserMenu(false)}
              />
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-gray-600 dark:bg-gray-700 rounded-xl shadow-lg border border-gray-500 dark:border-gray-600 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-500 dark:border-gray-600">
                  <p className="text-sm font-medium text-white">
                    {profile?.full_name || "User"}
                  </p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </div>

                <button
                  onClick={() => {
                    onSectionChange("settings");
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-500 dark:hover:bg-gray-600 hover:text-white transition-colors"
                >
                  <SettingsIcon className="w-4 h-4" />
                  Settings
                </button>

                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-red-900/20 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>

        {/* Upgrade Card */}
        {profile?.plan_type === "free" && (
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-4 text-white">
            <h3 className="font-semibold text-sm mb-1">Upgrade to Pro</h3>
            <p className="text-xs text-blue-100 mb-3">
              Unlimited access to all tools
            </p>
            <button className="w-full bg-white/20 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-white/30 transition-all duration-200">
              Subscribe Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}