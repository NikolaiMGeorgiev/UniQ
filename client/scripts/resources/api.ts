import { Room, Student, ResponseType, UserTeacher, UserStudent, RoomSchedule } from './types.js'

const apiRoute = 'http://localhost:8080'
const token = localStorage.getItem("accessToken");

type LoginType = (params: BodyInit) => Promise<ResponseType<UserStudent | UserTeacher>>
export const login: LoginType = async (params) => {
    const response = await fetch(`${apiRoute}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
        headers: { 'Content-Type': 'application/json' },
        mode: 'cors',
    })

    return await response.json()
}

type GetRooms = () => Promise<ResponseType<Room[]>>
export const getRooms: GetRooms = async () => {
    const response = await fetch(`${apiRoute}/api/rooms`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
        mode: 'cors'
    });

    const responseParsed = await response.json();
    return {
        success: true,
        error: null,
        data: responseParsed.data
    }
}

type FetchRoomsType = () => Promise<ResponseType<Room[]>>
export const fetchRooms: FetchRoomsType = async () => {
    // const response = await fetch(`${apiRoute}/rooms`, {
    //     method: 'GET',
    //     mode: 'cors'
    // })

    // return response.json();
    return {
        success: true,
        error: null,
        data: []//rooms
    }
}

type FetchRoomType = (id: string) => Promise<ResponseType<RoomSchedule | undefined>>
export const fetchRoom: FetchRoomType = async (id) => {
    const response = await fetch(`${apiRoute}/api/rooms/${id}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
        mode: 'cors'
    })

    const responseParsed = await response.json();
    return {
        success: true,
        error: null,
        data: responseParsed.data
    }
}

type CreateRoomType = (roomData: BodyInit) => Promise<ResponseType<null>>
export const createRoom: CreateRoomType = async (roomData) => {
    const response = await fetch(`${apiRoute}/api/rooms`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json'  },
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
    const response = await fetch(`${apiRoute}/api/rooms/${id}`, {
        method: 'PUT',
        mode: 'cors',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: roomData,
    })

    return response.json()
}

export const deleteRoom = async (id: string) => {
    const response = await fetch(`${apiRoute}/api/rooms/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
        mode: 'cors',
    })

    return response.json()
}

export const callNextStudent = async (roomId: string, data: BodyInit) => {
    const response = await fetch(`${apiRoute}/api/queue/next/${roomId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        mode: 'cors',
        body: data
    })

    return response.json()
}

type FetchStudentsType = () => Promise<ResponseType<Student[]>>
export const fetchStudents: FetchStudentsType = async () => {
    const response = await fetch(`${apiRoute}/students`, {
        method: 'GET',
        mode: 'cors'
    })

    const responseParsed = await response.json();

    return {
        success: true,
        error: null,
        data: responseParsed.data,
    }
}
