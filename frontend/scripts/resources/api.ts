import { rooms } from "./testData";
import { Room } from "./types";

const apiRoute = './api';

type ResponseType<T> = {
    success: boolean
    error: {
        message: string
    } | null
    data: T
}

// TODO: add better typing
type LoginType = (params: BodyInit) => Promise<ResponseType<null>>
export const login: LoginType = async (params) => {
    const response = await fetch(`${apiRoute}/login`, {
        method: 'POST',
        body: params,
        mode: 'cors'
    });
    
    return response.json();
}

type RegisterType = (params: BodyInit) => Promise<ResponseType<null>>
export const register: RegisterType = async (params) => {
    const response = await fetch(`${apiRoute}/register`, {
        method: 'POST',
        body: params,
        mode: 'cors'
    });
    
    return response.json();
}

type FetchRoomsType = () => Promise<ResponseType<Room[]>>
export const fetchRooms: FetchRoomsType = async () => {
    // const response = await fetch(`localhost:3000/api/rooms`, {
    //     method: 'GET',
    //     mode: 'cors'
    // })

    // return response.json();
    return {
        success: true,
        error: null,
        data: rooms
    }
}

type FetchRoomType = (id: string) => Promise<ResponseType<Room | undefined>>
export const fetchRoom: FetchRoomType = async (id) => {
    // const response = await fetch(`localhost:3000/api/room/${id}`, {
    //     method: 'GET',
    //     mode: 'cors'
    // })

    // return response.json();

    return {
        success: true,
        error: null,
        data: rooms.find((room) => room.id === id)
    }
}