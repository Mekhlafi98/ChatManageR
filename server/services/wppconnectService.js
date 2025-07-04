const { create, Whatsapp } = require('@wppconnect-team/wppconnect');

class WPPConnectService {
    constructor() {
        this.clients = new Map();
        this.io = null;
    }

    async createClient(userId, sessionName = null) {
        const sessionId = sessionName || `user_${userId}`;

        if (this.clients.has(sessionId)) {
            return this.clients.get(sessionId);
        }

        try {
            const client = await create({
                session: sessionId,
                catchQR: (base64Qr, asciiQR, attempts, urlCode) => {
                    console.log('QR Code generated for session:', sessionId);
                    console.log('QR Code attempts:', attempts);
                    if (this.io) {
                        this.io.emit('qr_code', {
                            sessionId,
                            qr: base64Qr,
                            asciiQR,
                            attempts,
                            urlCode
                        });
                    }
                },
                statusFind: (sessionSession, session) => {
                    console.log('Status Find:', sessionSession, session);
                    if (this.io) {
                        this.io.emit('status_find', {
                            sessionId,
                            sessionSession,
                            session
                        });
                    }
                },
                headless: true,
                devtools: false,
                useChrome: true,
                debug: false,
                logQR: true,
                browserWS: '',
                browserArgs: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-accelerated-2d-canvas',
                    '--no-first-run',
                    '--no-zygote',
                    '--disable-gpu',
                    '--disable-background-timer-throttling',
                    '--disable-backgrounding-occluded-windows',
                    '--disable-renderer-backgrounding',
                    '--disable-features=TranslateUI',
                    '--disable-ipc-flooding-protection',
                    '--disable-default-apps',
                    '--disable-extensions',
                    '--disable-plugins',
                    '--disable-sync',
                    '--disable-translate',
                    '--hide-scrollbars',
                    '--mute-audio',
                    '--no-default-browser-check',
                    '--safebrowsing-disable-auto-update',
                    '--disable-web-security',
                    '--disable-features=VizDisplayCompositor',
                ],
                puppeteerOptions: {
                    args: [
                        '--no-sandbox',
                        '--disable-setuid-sandbox',
                        '--disable-dev-shm-usage',
                        '--disable-accelerated-2d-canvas',
                        '--no-first-run',
                        '--no-zygote',
                        '--disable-gpu',
                        '--disable-background-timer-throttling',
                        '--disable-backgrounding-occluded-windows',
                        '--disable-renderer-backgrounding',
                        '--disable-features=TranslateUI',
                        '--disable-ipc-flooding-protection',
                        '--disable-default-apps',
                        '--disable-extensions',
                        '--disable-plugins',
                        '--disable-sync',
                        '--disable-translate',
                        '--hide-scrollbars',
                        '--mute-audio',
                        '--no-default-browser-check',
                        '--safebrowsing-disable-auto-update',
                        '--disable-web-security',
                        '--disable-features=VizDisplayCompositor',
                    ],
                    headless: true,
                    ignoreDefaultArgs: ['--disable-extensions'],
                    timeout: 60000,
                },
                disableWelcome: false,
                updatesLog: true,
                autoClose: 60000,
                tokenStore: 'file',
                folderNameToken: './tokens',
                mkdirFolderToken: '',
                webhook: {
                    url: 'http://localhost:3000/api/whatsapp/webhook',
                    autoDownload: true,
                    uploadS3: false,
                    readMessage: true,
                    allUnreadOnStart: false,
                    listenAcks: true,
                    onPresenceChanged: true,
                    onParticipantsChanged: true,
                    onReactionMessage: true,
                    onPollResponse: true,
                    onRevokedMessage: true,
                    onLabelUpdated: true,
                    onSelfMessage: false,
                    webhookByEvents: false,
                    webhookBase64: false,
                },
                webhookByEvents: false,
                webhookBase64: false,
                webhookMedia: false,
                sendMessage: {
                    createChat: true,
                    createGroup: true,
                },
                chatwoot: {
                    endpoint: '',
                    enable: false,
                    agentToken: '',
                    inboxId: '',
                },
                archive: {
                    enable: false,
                    waitTime: 10,
                    daysToArchive: 45,
                },
                log: {
                    level: 'ERROR',
                    color: true,
                },
                createOptions: {
                    useChrome: true,
                    addBrowserArgs: [
                        '--no-sandbox',
                        '--disable-setuid-sandbox',
                        '--disable-dev-shm-usage',
                        '--disable-accelerated-2d-canvas',
                        '--no-first-run',
                        '--no-zygote',
                        '--disable-gpu',
                        '--disable-background-timer-throttling',
                        '--disable-backgrounding-occluded-windows',
                        '--disable-renderer-backgrounding',
                        '--disable-features=TranslateUI',
                        '--disable-ipc-flooding-protection',
                        '--disable-default-apps',
                        '--disable-extensions',
                        '--disable-plugins',
                        '--disable-sync',
                        '--disable-translate',
                        '--hide-scrollbars',
                        '--mute-audio',
                        '--no-default-browser-check',
                        '--safebrowsing-disable-auto-update',
                        '--disable-web-security',
                        '--disable-features=VizDisplayCompositor',
                    ],
                    addBrowserArgsOptions: {
                        userDataDir: './tokens',
                    },
                },
                mapper: {
                    enable: false,
                    prefix: 'tag',
                },
                db: {
                    mongodbDatabase: {
                        url: process.env.MONGODB_URI || 'mongodb://localhost:27017',
                        options: {
                            useUnifiedTopology: true,
                        },
                    },
                    redis: {
                        url: '',
                        options: {},
                    },
                    delOldMessages: {
                        daysOld: 45,
                        deleteMedia: true,
                    },
                },
                cors: {
                    origin: '*',
                    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
                    allowedHeaders: ['Content-Type', 'Authorization'],
                },
            });

            this.clients.set(sessionId, client);
            console.log(`WPPConnect client created for session: ${sessionId}`);

            return client;
        } catch (error) {
            console.error(`Error creating WPPConnect client for session ${sessionId}:`, error);
            throw error;
        }
    }

    getClient(sessionId) {
        return this.clients.get(sessionId);
    }

    async initializeClient(userId, io, sessionName = null) {
        this.io = io;
        const sessionId = sessionName || `user_${userId}`;

        try {
            const client = await this.createClient(userId, sessionName);

            // Set up event listeners using the correct WPPConnect API
            client.onStateChange((state) => {
                console.log(`Session ${sessionId} state changed to:`, state);
                if (this.io) {
                    this.io.emit('state_change', { sessionId, state });
                }
            });

            client.onIncomingCall(async (call) => {
                console.log('Incoming call:', call);
                if (this.io) {
                    this.io.emit('incoming_call', { sessionId, call });
                }
            });

            client.onMessage(async (message) => {
                console.log('New message:', message);
                if (this.io) {
                    this.io.emit('message', { sessionId, message });
                }
            });

            client.onAck(async (ack) => {
                console.log('Message ack:', ack);
                if (this.io) {
                    this.io.emit('ack', { sessionId, ack });
                }
            });

            // Additional event listeners for better debugging
            client.onAnyMessage(async (message) => {
                console.log('Any message event:', message);
                if (this.io) {
                    this.io.emit('any_message', { sessionId, message });
                }
            });

            client.onMessageCreate(async (message) => {
                console.log('Message create event:', message);
                if (this.io) {
                    this.io.emit('message_create', { sessionId, message });
                }
            });

            return client;
        } catch (error) {
            console.error(`Error initializing WPPConnect client for session ${sessionId}:`, error);
            throw error;
        }
    }

    async destroyClient(sessionId) {
        try {
            const client = this.clients.get(sessionId);
            if (client) {
                await client.close();
                this.clients.delete(sessionId);
                console.log(`WPPConnect client destroyed for session: ${sessionId}`);
            }
        } catch (error) {
            console.error(`Error destroying WPPConnect client for session ${sessionId}:`, error);
        }
    }

    async sendMessage(sessionId, chatId, content, options = {}) {
        try {
            const client = this.getClient(sessionId);
            if (!client) {
                throw new Error('Client not found');
            }

            const result = await client.sendText(chatId, content, options);
            return result;
        } catch (error) {
            console.error(`Error sending message from session ${sessionId}:`, error);
            throw error;
        }
    }

    async getContacts(sessionId) {
        try {
            const client = this.getClient(sessionId);
            if (!client) {
                throw new Error('Client not found');
            }

            const contacts = await client.getAllContacts();
            return contacts;
        } catch (error) {
            console.error(`Error getting contacts for session ${sessionId}:`, error);
            throw error;
        }
    }

    async getChats(sessionId) {
        try {
            const client = this.getClient(sessionId);
            if (!client) {
                throw new Error('Client not found');
            }

            const chats = await client.getAllChats();
            return chats;
        } catch (error) {
            console.error(`Error getting chats for session ${sessionId}:`, error);
            throw error;
        }
    }
}

module.exports = new WPPConnectService(); 