import { CreateRoom, UpdateRoom } from "./types"

export const mapToCreateRoom = (formData: FormData, studentIds: string[], id?: string): CreateRoom | UpdateRoom => {
    const formDataEntries = Object.fromEntries(formData.entries())

    const getStringValue = (name: keyof CreateRoom) => name in formDataEntries ? String(formDataEntries[name]) : undefined

    const type = (() => {
        if (!('type' in formDataEntries)) {
            return undefined
        }

        const stringifiedValue = String(formDataEntries.type)
        if ('schedule' === stringifiedValue || 'queue' === stringifiedValue) {
            return stringifiedValue
        }

        return undefined
    })()

    const status = (() => {
        if (!('status' in formDataEntries)) {
            return undefined
        }

        const stringifiedValue = String(formDataEntries.status)
        if (stringifiedValue === "not-started" || stringifiedValue === "active" || stringifiedValue === "break" || stringifiedValue === "closed") {
            return stringifiedValue
        }

        return undefined
    })()

    return {
        ...(id && { id }),
        name: getStringValue('name'),
        creatorId: getStringValue('creatorId'),
        startDate: getStringValue('startDate'),
        ...(type && { type }),
        ...(status && { status }),
        turnDuration: 'turnDuration' in formDataEntries ? Number(formDataEntries.turnDuration) : undefined,
        description: getStringValue('description'),
        studentIds,
    }
}
