import { rooms, students } from './testData'
import { Room, Student, Teacher, ResponseType } from './types'

const apiRoute = './api'

// TODO: add better typing
type LoginType = (params: BodyInit) => Promise<ResponseType<Student | Teacher>>
export const login: LoginType = async (params) => {
    const response = await fetch(`${apiRoute}/login`, {
        method: 'POST',
        body: params,
        mode: 'cors',
    })

    return response.json()
}

type RegisterType = (params: BodyInit) => Promise<ResponseType<null>>
export const register: RegisterType = async (params) => {
    const response = await fetch(`${apiRoute}/register`, {
        method: 'POST',
        body: params,
        mode: 'cors',
    })

    return response.json()
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
        data: rooms,
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
        data: rooms.find((room) => room.id === id),
    }
}

type CreateRoomType = (roomData: BodyInit) => Promise<ResponseType<null>>
export const createRoom: CreateRoomType = async (roomData) => {
    const response = await fetch(`localhost:3000/api/room`, {
        method: 'POST',
        mode: 'cors',
        body: roomData,
    })

    return response.json()
}

type UpdateRoomType = (
    id: string,
    roomData: BodyInit
) => Promise<ResponseType<null>>
export const updateRoom: UpdateRoomType = async (id, roomData) => {
    const response = await fetch(`localhost:3000/api/room/${id}`, {
        method: 'PUT',
        mode: 'cors',
        body: roomData,
    })

    return response.json()
}

type DeleteRoomType = (id: string) => Promise<ResponseType<null>>
export const deleteRoom: DeleteRoomType = async (id) => {
    const response = await fetch(`localhost:3000/api/room/${id}`, {
        method: 'DELETE',
        mode: 'cors',
    })

    return response.json()
}

type FetchStudentsType = () => Promise<ResponseType<Student[]>>
export const fetchStudents: FetchStudentsType = async () => {
    // const response = await fetch(`localhost:3000/api/students`, {
    //     method: 'GET',
    //     mode: 'cors'
    // })

    // return response.json();

    return {
        success: true,
        error: null,
        data: students,
    }
}
