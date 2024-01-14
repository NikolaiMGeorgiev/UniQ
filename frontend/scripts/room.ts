import { createExpandableRoomContainer } from './components/expandableRoomContainer'
import { fetchRoom, fetchStudents } from './resources/api'
import { ElementDataType } from './utils/element'
import { getRoomIdFromURL } from './utils/getRoomIdFromURL'
import { redirect } from './utils/redirect'
import { isUserLoggedIn, isUserTeacher } from './utils/user'

const getButtons = () => {
    const breakButton: ElementDataType = {
        tagName: 'button',
        attributes: [
            { name: 'class', value: 'room-button-break' },
            { name: 'id', value: 'button-break' },
        ],
        properties: [{ name: 'innerHTML', value: 'Break' }],
        eventListeners: [
            {
                event: 'click',
                listener: () => console.log('@@@ Break clicked'),
            },
        ],
    }

    const endButton: ElementDataType = {
        tagName: 'button',
        attributes: [
            { name: 'class', value: 'room-button-end' },
            { name: 'id', value: 'button-end' },
        ],
        properties: [{ name: 'innerHTML', value: 'End' }],
        eventListeners: [
            { event: 'click', listener: () => console.log('@@@ End clicked') },
        ],
    }

    return [breakButton, endButton]
}

const loadRoomData = async () => {
    const roomId = getRoomIdFromURL()

    if (!roomId) {
        return redirect({ path: 'rooms' })
    }

    try {
        const roomData = await fetchRoom(roomId)
        // const studentsData = await fetchRoom(roomId)

        if (!roomData.success) {
            // TODO: handle error
            // if 401 -> redirect to login
            return
        }

        if (!roomData.data) {
            return redirect({ path: 'rooms' })
        }

        if (
            roomData.data.status === 'closed' ||
            roomData.data.status === 'not-started'
        ) {
            return redirect({ path: 'rooms' })
        }

        const container = document.getElementById('main-container')
        const roomContainer = document.getElementById('room-container')

        const element = createExpandableRoomContainer(
            roomData.data,
            'room',
            true,
            isUserTeacher() ? getButtons() : []
        )

        container?.insertBefore(element, roomContainer)
    } catch (err) {
        // TODO: handle error
    }
}

const loadAllStudents = async () => {
    try {
        const students = await fetchStudents()

        if (!students.success) {
            // todo: handle error
            return
        }
    } catch (err) {
        // todo: handle error
    }
}

const loadSingleStudent = async () => {}

;(async () => {
    if (!isUserLoggedIn()) {
        return redirect({ path: 'login'})
    }

    await loadRoomData()

    if (isUserTeacher()) {
        await loadAllStudents()
    } else {
        await loadSingleStudent()
    }
})()
