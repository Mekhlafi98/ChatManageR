import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import { CreateConnectionRequest, UpdateConnectionRequest, WhatsAppConnection } from '@/api/whatsapp';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Webhook, Signal, Settings2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WhatsAppConnectionFormProps {
  connection?: WhatsAppConnection;
  onSubmit: (data: CreateConnectionRequest | UpdateConnectionRequest) => void;
  onCancel: () => void;
  loading?: boolean;
  isEdit?: boolean;
}

const WEBHOOK_EVENTS = [
  { key: 'message', label: 'Messages', description: 'Receive message events' },
  { key: 'ack', label: 'Message Status', description: 'Message delivery status updates' },
  { key: 'presence', label: 'Presence', description: 'Online/offline status changes' },
  { key: 'call', label: 'Calls', description: 'Incoming call notifications' },
  { key: 'group', label: 'Groups', description: 'Group-related events' },
  { key: 'contact', label: 'Contacts', description: 'Contact updates' }
];

export const WhatsAppConnectionForm: React.FC<WhatsAppConnectionFormProps> = ({
  connection,
  onSubmit,
  onCancel,
  loading = false,
  isEdit = false
}) => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const [formData, setFormData] = useState<CreateConnectionRequest>({
    name: connection?.name || '',
    webhookUrl: connection?.webhookUrl || '',
    webhookEvents: connection?.webhookEvents || [],
    signalsEnabled: connection?.signalsEnabled || false,
    signalConfig: connection?.signalConfig || {
      onMessage: false,
      onAck: false,
      onPresence: false,
      onCall: false
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('WhatsAppConnectionForm: Form submitted with data:', formData);
    onSubmit(formData);
  };

  const handleWebhookEventToggle = (eventKey: string) => {
    setFormData(prev => ({
      ...prev,
      webhookEvents: prev.webhookEvents?.includes(eventKey)
        ? prev.webhookEvents.filter(e => e !== eventKey)
        : [...(prev.webhookEvents || []), eventKey]
    }));
  };

  const handleSignalConfigChange = (key: keyof typeof formData.signalConfig, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      signalConfig: {
        ...prev.signalConfig,
        [key]: value
      }
    }));
  };

  return (
    <div className={cn(isRTL && "rtl")} dir={isRTL ? "rtl" : "ltr"}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
              <Settings2 className="w-5 h-5" />
              Basic Configuration
            </CardTitle>
            <CardDescription>
              Configure the basic settings for your WhatsApp connection
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="connection-name">Connection Name *</Label>
              <Input
                id="connection-name"
                placeholder="e.g., Business Account, Personal Account"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="mt-1"
                required
                dir="auto"
              />
            </div>
          </CardContent>
        </Card>

        {/* Webhook Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
              <Webhook className="w-5 h-5" />
              Webhook Configuration
            </CardTitle>
            <CardDescription>
              Configure webhook URL and events for real-time notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="webhook-url">Webhook URL</Label>
              <Input
                id="webhook-url"
                type="url"
                placeholder="https://your-domain.com/webhook"
                value={formData.webhookUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, webhookUrl: e.target.value }))}
                className="mt-1"
                dir="ltr"
              />
              <p className="text-xs text-muted-foreground mt-1">
                URL where webhook events will be sent. Leave empty to disable webhooks.
              </p>
            </div>

            {formData.webhookUrl && (
              <div>
                <Label className="text-sm font-medium">Webhook Events</Label>
                <p className="text-xs text-muted-foreground mb-3">
                  Select which events should be sent to your webhook URL
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {WEBHOOK_EVENTS.map((event) => (
                    <div
                      key={event.key}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
                          <span className="font-medium text-sm">{event.label}</span>
                          {formData.webhookEvents?.includes(event.key) && (
                            <Badge variant="secondary" className="text-xs">Active</Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{event.description}</p>
                      </div>
                      <Switch
                        checked={formData.webhookEvents?.includes(event.key) || false}
                        onCheckedChange={() => handleWebhookEventToggle(event.key)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Signal Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
              <Signal className="w-5 h-5" />
              Signal Configuration
            </CardTitle>
            <CardDescription>
              Configure real-time signal handling for immediate event processing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="signals-enabled" className="text-sm font-medium">
                  Enable Signals
                </Label>
                <p className="text-xs text-muted-foreground">
                  Enable real-time signal processing for instant notifications
                </p>
              </div>
              <Switch
                id="signals-enabled"
                checked={formData.signalsEnabled}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, signalsEnabled: checked }))}
              />
            </div>

            {formData.signalsEnabled && (
              <>
                <Separator />
                <div>
                  <Label className="text-sm font-medium">Signal Events</Label>
                  <p className="text-xs text-muted-foreground mb-3">
                    Configure which events should trigger real-time signals
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="signal-message" className="text-sm">Message Signals</Label>
                        <p className="text-xs text-muted-foreground">Real-time message notifications</p>
                      </div>
                      <Switch
                        id="signal-message"
                        checked={formData.signalConfig?.onMessage || false}
                        onCheckedChange={(checked) => handleSignalConfigChange('onMessage', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="signal-ack" className="text-sm">Acknowledgment Signals</Label>
                        <p className="text-xs text-muted-foreground">Message delivery status signals</p>
                      </div>
                      <Switch
                        id="signal-ack"
                        checked={formData.signalConfig?.onAck || false}
                        onCheckedChange={(checked) => handleSignalConfigChange('onAck', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="signal-presence" className="text-sm">Presence Signals</Label>
                        <p className="text-xs text-muted-foreground">Online/offline status signals</p>
                      </div>
                      <Switch
                        id="signal-presence"
                        checked={formData.signalConfig?.onPresence || false}
                        onCheckedChange={(checked) => handleSignalConfigChange('onPresence', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="signal-call" className="text-sm">Call Signals</Label>
                        <p className="text-xs text-muted-foreground">Incoming call signals</p>
                      </div>
                      <Switch
                        id="signal-call"
                        checked={formData.signalConfig?.onCall || false}
                        onCheckedChange={(checked) => handleSignalConfigChange('onCall', checked)}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className={cn("flex gap-3 pt-4", isRTL ? "justify-start" : "justify-end")}>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!formData.name.trim() || loading}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
          >
            {loading ? (isEdit ? 'Updating...' : 'Creating...') : (isEdit ? 'Update Connection' : 'Create Connection')}
          </Button>
        </div>
      </form>
    </div>
  );
};