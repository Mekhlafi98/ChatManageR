import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { WhatsAppConnection, connectWhatsAppConnection, disconnectWhatsAppConnection, deleteWhatsAppConnection, setActiveConnection, updateWhatsAppConnection, UpdateConnectionRequest } from '@/api/whatsapp';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { WhatsAppConnectionForm } from './WhatsAppConnectionForm';
import { useToast } from '@/hooks/useToast';
import { Smartphone, Wifi, WifiOff, QrCode, CheckCircle, AlertCircle, Trash2, Star, StarOff, Settings, Webhook, Signal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WhatsAppConnectionCardProps {
  connection: WhatsAppConnection;
  isActive: boolean;
  onUpdate: () => void;
}

export const WhatsAppConnectionCard: React.FC<WhatsAppConnectionCardProps> = ({
  connection,
  isActive,
  onUpdate
}) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [connecting, setConnecting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const handleConnect = async () => {
    try {
      setConnecting(true);
      const response = await connectWhatsAppConnection(connection._id);

      if (response.success) {
        toast({
          title: t('common.success'),
          description: response.message,
        });

        // Navigate to QR code page
        navigate(`/qr/${connection._id}`);
        onUpdate();
      }
    } catch (error: any) {
      toast({
        title: t('common.error'),
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      setDisconnecting(true);
      const response = await disconnectWhatsAppConnection(connection._id);

      if (response.success) {
        toast({
          title: t('common.success'),
          description: response.message,
        });
        onUpdate();
      }
    } catch (error: any) {
      toast({
        title: t('common.error'),
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setDisconnecting(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      const response = await deleteWhatsAppConnection(connection._id);

      if (response.success) {
        toast({
          title: t('common.success'),
          description: response.message,
        });
        onUpdate();
      }
    } catch (error: any) {
      toast({
        title: t('common.error'),
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleSetActive = async () => {
    try {
      const response = await setActiveConnection(connection._id);

      if (response.success) {
        toast({
          title: t('common.success'),
          description: response.message,
        });
        onUpdate();
      }
    } catch (error: any) {
      toast({
        title: t('common.error'),
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleUpdate = async (data: UpdateConnectionRequest) => {
    try {
      setUpdating(true);
      const response = await updateWhatsAppConnection(connection._id, data);

      if (response.success) {
        toast({
          title: t('common.success'),
          description: response.message,
        });
        setShowEditDialog(false);
        onUpdate();
      }
    } catch (error: any) {
      toast({
        title: t('common.error'),
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleShowQR = () => {
    navigate(`/qr/${connection._id}`);
  };

  const getStatusIcon = () => {
    switch (connection.sessionStatus) {
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'connecting':
        return <Wifi className="w-4 h-4 text-yellow-500 animate-pulse" />;
      case 'qr_required':
        return <QrCode className="w-4 h-4 text-blue-500" />;
      default:
        return <WifiOff className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusText = () => {
    switch (connection.sessionStatus) {
      case 'connected':
        return 'Connected';
      case 'connecting':
        return 'Connecting...';
      case 'qr_required':
        return 'QR Code Required';
      default:
        return 'Disconnected';
    }
  };

  const getStatusColor = () => {
    switch (connection.sessionStatus) {
      case 'connected':
        return 'default';
      case 'connecting':
        return 'secondary';
      case 'qr_required':
        return 'outline';
      default:
        return 'destructive';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-md",
      isActive && "ring-2 ring-green-500/20 bg-green-50/50 dark:bg-green-950/20"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-gradient-to-br from-green-500 to-blue-600 text-white font-semibold">
                {getInitials(connection.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                {connection.name}
                {isActive && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
              </CardTitle>
              {connection.phone && (
                <p className="text-sm text-muted-foreground">{connection.phone}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <Badge variant={getStatusColor() as any} className="text-xs">
              {getStatusText()}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Configuration Status */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <Webhook className="w-3 h-3" />
            <span className={cn(
              connection.webhookUrl ? "text-green-600" : "text-muted-foreground"
            )}>
              Webhook: {connection.webhookUrl ? 'Configured' : 'Not Set'}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Signal className="w-3 h-3" />
            <span className={cn(
              connection.signalsEnabled ? "text-green-600" : "text-muted-foreground"
            )}>
              Signals: {connection.signalsEnabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        </div>

        {connection.webhookEvents && connection.webhookEvents.length > 0 && (
          <div className="flex gap-1 flex-wrap">
            {connection.webhookEvents.slice(0, 3).map((event, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {event}
              </Badge>
            ))}
            {connection.webhookEvents.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{connection.webhookEvents.length - 3}
              </Badge>
            )}
          </div>
        )}

        {connection.lastConnected && (
          <p className="text-xs text-muted-foreground">
            Last connected: {new Date(connection.lastConnected).toLocaleString()}
          </p>
        )}

        <div className="flex gap-2 flex-wrap">
          {connection.sessionStatus === 'connected' ? (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDisconnect}
              disabled={disconnecting}
            >
              {disconnecting ? 'Disconnecting...' : 'Disconnect'}
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={handleConnect}
              disabled={connecting}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
            >
              {connecting ? 'Connecting...' : 'Connect'}
            </Button>
          )}

          {connection.sessionStatus === 'qr_required' && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleShowQR}
              className="flex items-center gap-1"
            >
              <QrCode className="w-4 h-4" />
              Show QR
            </Button>
          )}

          {!isActive && connection.sessionStatus === 'connected' && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSetActive}
            >
              <Star className="w-4 h-4 mr-1" />
              Set Active
            </Button>
          )}

          <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-background max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Connection Settings</DialogTitle>
                <DialogDescription>
                  Update webhook and signal configuration for "{connection.name}"
                </DialogDescription>
              </DialogHeader>
              <WhatsAppConnectionForm
                connection={connection}
                onSubmit={handleUpdate}
                onCancel={() => setShowEditDialog(false)}
                loading={updating}
                isEdit={true}
              />
            </DialogContent>
          </Dialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                disabled={deleting}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-background">
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Connection</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{connection.name}"? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
};