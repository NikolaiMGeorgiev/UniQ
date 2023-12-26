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
        data: [
            {
                id: '123',
                creatorId: '1',
                name: 'room A',
                description: 'room for an exam',
                startDate: '02-03-2024',
                type: 'non-schedule',
                status: 'active',
                turnDuration: 30,
            },
            {
                id: '124',
                creatorId: '1',
                name: 'room B Asd',
                description: 'room for an exam 2',
                startDate: '02-04-2024',
                type: 'schedule',
                status: 'break',
                turnDuration: 20,
            }
        ]
    }
}