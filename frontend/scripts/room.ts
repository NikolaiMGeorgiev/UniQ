import { displayErrorAlert } from './components/alert'
import { createExpandableRoomContainer } from './components/expandableRoomContainer'
import { createStudentContainer } from './components/studentContainer'
import { fetchRoom } from './resources/api'
import { createSocket } from './resources/socket'
import { RoomStudent } from './resources/types'
import { ElementDataType } from './utils/element'
import { getRoomIdFromURL } from './utils/getRoomIdFromURL'
import { redirect } from './utils/redirect'
import { isUserLoggedIn, isUserTeacher } from './utils/user'

const socket = createSocket({ accessToken: localStorage.getItem('accessToken'), roomId: getRoomIdFromURL()})

const getRoomButtons = () => {
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

const getStudentButtons = () => {
    const breakButton: ElementDataType = {
        tagName: 'button',
        attributes: [
            { name: 'class', value: 'room-button-break' },
            { name: 'id', value: 'button-break' },
        ],
        properties: [{ name: 'innerHTML', value: 'Let in' }],
        eventListeners: [
            {
                event: 'click',
                listener: () => console.log('@@@ Let in clicked'),
            },
        ],
    }

    const endButton: ElementDataType = {
        tagName: 'button',
        attributes: [
            { name: 'class', value: 'room-button-end' },
            { name: 'id', value: 'button-end' },
        ],
        properties: [{ name: 'innerHTML', value: 'Kick out' }],
        eventListeners: [
            { event: 'click', listener: () => console.log('@@@ Kick out clicked') },
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
            displayErrorAlert({ message: 'Error fetching data. Please try again.' })
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
            isUserTeacher() ? getRoomButtons() : []
        )

        container?.insertBefore(element, roomContainer)
    } catch (err) {
        displayErrorAlert({ message: 'Error fetching data. Please try again.' })
    }
}

const loadAllStudents = async () => {
    const roomId = getRoomIdFromURL()

    try {
        socket.emit({ event: 'getRoomStudents', data: roomId })

        socket.on('roomStudents', (data: { data: RoomStudent[] }) => {
            displayStudents(data.data)
        })
    } catch (err) {
        displayErrorAlert({ message: 'Error fetching data. Please try again.' })
    }
}

const displayStudents = (data: RoomStudent[]) => {
    const roomsContainer = document.getElementById('room-container')

    if (roomsContainer?.children.length) {
        roomsContainer.replaceChildren()
    }

    data.forEach((studentData) => {
        const element = createStudentContainer(
            studentData,
            'students',
            getStudentButtons()
        )

        roomsContainer?.appendChild(element)
    })
}

const getResourceButton = (resourceUrl: string) => {
    const button: ElementDataType = {
        tagName: 'a',
        attributes: [
            { name: 'class', value: 'button-success' },
            { name: 'id', value: 'button-end' },
            { name: 'href', value: resourceUrl },
            { name: 'target', value: '_blank' },
        ],
        properties: [
            { name: 'innerHTML', value: 'Access resource' },
        ],
    }

    return [button]
}

const displayStudent = (data: RoomStudent) => {
    const roomsContainer = document.getElementById('room-container')

    if (roomsContainer?.children.length) {
        roomsContainer.replaceChildren()
    }

    const buttons = data.examResource ? getResourceButton(data.examResource) : []

    const element = createStudentContainer(
        data,
        'students',
        buttons,
    )

    roomsContainer?.appendChild(element)
}

const loadSingleStudent = async () => {
    const roomId = getRoomIdFromURL()

    try {
        socket.emit({ event: 'getRoomStudent', data: roomId })

        socket.on('roomStudent', (data: { data: RoomStudent }) => {
            displayStudent(data.data)
        })
    } catch (err) {
        displayErrorAlert({ message: 'Error fetching data. Please try again.' })
    }
}

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
