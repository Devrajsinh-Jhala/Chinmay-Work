const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all origins for simplicity in this setup
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Send current state to the newly connected client
    db.getState((err, questions) => {
        if (!err) {
            socket.emit('state_update', questions);
        }
    });

    socket.on('update_state', (newQuestions) => {
        // Save to DB
        db.saveState(newQuestions, (err) => {
            if (err) {
                console.error('Error saving state:', err);
                return;
            }
            // Broadcast to ALL clients (including sender, to confirm persistence/sync)
            io.emit('state_update', newQuestions);
        });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
