import { Room } from '../resources/types.js'
import createElement, { ElementDataType } from '../utils/element.js'

const createInfoContainerElements = (
    roomData: Room,
    classPrefix: string,
    expanded: boolean
) => {
    const nameElementConfig: ElementDataType = {
        tagName: 'span',
        attributes: [{ name: 'class', value: `${classPrefix}-title` }],
        properties: [{ name: 'innerHTML', value: roomData.name }],
    }

    const statusElementConfig: ElementDataType = {
        tagName: 'span',
        attributes: [
            {
                name: 'class',
                value: `${classPrefix}-status--${roomData.status}`,
            },
        ],
        properties: [{ name: 'innerHTML', value: roomData.status }],
    }

    const headerElement: ElementDataType = {
        tagName: 'div',
        attributes: [{ name: 'class', value: `${classPrefix}-item-header` }],
        children: [nameElementConfig, statusElementConfig],
    }

    const descriptionElement: ElementDataType = {
        tagName: 'span',
        attributes: [
            { name: 'class', value: `${classPrefix}-description` },
            { name: 'id', value: `description-${roomData.id}` },
        ],
        properties: [{ name: 'innerHTML', value: roomData.description }],
    }

    const scheduleInfoElement: ElementDataType = {
        tagName: 'span',
        attributes: [
            { name: 'class', value: `${classPrefix}-schedule-info` },
            { name: 'id', value: `schedule-info-${roomData.id}` },
        ],
        properties: [
            {
                name: 'innerHTML',
                value: 'In this room, each student has a specific time assigned for their turn.',
            },
        ],
    }

    const startTimeElement: ElementDataType = {
        tagName: 'span',
        attributes: [
            { name: 'class', value: `${classPrefix}-schedule-info` },
            { name: 'id', value: `start-time-${roomData.id}` },
        ],
        properties: [
            { name: 'innerHTML', value: `Start time: ${roomData.startTime}` },
        ],
    }

    const showMoreDetailsButton: ElementDataType = {
        tagName: 'button',
        attributes: [
            { name: 'class', value: `${classPrefix}-expand-collapse-button` },
            { name: 'id', value: `expand-collapse-button-${roomData.id}` },
        ],
        properties: [{ name: 'innerHTML', value: 'Show more details...' }],
        eventListeners: [
            {
                event: 'click',
                listener: () => {
                    const button = document.getElementById(
                        `expand-collapse-button-${roomData.id}`
                    )
                    const item = document.getElementById(`item-${roomData.id}`)
                    const description = document.getElementById(
                        `description-${roomData.id}`
                    )
                    const scheduleInfo = document.getElementById(
                        `schedule-info-${roomData.id}`
                    )
                    const startTime = document.getElementById(
                        `start-time-${roomData.id}`
                    )

                    if (button && item && description) {
                        if (button.innerHTML === 'Show more details...') {
                            button.innerHTML = 'Hide details...'
                            item.setAttribute('style', 'height: auto;')
                            description.setAttribute(
                                'style',
                                'white-space: normal;'
                            )
                            scheduleInfo?.setAttribute(
                                'style',
                                'display: block;'
                            )
                            startTime?.setAttribute('style', 'display: block;')
                        } else {
                            button.innerHTML = 'Show more details...'
                            item.setAttribute('style', 'height: 94px;')
                            description.setAttribute(
                                'style',
                                'white-space: nowrap;'
                            )
                            scheduleInfo?.setAttribute(
                                'style',
                                'display: none;'
                            )
                            startTime?.setAttribute('style', 'display: none;')
                        }
                    }
                },
            },
        ],
    }

    return expanded
        ? [
              headerElement,
              descriptionElement,
              scheduleInfoElement,
              startTimeElement,
          ]
        : [
              headerElement,
              descriptionElement,
              scheduleInfoElement,
              startTimeElement,
              showMoreDetailsButton,
          ]
}

export const createExpandableRoomContainer = (
    roomData: Room,
    classPrefix: string,
    expanded: boolean,
    buttons?: ElementDataType[]
) => {
    const infoContainerElements = createInfoContainerElements(
        roomData,
        classPrefix,
        expanded
    )

    const buttonsContainer: ElementDataType = {
        tagName: 'div',
        attributes: [
            { name: 'class', value: `${classPrefix}-buttons-container` },
            { name: 'id', value: `buttons-container-${roomData.id}` },
        ],
        children: buttons,
    }

    const infoContainer: ElementDataType = {
        tagName: 'div',
        attributes: [
            { name: 'class', value: `${classPrefix}-info-container` },
            { name: 'id', value: `info-container-${roomData.id}` },
        ],
        children: infoContainerElements,
    }

    return createElement({
        tagName: 'div',
        attributes: [
            { name: 'class', value: `${classPrefix}-item` },
            { name: 'id', value: `item-${roomData.id}` },
        ],
        children: [infoContainer, buttonsContainer],
    })
}
