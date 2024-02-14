export const statuses = [
    'not-started', 'active', 'break', 'closed'
] as const
export type Status = typeof statuses[number]

export type Room = {
    id: string
    name: string
    creatorId: string
    startTime: string
    type: RoomType
    status: Status
    turnDuration: number
    description: string
}

export const roomTypes = [
    'schedule',
    'queue'
] as const
export type RoomType = typeof roomTypes[number]

export type Schedule = {
    studentId: string
    position: number
    finished: boolean
}

export type RoomSchedule = {
    roomData: Room
    schedule: Schedule[]
}

export type CreateRoom = Omit<Room, 'id'> & {
    studentIds: string[]
}

export type UpdateRoom = Partial<Room> & {
    studentIds?: string[]
}

type User = {
    id: string
    email: string
    name: string
    password: string
    token: string
}

export type UserStudent = User & {
    role: 'student'
}

export type UserTeacher = User & {
    role: 'teacher'
}

export type ResponseType<T> = {
    success: true
    data: T
} | {
    success: false
    error: {
        message: string
    }
}

export type Student = {
    id: string
    name: string
    facultyNumber: string
}

export type Login = { email: string, password: string }