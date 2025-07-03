import api from './api';

export interface WhatsAppConnection {
  _id: string;
  name: string;
  phone?: string;
  isConnected: boolean;
  qrCode?: string;
  sessionStatus: 'disconnected' | 'connecting' | 'connected' | 'qr_required';
  lastConnected?: string;
  isDefault?: boolean;
  webhookUrl?: string;
  webhookEvents?: string[];
  signalsEnabled?: boolean;
  signalConfig?: {
    onMessage?: boolean;
    onAck?: boolean;
    onPresence?: boolean;
    onCall?: boolean;
  };
}

export interface WhatsAppStatus {
  connections: WhatsAppConnection[];
  activeConnectionId?: string;
}

export interface CreateConnectionRequest {
  name: string;
  webhookUrl?: string;
  webhookEvents?: string[];
  signalsEnabled?: boolean;
  signalConfig?: {
    onMessage?: boolean;
    onAck?: boolean;
    onPresence?: boolean;
    onCall?: boolean;
  };
}

export interface UpdateConnectionRequest {
  name?: string;
  webhookUrl?: string;
  webhookEvents?: string[];
  signalsEnabled?: boolean;
  signalConfig?: {
    onMessage?: boolean;
    onAck?: boolean;
    onPresence?: boolean;
    onCall?: boolean;
  };
}

// Description: Get all WhatsApp connections
// Endpoint: GET /api/whatsapp/connections
// Request: {}
// Response: WhatsAppStatus
export const getWhatsAppConnections = async () => {
  // Mocking the response
  return new Promise<WhatsAppStatus>((resolve) => {
    setTimeout(() => {
      resolve({
        connections: [
          {
            _id: '1',
            name: 'Business Account',
            phone: '+966501234567',
            isConnected: true,
            sessionStatus: 'connected',
            lastConnected: '2024-01-15T10:00:00Z',
            isDefault: true,
            webhookUrl: 'https://api.example.com/webhook',
            webhookEvents: ['message', 'ack', 'presence'],
            signalsEnabled: true,
            signalConfig: {
              onMessage: true,
              onAck: true,
              onPresence: false,
              onCall: true
            }
          },
          {
            _id: '2',
            name: 'Personal Account',
            phone: '+966507654321',
            isConnected: false,
            sessionStatus: 'disconnected',
            lastConnected: '2024-01-14T15:30:00Z',
            webhookUrl: '',
            webhookEvents: [],
            signalsEnabled: false,
            signalConfig: {
              onMessage: false,
              onAck: false,
              onPresence: false,
              onCall: false
            }
          }
        ],
        activeConnectionId: '1'
      });
    }, 500);
  });

  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get('/api/whatsapp/connections');
  // } catch (error: any) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Create a new WhatsApp connection
// Endpoint: POST /api/whatsapp/connections
// Request: CreateConnectionRequest
// Response: { success: boolean, connection: WhatsAppConnection, message: string }
export const createWhatsAppConnection = async (data: CreateConnectionRequest) => {
  // Mocking the response
  return new Promise<{ success: boolean; connection: WhatsAppConnection; message: string }>((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        connection: {
          _id: Date.now().toString(),
          name: data.name,
          isConnected: false,
          sessionStatus: 'qr_required',
          qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
          webhookUrl: data.webhookUrl || '',
          webhookEvents: data.webhookEvents || [],
          signalsEnabled: data.signalsEnabled || false,
          signalConfig: data.signalConfig || {
            onMessage: false,
            onAck: false,
            onPresence: false,
            onCall: false
          }
        },
        message: 'Connection created successfully. Please scan QR code.'
      });
    }, 1000);
  });

  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.post('/api/whatsapp/connections', data);
  // } catch (error: any) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Update a WhatsApp connection
