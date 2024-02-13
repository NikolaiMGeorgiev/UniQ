// import { io } from 'socket.io-client'
import { CreateRoom, UpdateRoom } from './types'

type EmitArgs = {
    event: 'deleteRoom',
    data: string
} | {
    event: 'updateRoom',
    data: CreateRoom | UpdateRoom
}

type UserSocketData = {
    userId: string
}

type RoomSocketData = {
    status: string
}
  
export const createSocket = () => {
    const socket = io('http://localhost:8080/');

    socket.on("user joined room", (data: UserSocketData) => {
        console.log(data.userId);
    });

    socket.on("user left room", (data: UserSocketData) => {
        console.log(data.userId);
    });

    socket.on("room status update", (data: RoomSocketData) => {
        console.log(data.status);
    });

    return {
        emit: ({ event, data }: EmitArgs) => socket.emit(event, data),
        on: (...args: Parameters<typeof socket.on>) => socket.on(...args)
    }
}
