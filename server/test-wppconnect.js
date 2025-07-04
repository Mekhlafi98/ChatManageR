const { create } = require('@wppconnect-team/wppconnect');

async function testWPPConnect() {
    try {
        console.log('Testing WPPConnect...');
        
        // Test creating a client
        const client = await create({
            session: 'test-session',
            catchQR: (base64Qr, asciiQR, attempts, urlCode) => {
                console.log('QR Code generated:', !!base64Qr);
            },
            statusFind: (sessionSession, session) => {
                console.log('Status Find:', sessionSession, session);
            },
            headless: true,
            devtools: false,
            useChrome: true,
            debug: false,
            logQR: true,
            browserWS: '',
            browserArgs: [
                '--disable-web-security',
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--no-first-run',
                '--disable-gpu',
            ],
            puppeteerOptions: {},
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
                    '--disable-web-security',
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--no-first-run',
                    '--disable-gpu',
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
        
        console.log('Client created successfully:', !!client);
        
        // Test destroying client
        await client.close();
        console.log('Client destroyed successfully');
        
        console.log('All tests passed!');
    } catch (error) {
        console.error('Test failed:', error);
    }
}

testWPPConnect(); 