import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { 
  MessageSquare, 
  Users, 
  Settings, 
  BarChart3, 
  LogOut,
  Smartphone
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { LanguageSelector } from './LanguageSelector';
import { ThemeToggle } from './ui/theme-toggle';

const sidebarItems = [
  {
    key: 'dashboard',
    icon: MessageSquare,
    path: '/',
    badge: null
  },
  {
    key: 'contacts',
    icon: Users,
    path: '/contacts',
    badge: null
  },
  {
    key: 'analytics',
    icon: BarChart3,
    path: '/analytics',
    badge: 'Pro'
  },
  {
    key: 'settings',
    icon: Settings,
    path: '/settings',
    badge: null
  }
];

export const DashboardSidebar: React.FC = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActivePath = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="h-full w-64 bg-background/50 backdrop-blur-sm border-r flex flex-col">
      {/* Logo/Brand */}
      <div className="p-6 border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
            <Smartphone className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg">{t('dashboard.title')}</h1>
            <p className="text-xs text-muted-foreground">Chat Management</p>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 p-4">
        <nav className="space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActivePath(item.path);
            
            return (
              <Button
                key={item.key}
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-11",
                  isActive && "bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20",
                  isRTL && "flex-row-reverse"
                )}
                onClick={() => navigate(item.path)}
              >
                <Icon className="w-5 h-5" />
                <span className="flex-1 text-left">{t(`nav.${item.key}`)}</span>
                {item.badge && (
                  <Badge variant="secondary" className="text-xs">
                    {item.badge}
                  </Badge>
                )}
              </Button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t space-y-4">
        <div className="flex items-center justify-center gap-2">
          <LanguageSelector />
          <ThemeToggle />
        </div>
        
        <Separator />
        
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950",
            isRTL && "flex-row-reverse"
          )}
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5" />
          <span className="flex-1 text-left">{t('nav.logout')}</span>
        </Button>
      </div>
    </div>
  );
};