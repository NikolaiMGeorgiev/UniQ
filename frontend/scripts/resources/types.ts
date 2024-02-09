export type Room = {
    id: string
    name: string
    creatorId: string
    startDate: string
    type: 'schedule' | 'queue'
    status: 'not-started' | 'active' | 'break' | 'closed'
    turnDuration: number
    description: string
}

export type CreateRoom = Omit<Room, 'id'> & {
    studentIds: string[]
}

export type UpdateRoom = Partial<Room> & {
    studentIds?: string[]
}

type User = {
    id: string
    username: string
    name: string
    password: string
    token: string
}

export type UserStudent = User & {
    type: 'student'
}

export type UserTeacher = User & {
    type: 'teacher'
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
    fn: string
    username: string
}

export type RoomStudent = Student & {
    status: 'active' | 'inactive' | 'finished' | 'in-exam'
}