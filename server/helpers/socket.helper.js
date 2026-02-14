import { Server } from 'socket.io';
import { decodeToken } from './reqest-helper.js';
import { QueueModel } from '../models/queue-model.js';
import { DatabaseHelper } from './database-helper.js';

export class SocketHelper {
    constructor(server) {
        this.io = new Server(server);
        this.db = new DatabaseHelper();
        this.sockets = {};
        this.queueHabndler = new QueueModel(this.db);
    }

    initSocket() {
        this.io.on('connection', (socket) => {
            console.log('A user connected', socket.id);
            const { roomId } = socket.handshake.query;
            const { token, role } = socket.handshake.auth;
            const userId = decodeToken(token).id;
            socket.join(roomId);
            
            if (role === 'teacher' || !userId) {
                return;
            }

            this.io.to(roomId).emit('student joined queue', userId);

            socket.on('disconnect', () => {
                socket.leave(roomId);

                if (role === 'student') {
                    this.io.to(roomId).emit('student left queue', userId);
                    this.queueHabndler.remove({ roomId, studentId: userId });
                }

                console.log('User disconnected', userId);
            });
        });
    }

    sendResource(resourceData) {
        const { token, roomId, link } = resourceData;
        this.io.to(roomId.toString()).emit('receive resource', link, token);
    }

    updateRoomStatus(roomId, status) {
        this.io.to(roomId.toString()).emit('room status update', status);
    }
}