import { createExpandableRoomContainer } from './components/expandableRoomContainer'
import { deleteRoom, fetchRooms } from './resources/api'
import { Room } from './resources/types'
import createElement, { ElementDataType } from './utils/element'
import { redirect } from './utils/redirect'
import { isUserLoggedIn, isUserStudent, isUserTeacher } from './utils/user'

const handleDeleteRoom = async (roomId: string) => {
    try {
        const response = await deleteRoom(roomId)

        if (!response.success) {
            // TODO: handle error
        }
    } catch (err) {
        // TODO: handle error
    }
}

const getButtons = (roomId: string) => {
    const joinButton: ElementDataType = {
        tagName: 'button',
        attributes: [
            { name: 'class', value: 'rooms-button-join' },
            { name: 'id', value: `button-join-${roomId}` },
        ],
        properties: [{ name: 'innerHTML', value: 'Join' }],
        eventListeners: [
            {
                event: 'click',
                listener: () => redirect({ path: 'room', id: roomId }),
            },
        ],
    }

    const editButton: ElementDataType = {
        tagName: 'button',
        attributes: [
            { name: 'class', value: 'rooms-button-edit' },
            { name: 'id', value: `button-edit-${roomId}` },
        ],
        properties: [{ name: 'innerHTML', value: 'Edit' }],
        eventListeners: [
            {
                event: 'click',
                listener: () => redirect({ path: 'add-edit', id: roomId }),
            },
        ],
    }

    const deleteButton: ElementDataType = {
        tagName: 'button',
        attributes: [
            { name: 'class', value: 'rooms-button-delete' },
            { name: 'id', value: `button-delete-${roomId}` },
        ],
        properties: [{ name: 'innerHTML', value: 'Delete' }],
        eventListeners: [
            {
                event: 'click',
                listener: async () => {
                    await handleDeleteRoom(roomId)
                },
            },
        ],
    }

    return isUserStudent() ? [joinButton] : [joinButton, editButton, deleteButton]
}

const displayElements = (data: Room[]) => {
    const roomsContainer = document.getElementById('rooms-container')
    const footer = document.getElementById('footer')

    data.forEach((roomData) => {
        const element = createExpandableRoomContainer(
            roomData,
            'rooms',
            false,
            getButtons(roomData.id)
        )

        roomsContainer?.appendChild(element)
    })

    if (isUserTeacher()) {
        const addRoomButton = createElement({
            tagName: 'button',
            attributes: [
                { name: 'id', value: 'button-add-room' },
                { name: 'class', value: 'button-primary' },
            ],
            properties: [
                { name: 'innerHTML', value: 'Add room' },
            ],
            eventListeners: [
                { event: 'click', listener: () => redirect({ path: 'add-edit' })}
            ]
        })

        footer?.appendChild(addRoomButton)
    }
}

const loadData = async () => {
    try {
        const data = await fetchRooms()

        if (!data.success) {
            // TODO: handle error
            return
        }

        displayElements(data.data)
    } catch (err) {
        // TODO: handle error
    }
}

;(() => {
    if (!isUserLoggedIn()) {
        return redirect({ path: 'login'})
    }

    loadData()
})()
