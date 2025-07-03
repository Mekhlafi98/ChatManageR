import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { getWhatsAppConnections, createWhatsAppConnection, WhatsAppStatus, CreateConnectionRequest } from '@/api/whatsapp';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { WhatsAppConnectionCard } from '@/components/WhatsAppConnectionCard';
import { WhatsAppConnectionForm } from '@/components/WhatsAppConnectionForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/useToast';
import { Smartphone, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Settings: React.FC = () => {
  const { t } = useTranslation();
  const { language, setLanguage, isRTL } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [whatsappStatus, setWhatsappStatus] = useState<WhatsAppStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadWhatsAppConnections();
  }, []);

  const loadWhatsAppConnections = async () => {
    try {
      console.log('Loading WhatsApp connections...');
      setLoading(true);
      const status = await getWhatsAppConnections();
      setWhatsappStatus(status);
      console.log('WhatsApp connections loaded:', status);
    } catch (error: any) {
      console.error('Error loading WhatsApp connections:', error);
      toast({
        title: t('common.error'),
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateConnection = async (data: CreateConnectionRequest) => {
    try {
      console.log('Creating new WhatsApp connection:', data);
      setCreating(true);
      const response = await createWhatsAppConnection(data);

      if (response.success) {
        toast({
          title: t('common.success'),
          description: response.message,
        });
        setShowCreateDialog(false);
        await loadWhatsAppConnections();
        
        // Navigate to QR code page if QR is required
        if (response.connection.sessionStatus === 'qr_required') {
          navigate(`/qr/${response.connection._id}`);
        }
      }
    } catch (error: any) {
      console.error('Error creating WhatsApp connection:', error);
      toast({
        title: t('common.error'),
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className={cn("h-screen flex", isRTL && "flex-row-reverse")}>
      <DashboardSidebar />

      <div className="flex-1 overflow-y-auto bg-gradient-to-br from-background to-secondary/20">
        <div className="max-w-6xl mx-auto p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{t('settings.title')}</h1>
            <p className="text-muted-foreground mt-2">
              Manage your WhatsApp connections and application preferences
            </p>
          </div>

          {/* WhatsApp Connections */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="w-5 h-5" />
                    WhatsApp Connections
                  </CardTitle>
                  <CardDescription>
                    Manage multiple WhatsApp accounts with webhook and signal configuration
                  </CardDescription>
                </div>
                <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Connection
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-background max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Create New WhatsApp Connection</DialogTitle>
                      <DialogDescription>
                        Add a new WhatsApp account with webhook and signal configuration
                      </DialogDescription>
                    </DialogHeader>
                    <WhatsAppConnectionForm
                      onSubmit={handleCreateConnection}
                      onCancel={() => setShowCreateDialog(false)}
                      loading={creating}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : whatsappStatus?.connections.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Smartphone className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No WhatsApp connections found</p>
                  <p className="text-sm">Create your first connection to get started</p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {whatsappStatus?.connections.map((connection) => (
                    <WhatsAppConnectionCard
                      key={connection._id}
                      connection={connection}
                      isActive={connection._id === whatsappStatus.activeConnectionId}
                      onUpdate={loadWhatsAppConnections}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Language Settings */}
          <Card>
            <CardHeader>
              <CardTitle>{t('settings.language')}</CardTitle>
              <CardDescription>
                Choose your preferred language for the interface
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="language-en" className="flex items-center gap-2 cursor-pointer">
                  <span>English</span>
                </Label>
                <Switch
                  id="language-en"
                  checked={language === 'en'}
                  onCheckedChange={() => setLanguage('en')}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="language-ar" className="flex items-center gap-2 cursor-pointer">
                  <span>العربية (Arabic)</span>
                </Label>
                <Switch
                  id="language-ar"
                  checked={language === 'ar'}
                  onCheckedChange={() => setLanguage('ar')}
                />
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle>{t('settings.notifications')}</CardTitle>
              <CardDescription>
                Configure notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="browser-notifications" className="flex flex-col gap-1 cursor-pointer">
                  <span>Browser Notifications</span>
                  <span className="text-sm text-muted-foreground">
                    Get notified when new messages arrive
                  </span>
                </Label>
                <Switch id="browser-notifications" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="sound-notifications" className="flex flex-col gap-1 cursor-pointer">
                  <span>Sound Notifications</span>
                  <span className="text-sm text-muted-foreground">
                    Play sound when receiving messages
                  </span>
                </Label>
                <Switch id="sound-notifications" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="desktop-notifications" className="flex flex-col gap-1 cursor-pointer">
                  <span>Desktop Notifications</span>
                  <span className="text-sm text-muted-foreground">
                    Show notifications on desktop
                  </span>
                </Label>
                <Switch id="desktop-notifications" />
              </div>
            </CardContent>
          </Card>

          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle>{t('settings.profile')}</CardTitle>
              <CardDescription>
                Manage your profile information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-reply" className="flex flex-col gap-1 cursor-pointer">
                  <span>Auto Reply</span>
                  <span className="text-sm text-muted-foreground">
                    Automatically reply to new messages
                  </span>
                </Label>
                <Switch id="auto-reply" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="read-receipts" className="flex flex-col gap-1 cursor-pointer">
                  <span>Read Receipts</span>
                  <span className="text-sm text-muted-foreground">
                    Send read receipts for messages
                  </span>
                </Label>
                <Switch id="read-receipts" defaultChecked />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};