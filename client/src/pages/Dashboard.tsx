import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Contact } from '@/api/contacts';
import { ContactsList } from '@/components/ContactsList';
import { ChatArea } from '@/components/ChatArea';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

export const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const [selectedContact, setSelectedContact] = useState<Contact | undefined>();

  console.log('Dashboard rendered, selected contact:', selectedContact?._id);

  return (
    <div className={cn("h-screen flex", isRTL && "flex-row-reverse")}>
      {/* Sidebar */}
      <DashboardSidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Contacts Panel */}
        <div className="w-80 border-r">
          <ContactsList
            selectedContactId={selectedContact?._id}
            onContactSelect={setSelectedContact}
          />
        </div>
        
        {/* Chat Area */}
        <div className="flex-1">
          <ChatArea contact={selectedContact} />
        </div>
      </div>
    </div>
  );
};