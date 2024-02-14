import { CreateRoom, UpdateRoom, RoomType, Status, roomTypes, statuses } from "../types"
import { FormDataEntry, getStringValue } from "./utils"

const getType = (formDataEntries: FormDataEntry, defaultValue = roomTypes[0]): RoomType => {
    if (!('type' in formDataEntries)) {
        return defaultValue
    }

    const stringifiedValue = String(formDataEntries.type)
    if ('schedule' === stringifiedValue || 'queue' === stringifiedValue) {
        return stringifiedValue
    }

    return defaultValue
}

const getStatus = (formDataEntries: FormDataEntry, defaultValue = statuses[0]): Status => {
    if (!('status' in formDataEntries)) {
        return defaultValue
    }

    const stringifiedValue = String(formDataEntries.status)
    if (stringifiedValue === "not-started" || stringifiedValue === "active" || stringifiedValue === "break" || stringifiedValue === "closed") {
        return stringifiedValue
    }

    return defaultValue
}


export const mapFormDataToCreateRoom = (formData: FormData, studentIds: string[], id?: string): CreateRoom => {
    const formDataEntries = Object.fromEntries(formData.entries())

    const type = getType(formDataEntries)
    const status = getStatus(formDataEntries)

    return {
        ...(id && { id }),
        name: getStringValue(formDataEntries, 'name') ?? '',
        creatorId: localStorage.getItem('id') ?? '',
        startTime: getStringValue(formDataEntries, 'startTime') ?? '',
        type,
        status,
        turnDuration: 'turnDuration' in formDataEntries ? Number(formDataEntries.turnDuration) : 1,
        description: getStringValue(formDataEntries, 'description') ?? '',
        studentIds,
    }
}

export const mapFormDataToUpdateRoom = (formData: FormData, studentIds: string[], id?: string): UpdateRoom => {
    const formDataEntries = Object.fromEntries(formData.entries())

    const type = getType(formDataEntries)
    const status = getStatus(formDataEntries)

    return {
        ...(id && { id }),
        name: getStringValue(formDataEntries, 'name'),
        creatorId: localStorage.getItem('id') ?? '',
        startTime: getStringValue(formDataEntries, 'startTime'),
        ...(type && { type }),
        ...(status && { status }),
        turnDuration: 'turnDuration' in formDataEntries ? Number(formDataEntries.turnDuration) : undefined,
        description: getStringValue(formDataEntries, 'description'),
        studentIds,
    }
}