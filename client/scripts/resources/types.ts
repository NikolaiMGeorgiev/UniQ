type Status = 'not-started' | 'active' | 'break' | 'closed'

export type Room = {
    id: string
    name: string
    creatorId: string
    startTime: string
    type: 'schedule' | 'queue'
    status: Status
    turnDuration: number
    description: string
}

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
