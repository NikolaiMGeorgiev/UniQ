export const statuses = [
    'not-started', 'started', 'break', 'closed'
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
    position: number | undefined
    finished: boolean
}

export type RoomSchedule = {
    roomData: Room
    schedule: Schedule[]
}

export type CreateRoom = Omit<Room, 'id'> & {
    students: string[]
}

export type UpdateRoom = Partial<Room> & {
    students?: string[]
}

type User = {
    id: string
    email: string
    name: string
    password: string
    token: string
}

export type UserStudent = User & {
    role: typeof roles[0]
}

export type UserTeacher = User & {
    role: typeof roles[1]
}

export type ResponseType<T> = {
    success: true
    data: T
} | {
    success: false
    message: string
}

export type Student = {
    id: string
    name: string
    facultyNumber: string
}

export type Login = { email: string, password: string }

export const roles = ['student', 'teacher'] as const
export type Role = typeof roles[number]

export type Register = {
    email: string,
    password: string
    name: string
    role: Role
}
