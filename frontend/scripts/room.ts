import { createExpandableRoomContainer } from "./components/expandableRoomContainer"
import { fetchRoom } from "./resources/api"
import { ElementDataType } from "./utils/element"
import { redirect } from "./utils/redirect"

const getRoomIdFromURL = () => window?.location?.search
    ?.replace('?', '')
    .split('&')
    .map((el) => el.split('='))
    .find((el) => el[0] === 'id')?.[1]


const getButtons = () => {
    const breakButton: ElementDataType = {
        tagName: 'button',
        attributes: [
            { name: 'class', value: `room-button-break` },
            { name: 'id', value: `button-break` },
        ],
        properties: [
            { name: 'innerHTML', value: 'Break' },
        ],
        eventListeners: [
            { event: 'click', listener: () => console.log('@@@ Break clicked') }
        ]
    }

    const endButton: ElementDataType = {
        tagName: 'button',
        attributes: [
            { name: 'class', value: `room-button-end` },
            { name: 'id', value: `button-end` },
        ],
        properties: [
            { name: 'innerHTML', value: 'End' },
        ],
        eventListeners: [
            { event: 'click', listener: () => console.log('@@@ End clicked') }
        ]
    }

    return [breakButton, endButton]
}

const loadData = async () => {
    const roomId = getRoomIdFromURL()
    
    if (!roomId) {
        return redirect({ path: 'rooms' })
    }

    try {
        const roomData = await fetchRoom(roomId)
        //const studentsData = await fetchRoom(roomId)

        if (roomData.error) {
            // TODO: handle error
            return
        }

        if (!roomData.data) {
            return redirect({ path: 'rooms' })
        }

        if (roomData.data.status === 'closed' || roomData.data.status === 'not-started') {
            return redirect({ path: 'rooms' })
        }

        console.log(roomData)

        const container = document.getElementById('main-container')
        const roomContainer = document.getElementById('room-container')

        const element = createExpandableRoomContainer(roomData.data, 'room', true, getButtons())

        container?.insertBefore(element, roomContainer)
    } catch(err) {
        // TODO: handle error
    }
}

(() => {
    loadData()
})()