// Endpoint: PUT /api/whatsapp/connections/:connectionId
// Request: UpdateConnectionRequest
// Response: { success: boolean, connection: WhatsAppConnection, message: string }
export const updateWhatsAppConnection = async (connectionId: string, data: UpdateConnectionRequest) => {
  // Mocking the response
  return new Promise<{ success: boolean; connection: WhatsAppConnection; message: string }>((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        connection: {
          _id: connectionId,
          name: data.name || 'Updated Connection',
          isConnected: false,
          sessionStatus: 'disconnected',
          webhookUrl: data.webhookUrl || '',
          webhookEvents: data.webhookEvents || [],
          signalsEnabled: data.signalsEnabled || false,
          signalConfig: data.signalConfig || {
            onMessage: false,
            onAck: false,
            onPresence: false,
            onCall: false
          }
        },
        message: 'Connection updated successfully.'
      });
    }, 500);
  });

  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.put(`/api/whatsapp/connections/${connectionId}`, data);
  // } catch (error: any) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Connect a specific WhatsApp connection
// Endpoint: POST /api/whatsapp/connections/:connectionId/connect
// Request: { connectionId: string }
// Response: { success: boolean, qrCode?: string, message: string }
export const connectWhatsAppConnection = async (connectionId: string) => {
  // Mocking the response
  return new Promise<{ success: boolean; qrCode?: string; message: string }>((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
        message: 'QR Code generated. Please scan with WhatsApp.'
      });
    }, 1000);
  });

  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.post(`/api/whatsapp/connections/${connectionId}/connect`);
  // } catch (error: any) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Disconnect a specific WhatsApp connection
// Endpoint: POST /api/whatsapp/connections/:connectionId/disconnect
// Request: { connectionId: string }
// Response: { success: boolean, message: string }
export const disconnectWhatsAppConnection = async (connectionId: string) => {
  // Mocking the response
  return new Promise<{ success: boolean; message: string }>((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'WhatsApp connection disconnected successfully'
      });
    }, 500);
  });

  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.post(`/api/whatsapp/connections/${connectionId}/disconnect`);
  // } catch (error: any) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Delete a WhatsApp connection
// Endpoint: DELETE /api/whatsapp/connections/:connectionId
// Request: { connectionId: string }
// Response: { success: boolean, message: string }
export const deleteWhatsAppConnection = async (connectionId: string) => {
  // Mocking the response
  return new Promise<{ success: boolean; message: string }>((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Connection deleted successfully'
      });
    }, 500);
  });

  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.delete(`/api/whatsapp/connections/${connectionId}`);
  // } catch (error: any) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Set active WhatsApp connection
// Endpoint: PUT /api/whatsapp/connections/:connectionId/activate
// Request: { connectionId: string }
// Response: { success: boolean, message: string }
export const setActiveConnection = async (connectionId: string) => {
  // Mocking the response
  return new Promise<{ success: boolean; message: string }>((resolve) => {
    setTimeout(() => {
      const connection = mockConnections.find(c => c._id === connectionId);
      if (connection) {
        activeConnectionId = connectionId;
        resolve({
          success: true,
          message: 'Active connection updated successfully'
        });
      } else {
        resolve({
          success: false,
          message: 'Connection not found.'
        });
      }
    }, 300);
  });

  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.put(`/api/whatsapp/connections/${connectionId}/activate`);
  // } catch (error: any) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Legacy functions for backward compatibility
export const getWhatsAppStatus = async () => {
  const connections = await getWhatsAppConnections();
  const activeConnection = connections.connections.find(c => c._id === connections.activeConnectionId);
  
  return {
    isConnected: activeConnection?.isConnected || false,
    sessionStatus: activeConnection?.sessionStatus || 'disconnected',
    lastConnected: activeConnection?.lastConnected,
    qrCode: activeConnection?.qrCode
  };
};

export const connectWhatsApp = async () => {
  const connections = await getWhatsAppConnections();
  const activeConnection = connections.connections.find(c => c._id === connections.activeConnectionId);
  
  if (activeConnection) {
    return await connectWhatsAppConnection(activeConnection._id);
  }
  
  throw new Error('No active connection found');
};

export const disconnectWhatsApp = async () => {
  const connections = await getWhatsAppConnections();
  const activeConnection = connections.connections.find(c => c._id === connections.activeConnectionId);
  
  if (activeConnection) {
    return await disconnectWhatsAppConnection(activeConnection._id);
  }
  
  throw new Error('No active connection found');
};