import api from './api';

export interface Message {
  _id: string;
  contactId: string;
  content: string;
  timestamp: string;
  isOutgoing: boolean;
  status: 'sent' | 'delivered' | 'read';
  messageType: 'text' | 'image' | 'document';
}

// Description: Get messages for a specific contact
// Endpoint: GET /api/messages/:contactId
// Request: { contactId: string, page?: number, limit?: number }
// Response: { messages: Message[], hasMore: boolean }
export const getMessages = async (contactId: string, page = 1, limit = 50) => {
  try {
    const response = await api.get(`/api/messages/${contactId}?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Send a message to a contact
// Endpoint: POST /api/messages
// Request: { contactId: string, content: string, messageType: 'text' | 'image' | 'document' }
// Response: { success: boolean, message: Message }
export const sendMessage = async (contactId: string, content: string, messageType: 'text' | 'image' | 'document' = 'text') => {
  try {
    const response = await api.post('/api/messages', { contactId, content, messageType });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Mark messages as read
// Endpoint: PUT /api/messages/read
// Request: { contactId: string, messageIds: string[] }
// Response: { success: boolean }
export const markMessagesAsRead = async (contactId: string, messageIds: string[]) => {
  try {
    const response = await api.put('/api/messages/read', { contactId, messageIds });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};