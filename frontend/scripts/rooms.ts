import { createExpandableRoomContainer } from "./components/expandableRoomContainer"
import { deleteRoom, fetchRooms } from "./resources/api"
import { ElementDataType } from "./utils/element"
import { redirect } from "./utils/redirect"

const handleDeleteRoom = async (roomId: string) => {
    try {
        const response = await deleteRoom(roomId)

        if (!response.success || response.error) {
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
            { name: 'class', value: `rooms-button-join` },
            { name: 'id', value: `button-join-${roomId}` },
        ],
        properties: [
            { name: 'innerHTML', value: 'Join' },
        ],
        eventListeners: [
            { event: 'click', listener: () => redirect({ path: 'room', id: roomId }) }
        ]
    }

    const editButton: ElementDataType = {
        tagName: 'button',
        attributes: [
            { name: 'class', value: `rooms-button-edit` },
            { name: 'id', value: `button-edit-${roomId}` },
        ],
        properties: [
            { name: 'innerHTML', value: 'Edit' },
        ],
        eventListeners: [
            { event: 'click', listener: () => redirect({ path: 'add-edit', id: roomId }) }
        ]
    }

    const deleteButton: ElementDataType = {
        tagName: 'button',
        attributes: [
            { name: 'class', value: `rooms-button-delete` },
            { name: 'id', value: `button-delete-${roomId}` },
        ],
        properties: [
            { name: 'innerHTML', value: 'Delete' },
        ],
        eventListeners: [
            { event: 'click', listener: () => handleDeleteRoom(roomId) }
        ]
    }

    return [joinButton, editButton, deleteButton]
}

const loadData = async () => {
    try {
        const data = await fetchRooms()

        if (data.error) {
            // TODO: handle error
            return
        }

        const container = document.getElementById('rooms-container')

        data.data.forEach((roomData) => {
            const element = createExpandableRoomContainer(roomData, 'rooms', false, getButtons(roomData.id))

            container?.appendChild(element)
        })
    } catch(err) {
        // TODO: handle error
    }
}

(() => {
    loadData()
})()