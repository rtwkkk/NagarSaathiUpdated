import { useState } from 'react';
import { Search, Bell, Sun, Moon, User } from 'lucide-react';
import { useDarkMode } from '../contexts/dark-mode-context';
import { useAuth } from '../contexts/auth-context';
import { NotificationDropdown } from './notification-dropdown';
import { ProfileSidebar } from './profile-sidebar';

interface DashboardHeaderProps {
  onNavigateToSettings: (tab: string) => void;
}

export function DashboardHeader({ onNavigateToSettings }: DashboardHeaderProps) {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const { user, signOut } = useAuth();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileSidebarOpen, setProfileSidebarOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);

  const handleSignOut = () => {
    if (confirm('Are you sure you want to sign out?')) {
      signOut();
    }
  };

  const handleNavigateToSettings = (tab: string) => {
    onNavigateToSettings('settings');
    // Need to wait for settings view to render before setting active tab
    setTimeout(() => {
      const event = new CustomEvent('settingsTabChange', { detail: { tab } });
      window.dispatchEvent(event);
    }, 100);
  };

  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-[#2a2a3e] border-b-2 border-gray-300 dark:border-[#f3f3f5] shadow-md">
      <div className="h-[73px] px-6 flex items-center justify-between">
        {/* Left: Search Bar */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-[#f3f3f5]" />
            <input
              type="text"
              placeholder="Search incidents, locations, or teams..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-[#2a2a3e] border-2 border-gray-300 dark:border-[#f3f3f5] rounded-lg text-sm dark:text-white dark:placeholder-[#f3f3f5]/60 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Right: Profile Section with Notifications & Dark Mode Toggle */}
        <div className="flex items-center gap-4">
          {/* Notification Bell with Badge */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className={`relative p-2.5 rounded-lg transition-all duration-200 ${
                notificationsOpen 
                  ? 'bg-blue-100 dark:bg-blue-900/30 ring-2 ring-blue-500' 
                  : 'bg-gray-50 dark:bg-[#1a1a2e] hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-gray-200 dark:border-[#f3f3f5]/20 hover:border-blue-300 dark:hover:border-blue-500'
              }`}
              aria-label="View notifications"
            >
              <Bell className={`w-5 h-5 ${notificationsOpen ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-[#f3f3f5]'}`} />
              
              {/* Red Notification Badge */}
              {notificationCount > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-[#2a2a3e] animate-pulse">
                  <span className="text-white text-xs font-bold">{notificationCount}</span>
                </div>
              )}
            </button>

            {/* Notification Dropdown */}
            <NotificationDropdown 
              isOpen={notificationsOpen} 
              onClose={() => setNotificationsOpen(false)} 
            />
          </div>

          {/* Dark Mode Toggle - Adjusted Size */}
          <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 dark:bg-[#1a1a2e] rounded-lg border border-gray-200 dark:border-[#f3f3f5]/20">
            <Sun className={`w-5 h-5 transition-colors ${darkMode ? 'text-gray-400' : 'text-yellow-600'}`} />
            <button
              onClick={toggleDarkMode}
              className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
                darkMode ? 'bg-blue-600 shadow-lg shadow-blue-500/50' : 'bg-gray-300'
              }`}
              aria-label="Toggle dark mode"
            >
              <div
                className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform duration-300 shadow-md ${
                  darkMode ? 'translate-x-7' : 'translate-x-0'
                }`}
              ></div>
            </button>
            <Moon className={`w-5 h-5 transition-colors ${darkMode ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`} />
          </div>

          {/* Profile Section - Clickable with Hover State */}
          <button
            onClick={() => setProfileSidebarOpen(true)}
            className={`flex items-center gap-3 pl-4 border-l-2 border-gray-300 dark:border-[#f3f3f5]/20 transition-all duration-200 ${
              profileSidebarOpen
                ? 'bg-blue-50 dark:bg-blue-900/20 -mr-6 pr-6 py-2 rounded-l-lg ring-2 ring-blue-500'
                : 'hover:bg-gray-50 dark:hover:bg-[#1a1a2e] -mr-6 pr-6 py-2 rounded-l-lg'
            }`}
            aria-label="Open profile sidebar"
          >
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{user?.name || 'Admin User'}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">{user?.role || 'Super Administrator'}</p>
            </div>
            <div className={`w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center shadow-md transition-transform duration-200 ${
              profileSidebarOpen ? 'scale-110 ring-2 ring-white dark:ring-[#2a2a3e]' : 'hover:scale-105'
            }`}>
              <User className="w-5 h-5 text-white" />
            </div>
          </button>
        </div>
      </div>

      {/* Profile Sidebar */}
      <ProfileSidebar 
        isOpen={profileSidebarOpen} 
        onClose={() => setProfileSidebarOpen(false)}
        onNavigateToSettings={handleNavigateToSettings}
      />
    </header>
  );
}