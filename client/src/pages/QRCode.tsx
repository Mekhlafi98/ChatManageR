import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSocket } from '@/contexts/SocketContext';
import { getWhatsAppConnections, connectWhatsAppConnection, WhatsAppConnection } from '@/api/whatsapp';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/useToast';
import { QrCode, RefreshCw, ArrowLeft, Smartphone, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export const QRCode: React.FC = () => {
  const { connectionId } = useParams<{ connectionId: string }>();
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const { socket, isConnected } = useSocket();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [connection, setConnection] = useState<WhatsAppConnection | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);

  useEffect(() => {
    if (connectionId) {
      loadConnection();
    }
  }, [connectionId]);

  // Listen for Socket.IO events
  useEffect(() => {
    if (!socket || !connection) return;

    const handleQRCode = (data: any) => {
      console.log('QR Code received via Socket.IO:', data);
      if (data.sessionId === connection.name) {
        setQrCode(data.qr);
        toast({
          title: t('common.success'),
          description: 'QR Code received successfully',
        });
      }
    };

    const handleStateChange = (data: any) => {
      console.log('State change received via Socket.IO:', data);
      if (data.sessionId === connection.name) {
        if (data.state === 'CONNECTED') {
          setConnection(prev => prev ? { ...prev, sessionStatus: 'connected' } : null);
          toast({
            title: t('common.success'),
            description: 'WhatsApp connected successfully!',
          });
          // Navigate to dashboard after successful connection
          setTimeout(() => navigate('/'), 2000);
        } else if (data.state === 'QRCODE') {
          setConnection(prev => prev ? { ...prev, sessionStatus: 'qr_required' } : null);
        }
      }
    };

    const handleStatusFind = (data: any) => {
      console.log('Status find received via Socket.IO:', data);
      if (data.sessionId === connection.name) {
        // Handle status updates
      }
    };

    // Listen for events
    socket.on('qr_code', handleQRCode);
    socket.on('state_change', handleStateChange);
    socket.on('status_find', handleStatusFind);

    // Cleanup listeners
    return () => {
      socket.off('qr_code', handleQRCode);
      socket.off('state_change', handleStateChange);
      socket.off('status_find', handleStatusFind);
    };
  }, [socket, connection, toast, t, navigate]);

  const loadConnection = async () => {
    try {
      setLoading(true);
      const response = await getWhatsAppConnections();
      const foundConnection = response.connections.find(c => c._id === connectionId);

      if (foundConnection) {
        setConnection(foundConnection);

        // If connection doesn't have QR code but needs one, generate it
        if (foundConnection.sessionStatus === 'qr_required' && !foundConnection.qrCode) {
          await handleRefreshQR();
        }
      } else {
        toast({
          title: t('common.error'),
          description: 'Connection not found',
          variant: 'destructive',
        });
        navigate('/settings');
      }
    } catch (error: any) {
      console.error('Error loading connection:', error);
      toast({
        title: t('common.error'),
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshQR = async () => {
    if (!connection) return;

    try {
      setRefreshing(true);
      setQrCode(null); // Clear existing QR code
      const response = await connectWhatsAppConnection(connection._id);

      if (response.success) {
        toast({
          title: t('common.success'),
          description: 'QR Code generation started. Please wait...',
        });
        // QR code will be received via Socket.IO
      }
    } catch (error: any) {
      console.error('Error refreshing QR code:', error);
      toast({
        title: t('common.error'),
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className={cn("h-screen flex", isRTL && "flex-row-reverse")}>
        <DashboardSidebar />
        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-background to-secondary/20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!connection) {
    return (
      <div className={cn("h-screen flex", isRTL && "flex-row-reverse")}>
        <DashboardSidebar />
        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-background to-secondary/20">
          <div className="text-center space-y-4">
            <QrCode className="w-16 h-16 mx-auto text-muted-foreground" />
            <h2 className="text-2xl font-bold">Connection Not Found</h2>
            <Button onClick={() => navigate('/settings')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Settings
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("h-screen flex", isRTL && "flex-row-reverse")}>
      <DashboardSidebar />

      <div className="flex-1 overflow-y-auto bg-gradient-to-br from-background to-secondary/20">
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/settings')}
              className="shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">WhatsApp QR Code</h1>
              <p className="text-muted-foreground">
                Scan the QR code with WhatsApp to connect "{connection.name}"
              </p>
            </div>
          </div>

          {/* Connection Status */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="w-5 h-5" />
                    {connection.name}
                  </CardTitle>
                  <CardDescription>
                    {connection.phone || 'Phone number will appear after connection'}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={isConnected ? 'default' : 'destructive'}
                    className="text-xs"
                  >
                    {isConnected ? 'Socket Connected' : 'Socket Disconnected'}
                  </Badge>
                  <Badge
                    variant={connection.sessionStatus === 'connected' ? 'default' : 'secondary'}
                    className="flex items-center gap-1"
                  >
                    {connection.sessionStatus === 'connected' && (
                      <CheckCircle className="w-3 h-3" />
                    )}
                    {connection.sessionStatus === 'connected' ? 'Connected' :
                      connection.sessionStatus === 'connecting' ? 'Connecting...' :
                        connection.sessionStatus === 'qr_required' ? 'QR Code Required' : 'Disconnected'}
                  </Badge>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* QR Code Display */}
          {connection.sessionStatus === 'connected' ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
                <CheckCircle className="w-16 h-16 text-green-500" />
                <h2 className="text-2xl font-bold text-green-600">Successfully Connected!</h2>
                <p className="text-muted-foreground text-center">
                  Your WhatsApp account "{connection.name}" is now connected and ready to use.
                </p>
                <Button
                  onClick={() => navigate('/')}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                >
                  Go to Dashboard
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <QrCode className="w-5 h-5" />
                      Scan QR Code
                    </CardTitle>
                    <CardDescription>
                      Use WhatsApp on your phone to scan this QR code
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleRefreshQR}
                    disabled={refreshing}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className={cn("w-4 h-4", refreshing && "animate-spin")} />
                    {refreshing ? 'Refreshing...' : 'Refresh QR'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center space-y-6">
                  {/* QR Code */}
                  <div className="bg-white p-6 rounded-2xl shadow-lg border-4 border-green-100">
                    {qrCode ? (
                      <img
                        src={qrCode.startsWith('data:') ? qrCode : `data:image/png;base64,${qrCode}`}
                        alt="WhatsApp QR Code"
                        className="w-64 h-64 rounded-lg"
                      />
                    ) : (
                      <div className="w-64 h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                        <div className="text-center space-y-2">
                          <QrCode className="w-12 h-12 mx-auto text-gray-400" />
                          <p className="text-gray-500">
                            {refreshing ? 'Generating QR Code...' : 'Waiting for QR Code...'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Instructions */}
                  <div className="max-w-md text-center space-y-4">
                    <h3 className="text-lg font-semibold">How to scan:</h3>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-start gap-3 text-left">
                        <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                          1
                        </div>
                        <p>Open WhatsApp on your phone</p>
                      </div>
                      <div className="flex items-start gap-3 text-left">
                        <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                          2
                        </div>
                        <p>Go to Settings → Linked Devices</p>
                      </div>
                      <div className="flex items-start gap-3 text-left">
                        <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                          3
                        </div>
                        <p>Tap "Link a Device" and scan this QR code</p>
                      </div>
                    </div>
                  </div>

                  {/* Auto-refresh notice */}
                  <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 max-w-md">
                    <p className="text-sm text-blue-700 dark:text-blue-300 text-center">
                      <strong>Note:</strong> QR codes expire after a few minutes.
                      If the code doesn't work, click "Refresh QR" to generate a new one.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};