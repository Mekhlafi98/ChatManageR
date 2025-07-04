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

export interface CreateContactRequest {
  name: string;
  phone: string;
  profilePicture?: string;
  tags?: string[];
}

// Description: Get all WhatsApp contacts
// Endpoint: GET /api/contacts
// Request: {}
// Response: { contacts: Contact[] }
export const getContacts = async () => {
  try {
    const response = await api.get('/api/contacts');
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Create a new contact
// Endpoint: POST /api/contacts
// Request: CreateContactRequest
// Response: { success: boolean, contact: Contact }
export const createContact = async (data: CreateContactRequest) => {
  try {
    const response = await api.post('/api/contacts', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Sync contacts from WhatsApp
// Endpoint: POST /api/contacts/sync
// Request: {}
// Response: { success: boolean, message: string, syncedCount: number }
export const syncContacts = async () => {
  try {
    const response = await api.post('/api/contacts/sync');
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Search contacts by name or phone
// Endpoint: GET /api/contacts/search
// Request: { query: string }
// Response: { contacts: Contact[] }
export const searchContacts = async (query: string) => {
  try {
    const response = await api.get(`/api/contacts/search?query=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Check if a contact exists by phone number
// Endpoint: GET /api/contacts/check/:phone
// Request: { phone: string }
// Response: { exists: boolean, contact?: Contact }
export const checkContactExists = async (phone: string) => {
  try {
    const response = await api.get(`/api/contacts/check/${encodeURIComponent(phone)}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};