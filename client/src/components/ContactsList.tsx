import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import { Contact, getContacts, syncContacts, searchContacts } from '@/api/contacts';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';
import { Skeleton } from './ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Search, RefreshCw, Circle, Plus, Phone } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { cn } from '@/lib/utils';

interface ContactsListProps {
  selectedContactId?: string;
  onContactSelect: (contact: Contact) => void;
}

export const ContactsList: React.FC<ContactsListProps> = ({
  selectedContactId,
  onContactSelect
}) => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const { toast } = useToast();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [showAddNumberDialog, setShowAddNumberDialog] = useState(false);
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const [newContactName, setNewContactName] = useState('');
  const [addingContact, setAddingContact] = useState(false);

  useEffect(() => {
    loadContacts();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      handleSearch();
    } else {
      loadContacts();
    }
  }, [searchQuery]);

  const loadContacts = async () => {
    try {
      console.log('Loading contacts...');
      setLoading(true);
      const response = await getContacts();
      setContacts(response.contacts);
      console.log('Contacts loaded:', response.contacts.length);
    } catch (error: any) {
      console.error('Error loading contacts:', error);
      toast({
        title: t('common.error'),
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    try {
      console.log('Syncing contacts...');
      setSyncing(true);
      const response = await syncContacts();
      toast({
        title: t('common.success'),
        description: `${response.syncedCount} contacts synced`,
      });
      await loadContacts();
    } catch (error: any) {
      console.error('Error syncing contacts:', error);
      toast({
        title: t('common.error'),
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSyncing(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      console.log('Searching contacts:', searchQuery);
      setSearching(true);
      const response = await searchContacts(searchQuery);
      setContacts(response.contacts);
    } catch (error: any) {
      console.error('Error searching contacts:', error);
      toast({
        title: t('common.error'),
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSearching(false);
    }
  };

  const handleAddContact = async () => {
    if (!newPhoneNumber.trim()) {
      toast({
        title: t('common.error'),
        description: 'Please enter a phone number',
        variant: 'destructive',
      });
      return;
    }

    try {
      setAddingContact(true);
      
      // Create a new contact object
      const newContact: Contact = {
        _id: Date.now().toString(),
        name: newContactName.trim() || newPhoneNumber,
        phone: newPhoneNumber.trim(),
        unreadCount: 0,
        isOnline: false,
        tags: ['manual']
      };

      // Add to contacts list
      setContacts(prev => [newContact, ...prev]);
      
      // Select the new contact
      onContactSelect(newContact);
      
      // Reset form
      setNewPhoneNumber('');
      setNewContactName('');
      setShowAddNumberDialog(false);
      
      toast({
        title: t('common.success'),
        description: 'Contact added successfully',
      });
    } catch (error: any) {
      console.error('Error adding contact:', error);
      toast({
        title: t('common.error'),
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setAddingContact(false);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return t('common.yesterday');
    } else {
      return date.toLocaleDateString();
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

  const validatePhoneNumber = (phone: string) => {
    // Basic phone number validation
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-4 border-b">
          <Skeleton className="h-10 w-full mb-3" />
          <Skeleton className="h-9 w-full" />
        </div>
        <div className="flex-1 p-4 space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background/50 backdrop-blur-sm">
      {/* Header */}
      <div className="p-4 border-b bg-background/80 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-3">
          <div className="relative flex-1">
            <Search className={cn(
              "absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground",
              isRTL ? "right-3" : "left-3"
            )} />
            <Input
              placeholder={t('contacts.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                "bg-background/50",
                isRTL ? "pr-10" : "pl-10"
              )}
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={handleSync}
            disabled={syncing}
            className="shrink-0"
          >
            <RefreshCw className={cn("h-4 w-4", syncing && "animate-spin")} />
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleSync}
            disabled={syncing}
            className="flex-1"
          >
            {syncing ? t('common.loading') : t('contacts.syncContacts')}
          </Button>
          
          <Dialog open={showAddNumberDialog} onOpenChange={setShowAddNumberDialog}>
            <DialogTrigger asChild>
              <Button
                variant="default"
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Number
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-background">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Add Phone Number
                </DialogTitle>
                <DialogDescription>
                  Enter a phone number to start a new conversation
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="phone-number">Phone Number *</Label>
                  <Input
                    id="phone-number"
                    placeholder="+1234567890"
                    value={newPhoneNumber}
                    onChange={(e) => setNewPhoneNumber(e.target.value)}
                    className="mt-1"
                    dir="ltr"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Include country code (e.g., +1 for US, +966 for Saudi Arabia)
                  </p>
                </div>
                <div>
                  <Label htmlFor="contact-name">Contact Name (Optional)</Label>
                  <Input
                    id="contact-name"
                    placeholder="Enter contact name"
                    value={newContactName}
                    onChange={(e) => setNewContactName(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddNumberDialog(false);
                    setNewPhoneNumber('');
                    setNewContactName('');
                  }}
                  disabled={addingContact}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddContact}
                  disabled={!newPhoneNumber.trim() || !validatePhoneNumber(newPhoneNumber) || addingContact}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                >
                  {addingContact ? 'Adding...' : 'Add Contact'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Contacts List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {contacts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {t('contacts.noContacts')}
            </div>
          ) : (
            contacts.map((contact) => (
              <div
                key={contact._id}
                onClick={() => onContactSelect(contact)}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-accent/50 mb-1",
                  selectedContactId === contact._id && "bg-accent border border-primary/20",
                  "group"
                )}
              >
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={contact.profilePicture} alt={contact.name} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                      {getInitials(contact.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className={cn(
                    "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background",
                    contact.isOnline ? "bg-green-500" : "bg-gray-400"
                  )}>
                    <Circle className="w-full h-full" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-sm truncate" dir="auto">
                      {contact.name}
                    </h3>
                    <div className="flex items-center gap-1 shrink-0">
                      {contact.lastMessageTime && (
                        <span className="text-xs text-muted-foreground">
                          {formatTime(contact.lastMessageTime)}
                        </span>
                      )}
                      {contact.unreadCount > 0 && (
                        <Badge variant="default" className="bg-green-500 hover:bg-green-600 text-white text-xs min-w-[20px] h-5 rounded-full flex items-center justify-center">
                          {contact.unreadCount > 99 ? '99+' : contact.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground truncate flex-1" dir="auto">
                      {contact.lastMessage || contact.phone}
                    </p>
                  </div>

                  {contact.tags && contact.tags.length > 0 && (
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {contact.tags.slice(0, 2).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {contact.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{contact.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-2 mt-1">
                    <span className={cn(
                      "text-xs flex items-center gap-1",
                      contact.isOnline ? "text-green-600" : "text-muted-foreground"
                    )}>
                      <Circle className="w-2 h-2 fill-current" />
                      {contact.isOnline ? t('contacts.online') :
                        contact.lastSeen ? `${t('contacts.lastSeen')} ${formatTime(contact.lastSeen)}` :
                        t('contacts.offline')
                      }
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};