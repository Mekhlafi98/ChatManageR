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
  // Mocking the response
  return new Promise<{ messages: Message[]; hasMore: boolean }>((resolve) => {
    setTimeout(() => {
      const mockMessages: Message[] = [
        {
          _id: '1',
          contactId,
          content: 'مرحباً، كيف يمكنني مساعدتك اليوم؟',
          timestamp: '2024-01-15T08:00:00Z',
          isOutgoing: true,
          status: 'read',
          messageType: 'text'
        },
        {
          _id: '2',
          contactId,
          content: 'أحتاج إلى معلومات حول المنتج الجديد',
          timestamp: '2024-01-15T08:05:00Z',
          isOutgoing: false,
          status: 'delivered',
          messageType: 'text'
        },
        {
          _id: '3',
          contactId,
          content: 'بالطبع! سأرسل لك جميع التفاصيل الآن',
          timestamp: '2024-01-15T08:10:00Z',
          isOutgoing: true,
          status: 'read',
          messageType: 'text'
        },
        {
          _id: '4',
          contactId,
          content: 'شكراً لك على الاستجابة السريعة',
          timestamp: '2024-01-15T08:15:00Z',
          isOutgoing: false,
          status: 'delivered',
          messageType: 'text'
        },
        {
          _id: '5',
          contactId,
          content: 'عفواً، نحن هنا لخدمتك دائماً',
          timestamp: '2024-01-15T08:20:00Z',
          isOutgoing: true,
          status: 'sent',
          messageType: 'text'
        }
      ];
      
      resolve({
        messages: mockMessages,
        hasMore: false
      });
    }, 500);
  });
  
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get(`/api/messages/${contactId}?page=${page}&limit=${limit}`);
  // } catch (error: any) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Send a message to a contact
// Endpoint: POST /api/messages
// Request: { contactId: string, content: string, messageType: 'text' | 'image' | 'document' }
// Response: { success: boolean, message: Message }
export const sendMessage = async (contactId: string, content: string, messageType: 'text' | 'image' | 'document' = 'text') => {
  // Mocking the response
  return new Promise<{ success: boolean; message: Message }>((resolve) => {
    setTimeout(() => {
      const newMessage: Message = {
        _id: Date.now().toString(),
        contactId,
        content,
        timestamp: new Date().toISOString(),
        isOutgoing: true,
        status: 'sent',
        messageType
      };
      
      resolve({
        success: true,
        message: newMessage
      });
    }, 1000);
  });
  
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.post('/api/messages', { contactId, content, messageType });
  // } catch (error: any) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Mark messages as read
// Endpoint: PUT /api/messages/read
// Request: { contactId: string, messageIds: string[] }
// Response: { success: boolean }
export const markMessagesAsRead = async (contactId: string, messageIds: string[]) => {
  // Mocking the response
  return new Promise<{ success: boolean }>((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 300);
  });
  
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.put('/api/messages/read', { contactId, messageIds });
  // } catch (error: any) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};