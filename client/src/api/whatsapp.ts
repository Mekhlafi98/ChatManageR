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
  try {
    const response = await api.get('/api/whatsapp/connections');
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Create a new WhatsApp connection
// Endpoint: POST /api/whatsapp/connections
// Request: CreateConnectionRequest
// Response: { success: boolean, connection: WhatsAppConnection, message: string }
export const createWhatsAppConnection = async (data: CreateConnectionRequest) => {
  try {
    console.log('createWhatsAppConnection: Making API call with data:', data);
    const response = await api.post('/api/whatsapp/connections', data);
    console.log('createWhatsAppConnection: API response:', response);
    return response.data;
  } catch (error: any) {
    console.error('createWhatsAppConnection: API error:', error);
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Update a WhatsApp connection
// Endpoint: PUT /api/whatsapp/connections/:connectionId
// Request: UpdateConnectionRequest
// Response: { success: boolean, connection: WhatsAppConnection, message: string }
export const updateWhatsAppConnection = async (connectionId: string, data: UpdateConnectionRequest) => {
  try {
    const response = await api.put(`/api/whatsapp/connections/${connectionId}`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Connect a specific WhatsApp connection
// Endpoint: POST /api/whatsapp/connections/:connectionId/connect
// Request: { connectionId: string }
// Response: { success: boolean, qrCode?: string, message: string }
export const connectWhatsAppConnection = async (connectionId: string) => {
  try {
    const response = await api.post(`/api/whatsapp/connections/${connectionId}/connect`);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Disconnect a specific WhatsApp connection
// Endpoint: POST /api/whatsapp/connections/:connectionId/disconnect
// Request: { connectionId: string }
// Response: { success: boolean, message: string }
export const disconnectWhatsAppConnection = async (connectionId: string) => {
  try {
    const response = await api.post(`/api/whatsapp/connections/${connectionId}/disconnect`);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Delete a WhatsApp connection
// Endpoint: DELETE /api/whatsapp/connections/:connectionId
// Request: { connectionId: string }
// Response: { success: boolean, message: string }
export const deleteWhatsAppConnection = async (connectionId: string) => {
  try {
    const response = await api.delete(`/api/whatsapp/connections/${connectionId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Set active WhatsApp connection
// Endpoint: PUT /api/whatsapp/connections/:connectionId/activate
// Request: { connectionId: string }
// Response: { success: boolean, message: string }
export const setActiveConnection = async (connectionId: string) => {
  try {
    return await api.put(`/api/whatsapp/connections/${connectionId}/activate`);
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Legacy functions for backward compatibility
export const getWhatsAppStatus = async () => {
  const connectionsData = await getWhatsAppConnections();
  const activeConnection = connectionsData.connections.find((c: WhatsAppConnection) => c._id === connectionsData.activeConnectionId);

  return {
    isConnected: activeConnection?.isConnected || false,
    sessionStatus: activeConnection?.sessionStatus || 'disconnected',
    lastConnected: activeConnection?.lastConnected,
    qrCode: activeConnection?.qrCode
  };
};

export const connectWhatsApp = async () => {
  const connectionsData = await getWhatsAppConnections();
  const activeConnection = connectionsData.connections.find((c: WhatsAppConnection) => c._id === connectionsData.activeConnectionId);

  if (activeConnection) {
    return await connectWhatsAppConnection(activeConnection._id);
  }

  throw new Error('No active connection found');
};

export const disconnectWhatsApp = async () => {
  const connectionsData = await getWhatsAppConnections();
  const activeConnection = connectionsData.connections.find((c: WhatsAppConnection) => c._id === connectionsData.activeConnectionId);

  if (activeConnection) {
    return await disconnectWhatsAppConnection(activeConnection._id);
  }

  throw new Error('No active connection found');
};