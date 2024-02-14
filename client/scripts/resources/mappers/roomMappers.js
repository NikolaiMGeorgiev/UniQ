import { getStringValue } from "./utils.js";
const getType = (formDataEntries, defaultValue) => {
    if (!('type' in formDataEntries)) {
        return defaultValue;
    }
    const stringifiedValue = String(formDataEntries.type);
    if ('schedule' === stringifiedValue || 'queue' === stringifiedValue) {
        return stringifiedValue;
    }
    return defaultValue;
};
const getStatus = (formDataEntries, defaultValue) => {
    if (!('status' in formDataEntries)) {
        return defaultValue;
    }
    const stringifiedValue = String(formDataEntries.status);
    if (stringifiedValue === "not-started" || stringifiedValue === "started" || stringifiedValue === "break" || stringifiedValue === "closed") {
        return stringifiedValue;
    }
    return defaultValue;
};
export const mapFormDataToCreateRoom = (formData, studentIds, id) => {
    const formDataEntries = Object.fromEntries(formData.entries());
    const type = getType(formDataEntries, 'queue');
    const status = getStatus(formDataEntries, 'not-started');
    return {
        ...(id && { id }),
        name: getStringValue(formDataEntries, 'name') ?? '',
        creatorId: localStorage.getItem('id') ?? '',
        startTime: getStringValue(formDataEntries, 'startTime') ?? '',
        type,
        status,
        turnDuration: 'turnDuration' in formDataEntries ? Number(formDataEntries.turnDuration) : 1,
        description: getStringValue(formDataEntries, 'description') ?? '',
        students: studentIds,
    };
};
export const mapFormDataToUpdateRoom = (formData, studentIds, id) => {
    const formDataEntries = Object.fromEntries(formData.entries());
    const type = getType(formDataEntries, 'queue');
    const status = getStatus(formDataEntries, 'not-started');
    return {
        ...(id && { id }),
        name: getStringValue(formDataEntries, 'name'),
        creatorId: localStorage.getItem('id') ?? '',
        startTime: getStringValue(formDataEntries, 'startTime'),
        ...(type && { type }),
        ...(status && { status }),
        turnDuration: 'turnDuration' in formDataEntries ? Number(formDataEntries.turnDuration) : undefined,
        description: getStringValue(formDataEntries, 'description'),
        students: studentIds,
    };
};
