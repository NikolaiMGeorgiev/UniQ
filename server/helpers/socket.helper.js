import { Server } from 'socket.io';
import { decodeToken, encodeToken } from './reqest-helper.js';
import { QueueModel } from '../models/queue-model.js';

export class SocketHelper {
    constructor(server, db) {
        this.io = new Server(server);
        this.db = db;
        this.sockets = {};
        this.queueHabndler = new QueueModel(db);
    }

    initSocket() {
        const io = this.io;
        io.on('connection', (socket) => {
            console.log('A user connected', socket.id);
            const { roomId } = socket.handshake.query;
            const { token, role } = socket.handshake.auth;
            const userId = decodeToken(token).id;
            socket.join(roomId);
            
            if (role === 'teacher' || !userId) {
                return;
            }

            io.to(roomId).emit('student joined queue', userId);

            socket.on('disconnect', () => {
                socket.leave(roomId);

                if (role === 'student') {
                    io.to(roomId).emit('student left queue', userId);
                    this.queueHabndler.remove({ roomId, studentId: userId });
                }

                console.log('User disconnected', userId);
            });
        });
    }

    sendResource(resourceData) {
        const { studentId, roomId, link } = resourceData;
        const token = encodeToken(studentId);
        this.io.to(roomId).emit('receive resource', {resource: link, userToken: token });
    }

    updateRoomStatus(roomId, status) {
        this.io.to(roomId).emit('room status update', status);
    }
}