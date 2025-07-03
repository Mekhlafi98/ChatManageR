const { Client, LocalAuth } = require('whatsapp-web.js');
const { fork } = require('child_process');

class WhatsAppService {
    constructor() {
        this.clients = new Map();
    }

    createClient(userId) {
        if (this.clients.has(userId)) {
            return this.getClient(userId);
        }

        const client = new Client({
            authStrategy: new LocalAuth({ clientId: userId }),
            puppeteer: {
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            }
        });

        this.clients.set(userId, { client, childProcess: null });

        return client;
    }

    getClient(userId) {
        return this.clients.get(userId)?.client;
    }

    initializeClient(userId, io) {
        const clientData = this.clients.get(userId);
        if (!clientData || !clientData.client) {
            throw new Error('Client not created for this user.');
        }

        const { client } = clientData;

        client.on('qr', (qr) => {
            io.emit('qr', { qr });
        });

        client.on('ready', () => {
            io.emit('ready');
            console.log('Client is ready!');
        });

        client.on('authenticated', () => {
            io.emit('authenticated');
            console.log('Authenticated!');
        });

        client.on('auth_failure', (msg) => {
            io.emit('auth_failure', { message: msg });
            console.error('Authentication failure', msg);
        });

        client.on('disconnected', (reason) => {
            io.emit('disconnected', { reason });
            this.clients.delete(userId);
        });

        const childProcess = fork('./services/whatsappChild.js', [userId]);
        childProcess.on('message', (msg) => {
            io.emit('message', msg);
        });
        clientData.childProcess = childProcess;

        client.initialize();
    }

    async destroyClient(userId) {
        const clientData = this.clients.get(userId);
        if (clientData && clientData.client) {
            await clientData.client.destroy();
            if (clientData.childProcess) {
                clientData.childProcess.kill();
            }
            this.clients.delete(userId);
        }
    }
}

module.exports = new WhatsAppService();