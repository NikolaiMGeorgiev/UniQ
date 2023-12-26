import { fetchRooms } from "./resources/api"
import { Room } from "./resources/types"
import createElement, { ElementDataType } from "./utils/element"

const createRoomElement = (roomData: Room) => {
    const nameElementConfig: ElementDataType = {
        tagName: 'p',
        attributes: [
            { name: 'class', value: 'title' },
        ],
        properties: [
            { name: 'innerHTML', value: roomData.name }
        ],
    }

    const statusElementConfig: ElementDataType = {
        tagName: 'p',
        attributes: [
            { name: 'class', value: `status--${roomData.status}` },
        ],
        properties: [
            { name: 'innerHTML', value: roomData.status }
        ],
    }

    return createElement({
        tagName: 'div',
        attributes: [
            { name: 'class', value: 'item' },
        ],
        children: [
            nameElementConfig, statusElementConfig
        ]
    })
}

const loadData = async () => {
    const data = await fetchRooms()

    if (data.error) {
        // TODO: handle error
        return
    }

    const container = document.getElementById('rooms-container')

    data.data.forEach((el) => {
        const element = createRoomElement(el)

        container?.appendChild(element)
    })
}

(() => {
    loadData()
})()