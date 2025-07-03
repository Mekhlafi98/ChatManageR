const { Client, LocalAuth } = require('whatsapp-web.js');

const userId = process.argv[2];

const client = new Client({
    authStrategy: new LocalAuth({ clientId: userId }),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

client.on('message', async (message) => {
    try {
        const chat = await message.getChat();
        const contact = await message.getContact();
        process.send({ 
            from: message.from,
            to: message.to,
            body: message.body,
            timestamp: message.timestamp,
            author: message.author,
            deviceType: message.deviceType,
            isForwarded: message.isForwarded,
            isStatus: message.isStatus,
            isStarred: message.isStarred,
            broadcast: message.broadcast,
            fromMe: message.fromMe,
            hasQuotedMsg: message.hasQuotedMsg,
            hasMedia: message.hasMedia,
            links: message.links,
            location: message.location,
            vCards: message.vCards,
            mentionedIds: message.mentionedIds,
            id: message.id._serialized,
            ack: message.ack,
            chat: {
                id: chat.id._serialized,
                name: chat.name,
                isGroup: chat.isGroup,
                isReadOnly: chat.isReadOnly,
                unreadCount: chat.unreadCount,
                timestamp: chat.timestamp,
                archived: chat.archived,
                pinned: chat.pinned,
                isMuted: chat.isMuted,
                muteExpiration: chat.muteExpiration
            },
            contact: {
                id: contact.id._serialized,
                number: contact.number,
                isBusiness: contact.isBusiness,
                isEnterprise: contact.isEnterprise,
                isMe: contact.isMe,
                isMyContact: contact.isMyContact,
                isUser: contact.isUser,
                isWAContact: contact.isWAContact,
                name: contact.name,
                pushname: contact.pushname,
                shortName: contact.shortName
            }
        });
    } catch (error) {
        console.error('Failed to process message:', error);
    }
});

client.initialize();