import { isUserStudent } from '../utils/user.js'
import { CreateRoom, UpdateRoom } from './types.js'

type EmitArgs = {
    event: 'deleteRoom',
    data: string
} | {
    event: 'updateRoom',
    data: CreateRoom | UpdateRoom
} | {
    event: 'getRoomStudents',
    data: string
} | {
    event: 'getRoomStudent',
    data: string
}

export const createSocket = (roomId: string) => {
    const token = localStorage.getItem("accessToken")
    const role = localStorage.getItem("role")
    // @ts-ignore
    const socket = io('http://localhost:8080/', { query: {roomId}, auth: {token, role} });

    socket.on('student joined queue', (userId: string) => {
        console.log('student joined queue', userId)
    })

    socket.on('student left queue', (userId: string) => {
        console.log('student left queue - T', userId)
    })

    return {
        emit: ({ event, data }: EmitArgs) => socket.emit(event, data),
        on: (...args: Parameters<typeof socket.on>) => socket.on(...args)
    }
}
