export type Room = {
    id: string
    name: string
    creatorId: string
    startDate: string
    type: 'schedule' | 'non-schedule'
    status: 'not-started' | 'active' | 'break' | 'closed'
    turnDuration: number
    description: string
}
