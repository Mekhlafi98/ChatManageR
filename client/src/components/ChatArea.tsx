import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import { Contact } from '@/api/contacts';
import { Message, getMessages, sendMessage, markMessagesAsRead } from '@/api/messages';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { Send, Phone, Video, MoreVertical, Circle, Check, CheckCheck } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { cn } from '@/lib/utils';

interface ChatAreaProps {
  contact?: Contact;
}

export const ChatArea: React.FC<ChatAreaProps> = ({ contact }) => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (contact) {
      loadMessages();
    }
  }, [contact]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    if (!contact) return;

    try {
      console.log('Loading messages for contact:', contact._id);
      setLoading(true);
      const response = await getMessages(contact._id);
      setMessages(response.messages);
      
      // Mark messages as read
      const unreadMessages = response.messages.filter(msg => !msg.isOutgoing);
      if (unreadMessages.length > 0) {
        await markMessagesAsRead(contact._id, unreadMessages.map(msg => msg._id));
      }
    } catch (error: any) {
      console.error('Error loading messages:', error);
      toast({
        title: t('common.error'),
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact || !newMessage.trim() || sending) return;

    try {
      console.log('Sending message:', newMessage);
      setSending(true);
      const response = await sendMessage(contact._id, newMessage.trim());
      
      setMessages(prev => [...prev, response.message]);
      setNewMessage('');
      
      toast({
        title: t('common.success'),
        description: 'Message sent successfully',
      });
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: t('common.error'),
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSending(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return t('common.today');
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

  const getStatusIcon = (status: Message['status']) => {
    switch (status) {
      case 'sent':
        return <Check className="w-4 h-4 text-muted-foreground" />;
      case 'delivered':
        return <CheckCheck className="w-4 h-4 text-muted-foreground" />;
      case 'read':
        return <CheckCheck className="w-4 h-4 text-blue-500" />;
      default:
        return null;
    }
  };

  if (!contact) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-background to-secondary/20">
        <div className="text-center space-y-4 max-w-md mx-auto p-8">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.488"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-foreground">{t('dashboard.title')}</h2>
          <p className="text-muted-foreground">{t('dashboard.selectContact')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-background to-secondary/10">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b bg-background/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-10 w-10">
              <AvatarImage src={contact.profilePicture} alt={contact.name} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                {getInitials(contact.name)}
              </AvatarFallback>
            </Avatar>
            <div className={cn(
              "absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background",
              contact.isOnline ? "bg-green-500" : "bg-gray-400"
            )}>
              <Circle className="w-full h-full" />
            </div>
          </div>
          <div>
            <h3 className="font-semibold" dir="auto">{contact.name}</h3>
            <p className="text-sm text-muted-foreground">
              {contact.isOnline ? t('contacts.online') : 
                contact.lastSeen ? `${t('contacts.lastSeen')} ${formatTime(contact.lastSeen)}` : 
                t('contacts.offline')
              }
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Video className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              {messages.map((message, index) => {
                const showDate = index === 0 || 
                  formatDate(messages[index - 1].timestamp) !== formatDate(message.timestamp);
                
                return (
                  <div key={message._id}>
                    {showDate && (
                      <div className="flex justify-center my-4">
                        <Badge variant="secondary" className="text-xs">
                          {formatDate(message.timestamp)}
                        </Badge>
                      </div>
                    )}
                    
                    <div className={cn(
                      "flex",
                      message.isOutgoing ? "justify-end" : "justify-start"
                    )}>
                      <div className={cn(
                        "max-w-[70%] rounded-2xl px-4 py-2 shadow-sm",
                        message.isOutgoing
                          ? "bg-gradient-to-r from-green-500 to-green-600 text-white"
                          : "bg-background border"
                      )}>
                        <p className="text-sm whitespace-pre-wrap break-words" dir="auto">
                          {message.content}
                        </p>
                        <div className={cn(
                          "flex items-center justify-end gap-1 mt-1",
                          message.isOutgoing ? "text-green-100" : "text-muted-foreground"
                        )}>
                          <span className="text-xs">
                            {formatTime(message.timestamp)}
                          </span>
                          {message.isOutgoing && getStatusIcon(message.status)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="p-4 border-t bg-background/80 backdrop-blur-sm">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <Input
            ref={inputRef}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={t('chat.typeMessage')}
            className="flex-1 bg-background/50"
            disabled={sending}
            dir="auto"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!newMessage.trim() || sending}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};