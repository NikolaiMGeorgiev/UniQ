import { SERVER_URL } from '../../config.js';
import { getUser } from '../models/users-model.js';
import { Server } from 'socket.io';

export class SocketHelper {
    constructor(server, db) {
        this.io = new Server(server);
        this.db = db;
        this.sockets = {};
    }

    initSocket() {
        this.io.on('connection', (socket) => {
            console.log('A user connected');
        
            socket.on('disconnect', () => {
                console.log('User disconnected');
            });
        
            socket.on('room activated', (roomId) => {
                io.emit('chat message', msg);
            });
        });

        /*
        console.log(this.io);
        this.io.on("connection", (socket) => {
            console.log('connected');
        });

        io.on("join room", async (data) => {
            const { userId, roomId } = data;
            const userData = await db.querySingle("users", userId, getUser);
            const publicUserData = {
                id: userId,
                name: userData.name,
                name: userData.anem
            }
            socket.join(roomId);
            socket.to(roomId).emit("user joined room", publicUserData);
        });
        */
    }
}