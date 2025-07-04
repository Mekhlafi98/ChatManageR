// src/socket.js
let io = null;

module.exports = {
    init: (server) => {
        io = require('socket.io')(server, {
            cors: {
                origin: '*', // or specify frontend origin
                methods: ['GET', 'POST'],
            },
        });

        io.on('connection', (socket) => {
            console.log('New client connected:', socket.id);

            socket.on('disconnect', () => {
                console.log('Client disconnected:', socket.id);
            });
        });

        return io;
    },

    get: () => io,
};
