import { io } from 'socket.io-client'
import { CreateRoom, UpdateRoom } from './types'

type EmitArgs = {
    event: 'deleteRoom',
    data: string
} | {
    event: 'updateRoom',
    data: CreateRoom | UpdateRoom
}

  
export const createSocket = () => {
    const socket = io(import.meta.env.VITE_SERVER_URL)

    return {
        emit: ({ event, data }: EmitArgs) => socket.emit(event, data),
        on: (...args: Parameters<typeof socket.on>) => socket.on(...args)
    }
}
