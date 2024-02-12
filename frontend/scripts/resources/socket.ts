import { io } from 'socket.io-client'
import { CreateRoom, UpdateRoom } from './types'

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

  
export const createSocket = (query?: Record<string, any>) => {
    const socket = io(import.meta.env.VITE_SERVER_URL, { query })

    return {
        emit: ({ event, data }: EmitArgs) => socket.emit(event, data),
        on: (...args: Parameters<typeof socket.on>) => socket.on(...args)
    }
}
