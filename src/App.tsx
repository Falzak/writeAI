import React, { useState } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { Sidebar } from "./components/Sidebar";
import { Dashboard } from "./components/Dashboard";
import { WritingTools } from "./components/WritingTools";
import { WritingEditor } from "./components/WritingEditor";
import { TextToSpeech } from "./components/TextToSpeech";
import { Projects } from "./components/Projects";
import { Templates } from "./components/Templates";
import { Settings } from "./components/Settings";
import { WritingTool } from "./types";

function AppContent() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [selectedTool, setSelectedTool] = useState<WritingTool | null>(null);

  const handleToolSelect = (tool: WritingTool) => {
    setSelectedTool(tool);
  };

  const handleBackToTools = () => {
    setSelectedTool(null);
    setActiveSection("tools");
  };

  const renderContent = () => {
    if (selectedTool) {
      return <WritingEditor tool={selectedTool} onBack={handleBackToTools} />;
    }

    switch (activeSection) {
      case "dashboard":
        return <Dashboard />;
      case "tools":
        return <WritingTools onToolSelect={handleToolSelect} />;
      case "audio":
        return <TextToSpeech />;
      case "projects":
        return <Projects />;
      case "templates":
        return <Templates />;
      case "settings":
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="h-screen bg-gray-800 dark:bg-gray-900 flex transition-colors duration-200">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      <div className="flex-1 p-2 overflow-hidden">
        <main className="h-full bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ProtectedRoute>
          <AppContent />
        </ProtectedRoute>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
