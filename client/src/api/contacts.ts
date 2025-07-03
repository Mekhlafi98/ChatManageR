import api from './api';

export interface Contact {
  _id: string;
  name: string;
  phone: string;
  profilePicture?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
  isOnline: boolean;
  lastSeen?: string;
  tags?: string[];
}

// Description: Get all WhatsApp contacts
// Endpoint: GET /api/contacts
// Request: {}
// Response: { contacts: Contact[] }
export const getContacts = async () => {
  // Mocking the response
  return new Promise<{ contacts: Contact[] }>((resolve) => {
    setTimeout(() => {
      resolve({
        contacts: [
          {
            _id: '1',
            name: 'أحمد محمد',
            phone: '+966501234567',
            profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
            lastMessage: 'مرحباً، كيف حالك؟',
            lastMessageTime: '2024-01-15T10:30:00Z',
            unreadCount: 2,
            isOnline: true,
            tags: ['عميل', 'مهم']
          },
          {
            _id: '2',
            name: 'Sarah Johnson',
            phone: '+1234567890',
            profilePicture: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
            lastMessage: 'Thanks for the quick response!',
            lastMessageTime: '2024-01-15T09:15:00Z',
            unreadCount: 0,
            isOnline: false,
            lastSeen: '2024-01-15T08:45:00Z',
            tags: ['customer']
          },
          {
            _id: '3',
            name: 'فاطمة العلي',
            phone: '+966507654321',
            lastMessage: 'شكراً لك على المساعدة',
            lastMessageTime: '2024-01-14T16:20:00Z',
            unreadCount: 1,
            isOnline: false,
            lastSeen: '2024-01-14T18:30:00Z',
            tags: ['عميل محتمل']
          },
          {
            _id: '4',
            name: 'Mike Chen',
            phone: '+8613912345678',
            profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
            lastMessage: 'Let me know when you are available',
            lastMessageTime: '2024-01-14T14:10:00Z',
            unreadCount: 0,
            isOnline: true,
            tags: ['business']
          },
          {
            _id: '5',
            name: 'نورا السعد',
            phone: '+966509876543',
            lastMessage: 'متى يمكننا الاجتماع؟',
            lastMessageTime: '2024-01-13T11:45:00Z',
            unreadCount: 3,
            isOnline: false,
            lastSeen: '2024-01-13T12:00:00Z',
            tags: ['VIP', 'عميل']
          }
        ]
      });
    }, 800);
  });
  
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get('/api/contacts');
  // } catch (error: any) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Sync contacts from WhatsApp
// Endpoint: POST /api/contacts/sync
// Request: {}
// Response: { success: boolean, message: string, syncedCount: number }
export const syncContacts = async () => {
  // Mocking the response
  return new Promise<{ success: boolean; message: string; syncedCount: number }>((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Contacts synced successfully',
        syncedCount: 12
      });
    }, 2000);
  });
  
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.post('/api/contacts/sync');
  // } catch (error: any) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Search contacts by name or phone
// Endpoint: GET /api/contacts/search
// Request: { query: string }
// Response: { contacts: Contact[] }
export const searchContacts = async (query: string) => {
  // Mocking the response
  return new Promise<{ contacts: Contact[] }>((resolve) => {
    setTimeout(() => {
      const allContacts = [
        {
          _id: '1',
          name: 'أحمد محمد',
          phone: '+966501234567',
          profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          lastMessage: 'مرحباً، كيف حالك؟',
          lastMessageTime: '2024-01-15T10:30:00Z',
          unreadCount: 2,
          isOnline: true,
          tags: ['عميل', 'مهم']
        },
        {
          _id: '2',
          name: 'Sarah Johnson',
          phone: '+1234567890',
          profilePicture: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
          lastMessage: 'Thanks for the quick response!',
          lastMessageTime: '2024-01-15T09:15:00Z',
          unreadCount: 0,
          isOnline: false,
          lastSeen: '2024-01-15T08:45:00Z',
          tags: ['customer']
        }
      ];
      
      const filtered = allContacts.filter(contact => 
        contact.name.toLowerCase().includes(query.toLowerCase()) ||
        contact.phone.includes(query)
      );
      
      resolve({ contacts: filtered });
    }, 300);
  });
  
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get(`/api/contacts/search?query=${encodeURIComponent(query)}`);
  // } catch (error: any) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};