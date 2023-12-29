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

type User = {
    id: string
    username: string
    name: string
    password: string
}

export type Student = User & {
    type: 'student'
}

export type Teacher = User & {
    type: 'teacher'
}
